# ReadFlow 技术实现手册

> v0.7.90 / 2026-08-12

---

## 1. 数据层（node:sqlite）

### 1.1 数据库位置

权威路径：`~/Library/Application Support/readflow/readflow.db`（单层，userData 根目录直接放置）。

历史路径自动迁移：`migrateLegacyDatabase()` 在启动时检测嵌套旧路径 `.../readflow/readflow/readflow.db`，有数据则整体复制到扁平位置，**绝不覆盖已有数据**。

### 1.2 核心表

| 表 | 用途 |
|---|---|
| `items` | 统一内容卡片，32+ 列含 `feed_id`（级联删除）、`content_html`、`cover_url/path` |
| `items_fts` | FTS5 全文搜索虚表，触发器随增删改自动维护；不可用时降级 LIKE |
| `feeds` | RSS/Atom 订阅源，含 `etag`/`last_modified`（304 条件请求）、`error_count`/`last_error` |
| `highlights` | 划线笔记（item_id 级联） |
| `boards` | 白板 |
| `board_cards` | 白板卡片（kind: ref/text/link/image/file/video），含 `item_id`、坐标、payload（本地附件） |
| `board_links` | 卡片连线（from_id/to_id + label） |
| `settings` | 全局 KV（外观、快捷键、音效、保留策略等） |
| `discover_cache` | GitHub README 解析缓存（24h） |

### 1.3 关键查询

- **去重写入** `upsertItem`：`ON CONFLICT(url, source_type)` 冲突更新；内容完全相同则跳过（避免 FTS 写放大）。
- **全文搜索** `searchItems`：FTS5 优先，降级 LIKE 兜底。
- **分页列表** `listItemsPage(view, search, sourceType, sourceName, page, pageSize)`：LIMIT/OFFSET 分页，每页 15 条。
- **保留策略** `purgeOldItems`：仅清理「已归档」超 N 天或总量超 N 条，收藏/白板引用永不被清理。

### 1.4 feed_id 级联

items 表 `feed_id` 列：
- RSS 新建条目写入对应 feed.id
- 启动时一次性回填（`source_name` → `feeds.name` 反查）
- `deleteFeed` 按 `feed_id` 删除对应 items + `feed_id=0` 旧数据兜底

---

## 2. 采集调度（Scheduler）

### 2.1 架构

```
setInterval(60s) → runDue() → fetchAndParse(feed) → upsertItem() → notify renderer
```

### 2.2 策略

- **分频调度**：每源独立 `schedule_min`（热榜 30min、RSS 30–1440min、GitHub 24h）
- **到期判断** `runDue`：只抓 `last_fetched_at + schedule_min ≤ now`
- **失败记录**：每次失败自增 `error_count`、写入真实 `last_error`（DNS/超时/403/CERT）
- **条件请求**：携带 `If-None-Match`/`If-Modified-Since`，服务端 304 跳过解析
- **批量刷新** `refreshAllFeeds`：忽略到期，强制全部刷新

### 2.3 来源适配

| 来源 | 引擎 | 说明 |
|---|---|---|
| RSS/Atom | `rss-parser` + `fetch` | 支持 304 条件请求 |
| 热榜 | cheerio 爬取 | tophub.today 各榜单 |
| GitHub ★ | REST API（可选 token） | 按用户名拉取 starred 仓库 |
| 手动收集 | ⌘N → readability | 异步补全正文 |
| X 书签 | 本地 JSON/CSV 导入 | X API 需付费，走文件导入 |

### 2.4 网络诊断

`src/main/netlog.ts` 的 `extractError` 规范化了 ENOTFOUND/ETIMEDOUT/ECONNREFUSED/CERT_* 等。开发者模式开启后右下角浮层实时显示每次 RSS 请求的状态/耗时/字节。

---

## 3. 渲染层（React + Zustand）

### 3.1 入口

四栏可拖拽布局：`Sidebar` | `FeedsPanel` | `ItemList` | `ReaderPane`。

### 3.2 状态管理

单一 Zustand store（`src/renderer/src/store.ts`），核心状态：

```ts
screen: Screen           // library | board | settings
view: View               // rss | read | later | favorite | archived | all
selectedId: number|null
pendingReadId: number|null   // RSS 延迟标记已读
search: string
zenMode: boolean             // 专注模式
appearance: Appearance       // 主题/卡片风格/阅读配色/字体/音效
developerMode: boolean
```

所有状态变更通过 store actions，渲染层不直接写数据库。

### 3.3 IPC 桥

`preload/index.ts` 用 `contextBridge` + `ipcRenderer.invoke` 暴露类型安全的 API。渲染层不直接访问 Node API。白名单安全。

### 3.4 分页加载

