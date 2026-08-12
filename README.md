# 阅流 ReadFlow

> 个人知识流桌面客户端 —— 收集 → 速读 → 分类 → 组织 → 沉淀。
> 本地优先 · 键盘驱动 · 整面配色 · 白板连线 · Electron + React。
> 当前版本 **v0.7.82** · macOS（Electron 37）。

---

## 目录

- [1. 产品定位](#1-产品定位)
- [2. 技术栈](#2-技术栈)
- [3. 系统架构](#3-系统架构)
- [4. 数据模型](#4-数据模型)
- [5. 内容来源](#5-内容来源)
- [6. 设计系统](#6-设计系统)
- [7. 界面与交互](#7-界面与交互)
- [8. 快捷键](#8-快捷键)
- [9. 开发者模式与网络诊断](#9-开发者模式与网络诊断)
- [10. 构建与打包](#10-构建与打包)
- [11. 目录结构](#11-目录结构)
- [12. 版本更新日志](#12-版本更新日志)
- [13. 已知限制与后续](#13-已知限制与后续)

---

## 1. 产品定位

信息入口越来越多（RSS、热榜、GitHub Star、X/Twitter 书签、手动收集），但看完就忘、无法沉淀。**阅流**把所有这些来源统一抽象为「条目卡片」，并用一条强制流动的 Pipeline 把每条内容推向下一个动作，而不是让它们躺在收集箱里「收藏即冷藏」：

```
收集(RSS未读) → 速读(Triage) → 分类(稍后/收藏/归档) → 白板组织 → 沉淀输出
```

设计原则：

1. **条目即卡片** —— 所有内容（RSS 条目、GitHub 仓库、推文、手动收集）都是同一个 `Item`，列表、阅读、白板上的引用都是同一份数据的不同视图。
2. **本地优先** —— SQLite（node:sqlite 内置，零原生编译）+ 本地封面/白板附件仓，断网全功能可用。
3. **键盘可达** —— 全程快捷键 + 可录制的快捷键系统，`j/k` 浏览，单手处理信息流。
4. **整面配色** —— 12 套卡片风格 × 30 套阅读配色 × 自定义主题编辑器，配置即所见即所得。
5. **白板连线** —— 自研 Canvas，6 种卡片类型 + 四边中点拖拽连线 + 贝塞尔曲线 + 关系标签，形成领域结构化认知。
6. **专注模式** —— 一键隐藏所有侧栏，阅读面板全屏。
7. **配置可迁移** —— JSON 一键导出全部设置+订阅源，跨机恢复。

---

## 2. 功能一览

| 模块 | 功能点 |
|------|--------|
| **内容采集** | RSS/Atom（30-1440min 分频调度 + 304 条件请求）、GitHub Star（REST API）、Twitter/X 书签（本地 JSON/CSV 导入）、热榜（tophub）、手动收集（⌘N） |
| **信息流** | 分页滚动加载（15 条/页）、未读延迟标记（翻页/切换视图时标已读）、全文搜索（FTS5 + LIKE 兜底）、来源筛选（按订阅源 / GitHub★ / Twitter 书签） |
| **阅读面板** | 全文提取（readability + DOMPurify 净化）、30 套阅读配色 + 自定义、图片灯箱、文字缩放 70%-200%、标题可点击打开原文 |
| **白板** | 自研 Canvas（拖拽/缩放/平移）、6 种卡片类型、四边中点拖拽连线（贝塞尔 + 关系标签）、本地附件 `board-asset://` 加载 |
| **外观** | 亮/暗主题跟随系统、12 套卡片风格（24 套色板）、阅读字体探测 500+、音效开关+音量 |
| **快捷键** | ⌘+1~6 视图切换、j/k 浏览、f/l/e 收藏/稍后/归档、B 送白板、全部可录制重绑+冲突检测 |
| **数据管理** | JSON 导出/导入配置、数据库路径文件选择器、保留策略（天数/条数）、启动去重迁移 |
| **开发者工具** | 开发者模式 + 网络诊断面板（RSS 请求状态/耗时/字节实时显示） |
| **专注模式** | 一键隐藏侧栏/源栏/列表、Esc 退出、全屏阅读 |

---

## 3. 产品亮点

- **Pipeline 设计哲学**：收集(RSS未读) → 速读 → 分类(稍后/收藏/归档) → 白板组织 → 沉淀输出，拒绝「收藏即冷藏」
- **纯本地架构**：SQLite（node:sqlite 零原生编译）+ 本地封面/附件仓，断网全功能可用，数据 100% 归用户
- **单 store 乐观更新**：Zustand 单一 store + IPC 异步桥，渲染层不直接访问 Node API
- **键盘可达全程**：j/k/e/l/f/o 单手操作，⌘ 组合键全局生效，快捷键系统支持录制重绑 + 冲突检测
- **50+ 配色维度**：12 套卡片风格 × 30 套阅读配色 × 自定义主题编辑器 = 千级组合，像素级 UI 打磨
- **白板即思考工具**：信息流条目 `B` 即可推送至白板，拖拽连线形成结构化认知，不依赖第三方画布库
- **FTS5 全文搜索**：支持降级 LIKE 兜底，触发器自动维护索引
- **未签名 DMG 分发**：用户数据始终在本地，无云端依赖

---

## 4. 后续优化

## 2. 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 壳 | **Electron 37** + **electron-vite** | 跨平台桌面壳；`hiddenInset` 无边框窗口，标题栏仅显示版本号 |
| 前端 | **React 18** + **TypeScript** + **Zustand 4** | 渲染进程状态管理（单一 store + IPC 异步桥） |
| 数据层 | **node:sqlite**（`node:sqlite` 内置模块） | 同步 API 不阻塞主进程；WAL 模式；FTS5 全文索引（不可用时降级 LIKE） |
| 阅读解析 | **@mozilla/readability** + **cheerio** + **DOMPurify** + **linkedom** | 正文提取、非标页面抓取、XSS 净化 |
| RSS | **rss-parser** | 标准源解析（改为 `fetch` + `parseString`，附带网络诊断日志） |
| 白板 | 自研 Canvas 组件（`BoardView.tsx`） | 卡片 + 连线 + 平移缩放，持久化到 `board_cards` / `board_links` |
| 编辑器 | **TipTap / ProseMirror**（依赖保留，写作 UI 暂未接入） | 预留引用卡片节点 |
| 图标 | **lucide-react** | 统一线性图标 |
| 音效 | 自研 Web Audio 合成（`lib/sound.ts`） | 全局轻触音效、外链打开提示音 |
| 打包 | **electron-builder** → 自定义 `make-dmg.py` | 未签名 DMG（右键「打开」即可） |

> 说明：早期设计蓝图（DESIGN.md）曾规划 Tailwind/shadcn、tldraw、better-sqlite3+Drizzle、TanStack Query、WebDAV 同步等，当前实现已简化并落地为上述选型；本文档以**当前代码**为准。

---

## 3. 系统架构

```
┌─ 渲染进程 (React + Zustand) ───────────────────────────────┐
│  侧栏 · 订阅源栏 · 信息流 · 阅读面板 · 白板 · 系统配置         │
│         ↕  window.readflow.invoke(...) / onXxx(回调)         │
│  preload/index.ts —— contextBridge 类型安全 IPC 桥           │
├─ 主进程 (Main) ───────────────────────────────────────────┤
│  采集调度 scheduler（按源频率、失败计数、last_error）          │
│  来源适配：rss.ts / tophub.ts / github.ts / readability.ts    │
│  GitHub★ / Twitter 书签 导入 / OPML / 发现 Discover          │
│  网络诊断 netlog；本地 HTTP 摄入服务 ingest                   │
│         ↕                                                     │
│  node:sqlite —— userData/readflow.db (WAL)                   │
│  本地仓：images/（封面）· board-assets/（白板附件）· backups/ │
└────────────────────────────────────────────────────────────┘
```

- 渲染进程不直接访问 Node API，所有读写经 `contextIsolation` 下的预加载桥（`ipcMain.handle`，首参剥离后交给业务函数）。
- 重活（抓取、正文提取、封面下载、发现解析）在**主进程**完成；采集结束通过 `webContents.send('sources:updated')` 通知渲染进程 `load()` 刷新，**绝不静默丢数据**。
- 自定义协议：`board-asset://`（白板本地附件）、`cover://`（本地化封面），渲染进程安全加载离线资源。
- 数据库开 WAL；列表只投影需要的列（`ItemRow`），详情按需取单条正文（`getItem`），避免正文跨 IPC 全量传输（性能优化）。

---

## 4. 数据模型

SQLite 核心表（见 `src/main/db.ts`）：

| 表 | 作用 |
|---|---|
| `items` | 统一内容卡片：`source_type`、`source_name`、`url`(UNIQUE+source_type)、`title`、`author`、`summary`、`content_text`、`content_html`、`cover_url`、`cover_path`、`status`(inbox/later/favorite/archived)、`is_read`、`published_at`、`fetched_at`、`feed_id`（关联 feeds 级联删除） |
| `items_fts` | FTS5 虚表（title+summary+content_text），触发器随增删改自动维护；不可用时降级 LIKE |
| `feeds` | 订阅源：`type`、`name`、`url`(UNIQUE)、`schedule_min`、`last_fetched_at`、`error_count`、`last_error`、`etag`、`last_modified`、`enabled`、`config_json` |
| `highlights` | 划线笔记（item_id 级联删除） |
| `boards` | 白板（name + 已弃用 snapshot_json，兼容迁移） |
| `board_cards` | 白板卡片，独立持久化：`kind`(ref/text/link/image/file/video)、`item_id`、`x/y/w/h`、`title`、`body`、`payload`(含本地附件元数据) |
| `board_links` | 卡片间关系连线：`from_id`/`to_id` + `label`（支持/反驳/延伸） |
| `documents` | 写作文档预留表（content_json / markdown_cache）；当前 UI 未接入 |
| `settings` | 通用 kv（主题、卡片风格、字体、音效、快捷键、开发者模式、布局宽度、保留策略…） |
| `discover_cache` | 仓库 README 解析出的订阅源缓存（24h） |

关键逻辑：

- **去重写入** `upsertItem`：按 `(url, source_type)` 冲突更新；内容完全相同则跳过，避免每次抓取重建 FTS 索引（写放大修复）。
- **保留策略** `purgeOldItems`：仅清理「已归档」且超过 N 天、或单库超 N 条的旧条目；**收藏与白板引用永不被清理**。
- **封面本地化** `storeCover`：封面下载到 `images/`，离线可用。

---

## 5. 内容来源

| 来源 | 方式 | 说明 |
|---|---|---|
| RSS / Atom | rss-parser | 不预置任何源，由用户手动添加 / 选择 RSS 源 / OPML 导入；支持单源 / 全部刷新；抓取失败（DNS/超时/403/证书）如实提示「无法获取数据」 |
| tophub 热榜 | 抓取 + cheerio 解析 | 各榜单页，热度值入库 |
| GitHub ★ | GitHub REST API（可选 token） | 按用户名拉取 starred 仓库（≤1000），写入 `source_type=github` |
| X / Twitter 书签 | 本地文件导入（JSON / CSV） | X 官方读书签需付费凭证，走导入最现实；已修复 `full_text` 列名与 HTML 实体、媒体抽取 |
| 手动收集 | ⌘N 快速添加 | 粘 URL → readability 提正文 → 入收集箱（异步补全，不阻塞） |

调度策略：每源独立频率（热榜 30min / RSS 30–1440min / GitHub 24h），失败自增 `error_count` 并保存真实 `last_error`（DNS/超时/403/CERT 等），UI 三处提示「无法获取数据」。

---

## 6. 设计系统

设计令牌统一在 `src/renderer/src/styles/tokens.css`，受 **WorkBuddy UI 规范** 与 **emilkowalski/skills** 动效高标准约束。

### 6.1 色彩与主题

- **三级背景 / 文本 / 边框** 语义色板，亮暗双主题（默认跟随系统）。
- **整面配色（卡片风格，12 套）**：纸感 / 玻璃 / 暗夜 / 极光 / 海洋 / 落日 / 薰衣草 / 森林 / 玫瑰 / 石板 / 琥珀 / 暗金。每套定义 light + dark 两套色板（共 24 套），通过 `[data-card-style=X][data-theme=dark]` 组合选择器生效。
- **主强调色从签名色派生**：每个卡片风格自带 `--card-accent`，UI 主强调色直接用它本身。
- **阅读配色（30 套内置 + 自定义）**：独立于 UI 配色，为阅读面板提供 30 套 VSCode 主题风格的正文渲染配色（暗色 15 套 + 亮色 15 套），通过 CSS 变量 `--rt-*` 注入阅读面板。支持「跟随界面」模式（不注入变量，直接使用 UI 配色）。用户可对任意主题创建副本、编辑 15 个颜色值后保存为自定义主题（localStorage 存储），也可删除自定义主题。

### 6.2 动效令牌（对齐高水准工艺）

| 令牌 | 值 | 用途 |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23,1,0.32,1)` | 进入/退出、跟手 |
| `--ease-in-out` | `cubic-bezier(0.77,0,0.175,1)` | 位移/形变 |
| `--ease-drawer` | `cubic-bezier(0.32,0.72,0,1)` | 抽屉 |
| `--dur-fast` | 120ms | 按钮反馈、小弹层 |
| `--dur-base` | 160ms | 下拉、卡片态切换 |
| `--dur-slow` | 240ms | 模态、抽屉 |

规则：禁止内置弱 `ease`；UI 动效 <300ms；只用 `transform`/`opacity`（GPU）；按钮 `:active{transform:scale(0.97)}`；尊重 `prefers-reduced-motion`。

### 6.3 字体与排印

- 阅读字体从**系统探测到的等宽字体**中任选（lucide/monospace 探测），字号 70%–200% 滑块，字重 细(300)/正常(400)/粗(700)。
- 全局 UI 字体（`--font-ui`）同步外观所选字体；正文阅读字体（`--font-reading`）同源。
- 阅读面板正文衬线/等宽混合、行宽自适应（不再限 70ch），去 justify，图片/表格/代码铺满。

---

## 7. 界面与交互

### 7.1 四栏可拖拽布局

```
[ 侧栏 Sidebar ] │ [ 订阅源栏 FeedsPanel ] │ [ 信息流 ItemList ] │ [ 阅读面板 ReaderPane ]
```

- **侧栏**（可折叠分组，状态持久化）：「全部」分组（RSS 未读 / 已读 / 稍后读 / 已收藏）+ GitHub ★ + Twitter 书签，白板与标签可折叠保留，系统设置置底常驻不折叠。搜索框置于侧栏顶部，可用 `/` 聚焦。
- **订阅源栏**（第四栏）：仅 RSS 类视图显示（归档、GitHub/推特来源筛选时隐藏）；按 `source_name` 筛选信息流，每个源带 `lib/feedColor.ts` 确定性哈希配色圆点；信息流卡片来源徽标同色。
- **信息流**：卡片 = 来源彩色圆点 + 标题 + 2 行摘要 + 时间（「X 前」按 `COALESCE(published_at, fetched_at)` 排序）；悬停露出 已读 / 稍后读 / 收藏 / 打开 / 删除 动作。RSS 未读视图点击卡片**仅打开阅读、不立即标已读**；翻到下一条或切换视图时上一张才入已读并移出未读列表，连续阅读不打断。
- **阅读面板**：调 `lib/reader.ts` 的 `renderArticleHtml` 规整（剥离站内联 style/class、回填懒加载图、iframe 转链接、DOMPurify 净化），图片点击进灯箱；支持「无图模式」、已读切换；Twitter/X 书签与其它条目一致走正文渲染兜底。外链用系统默认浏览器打开并播放提示音。

### 7.2 视图模型

`View = 'rss' | 'read' | 'later' | 'favorite' | 'archived' | 'all'`

- `rss` = 未读收集箱（`status='inbox' AND is_read=0`，主 RSS 视图只显未读）
- `read` = 已读列表（跨状态）；`later/favorite/archived` 按 status；`all` = 全部
- `ItemStatus` 仍保留 `'inbox'` 作为库内状态值，与 View 解耦

### 7.3 白板（知识组织）

- 自研 Canvas（`BoardView.tsx`）：空白处拖拽平移、滚轮缩放、拖拽卡片；从信息流按 `B` 或按钮把条目「送白板」（无白板时自动新建）。
- 卡片类型（6 种）：`ref`（引用条目）/ `text` / `link` / `image` / `file` / `video`；本地附件经 `board-asset://` 安全加载。6 种类型以快捷按钮组形式内嵌于白板工具栏中，无需弹窗选择。
- **卡片连线**：hover 卡片显示四边中点拖拽手柄，按住任意手柄拖到另一张卡片即建立连线。连线自动选择卡间相对方向锚点 + 切线对齐贝塞尔曲线。连线中点可删除或编辑标签。无需切换模式，始终可用。

### 7.4 系统配置（5 个 Tab）

| Tab | 内容 |
|---|---|
| 外观 | 主题（跟随/亮/暗）、卡片风格（12 选一，整面配色）、阅读配色（30 套内置 + 自定义复制编辑）、阅读字体探测下拉、字号 70%–200%、字重、音效开关+音量 |
| 来源管理 | RSS 订阅分页管理（含源地址展示、错误详情）；GitHub★/Twitter 书签 分类管理；增删源、立即刷新、OPML 导入；删除订阅级联清除已下载内容 |
| 发现 RSS | 搜 GitHub 仓库 → 解析其 README/订阅源 → 一键/批量导入（discover_cache 24h 复用） |
| 数据管理 | JSON 配置导出/导入（含全部设置+订阅源）；数据库路径设置（支持文件选择器浏览）；刷新全部源；保留策略（keepDays/maxItems/立即清理）；开发者模式开关 |
| 快捷键 | 录制/重置每项快捷键、全部重置、冲突检测；遵循主流约定（⌘ 类全局生效，单键类输入时不触发） |

### 7.5 快速添加

全局 `⌘N`（或侧栏「+」）打开 `QuickAdd`：粘贴 URL 即入收集箱，正文由 readability 后台补全。

---

## 8. 快捷键

遵循主流桌面软件约定：`Mod` = ⌘(mac) / Ctrl(其它)。带 ⌘/Ctrl 的组合键在输入框聚焦时也生效；单键（j/k/e/l/f/o）仅在非输入时触发。`/` 为聚焦搜索的便利键，`Esc` 始终失焦并关闭弹层。

| 组合 | 作用 | | 组合 | 作用 |
|---|---|---|---|---|
| `Mod+,` | 打开系统配置 | | `j` / `k` | 下一条 / 上一条 |
| `Mod+F` | 聚焦搜索 | | `e` | 归档 |
| `Mod+R` | 刷新全部源 | | `l` | 稍后读 |
| `Mod+N` | 新建（快速添加） | | `f` | 收藏 |
| `Mod+1` | RSS 未读 | | `o` | 用浏览器打开原文 |
| `Mod+2` | 稍后读 | | `Mod+B` | 切换白板 |
| `Mod+3` | 已收藏 | | `Mod+/` | 快捷键帮助 |
| `Mod+4` | 已读 | | `Esc` | 关闭 / 返回 / 失焦 |
| `Mod+5` | 归档 | | | |
| `Mod+6` | 全部条目 | | | |

> 全部快捷键可在「系统配置 → 快捷键」中录制重绑、一键重置，并自动检测冲突。

---

## 9. 开发者模式与网络诊断

开启「系统配置 → 操作 → 开发者模式」后：

- 自动打开 DevTools（detached），并在右下角渲染浮动 **网络诊断面板**（`NetPanel`）。
- 每次 RSS 请求（HTTP 状态 / 耗时 / 字节 / 错误）经 `src/main/netlog.ts` 的 `extractError` 规范化（含 `ENOTFOUND`/`ETIMEDOUT`/`ECONNREFUSED`/`CERT_*` 等真实原因）后，经 `onNetLog` IPC 实时推送到面板。
- 用途：当某个源「无法获取数据」时，点「立即刷新全部源」，面板红字即定位失败类型（DNS / 代理 / 证书 / 源失效 / 需 VPN），便于针对性修复。

---

## 10. 构建与打包

```bash
# 依赖（建议用 managed Node 22）
npm install

# 开发
npm run dev                      # electron-vite 热重载

# 构建 + 打包（固定流水线）
npx electron-vite build                             # 编译 main / preload / renderer → out/
npx electron-builder --mac --dir                    # 产出 release/mac/ReadFlow.app
python3 build/make-dmg.py                           # 自定义 DMG

# 一键（推荐）
bash scripts/bump.sh "提交信息"                      # 自动 +semver patch / git commit / 构建 / 安装 / 打开

# 或
npm run dist                    # electron-vite build && electron-builder（产出 dmg）
```

- 数据库用 `node:sqlite`，**无需原生编译**，打包体积可控。
- DMG **未签名**：首次打开需右键「打开」或「仍要打开」。
- 版本号由 `package.json` 与 `app:version` 实时读取，标题栏右对齐显示。

---

## 11. 目录结构

```
readflow/
├── src/
│   ├── main/                      # 主进程
│   │   ├── index.ts               # 窗口、IPC 注册、Twitter/GitHub/OPML 导入、协议
│   │   ├── db.ts                  # node:sqlite schema / 查询 / 保留策略
│   │   ├── netlog.ts              # 网络诊断 + extractError 规范化
│   │   ├── ingest.ts              # 本地 HTTP 摄入服务
│   │   ├── sync.ts                # WebDAV 备份预留
│   │   └── sources/               # rss / tophub / github / readability / scheduler / githubDiscover
│   ├── preload/index.ts           # contextBridge IPC 桥
│   └── renderer/src/
│       ├── App.tsx                # 四栏布局 + 全局快捷键 + 网络面板 + 错误边界
│       ├── store.ts               # Zustand 单一 store
│       ├── env.d.ts               # 类型（Item/Feed/View/NetLogEntry…）
│       ├── components/             # Sidebar / FeedsPanel / ItemList / ReaderPane /
│       │                           #   BoardView / SettingsView / SourceManager / RssManager /
│       │                           #   DiscoverView / QuickAdd / CardEditor / ThemeEditor / icons
│       ├── lib/                   # appearance / shortcuts / sound / beam /
│       │                           #   reader / feedColor / monospace
│       └── styles/                # tokens.css（设计令牌）/ app.css
├── build/                        # make-dmg.py / build-dmg.py / dmg 背景图
├── extension/                    # 预留 X 书签浏览器扩展
├── DESIGN.md                     # 早期产品/技术设计蓝图（与当前实现有出入，供参考）
├── REVIEW.md                     # 历史代码审核记录
└── package.json
```

---

## 12. 版本更新日志

> 以下为 v0.7.11 之后的增量变更（更早的蓝图见 `DESIGN.md` / `REVIEW.md`）；完整提交历史见本地 git。

- **v0.7.12** UI 排版统一 + 推特导入 SQL 修复 + Discover 响应式：修复 Twitter 导入 `COUNT(*) AS all` 保留字语法错（→ `'all'`）；主题切换器圆角统一 10px；来源管理 RSS 区块三个平级操作 seg + 已订阅紧随其后；操作 tab 输入框限宽对齐；Discover 网格自适应防挤压；补 `env.d.ts` 的 `last_error` 类型。
- **v0.7.13** 左侧菜单布局重构：系统设置置底常驻不折叠；「全部」分组下排列 RSS 未读 / 已读 / 稍后读 / 已收藏（组内无分割线）；分割线仅保留「全部→GitHub」「GitHub→书签」；白板 / 标签可折叠保留。
- **v0.7.14** UI 排版六合一：侧栏去冗余分割线；信息流卡片高度约翻倍（96→196）改 flex 布局；删除归档菜单项（仅侧栏入口，SQL 仍支持）；FeedsPanel 行尾加单源刷新 + 头部全部刷新；手动添加 RSS 删类型下拉固定 `rss`；Discover 卡片固定 min 宽高。
- **v0.7.15** RSS 未读延迟标记：点击卡片不再立即标已读，翻到下一条 / 切换视图时才把上一张入已读并移出列表，连续阅读不打断。
- **v0.7.16** RSS 条件请求（304 增量省流量）：`feeds` 表加 `etag` / `last_modified`，请求带 `If-None-Match` / `If-Modified-Since`，服务端回 304 跳过下载与解析。
- **v0.7.17** 移除外链光束粒子特效（`lib/beam.ts` 文件保留未引用，vite 不再打包）。
- **v0.7.18** 移除非用户主动订阅的内置 7 个预置 RSS 源（`removeLegacySeedsOnce` 首次启动自动清老库预置条目，用户已读 / 收藏 / 稍后 / 归档过的保留）。
- **v0.7.19** 搜索 FTS 同步兜底（触发器失效 + 老库脱节自动 `rebuild`）+ 阅读模式精简（仅留「无图模式」）+ 白板连线重做（矩形边交点 + 平滑贝塞尔绕开卡片）。
- **v0.7.20** 删除二次确认弹窗（收藏 / 稍后 / 删除 / 清空直接执行）；Twitter/X 书签用 react-tweet 渲染；删除整个标签系统（db / store / sidebar / reader 全链路清理）。
- **v0.7.21** 移除 react-tweet（SWR 联网拉 CDN 不可用）：Twitter/X 书签回归正文渲染兜底（导入时已写 `content_html`）；依赖与代码彻底清理。
- **v0.7.22** UI 像素级打磨（处女座友好）：① 侧栏「全部」分组标题补左侧图标列，标题文字与下方条目在同一基线对齐；② 卡片未读去掉标题前置圆点，改由左侧 accent 竖条统一标识，已读/未读标题不再错位；③ 浮层/卡片/弹窗/白板卡的投影由固定黑 `rgba` 改为随主题自适应的 `color-mix(--color-text-primary)`，在 ocean/sunset 等深色卡片风格下投影可见；④ 分隔条 hover 高亮由硬编码蓝改为 `color-mix(--card-accent)`，随所选卡片风格联动；⑤ 补全键盘焦点环（侧栏项 / 分组标题 / 通用按钮 Tab 聚焦时显示 accent 描边），并给侧栏导航项加 `role="button"` + `tabIndex` + Enter/Space 激活；⑥ 清理 Writer/Gallery/标签/来源徽标底色等残留死 CSS。
- **v0.7.23** 修复两类体验问题并优化启动：①「全部」视图（及 RSS 未读、各视图计数、标为已读）不再混入 GitHub ★ / Twitter 书签——这两者是有独立侧栏入口的收藏集合，主阅读流保持纯净；② 修复启动首屏「先默认样式再切成已设配色」的闪烁：外观设置持久化到 localStorage，渲染前 `bootAppearance()` 同步铺好主题 / 卡片风格 / 字体，DB 权威值在 `initAppearance` 异步覆盖并刷新缓存；③ 启动提速：新增 `app:bootstrap` 通道，把启动时的多次 `settings:get` 顺序往返合并为 1 次 IPC（`initAppearance` 重写），并为外观变更补充缓存写回。
- **v0.7.24** 来源管理页表单布局对齐（处女座友好）：① 手动添加 RSS / GitHub Star 的 label 与输入框改为固定 92px 右对齐 label 列 + 1fr 输入列的 Grid，所有输入框左边缘严格对齐；② 「每 120 分钟」与单位文字和数字输入框在同一基线；③ 按钮行与上方输入框左边缘对齐（用空 label 列占位）；④ 统一 button 与 input 的 `min-height: 30px`，消除按钮/输入框高度不一致；⑤ `src-actions` 内带图标的按钮改为 `inline-flex` + `gap`，图标与文字垂直居中。
- **v0.7.25** 信息流分页加载（翻页浏览历史）：① `db.ts` 抽出 `buildListWhere`，新增 `listItemsPage(view, search, sourceType, sourceName, page, pageSize)` 与 IPC `items:listPage`（每页 15 条，`LIMIT/OFFSET` 分页）；② store 新增 `itemsPage`/`itemsDone`/`itemsLoadingMore` 状态，`load()` 改为加载首页并重置分页，`loadMoreItems()` 追加下一页（去重、末页自动标记 `itemsDone`）；③ ItemList 监听 `FixedSizeList` 滚动，距底部 0.8 行内自动触发加载，底部固定 44px 状态栏显示「已显示 N 条 · 滚动到底部加载更多 / 加载中…（accent 旋转环）/ 已显示全部 N 条」。选中某 RSS 订阅源后可一路翻到该源全部历史条目，不再静止在初始 15 条。
- **v0.7.26** UI 打磨——Discover（RSS 发现）仓库卡片紧凑化：折叠态 `min-height` 由 400px 降为 **200px**（原内容仅约 100px，下方大片留白），`min-width` 由 300px 增至 **350px**（按需求 +50），网格列 `minmax(300px,1fr)` → `minmax(350px,1fr)`、容器 `max-width` 1200 → **1260px**，卡片更宽、每行列数自然减少；展开（拉出 README 解析的 RSS 源列表）仍按内容自然增高。另加窄屏 `@media (max-width:760px)` 兜底，避免 min 350 在极窄窗口横向溢出。
- **v0.7.27** 重构 RSS 数据流程逻辑（结合完整流程图审查）：①「全部刷新」改为**强制刷新全部已启用源**（`refreshAllFeeds`，忽略到期判断），后台定时仍走 `runDue`（仅到期源），职责分离——此前「全部刷新」因到期限制对刚抓过的源点了没反应；② 新增 RSS **添加即抓取**（store.addFeed 捕获新源 id 立即 `refreshFeed`，无需等 ≤60s 调度），Discover 一键批量添加后也强制刷新全部；③ `feeds:add` 改为**幂等**（UNIQUE(url) 冲突不再抛错，返回已有源），手动添加重复源会提示「已存在，已跳过」，与 Discover 批量行为一致；④ 退出前 `checkpoint()` 截断 WAL，避免 `.db-wal` 无限增长、重启/更新后启动回放变慢。
- **v0.7.28** 修复「安装后信息流一片空白、像没数据」：v0.7.18 起砍掉全部内置预置源后，全新安装或来源列表为空的库**没有任何订阅源**，打开只剩一条欢迎引导卡，看起来像没数据；若从带预置源的更早版本升级，老预置源被一次性清理、新版又不补，源列表同样为空。现改为 `seedIfEmpty()` 在 **feeds 表为空**（全新安装 / 已装但无源）时自动预置一组精选 RSS（Hacker News / 少数派 / 酷壳 / 虎嗅 / V2EX / GitHub Blog，`addFeeds` 幂等、每次启动重跑无副作用），源 url 刻意避开旧版 LEGACY 列表不会被误删；调度器首轮 8s 后抓取，开箱即有真实内容。
- **v0.7.29** 启动健壮性：定位「装了新版本仍没数据」的运行时根因——`app.whenReady` 里 `createWindow()` 排在 `startIngestServer()` / `startScheduler()` **之后**，而本地 ingest http 服务（端口 47832）**无 error handler**，一旦端口被占用（`EADDRINUSE`，常见于上次未退干净）就会变成未捕获异常**崩掉主进程、窗口建不出来**，表现为整片空白。现改为：① `createWindow()` **先行**，保证 UI 永远能打开；② `initDb` / `startIngestServer` / `startScheduler` 各自包 `try/catch`，次级服务失败不再拖垮窗口；③ `ingest.ts` 给 `server` 加 `'error'` 监听器吞掉 listen 错误。至此代码层（种子/抓取/渲染首屏/空状态报错）已逐项实测确认正确，剩下「仍没数据」多为真机网络抓取失败或**用户实际跑的是旧二进制**（未签名 DMG 易被老进程/未覆盖占据）——以标题栏版本号与「来源管理」里 6 个预置源作为判定依据。
- **v0.7.30** 数据可观测性 + 定位「没数据」元凶：经本地用 `node:sqlite` 直接打开真实库实测，确认 `~/Library/Application Support/readflow/readflow/readflow.db`（嵌套路径，本代码库自始至终唯一的库路径）**数据完好**——含 1 个订阅源（潮流周刊）+ 14 条条目（Twitter 书签 / 阮一峰周刊 / 潮流周刊 265–276 期），且 app 原版 `listItems('rss')` 查询对着真实库**返回 12 条**，数据层 100% 正常。据此判定用户所见「没数据」是**运行中的 app 读到了另一个空库**（多为机器上旧副本 / 顶层孤儿 `…/readflow/readflow.db` 0 字节残留），而非数据丢失。新增：① 设置 → 操作 顶部「数据库位置」卡片，**直接显示当前 app 实际指向的库绝对路径**（含「复制路径」「在访达中打开」），IPC `app:dbFile` / `app:openDbDir`；② 该卡片提示用户核对路径是否就是有数据的那个文件。从此"到底读的是哪个库"一眼可见，杜绝旧二进制糊弄。
- **v0.7.31** 修复「数据库位置」卡片**永远显示"加载中"**：根因是该 `useEffect` 仅 `invoke('app:dbFile').then(...)`，**没有 `.catch`**——一旦主进程未就绪 / 主进程是旧版（无此 handler，常见于 dev 模式 HMR 只热更了渲染层、或旧二进制）/ IPC 被 reject，promise 永不 resolve，`dbFile` 卡在初始空串 → 一直"加载中"。现改为：① `getDbFile()` **惰性兜底**——即便 `initDb` 因异常未跑完，也按 `userData/readflow/readflow.db` 算出本应使用路径，绝不返回空；② 渲染层 `invoke` 加 `.catch` + **最多 3 次 400ms 重试**，失败则显示明确红色错误「⚠ 读取数据库路径失败：…（主进程可能未就绪，请彻底退出后重开应用）」而非无限加载；③ 新增 `.db-err` 样式。从"静默卡死"升级为"可读诊断"。
- **v0.7.33** 根治「替换 app 后数据丢失 / 出现两个库文件」：① 把数据库路径**锁死为唯一权威位置** `~/Library/Application Support/readflow/readflow/readflow.db`（所有应用数据集中在该 `readflow/` 子目录），并把旧路径 `…/readflow/readflow.db`（扁平）登记为历史遗留；② 新增 `migrateLegacyDatabase()`：每次启动若权威库为空/缺失、而历史旧路径有数据，则**自动整体复制**旧库（含 `-wal`/`-shm`）到权威位置并改名 `.migrated` 备份，**绝不覆盖已有数据的权威库**（经 10 条独立单测验证：迁移/不覆盖/空库填充/无操作四场景全过）；③ 澄清根因——此前「没数据」并非 dev 模式所致，而是**不同版本 app 改过数据库路径**，替换 `.app` 后新二进制去新位置找、旧数据被孤立成空库；dev 模式的 `userData` 重定向仅作用于项目目录 `.readflow-userData`，与用户 `~/Library` 真实数据完全隔离。今后若再改路径，只需把旧路径追加进 `legacyDbCandidates()` 即可自动兼容。
- **v0.7.34** 数据库改为**单层**结构：应用数据 `readflow.db` / `images/` / `backups/` / `board-assets/` 直接放在 Electron `userData` 根目录（`~/Library/Application Support/readflow/`），**不再多套一层 `readflow/` 子目录**（消除「两个 readflow 文件夹」的视觉冗余）。v0.7.33 的嵌套位置 `…/readflow/readflow.db` 登记为新版的历史遗留路径，`migrateLegacyDatabase()` 仍会在启动时自动把其中的数据迁到单层位置；嵌套数据子目录（images/backups/board-assets）也会上移到根目录后删除空壳。
- **v0.7.40+** 白板交互重构：卡片 6 类型快捷按钮移至工具栏（Excalidraw 风格），删除弹窗模式；连线改为 hover 卡片四边中点拖拽（无需切换模式）；贝塞尔曲线切线对齐；删除白板二次确认；移除重命名按钮；RSS 删除级联清理（`feed_id` 列 + 启动回填）；书签/白板分区分隔线；白板标题字号统一。
- **v0.7.65+** JSON 配置导入/导出：设置页增加「导出配置」和「导入配置」按钮，所有设置项 + 订阅源列表序列化为 `readflow-config.json`，跨机迁移一键恢复。
- **v0.7.73+** 阅读配色系统：30 套 VSCode 主题风格阅读配色（暗色 15 + 亮色 15），支持「跟随界面」模式。自定义主题编辑器：hover 色块显示「创建副本」按钮，弹窗编辑 15 个颜色值后保存到 localStorage。阅读面板 dropdown 与外观设置页同步展示内置 + 自定义主题。
- **v0.7.75** RSS 分页删除修复（删除后不再跳回首页）+ 订阅列表去重（`addFeeds` 入参去重 + DB 启动去重迁移）；已订阅列表展示源地址（标题下方小号 mono 字体 URL）；数据库路径支持文件选择器浏览。
- **v0.7.76** items 表增加 `feed_id` 列：新建 RSS 条目自动关联到 feeds；启动时按 `source_name` 回填已有条目；`deleteFeed` 按 `feed_id` 级联清理。配色操作按钮重构：删除「新建阅读配色」按钮，16px 正圆 hover 按钮，beam-border 静态描边效果，右上角贴合卡片。

---

## 13. 已知限制与后续

- **写作输出（TipTap 文档）**：`documents` 表与依赖保留，写作视图（Markdown 编辑器 + 引用卡片节点）待接入
- **UI 风格自定义编辑器**：12 套卡片风格当前仅可切换，后续支持像阅读配色一样的复制编辑保存
- **WebDAV 备份**：`sync.ts` 结构就绪，需补充设置入口与实测
- **浏览器扩展联调**：`extension/` 本体已打包，需完成与桌面端通信
- **白板性能**：大画布（100+ 卡片）时滚轮缩放可做增量渲染优化
- **自动更新**：未签名 DMG 无 Sparkle/Squirrel，待接入更新通道
- **云同步**：后续可考虑跨设备通过 WebDAV/本地网络同步

> `DESIGN.md` 为早期蓝图，`docs/TECH.md` 为当前 v0.7.90 技术实现手册。
