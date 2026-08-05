# 阅流 ReadFlow

> 个人知识流桌面客户端 —— 收集 → 速读 → 分类 → 组织 → 沉淀。
> 本地优先 · 键盘驱动 · 整面配色 · Electron + React。
> 当前版本 **v0.7.22** · macOS（Electron 37）。

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
4. **整面配色** —— 选一个卡片风格即确定整站基调与主强调色，配置即所见即所得。

---

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
│  node:sqlite —— userData/readflow/readflow.db (WAL)          │
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
| `items` | 统一内容卡片：`source_type`、`source_name`、`url`(UNIQUE+source_type)、`title`、`author`、`summary`、`content_text`、`content_html`、`cover_url`、`cover_path`、`status`(inbox/later/favorite/archived)、`is_read`、`published_at`、`fetched_at` |
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
- **整面配色（卡片风格）**：11 种风格（纸感 / 玻璃 / 暗夜 / 极光 / 海洋 / 落日 / 薰衣草 / 森林 / 玫瑰 / 石板 / 琥珀）+「默认」，每个风格定义 light + dark 两套色板（共 22 套），通过 `[data-card-style=X][data-theme=dark]` 组合选择器生效。
- **主强调色从签名色派生**：每个卡片风格自带 `--card-accent`，UI 主强调色（按钮/开关/聚焦环/选中态）直接用它本身，链接/信息色用 `color-mix` 推导以保证亮暗对比度。**无独立「强调色」控件** —— 选了卡片风格，整站配色即随之确定。

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
- 卡片类型：`ref`（引用条目，自带标题/摘要副本）/ `text` / `link` / `image` / `file` / `video`；本地附件经 `board-asset://` 安全加载。
- 卡片边缘连线 + 关系标签（支持/反驳/延伸），形成领域结构化认知。

### 7.4 系统配置（5 个 Tab）

| Tab | 内容 |
|---|---|
| 外观 | 主题（跟随/亮/暗）、卡片风格（12 选一，整面配色）、阅读字体探测下拉、字号 70%–200%、字重、音效开关+音量、实时预览 |
| 来源管理 | RSS/GitHub★/Twitter 书签 分类管理；增删源、立即刷新、OPML 导入、GitHub 用户名拉取、Twitter 书签导入；失败源显示「无法获取数据」+ 真实原因 |
| 发现 RSS | 搜 GitHub 仓库 → 解析其 README/订阅源 → 一键/批量导入（discover_cache 24h 复用） |
| 操作 | 刷新全部源、保留策略（keepDays / maxItems / 立即清理）、开发者模式开关 |
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
electron-vite build             # 编译 main / preload / renderer → out/
./node_modules/.bin/electron-builder --mac --dir   # 产出 release/ReadFlow.app
python3 build/make-dmg.py       # 自定义背景 DMG（icvp backgroundType=2）

# 或一键
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
│       │                           #   BoardView / SettingsView / SourceManager /
│       │                           #   DiscoverView / QuickAdd / CardEditor / icons
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

---

## 13. 已知限制与后续

- **写作输出（TipTap 文档）UI 暂未接入**：`documents` 表与依赖保留，写作视图待后续版本回归。
- **X 书签**走本地文件导入（X 官方读 Bookmark 需付费 API）；浏览器扩展（`extension/`）本体已打包但未联调。
- **WebDAV 备份** `sync.ts` 结构就绪，需在「系统配置」补充入口并实测。
- **国际源**（CNBC/Bloomberg/Investing）在大陆常需 VPN，失败会如实显示在「无法获取数据」与开发者网络面板。
- 参考：`DESIGN.md` 为早期蓝图，本文档以 v0.7.22 实际代码为准；后续里程碑（白板性能、写作闭环、云同步、自动更新）按计划推进。