信息流按需翻页（每页 15 条）：`FixedSizeList` 虚拟滚动监听到达底部 → `loadMoreItems()` 追加下一页 → 去重 + 末页自动标记 `itemsDone`。底部状态栏显示「已显示 N 条 · 滚动加载更多」或加载中旋转环。

### 3.5 RSS 延迟标记已读

点击卡片**不立即标已读**。翻到下一条或切换视图时，`pendingReadId` 才被 `flushPending()` 写入 `is_read=1` 并移出未读列表，连续阅读不打断。

### 3.6 收藏/稍后/删除

无二次确认弹窗，直接执行。`f` 收藏、`l` 稍后读、`e` 归档、`j/k` 上下切换。

---

## 4. 白板（Board）

### 4.1 自研 Canvas

`BoardView.tsx`：纯 React Canvas（无第三方库），空白处拖拽平移、滚轮缩放、拖拽卡片移动。

### 4.2 卡片类型（6 种）

`ref`（引用条目）/ `text` / `link` / `image` / `file` / `video`。

6 种类型以快捷按钮组内嵌工具栏（Excalidraw 风格），无需弹窗选择。

从信息流按 `B` 或按钮「送白板」，无白板时自动新建。

本地附件经 `board-asset://` 自定义协议安全加载。

### 4.3 连线

hover 卡片显示四边中点拖拽手柄。按住手柄拖到另一张卡片 → 自动建立连线：
- 自动选择两卡间相对方向锚点（上/下/左/右）
- 贝塞尔曲线切线对齐
- 连线中点可删除或编辑标签
- 无需切换模式，始终可用

### 4.4 数据持久化

`board_cards` / `board_links` 表即时持久化。卡片编辑器 `CardEditor.tsx` 支持附件上传。

---

## 5. 阅读面板（ReaderPane）

### 5.1 正文渲染

`lib/reader.ts` → `renderArticleHtml` → `DOMPurify` 净化 → 剥离站内联 style/class → 回填懒加载图 → iframe 转链接 → `cleanArticleHtml`（Worker 线程异步清洗）。

### 5.2 图片灯箱

正文图片点击触发 `lightbox` 全屏查看，点击关闭。

### 5.3 阅读配色注入

`appearance.readingTheme` 选中后，ReaderPane 的容器 `div` 设置 `data-reading-theme="themeId"`，CSS 变量 `--rt-*`（15 个阅读面板颜色）通过阅读配色系统注入。选择「跟随界面」时移除此属性，使用 UI 自身配色。

### 5.4 文章标题可点击

标题本身是 `<a>` 链接，`e.preventDefault()` 后用 `openInBrowser(item.url)` 在系统默认浏览器打开。URL 完全隐藏。

### 5.5 Zen 专注模式

点击「专注」按钮（Maximize 图标）：隐藏侧栏、源栏、列表，阅读面板撑满全宽。Esc 退出。

---

## 6. 音效系统

### 6.1 Web Audio 合成

`lib/sound.ts`：纯 Web Audio API 合成短促音效，无外部音频文件。

### 6.2 音效类型

`complete`（操作完成）、`click`（点击反馈）、`switch`（切换反馈）、`open`（打开外链）。

### 6.3 配置

设置 → 外观：音效开关 + 音量滑块（0%–100%）。首次需一次点击解锁音频（浏览器 AudioContext 策略）。

---

## 7. 快捷键系统

### 7.1 架构

`lib/shortcuts.ts` + store 持久化。每项快捷键支持录制重绑 + 冲突检测 + 一键重置。

### 7.2 规则

- `⌘` 组合键：输入框聚焦时也生效
- 单键（j/k/e/l/f/o）：仅在非输入时触发
- `/` 聚焦搜索
- `Esc` 优先级：Zen 退出 > 失焦 > 关闭弹层

---

## 8. 配置系统

### 8.1 外观

| 配置项 | 存储 | 说明 |
|---|---|---|
| 主题 | settings | 跟随系统/亮/暗 |
| 卡片风格 | settings | 12 套（纸感/玻璃/暗夜/极光/海洋/落日/薰衣草/森林/玫瑰/石板/琥珀/暗金），light+dark 共 24 套色板 |
| 阅读配色 | settings + localStorage | 30 套内置 VSCode 主题风格 + 自定义主题编辑保存 |
| 阅读字体 | settings | 系统字体探测下拉（500+ 字体） |
| 字号/字重 | settings | 70%–200% 滑块 + 细/正常/粗 |

启动优化：外观设置持久化到 localStorage，渲染前 `bootAppearance()` 同步铺好主题/字体，DB 权威值在 `initAppearance` 异步覆盖。

### 8.2 数据管理

- **JSON 配置导入/导出**：所有设置 + 订阅源序列化为 `readflow-config.json`，跨机恢复
- **数据库路径**：文件选择器浏览 + 手动输入，带「保存」「浏览…」按钮
- **保留策略**：keepDays / maxItems / 立即清理

### 8.3 快捷键

录制/重置每项，冲突检测。

---

## 9. 阅读配色系统（Reading Themes）

### 9.1 架构

`lib/reading-themes.ts`：
- `READING_THEMES`：30 套内置主题（暗色 15、亮色 15），每套定义 15 个 `--rt-*` CSS 变量
- `getAllReadingThemes()`：合并内置 + 自定义，供外观设置页和阅读面板下拉使用
- `upsertCustomReadingTheme()`：保存/更新自定义主题到 localStorage
- `deleteCustomReadingTheme()`：删除自定义主题
- `getCustomReadingThemes()`：从 localStorage 读取
- `FOLLOW_UI_ID`：跟随界面模式 ID

### 9.2 内置主题列表

**暗色**（15 套）：VSCode Dark / Monokai / Solarized Dark / One Dark / Dracula / Nord / Gruvbox Dark / Tokyo Night / Catppuccin Mocha / Ayu Dark / Palenight / Material Dark / GitHub Dark / Synthwave / Outrun

**亮色**（15 套）：VSCode Light / Solarized Light / GitHub Light / One Light / Nord Light / Gruvbox Light / Catppuccin Latte / Ayu Light / Min Light / Flat White / Chrome DevTools / Paper / Ivory / Sepia / Cream

### 9.3 自定义主题

通过外观页面 hover 色的「+」按钮创建副本 → ThemeEditor 弹窗编辑 15 个颜色值 → 保存到 localStorage。自定义主题与内置主题一同出现在所有下拉和外观页面。

### 9.4 CSS 注入机制

阅读面板容器设置 `data-reading-theme="themeId"`，由 CSS 规则：

```css
[data-reading-theme="monokai"] .reader-body {
  --rt-bg: #272822;
  --rt-fg: #f8f8f2;
  /* ... */
}
```

自定义主题动态注入 `<style>` 标签。

---

## 10. 设计令牌与动效

### 10.1 颜色系统

- 三级语义色板（`--color-background-primary/secondary/tertiary`、`--color-text-*`、`--color-border-*`）
- 亮暗双主题
- 12 套卡片风格 × 2（light/dark）= 24 套，通过 `[data-card-style=X][data-theme=dark]` 组合选择器
- 主强调色 `--card-accent` 从签名色派生

### 10.2 动效令牌

| 令牌 | 值 | 用途 |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23,1,0.32,1)` | 进入/退出 |
| `--ease-in-out` | `cubic-bezier(0.77,0,0.175,1)` | 位移/形变 |
| `--ease-drawer` | `cubic-bezier(0.32,0.72,0,1)` | 抽屉 |
| `--dur-fast` | 120ms | 按钮反馈 |
| `--dur-base` | 160ms | 下拉/切换 |
| `--dur-slow` | 240ms | 模态/抽屉 |

---

## 11. 打包流程

固定流水线：`electron-vite build` → `electron-builder --mac --dir` → `make-dmg.py`。

一键：`bash scripts/bump.sh "message"`（自动 semver patch + git commit + 构建 + 安装 + 打开）。

DMG 未签名，首次需右键打开。版本号实时读取 `package.json`。

---

## 12. 目录结构

```
readflow/
├── src/
│   ├── main/
│   │   ├── index.ts          # 窗口、IPC、协议、OPML/JSON 导入导出
│   │   ├── db.ts             # SQLite schema/queries/purge
│   │   ├── netlog.ts         # 网络诊断
│   │   ├── ingest.ts         # 本地 HTTP 摄入
│   │   └── sources/          # rss / tophub / github / readability / scheduler
│   ├── preload/index.ts      # contextBridge
│   └── renderer/src/
│       ├── App.tsx           # 四栏布局 + 全局快捷键 + 错误边界
│       ├── store.ts          # Zustand store
│       ├── env.d.ts          # 类型定义
│       ├── components/       # Sidebar/FeedsPanel/ItemList/ReaderPane/BoardView/
│       │                     # SettingsView/RssManager/DiscoverView/QuickAdd/
│       │                     # CardEditor/ThemeEditor/icons
│       ├── lib/              # appearance/shortcuts/sound/reader/feedColor/
│       │                     # reading-themes/monospace
│       └── styles/           # tokens.css / app.css
├── build/                    # make-dmg.py
├── docs/                     # DESIGN / REVIEW / UIUX分析 / TECH
└── scripts/                  # bump.sh / post-dev.sh
```
