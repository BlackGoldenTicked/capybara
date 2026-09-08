# 水豚 Capybara —— 软件复刻手册（从零重建指南）

> 本文档的目的：让一名不熟悉本项目的开发者，仅凭此手册即可**从头把「水豚 Capybara」这款桌面软件重新实现出来**——包括它的产品定位、技术选型、系统架构、数据模型、IPC 契约、各功能模块的实现要点、构建打包流程、关键 bug 修复与技术难点归纳，以及一份完整的开发历程时间线（可作为需求演进的参考）。
>
> 适用范围：macOS 平台，Electron 37 + React 18 + node:sqlite（零原生编译）。当前最新版本 **v0.7.192**。
>
> 文档以**当前代码事实**为准（已逐一核对 `src/main`、`src/preload`、`src/renderer`、`build/`、`scripts/`、`package.json`），并结合 11 轮对话时间线（2026-08-03 ～ 2026-08-14）进行梳理。

---

## 目录

- [0. 一句话定义](#0-一句话定义)
- [1. 技术栈与精确版本](#1-技术栈与精确版本)
- [2. 系统架构](#2-系统架构)
- [3. 目录结构](#3-目录结构实现清单)
- [4. 数据模型](#4-数据模型sqlite-node-sqlite)
- [5. IPC 契约](#5-ipc-契约主渲染)
- [6. 核心功能模块实现要点](#6-核心功能模块实现要点)
- [7. 界面与交互](#7-界面与交互四栏可拖拽)
- [8. 构建与打包](#8-构建与打包精确流水线)
- [9. 技术难点与 Bug 归纳](#9-技术难点与-bug-归纳)
- [10. 关键运维与陷阱](#10-关键运维与陷阱复刻务必规避)
- [11. 完整开发历程时间线](#11-完整开发历程时间线)
- [12. 版本更新日志](#12-版本更新日志git-权威记录)
- [13. 复刻优先级建议](#13-复刻优先级建议)

---

## 0. 一句话定义

**水豚 Capybara 是一款「本地优先」的个人知识流桌面客户端**：把 RSS、热榜、GitHub Star、X/Twitter 书签、手动收集等所有来源统一抽象为「条目卡片」，并用一条强制流动的 Pipeline 把每条内容推向下一个动作，避免「收藏即冷藏」。

```
收集(RSS未读) → 速读(Triage) → 分类(稍后/收藏/归档) → 白板组织 → 沉淀输出
```

命名寓意：水豚性情极其佛系，几乎没有攻击性——在信息爆炸的时代，关注自己关注的，不要给自己太大压力。

### 四大设计原则（复刻时必须守住）

1. **条目即卡片** —— 所有内容（RSS 条目、GitHub 仓库、推文、手动收集）都是同一个 `Item`，列表 / 阅读 / 白板引用都是同一份数据的不同视图。
2. **本地优先** —— SQLite（node:sqlite 内置，零原生编译）+ 本地封面 / 白板附件仓，断网全功能可用。
3. **键盘可达** —— 全程快捷键（`j/k` 浏览），单手处理信息流。
4. **整面配色** —— 选一个卡片风格即确定整站基调与主强调色，配置即所见即所得。

### 双重参考体系

- **产品骨架学 WorkBuddy**（原生工具感）：三进程分离、`contextIsolation: true` + `nodeIntegration: false`、preload 通道白名单、CSP 头、macOS 窗口生命周期。
- **阅读写作学 Vercel design.md**（编辑级排版）：双速阅读（速读路径 + 审读路径）、60–68 字符行宽、固定字号角色、单色优先、先间距后边框、默认静止动效。
- **RSS 解析/正文渲染学 Fluent Reader + NetNewsWire**：Worker 异步 HTML 清洗、全局提取并发控制 + URL 去重缓存、CSS 广告/社交按钮过滤、WAL 自动 checkpoint。

---

## 1. 技术栈与精确版本

| 层 | 选型 | 版本 | 说明 |
|---|---|---|---|
| 壳 | Electron | **37.2.0** | `hiddenInset` 无边框窗口，标题栏仅显示版本号 |
| 构建 | electron-vite | 2.3.0 | 同时编译 main / preload / renderer |
| 打包 | electron-builder | 25.1.8 | 仅产 dmg（未签名） |
| 前端 | React / React-DOM | 18.3.1 | 渲染进程 |
| 语言 | TypeScript / Vite | 5.6.3 / 5.4.11 | — |
| 状态 | Zustand | 4.5.5 | 渲染进程单一 store + IPC 异步桥 |
| 数据 | node:sqlite（内置模块） | — | 同步 API，WAL 模式，FTS5 全文索引（不可用时降级 LIKE） |
| 阅读解析 | @mozilla/readability | 0.6.0 | 正文提取 |
| | cheerio | 1.2.0 | 非标页面 / 热榜抓取 |
| | dompurify | 3.4.13 | XSS 净化（渲染层） |
| | linkedom | 0.18.13 | 服务端 DOM 清洗（Worker） |
| RSS | rss-parser | 3.13.0 | 标准源解析（改为 `fetch`＋`parseString` 并打网络诊断日志） |
| 列表 | react-window | 1.8.11 | 信息流虚拟滚动 |
| 图标 | lucide-react | 1.28.0 | 统一线性图标 |
| 编辑器 | @tiptap/* (core/react/starter-kit/pm) | 3.29.2 | 写作文档预留（UI 暂未接入） |
| 音效 | 自研 Web Audio 合成（`lib/sound.ts`） | — | 全局轻触音效、外链提示音 |
| 图片 | sharp | 0.35.3 | 仅 devDep，用于背景图生成 |

> 早期蓝图（DESIGN.md）曾规划 Tailwind/shadcn、tldraw、better-sqlite3+Drizzle、TanStack Query、WebDAV 同步等，**当前实现已全部简化落地为上面这套**。复刻请以本表为准。

---

## 2. 系统架构

```
┌─ 渲染进程 (React + Zustand) ───────────────────────────────┐
│  侧栏 · 订阅源栏 · 信息流 · 阅读面板 · 白板 · 系统配置         │
│         ↕  window.capybara.invoke(channel, ...args)          │
│  preload/index.ts —— contextBridge 类型安全 IPC 桥           │
├─ 主进程 (Main) ───────────────────────────────────────────┤
│  采集调度 scheduler（按源频率、失败计数、last_error）          │
│  来源适配：rss.ts / tophub.ts / github.ts / readability.ts    │
│  GitHub★ / Twitter 书签 导入 / OPML / 发现 Discover          │
│  网络诊断 netlog；本地 HTTP 摄入服务 ingest                   │
│         ↕                                                     │
│  node:sqlite —— userData/capybara.db (WAL)                   │
│  本地仓：images/（封面）· board-assets/（白板附件）· backups/ │
└────────────────────────────────────────────────────────────┘
```

### 关键架构约束（复刻必守）

1. **渲染进程不直接访问 Node API**；所有读写经 `contextIsolation` 下的预加载桥（`ipcMain.handle`，首参 `IpcMainInvokeEvent` 剥离后交给业务函数）。
2. **重活在主进程完成**（抓取、正文提取、封面下载、发现解析）；采集结束通过 `webContents.send('sources:updated')` 通知渲染进程 `load()` 刷新，**绝不静默丢数据**。
3. **自定义协议**：`board-asset://`（白板本地附件）、`cover://`（本地化封面），渲染进程安全加载离线资源。**注意：不要用自定义协议承载中文文件名**（host 会被 Chromium 做 IDN 转码导致路径不匹配），内置资源预览改用 data URL。
4. **数据库开 WAL**；列表只投影需要的列（`ItemRow`），详情按需取单条正文（`getItem`），避免正文跨 IPC 全量传输（性能优化 #1）。
5. **启动顺序**：`initDb()`（同步、极快）→ `registerIpc()` → 注册协议 → `createWindow()`（窗口先行，UI 永远能开）→ `startIngestServer()` / `startScheduler()`（即便抛错也不拖垮窗口）。

---

## 3. 目录结构（实现清单）

```
capybara/
├── package.json                 # 版本号 = 软件唯一版本源（标题栏 / app:version 实时读取）
├── electron.vite.config.ts      # main/preload/renderer 三入口
├── src/
│   ├── main/
│   │   ├── index.ts             # 窗口、IPC 注册、Twitter/GitHub/OPML 导入、协议注册
│   │   ├── db.ts                # node:sqlite schema / 查询 / 保留策略 / 旧库迁移 / 信源发现
│   │   ├── netlog.ts            # 网络诊断 + extractError 规范化
│   │   ├── ingest.ts            # 本地 HTTP 摄入服务
│   │   ├── sync.ts              # WebDAV 备份预留（stub）
│   │   ├── diag.ts              # 刷新诊断模块
│   │   ├── discover/
│   │   │   └── data.ts          # 信源发现数据（自动生成，勿手改）
│   │   ├── lib/html.ts          # HTML 解码 / 摘要提取工具
│   │   └── sources/
│   │       ├── rss.ts           # RSS 验证/解析
│   │       ├── tophub.ts        # 热榜抓取
│   │       ├── github.ts        # GitHub★ 抓取
│   │       ├── readability.ts   # 正文提取封装（含并发控制 + URL 缓存）
│   │       └── scheduler.ts     # 定时调度（runDue / refreshAllFeeds / refreshFeed）
│   ├── preload/index.ts         # contextBridge IPC 桥（通道白名单）
│   └── renderer/src/
│       ├── main.tsx / App.tsx   # 四栏布局 + 全局快捷键 + 网络面板 + 错误边界
│       ├── store.ts             # Zustand 单一 store
│       ├── env.d.ts             # 类型（Item/Feed/View/NetLogEntry/Card/BoardLink…）
│       ├── components/          # Sidebar / FeedsPanel / ItemList / ReaderPane /
│       │                        #   BoardView / SettingsView / RssManager / DiscoverPanel /
│       │                        #   GithubStarManager / TwitterBookmarkManager /
│       │                        #   QuickAdd / CardEditor / ThemeEditor / DbView / DiagPanel / icons
│       ├── lib/                 # appearance / article-frame / beam / feedColor / monospace /
│       │                        #   reader / reading-themes / shortcuts / sound
│       ├── workers/             # article-cleaner.worker.ts（异步 HTML 清洗）
│       └── styles/              # tokens.css（设计令牌）
├── build/
│   ├── post-dev.sh              # 开发完标准收尾（关进程→清构建→构建→安装/打开）
│   ├── make-dmg.py              # 自定义 DMG（修复背景图不显示）
│   ├── gen-bg.mjs               # 背景图生成（npm run bg）
│   ├── dmg-background.png       # DMG 背景图
│   ├── AppIcon.icns             # 应用图标
│   └── logos/                   # Dock 图标切换（PNG 入库，自动出现在设置页）
└── scripts/
    ├── bump.sh                  # 版本 +semver patch → git commit（触发 post-commit 自动构建）
    └── gen_discover_data.py     # 信源发现数据生成脚本（可复现）
```

> **资产铁律**：`build/AppIcon.icns`、`logo/`、`build/logos/` 作为构建资产入库；`Capybara.app/`、`out/`、`release/`、`node_modules/`、`electron.vite.config.*.mjs` 不入库（见 `.gitignore`）。

---

## 4. 数据模型（SQLite，node:sqlite）

所有表在 `src/main/db.ts` 的 `migrate()` 中 `CREATE TABLE IF NOT EXISTS`。**复刻时请把下面字段原样落地**（含默认值与索引），否则 IPC 查询语义会错位。

### 4.1 核心表 DDL（语义级）

```sql
-- 统一内容卡片
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL DEFAULT 'manual',   -- rss|x|x_bookmark|wechat|tophub|github|manual
  source_name TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  content_text TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL DEFAULT '',        -- 解析时存 decoded 全文；渲染层兜底清洗
  cover_url TEXT NOT NULL DEFAULT '',
  cover_path TEXT NOT NULL DEFAULT '',          -- 本地化封面（images/<id>.<ext>）
  status TEXT NOT NULL DEFAULT 'inbox',         -- inbox|later|favorite|archived
  is_read INTEGER NOT NULL DEFAULT 0,
  published_at TEXT NOT NULL DEFAULT '',
  fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
  feed_id INTEGER NOT NULL DEFAULT 0,           -- 关联 feeds；级联删除用
  UNIQUE(url, source_type)
);
CREATE INDEX idx_items_status ON items(status, fetched_at DESC);

-- 订阅源
CREATE TABLE feeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL DEFAULT 'rss',
  name TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  config_json TEXT NOT NULL DEFAULT '',
  schedule_min INTEGER NOT NULL DEFAULT 120,    -- 抓取频率（分钟）
  last_fetched_at TEXT NOT NULL DEFAULT '',
  error_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1,
  etag TEXT NOT NULL DEFAULT '',                 -- 条件请求缓存头（304 跳过下载）
  last_modified TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'article',          -- article|podcast|video（内容类型）
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_feeds_url ON feeds(url);

-- 划线笔记（item_id 级联删除）
CREATE TABLE highlights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quote TEXT, note TEXT, color TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 白板
CREATE TABLE boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '未命名白板',
  snapshot_json TEXT NOT NULL DEFAULT '{}',      -- 已弃用，仅兼容迁移
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 白板卡片（独立持久化，每张卡片独立一行）
CREATE TABLE board_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  kind TEXT NOT NULL DEFAULT 'ref',              -- ref|text|link|image|file|video
  item_id INTEGER,
  x REAL NOT NULL DEFAULT 0, y REAL NOT NULL DEFAULT 0,
  w REAL NOT NULL DEFAULT 240, h REAL NOT NULL DEFAULT 140,
  title TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '',
  payload TEXT NOT NULL DEFAULT '{}',            -- 含本地附件元数据 {file,name,size,mime}
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_board_cards_board ON board_cards(board_id);

-- 白板卡片间关系连线
CREATE TABLE board_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  from_id INTEGER NOT NULL, to_id INTEGER NOT NULL,
  label TEXT NOT NULL DEFAULT '',                -- 支持/反驳/延伸
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(board_id, from_id, to_id)
);
CREATE INDEX idx_board_links_board ON board_links(board_id);

-- 写作文档（预留，UI 未接入）
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT '未命名文档',
  content_json TEXT NOT NULL DEFAULT '',
  markdown_cache TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',          -- draft|...
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 通用 kv
CREATE TABLE settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT ''
);

-- FTS5 全文索引（不可用时整段降级 LIKE）
CREATE VIRTUAL TABLE items_fts USING fts5(
  title, summary, content_text, content='items', content_rowid='id',
  tokenize='unicode61'
);
-- 触发器：增删改自动维护 items_fts（见 db.ts migrate()）

-- 信源发现系统（3 张表）
CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,          -- 9 大领域
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE rss_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT '',
  xml_url TEXT NOT NULL,
  html_url TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL DEFAULT '',  -- 企业/个人/机构
  tier TEXT NOT NULL DEFAULT 'T4',       -- T0-T4 权威分级
  stars INTEGER NOT NULL DEFAULT 0,
  tags TEXT NOT NULL DEFAULT '[]',       -- JSON 数组字符串
  language TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT ''
);
CREATE INDEX idx_rss_sources_tier ON rss_sources(tier);

CREATE TABLE role_source_map (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL,
  source_id INTEGER NOT NULL,
  priority TEXT NOT NULL DEFAULT 'optional',  -- mandatory|optional
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (source_id) REFERENCES rss_sources(id)
);
CREATE INDEX idx_role_source_map_role ON role_source_map(role_id);
CREATE INDEX idx_role_source_map_source ON role_source_map(source_id);
```

### 4.2 关键数据逻辑（复刻必须一致）

- **去重写入 `upsertItem`**：按 `(url, source_type)` 冲突更新；内容完全相同则跳过（避免每次抓取重建 FTS 索引，写放大修复）。
- **保留策略 `purgeOldItems(days, max)`**：仅清理「已归档」且超过 N 天、或单库超 N 条的旧条目；**收藏与白板引用永不被清理**（`id NOT IN (SELECT item_id FROM board_cards) AND status != 'favorite'`）。
- **封面本地化 `storeCover`**：封面下载到 `images/<id>.<ext>`，离线可用；`fillCoverIfEmpty` 仅当无封面时补。
- **RSS 级联删除 `deleteFeed`**：优先按 `feed_id` 删，同时按 `source_name` 兜底兼容旧数据。
- **视图过滤**：GitHub★ / X书签 是独立侧栏集合，主阅读流用 `source_type NOT IN ('github','x_bookmark')` 排除，避免污染。
- **WAL checkpoint**：每 30 分钟或 WAL 文件 > 10MB 自动 `wal_checkpoint(TRUNCATE)`；退出前强制截断。
- **信源发现种子**：首次启动 `migrateDiscover()` 建表 + `seedDiscover()` 导入，`settings.discover_seeded=1` 标记防重复。数据源 `src/main/discover/data.ts`（自动生成勿手改），由 `scripts/gen_discover_data.py` 从 feeds 工作空间可复现生成。

### 4.3 数据库路径铁律（踩坑血泪，务必照做）

- **权威库唯一位置（扁平）**：`userData/capybara.db`；`images/`、`backups/`、`board-assets/` 直接放 userData 根，**绝不嵌套**。
- 改动路径必须同时一致存在于 `canonicalDbPath()` / `initDb()` / `getDbFile()`。
- `migrateLegacyDatabase()` 自动把嵌套旧库迁到扁平位（含 -wal/-shm），**绝不覆盖已有数据**；改路径请把旧路径加进 `legacyDbCandidates()`。
- dev 模式用项目内 `.capybara-userData` 隔离（见 index.ts 顶部），生产库在 `~/Library/Application Support/capybara/`。
- **改代码 / 删 seed 不删持久化数据**：SQLite 是文件，删代码 ≠ 删数据。

---

## 5. IPC 契约（主↔渲染）

### 5.1 安全模型

`src/preload/index.ts` 用 `contextBridge` + **通道白名单**暴露 `window.capybara.invoke(channel, ...args)`，绝不暴露 `ipcRenderer`。新增 channel 必须在 `validChannels` 与 `registerIpc()` 中同步登记，否则渲染进程调用抛 `Invalid channel`。

### 5.2 完整通道清单

```
app:version  app:fontList  app:bootstrap  app:logoList  app:setLogo  shell:openExternal
items:list  items:listPage  items:get  items:counts  items:updateStatus
items:markRead  items:setRead  items:delete  items:markAllRead  items:clearInbox
items:sourceCounts  items:quickAdd  items:counts
feeds:list  feeds:listPage  feeds:count  feeds:validate  feeds:add  feeds:addMany
feeds:delete  feeds:refresh  feeds:importOpml  sources:refreshAll
settings:get  settings:set  settings:purge  settings:export  settings:import
settings:getDbPath  settings:setDbPath  settings:pickDbPath
boards:list  boards:create  boards:delete  boards:rename
boards:cards  boards:addCard  boards:updateCard  boards:moveCard  boards:deleteCard  boards:openFile
boards:links  boards:addLink  boards:deleteLink  boards:updateLink
github:fetchStars  twitter:importBookmarks
discover:roles  discover:tags  discover:feeds  discover:add
db:tables  db:rows            -- 仅开发者模式下开放，表名白名单防注入
diag:snapshot  diag:testPurge  diag:testRefreshOne  diag:testRefreshAll  diag:testForceOne  diag:testForceAll
devtools:toggle  sync:backup
```

回调通道：`onSourcesUpdated(cb)`（主进程 `webContents.send('sources:updated')`）、`onNetLog(cb)`（网络诊断日志）、`getPathForFile(file)`（隔离环境下取 `<input type=file>` 真实路径）。

### 5.3 启动引导优化

`app:bootstrap` 一次性返回外观 / 音效 / 快捷键 / 开发者模式 / 布局宽度 / 版本 / logo，把渲染进程启动时的多次 `settings:get` 顺序往返合并为 1 次 IPC，缩短首屏。

---

## 6. 核心功能模块实现要点

### 6.1 RSS 采集与调度（`sources/scheduler.ts` + `rss.ts`）

- 每源独立频率（`schedule_min`：热榜 30min / RSS 30–1440min / GitHub 24h）。`dueFeeds()` 用 `julianday` 算到期；后台定时走 `runDue`（仅到期源），「全部刷新」按钮走 `refreshAllFeeds`（强制全刷，职责分离）。
- 抓取失败自增 `error_count` 并保存**真实** `last_error`（DNS/超时/403/CERT 等），UI 三处提示「无法获取数据」。`markFeedFetched` 成功时回存 `etag`/`last_modified` 支持 304 增量。
- 新增即抓取；`feeds:add` 幂等（相同 url 返回已有源）。退出前 / WAL 膨胀时 checkpoint。
- **调度结束必须通知前端**：`runDue` 回调通知渲染进程刷新（早期 bug：自动抓取的数据不刷新到界面，只有手动刷新才发事件）。

### 6.2 正文提取与渲染

**提取链路**：
- `@mozilla/readability` 抽正文；`lib/article-frame.ts` 与 Worker `article-cleaner.worker.ts` 异步 HTML 清洗（linkedom），3s 超时回退同步。
- **全局提取并发控制**：`ExtractionQueue` 限制全局最多 3 路并发提取（从原来 20 路降下来）。
- **URL 级别去重缓存**：10 分钟 TTL，同一 URL 的并发请求自动合并为一次实际下载（参考 NetNewsWire callback coalescing）。

**渲染链路**：
- `lib/reader.ts` 的 `renderArticleHtml` 规整——剥离站内联 style/class、回填懒加载图、iframe 转链接、**DOMPurify 净化**；图片点击进灯箱；支持「无图模式」、`prefers-reduced-motion`。
- **渲染方式演进**：最初用 `dangerouslySetInnerHTML` → beta-01 改为 `iframe sandbox` + `srcdoc` + postMessage 转发点击 → 后又还原为 `dangerouslySetInnerHTML`（因 iframe 方案有渲染问题），最终保持 Worker 异步清洗 + DOMPurify 净化 + dangerouslySetInnerHTML。

**RSS 摘要乱码修复**：解析时存 decoded `content_html`，启动时 `repairHtmlEncodedItems()` 修复旧数据 `&lt; &gt;` 实体；渲染层兜底清洗。

### 6.3 搜索（FTS5）

- `buildListWhere` 用 `items_fts MATCH`，用户输入拆词加引号防注入、支持前缀匹配；`hasFts()` 为假时降级 `LIKE`。
- `items_fts` 由触发器自动维护；启动时若行数与 `items` 不一致则 `INSERT INTO items_fts(items_fts) VALUES('rebuild')` 重建。

### 6.4 内容来源

| 来源 | 方式 | 关键实现 |
|---|---|---|
| RSS / Atom | rss-parser | 手动添加 / 选择 / OPML 导入；单源 / 全部刷新；支持 article/podcast/video 三种 kind |
| tophub 热榜 | cheerio 抓取 | 各榜单页，热度值入库 |
| GitHub ★ | REST API（可选 token） | `github:fetchStars`，按用户名拉 ≤1000 个 starred 写入 `source_type=github`；速率超限提示填 Token |
| X/Twitter 书签 | 本地文件导入 JSON/CSV | `parseTwitterExport` 兼容 `full_text`/`fulltext`、HTML 实体解码、媒体抽取、RFC4180 CSV 解析 |
| 手动收集 | ⌘N 快速添加 | 粘 URL → readability 提正文 → 入收集箱（异步补全不阻塞） |
| 发现 Discover | 2242 条候选源数据库 | 65 角色 × 9 领域筛选 + 标签 OR 筛选 + T0-T4 五色圆点 + 已订阅自动标记 |

### 6.5 信源发现系统（`DiscoverPanel.tsx` + `db.ts discover`）

**数据来源**：从 feeds 工作空间迁移，2242 条 RSS 候选源 × 65 角色 × 11825 对映射，内建在 `src/main/discover/data.ts`。

**查询**：`discoverFeeds()` 用 `json_each()` 解 tags JSON 做 OR 筛选 + `role_source_map` 做角色筛选 + `LEFT JOIN feeds ON f.url=s.xml_url` 标记已订阅。

**UI**：插在 RssManager「手动添加/导入 OPML」卡片与「已订阅」卡片之间；点击「+添加」展开 图文/播客/视频 三选（默认图文）→ 确认订阅。

**分页器**（吃豆人滑块）：
- 点数量自适应：≤20 页每页一点、>20 页固定 20 点等分。
- 自定义点状滑块（非 `<input type="range">`），轨道由点组成，thumb 与点同行。
- **吃豆人 thumb**：`conic-gradient` 嘴巴 + `chomp` 开合动画 + `::after` 眼睛；体积随拖动位置 14→22px 线性增长；朝向用 `transform: scaleX(var(--dir))` 镜像。
- **方向隐喻**：前进（页数从小到大）已吃过的点隐藏（`.eaten`）；后退（从大到小）已"拉出"的点变粑粑螺旋 SVG data URL（`.poop`）。
- 流畅度关键：thumb 位置用 rAF 节流（每帧一次 setState），**拖动中不查列表、松手才 query**。

### 6.6 白板（知识组织，`BoardView.tsx` 自研 Canvas）

- 空白处拖拽平移、滚轮缩放、拖拽卡片；信息流按 `B` 或按钮把条目「送白板」（无白板自动新建）。
- 卡片 6 种类型（ref/text/link/image/file/video），以快捷按钮组内嵌工具栏，无需弹窗。本地附件经 `board-asset://` 加载（`stageAsset` 拷入 `board-assets/<cardId><ext>`）。
- **连线**：hover 卡片显四边中点拖拽手柄，拖到另一张即建连线；自动选相对锚点 + 切线对齐贝塞尔曲线；中点可删 / 可编辑标签。
- **关键 bug 修复**：
  - 连线精度用 DOM 实测卡片高度（非 stale `h`）。
  - `React #185` 无限渲染（cardHeights 由 setState 改 ref + tick 触发）。
  - 白板平移 bug：`.board-layer` 铺满画布导致 `e.target` 判断失败 → 改为 pointer 事件 + `setPointerCapture`。
  - 卡片数据丢失：旧模型用单 JSON 快照 blob 存所有卡片，切换白板时覆盖丢失 → 改为每张卡片独立 DB 行。

### 6.7 设计系统与配色

- **三级语义色板** + 亮暗双主题（默认跟随系统）。设计令牌统一在 `styles/tokens.css`。
- **整面配色（12 套卡片风格）**：纸感 / 玻璃 / 暗夜 / 极光 / 海洋 / 落日 / 薰衣草 / 森林 / 玫瑰 / 石板 / 琥珀 / 暗金。每套 light+dark 两套（共 24），经 `[data-card-style=X][data-theme=dark]` 组合生效；主强调色从签名色 `--card-accent` 派生。
- **阅读配色（30 套内置 + 自定义）**：独立于 UI 配色，为阅读面板提供 30 套 VSCode 主题风格（`src/renderer/src/lib/reading-themes.ts`），经 `--rt-*` 注入；支持「跟随界面」。用户可对任意主题创建副本、编辑 15 个颜色值保存为自定义（localStorage）。
- **动效令牌**：`--ease-out: cubic-bezier(0.23,1,0.32,1)`、`--dur-fast/base/slow = 120/160/240ms`；禁止弱 ease，UI 动效 <300ms，只用 transform/opacity，按钮 `:active{scale(0.97)}`，尊重 reduced-motion。
- **Border Beam 光效**：纯 CSS `conic-gradient`+`mask` 的彩色脉动边框（`lib/beam.ts`），零依赖；用于 RSS 第三列文章卡片与发现页搜索按钮、分页器 thumb。
- **字体系统**：`app:fontList` IPC 扫描三目录（/System/Library/Fonts、/Library/Fonts、~/Library/Fonts），清洗样式后缀提取纯 family 名，去重排序返回 ~500 个字体。选择后全局生效（UI + 阅读正文）。

### 6.8 系统配置（5 Tab）

外观｜来源管理（RSS 分页 / GitHub★ / X书签 / OPML / 信源发现）｜发现 RSS｜数据管理（JSON 配置导入导出 + 数据库路径 + 保留策略 + 开发者模式）｜快捷键（录制/重置/冲突检测）。

### 6.9 开发者工具

- **数据库查看器**（`DbView.tsx` + `db:tables`/`db:rows`）：列出表结构与分页数据，表名强制白名单校验防注入。
- **刷新诊断**（`diag.ts` + `DiagPanel.tsx`）：清空验证 / 单源刷新 / 全量刷新，HTTP 级打点，强制刷新清 etag，结构化日志。
- **网络诊断**：每次 RSS 请求经 `netlog.ts` 的 `extractError` 规范化后实时推到面板，定位失败类型。

### 6.10 应用图标切换

- `build/logos/` 目录放 PNG（建议 1024×1024）即自动出现在设置页。
- `package.json` `extraResources` 配置 `build/logos → logos`。
- 主进程 `nativeImage.createFromPath` + `resize(128×128)` + `toDataURL()` 返回缩略图 data URL（不用自定义协议，因中文文件名 host 被 IDN 转码）。
- `app.dock.setIcon()` 运行时切换 Dock 图标。

---

## 7. 界面与交互（四栏可拖拽）

```
[ 侧栏 Sidebar ] │ [ 订阅源栏 FeedsPanel ] │ [ 信息流 ItemList ] │ [ 阅读面板 ReaderPane ]
```

- **侧栏**（可折叠分组，状态持久化）：「全部」分组（RSS 未读 / 已读 / 稍后读 / 已收藏）+ GitHub★ + Twitter 书签 + 白板 + 标签；系统设置置底常驻。搜索框置顶，`/` 聚焦。
- **订阅源栏（第四栏）**：仅 RSS 类视图显示；按 `source_name` 筛选，确定性哈希配色圆点（`lib/feedColor.ts`）。
- **信息流**：卡片 = 来源彩色圆点 + 标题 + 2 行摘要 + 「X 前」时间（按 `COALESCE(published_at,fetched_at)` 排序）；悬停露已读/稍后读/收藏/打开/删除。RSS 未读视图点卡片**仅打开不标已读**，切下一条/切视图时才入已读（连续阅读不打断）。
- **阅读面板**：外链用系统默认浏览器打开（`shell:openExternal`，仅放行 http/https）并播放提示音。

**快捷键**（Mod = ⌘/Ctrl）：`Mod+,` 配置｜`j/k` 上下条｜`e` 归档｜`l` 稍后｜`f` 收藏｜`o` 浏览器打开｜`Mod+B` 白板｜`Mod+N` 快速添加｜`Mod+R` 刷新全部｜`Mod+F` 搜索｜`Mod+1..6` 视图切换｜`Esc` 关闭。单键仅非输入时触发。

**Zen 专注模式**：一键隐藏侧栏/源栏/列表，阅读面板全屏，`Esc` 退出。

**三栏可拖拽 + 折叠**：侧栏与信息流之间有可拖拽分隔条，宽度持久化；信息流最大 400px；侧栏拖到 ≤96px 自动折叠成图标栏（再拖宽恢复）。

---

## 8. 构建与打包（精确流水线）

### 8.1 固定流程（复刻请严格照此）

```bash
npm install
npx electron-vite build                 # 编译 main / preload / renderer → out/
npx electron-builder --mac --dir        # 产出 release/mac/Capybara.app
python3 build/make-dmg.py               # 自定义 DMG（修复背景图不显示）
```

### 8.2 一键收尾 `scripts/bump.sh "改动简述"`

- 把 `package.json` 的 **semver patch 位 +1**（如 0.7.129 → 0.7.130）。
- `git add -A` + `git commit -m "vX.Y.Z 本次改动简述"`（**只 commit，不打 tag、不 push**）。
- 提交后由 `.git/hooks/post-commit` 钩子自动执行 `build/post-dev.sh`（完整构建+安装+打开）；纯文档提交跳过。

### 8.3 `build/post-dev.sh`（四步）

1. 关掉所有 Capybara / dev 进程（`osascript quit` + `pkill -f capybara/electron-vite/vite`）。
2. 清理 `out/`、`release/mac/`、旧 DMG、卸载残留 DMG 卷（`hdiutil detach /Volumes/Capybara*`）。
3. 构建：`npm run build` → `electron-builder --mac --dir` → `python3 build/make-dmg.py`。
4. 覆盖安装到 `/Applications/Capybara.app`：优先用 `ditto`（`dangerouslyDisableSandbox`，不触发 bulk delete 弹窗）；`rm -rf` + `cp -R` 在沙箱下会失败。最后 `open` + 前台 `activate`。

### 8.4 DMG 背景图（`make-dmg.py`）

- electron-builder 生成的 `.DS_Store` 缺 `backgroundImageAlias`，Finder 不显示背景图。本脚本改用 `hdiutil` 创建可读写 DMG，再用 `mac_alias`+`ds_store` 写入正确 `.DS_Store`（含 `backgroundType=2` + 背景图别名 + 窗口布局 + 图标位置），最后压为只读 UDZO。
- 背景图 `build/dmg-background.png`；窗口 660×440；图标 size **80**；`Capybara.app` 位置 **(180,190)**，`Applications` 位置 **(490,190)**。

### 8.5 git 用户配置

提交者 `Capybara Dev <dev@capybara.local>`；`.gitignore` 已覆盖 `release/`、`out/`、`node_modules/`、图标资产入库。

### 8.6 覆盖安装方式演进

| 方式 | 问题 | 解决 |
|---|---|---|
| `rm -rf /Applications/Capybara.app && cp -R` | 沙箱下 `rm -rf` 触发 bulk delete 弹窗，用户需多次确认 | 改用 `ditto`（`dangerouslyDisableSandbox`） |
| `ditto release/mac/Capybara.app /Applications/Capybara.app` | 偶尔旧进程残留导致 `open` 激活旧实例 | 先 `pkill -f Capybara` 再安装 |

---

## 9. 技术难点与 Bug 归纳

> 以下是从 11 轮对话中提炼的高频问题、关键 bug 和技术难点，按类别归纳。

### 9.1 Electron 进程与 IPC 层

#### 9.1.1 `ipcMain.handle` 首参陷阱（最高频）

**问题**：`ipcMain.handle` 的回调第一个参数是 `IpcMainInvokeEvent` 对象，会偷占业务参数位。且 node:sqlite 把 `event.type` 当命名参数报 `Unknown named parameter 'type'`。

**解决**：用 wrapper 统一剥离 event：

```typescript
const wrapped = (_e: IpcMainInvokeEvent, ...args: any[]) => actualHandler(...args);
ipcMain.handle('channel:name', wrapped);
```

**教训**：这条坑已补进 `electron-app-scaffold` skill 当作坑 0（最高频踩中）。

#### 9.1.2 调度器抓取后不通知前端

**问题**：自动调度 `runDue` 抓到新条目后没有通知渲染进程刷新（只有手动刷新才通知），导致真实数据进了库但界面一直显示旧数据。

**解决**：每轮抓取结束都会广播 `webContents.send('sources:updated')` 通知前端 `load()` 刷新。`startScheduler` 接收回调参数。

#### 9.1.3 预加载桥通道白名单

**问题**：新增 IPC channel 忘记在 `preload/index.ts` 的 `validChannels` 中同步登记，渲染进程调用抛 `Invalid channel`。

**解决**：新增 channel 必须在 `validChannels` 与 `registerIpc()` 中同步登记。

#### 9.1.4 `getPathForFile` 在隔离环境下的真实路径

**问题**：`contextIsolation` 下 `<input type=file>` 的 `file.path` 不可靠。

**解决**：preload 暴露 `getPathForFile(file)` 获取真实文件路径。

### 9.2 数据库与持久化

#### 9.2.1 数据库路径嵌套导致迁移失败

**问题**：早期数据库存在 `userData/capybara/capybara.db` 嵌套路径中，改路径后旧库找不到。

**解决**：
- 扁平化为 `userData/capybara.db`（权威库唯一位置）。
- `migrateLegacyDatabase()` 自动把嵌套旧库迁到扁平位（含 -wal/-shm），绝不覆盖已有数据。
- `legacyDbCandidates()` 包含所有历史路径，改路径请把旧路径加进去。

**教训**：**数据库路径铁律**——扁平 `userData/capybara.db` + 根目录 `images/backups/board-assets`，绝不可随意改；改必同步三处并加旧路径到迁移候选。

#### 9.2.2 FTS5 触发器在 UPDATE 时的问题

**问题**：担心 FTS5 外部表的 UPDATE/DELETE 触发器在改状态时抛错导致 `items:updateStatus` reject。

**排查**：经测试 FTS5 触发器在 UPDATE/DELETE/SEARCH 下都正常工作。真正的问题是调度器不通知前端。

#### 9.2.3 FTS5 不可用时的降级

**问题**：某些环境无 FTS5 支持。

**解决**：`hasFts()` 为假时整段降级 `LIKE`，UI 无感。启动时若 FTS 行数与 `items` 不一致则重建索引。

#### 9.2.4 WAL 体积膨胀

**问题**：大库长时间运行 WAL 膨胀。

**解决**：每 30 分钟或 WAL 文件 > 10MB 自动 `wal_checkpoint(TRUNCATE)`；退出前强制截断。

#### 9.2.5 白板卡片数据丢失（数据模型重写）

**问题**：旧模型把白板所有卡片存成 `boards` 表里一个 JSON 快照 blob，渲染进程只有一个共享 `boardNodes` 数组——切换白板时直接覆盖，且没可靠落盘，导致卡片"消失"。

**解决**：
- 新增 `board_cards` 表，每张卡片独立成行（`board_id` 归属）。
- 细粒度持久化 IPC：`boards:cards / addCard / updateCard / moveCard / deleteCard`。
- 拖动松手即 `moveCard` 落盘；切换白板时 `openBoard` 按 `board_id` 重新加载。
- 向后兼容：首次打开旧版白板自动把 `snapshot_json` 迁移成 ref 卡片。

### 9.3 白板交互

#### 9.3.1 白板平移 bug

**问题**：`.board-layer` 用 `inset:0` 铺满画布，成了指针事件的实际目标，旧代码写死 `e.target !== canvasRef.current` 直接 return——空白处永远拖不动。

**解决**：改为「点中卡片才拖卡片、点空白就平移」+ `setPointerCapture`。

#### 9.3.2 React #185 无限渲染

**问题**：`cardHeights` 用 `setState` 在 render 阶段更新，触发无限重渲染。

**解决**：`cardHeights` 由 `setState` 改为 `ref` + `tick` 触发（forceUpdate 模式）。

#### 9.3.3 连线精度问题

**问题**：连线锚点用 stale `h`（初始高度）而非实际渲染高度，导致连线偏移。

**解决**：用 DOM 实测卡片高度（`ref` + `getBoundingClientRect()`）。

### 9.4 RSS 采集与正文渲染

#### 9.4.1 RSS 摘要 HTML 实体乱码

**问题**：解析时未 decode `content_html`，导致 `&lt;` `&gt;` 等实体直接显示。

**解决**：解析时存 decoded `content_html`；启动时 `repairHtmlEncodedItems()` 修复旧数据；渲染层兜底清洗。

#### 9.4.2 正文渲染方式演进

| 阶段 | 方案 | 问题 |
|---|---|---|
| 初版 | `dangerouslySetInnerHTML` | 同进程渲染，大文章卡顿，无进程隔离 |
| beta-01 | `iframe sandbox` + `srcdoc` + postMessage | 有渲染问题 |
| 最终 | 还原 `dangerouslySetInnerHTML` + Worker 异步清洗 + DOMPurify | 稳定可用 |

#### 9.4.3 正文提取并发控制

**问题**：4 源 × 5 篇 = 最多 20 个并发 fire-and-forget fetch，可能压垮源站。

**解决**：`ExtractionQueue` 全局并发限制为 3 路 + URL 去重缓存（10 分钟 TTL）+ 同 URL 请求合并（pending Map）。

#### 9.4.4 本地 RSS vs 云端 RSS 阅读器

**问题**：用户问"为什么 Folo 可以加载历史所有文章，Capybara 只能拿到 feed 当前输出的十几条？"

**结论**：这不是 bug。Folo 是云端阅读器（服务端持续积累），Capybara 是纯本地的（直连 RSS feed，只能拿到 feed 当前输出）。隐私 vs 历史数据的取舍。

### 9.5 自定义协议与中文文件名

#### 9.5.1 `logo://` 协议承载中文文件名失败

**问题**：`logo://` 自定义协议里中文文件名（如"默认.png"）作为 host 被 Chromium 做 IDN 转换，路径不匹配 → 预览图加载失败。

**解决**：主进程 `listLogos()` 直接用 `nativeImage.createFromPath` + `resize(128×128)` + `toDataURL()` 返回缩略图 data URL。删除 `logo://` 协议。

**教训**：**内置资源的渲染预览用 data URL / 缩略图，不要用自定义协议承载中文文件名**（standard 协议 host 会被 IDN 转码）。

### 9.6 UI/UX 像素级打磨

#### 9.6.1 分页器演进（4 次重做）

| 版本 | 方案 | 问题 |
|---|---|---|
| v1 | 上一页/下一页 + 页码输入框 | 不够直观 |
| v2 | `<input type="range">` 滑块 + 独立刻度点 | 轨道和点分离，视觉混乱 |
| v3 | 自定义点状滑块（轨道由点组成） | thumb 与点不对齐 |
| v4 | 吃豆人 thumb + 点状态机 | 最终方案 |

**吃豆人分页器状态机**：
- 前进（页数从小到大）：已吃过的点隐藏（`.eaten`）
- 后退（从大到小）：已"拉出"的点变粑粑螺旋（`.poop`）
- 换方向时：粑粑变圆点，圆点变粑粑
- 体积随页数线性增长（14→22px）
- 朝向跟随拖动方向（`scaleX` 镜像）

**流畅度关键**：thumb 位置用 rAF 节流（每帧一次 setState），拖动中不查列表、松手才 query；100ms 节流触发查询。

#### 9.6.2 DMG 背景图不显示

**问题**：electron-builder 生成的 `.DS_Store` 缺 `backgroundImageAlias`，Finder 不显示背景图。

**解决**：自定义 `make-dmg.py`，用 `hdiutil` 创建可读写 DMG，再用 `mac_alias`+`ds_store` 写入正确 `.DS_Store`。

#### 9.6.3 字体系统全局改造

**问题**：系统安装了 501 个字体，原来只能选 22 个等宽字体。

**解决**：
- `scanSystemFonts()` 扫描三目录，清洗样式后缀提取纯 family 名，去重排序返回 ~500 个字体。
- 字体设置覆盖整个软件所有文字（UI + 阅读正文），字重全局生效。
- `--font-weight` CSS 变量取代原来的 `--reader-weight`（仅阅读区）。

### 9.7 Shell 环境兼容性

#### 9.7.1 Fish shell 语法不兼容

**问题**：`fish` 不支持 `var=$(...)` 语法、不支持 heredoc、不支持 `for` 循环语法。

**解决**：使用 `bash -c` 执行命令，或写成 bash 脚本文件再用 bash 执行。

#### 9.7.2 沙箱环境下覆盖安装失败

**问题**：沙箱下 `rm -rf /Applications/Capybara.app` 触发 bulk delete 弹窗，用户需多次确认甚至被拦截。

**解决**：改用 `ditto release/mac/Capybara.app /Applications/Capybara.app`（`dangerouslyDisableSandbox`），不触发 bulk delete 弹窗。

### 9.8 版本管理与提交规范

#### 9.8.1 bump + post-commit 重复提交

**问题**：`bump.sh` 内部 `git commit` 触发 post-commit 钩子，钩子再调 `post-dev.sh`。之前 `reset --soft` 后磁盘 `package.json` 与 git HEAD 不同步时，会出现连续两个同名提交。

**解决**：`reset --soft` 后必须先校对磁盘 `package.json` 与 git HEAD 一致，再 commit。

#### 9.8.2 提交后必构建（用户铁律）

**规则**：任何源码/构建文件 commit 后必须自动构建安装。用户明确反对「改了只提交不构建」。纯文档提交可跳过。

---

## 10. 关键运维与陷阱（复刻务必规避）

1. **数据库路径铁律**（§4.3）：扁平 `userData/capybara.db` + 根目录 `images/backups/board-assets`，绝不可随意改；改必同步三处并加旧路径到迁移候选。
2. **未签名 DMG**：首次打开需右键「打开」或「仍要打开」。
3. **版本号唯一源**：`package.json.version`，标题栏与 `app:version` 实时读取；提交必须经 `bump.sh`（patch+1）。
4. **WAL 体积**：大库长时间运行 WAL 膨胀，已用定时 + 阈值 checkpoint 兜底。
5. **FTS5 降级**：环境无 FTS5 时整段降级 LIKE，UI 无感。
6. **提交后必构建**（用户铁律）：任何源码/构建文件 commit 后必须自动构建安装；用户明确反对「改了只提交不构建」。
7. **清理中间文件**：electron-vite 生成的临时 `electron.vite.config.*.mjs`、构建产物开发完清理（`.gitignore` 已覆盖，但磁盘残留需手动 `rm`）。
8. **自定义协议不用中文文件名**：内置资源预览用 data URL / 缩略图，不要用自定义协议承载中文文件名。
9. **覆盖安装用 ditto**：避免 `rm -rf` 触发 bulk delete 弹窗。
10. **`SourceManager.tsx` 是废弃组件**：当前生效的 RSS 管理是 `RssManager.tsx`（被 SettingsView 的 rss tab 引用）。改来源管理 UI 一律改 RssManager。

---

## 11. 完整开发历程时间线

> 下列对话来自 WorkBuddy 本地会话（2026-08-03 ～ 2026-08-14），11 个会话 / 202 条用户消息 / 1945 条模型输出，按时间排序；git 版本日志为开发事实的权威记录。

### 总览

| # | 时间范围 | 会话 ID | 主题 |
|---|----------|---------|------|
| 1 | 08-03 17:44 ～ 08-04 19:52 | `04675f1b` | 初始设计 + MVP 构建（v0.1～v0.3） |
| 2 | 08-04 21:45 ～ 08-05 22:24 | `f3865fbb` | UI/动效优化 + OPML 导入 + 四栏布局 |
| 3 | 08-05 14:34 ～ 14:38 | `7c892a18` | UIUE 不足分析 |
| 4 | 08-05 22:32 ～ 08-06 16:43 | `5d9f5ef8` | 收口与 review + 删 react-tweet |
| 5 | 08-06 16:44 ～ 08-08 11:04 | `f9e64edb` | RSS 打通 + DMG + 字体系统 + Border Beam |
| 6 | 08-06 21:13 ～ 21:20 | `2ebaa5d6` | 沉淀 electron skill |
| 7 | 08-07 20:57 ～ 08-08 14:43 | `c3ee6f60` | DMG 背景图创意 + 字体改造 |
| 8 | 08-08 21:29 ～ 08-10 21:59 | `4b720433` | 对标 Fluent Reader/NetNewsWire + 正文渲染重构 + 白板连线 + 配色系统 + Zen 模式 |
| 9 | 08-11 07:57 ～ 11:38 | `0d92ed98` | 对话梳理 + 复刻手册产出 |
| 10 | 08-12 09:43 ～ 09:44 | `4b720433`（续） | 会话 8 延续 |
| 11 | 08-14 16:05 ～ 22:45 | `1245b13f` | 信源发现功能迁移 + 应用图标切换 + 吃豆人分页器 + RSS 布局调整 |

---

### 阶段一：产品设计与原型构建（08-03 ～ 08-05）

#### 会话 1 · 08-03 17:44 — 初始设计与 MVP

**用户诉求**：每天大量内容（推特收藏 / GitHub Star / 周报 / 热榜）看过就忘、无法沉淀，要做桌面客户端做浏览→收藏→组织→输出的 Pipeline。要求从技术架构 / UIUX / 数据 / 白板 / 写作出可落地计划（精确到小时）。参考 `awesomeskill.ai` 的 electron skill 与 WorkBuddy UI 规范、vercel design.md。授权「开发到基本可商用，中途自行决定」。

**关键决策与产出**：
- 产品命名 **水豚 Capybara**，Pipeline 设计（收集→速读→分类→白板→沉淀）。
- 技术架构：Electron + React，本地优先，Main 进程跑采集调度器，SQLite + FTS5。
- 白板选 tldraw（后改为自研），写作选 TipTap。
- 落地计划总计 180h，6 个阶段。
- X 数据获取：不依赖官方 API（$200/月），走浏览器扩展 + 本地通信。
- **v0.1 MVP 落地**：三进程分离、contextBridge IPC 白名单、WorkBuddy 设计令牌、三栏布局、J/K 快捷键、node:sqlite 零原生编译、localhost:47832 ingest 服务。
- **v0.2**：RSS 采集调度器、tophub 热榜、GitHub Star、正文提取、自研白板、TipTap 写作器、SourceManager。
- **踩坑**：`ipcMain.handle` 回调首参是 IPC event 对象，会偷占业务参数位。
- **v0.3**：FTS5 全文搜索、花瓣式图片板、WebDAV 同步、X 收藏浏览器扩展、DMG 带背景图。

**关键 bug 发现与修复**：
- 用户反馈"基本不可用"——收藏/白板/稍后读点了没反应、都是模拟数据、白板无反应。
- 根因 1：白板平移 bug（`.board-layer` 铺满画布导致 `e.target` 判断失败）。
- 根因 2：自动抓取的数据不刷新到界面（调度器不通知前端）。
- 根因 3：默认只有 tophub + 6 条写死假数据。
- 根因 4：操作静默无反应（无 ErrorBoundary + Toast）。
- 修复：7 个真实 RSS 源替换假数据、ErrorBoundary + Toast、白板重写、调度器通知前端。

#### 会话 2 · 08-04 21:45 — UI/动效优化 + OPML 导入

**用户诉求**：标签点击筛选有问题、白板列表启动后为空、卡片间添加链接关系、白板删除/新建按钮去掉、支持 OPML 导入、三栏支持左右拖拽改变大小、阅读模式/无图模式。

**产出**：
- 标签点击筛选修复（`listItems` 增加 `tagId` 参数）。
- 白板列表启动时自动 `loadBoards()`。
- 卡片间连线（`board_links` 表 + IPC + SVG 边）。
- 白板工具栏整理（删除/新建按钮去掉，添加卡片改为画布正中央平铺面板）。
- OPML 导入（正则解析嵌套 `<outline xmlUrl>`）。
- 三栏可拖拽 + 折叠（侧栏 ≤96px 自动折叠成图标栏）。
- 阅读模式 / 无图模式。

**后续优化**：
- 参考参考 `mytab`/`shiye-tabs` 做 UI 交互 / 动画 / 音效优化；后续去掉着色器、配色与强调色融合。
- 收集箱按订阅源彩色标签。
- 来源管理三栏→四栏。

#### 会话 3 · 08-05 14:34 — UIUE 不足分析

系统分析软件 UI/UX 短板。

#### 会话 4 · 08-05 22:32 — 收口与 review

- 删除不可用的 `react-tweet`。
- 更新内容汇总进 README。
- 按「处女座像素洁癖」标准 review UI 对齐 / 布局（用户偏好：UI 是第一生产力）。

---

### 阶段二：核心数据链路与基础设施（08-06 ～ 08-07）

#### 会话 5 · 08-06 16:44 — RSS 打通 + DMG + 字体系统 + Border Beam

**用户诉求**：开发 / 构建 / 测试 RSS 订阅加载（不保留历史数据，用户自填）；换 macOS 一套 PNG logo。

**关键产出**：
- RSS 流程加固（全刷/新增即抓/幂等/WAL checkpoint）。
- 空库预置精选 RSS。
- 启动链路加固（窗口先行 + 次级服务 try/catch 防 EADDRINUSE 崩空白）。
- 设置显示数据库绝对路径。
- **锁死 DB 权威路径 + 旧库自动迁移**（单层结构）。
- JSON Feed + 媒体缩略图。
- RSS 摘要 HTML 实体乱码修复。
- 阅读区 HTML 渲染。
- 刷新诊断模块。
- **字体系统改造**（从 22 个等宽 → 500+ 全系统字体，全局生效）。
- **Border Beam 光效**（纯 CSS conic-gradient + mask 彩色脉动边框）。
- DMG 构建 + 换 PNG logo。

**对应 git v0.7.22 – v0.7.51**：像素级打磨、信息流分页、RSS 流程加固、预置精选 RSS、启动链路加固、锁死 DB 路径、单层结构、JSON Feed、RSS 乱码修复、阅读区 HTML 渲染、刷新诊断、字体系统改造、Border Beam。

#### 会话 6 · 08-06 21:13 — 沉淀 electron skill

从项目代码梳理可复用的 Electron 开发 skill（前端 / 数据处理 / 交互 / UI）。

#### 会话 7 · 08-07 20:57 — DMG 背景图创意 + 字体改造

- 设计 DMG 安装背景图。
- 确定图标缩小至 80、Capybara 左移下移、Applications 右移的布局。
- 字体系统全面改造（`scanSystemFonts()` 扫描三目录）。
- DMG 背景图替换为用户自定义水墨风。

---

### 阶段三：正文渲染重构与体验大升级（08-08 ～ 08-10）

#### 会话 8 · 08-08 21:29 ～ 08-10 21:59 — 对标一流阅读器

**用户诉求**：参考 `fluent-reader` / `NetNewsWire` 提升 RSS 解析与正文渲染性能效果；打 **beta-01** tag；取精华去糟粕移植好功能。

**分析报告产出**（`docs/outputs/capybara-rss-rendering-analysis.md`）：
- 五个维度对比：RSS 解析、内容提取、正文渲染、数据库、缓存。
- P0 最该做的三件事：HTML 清洗移到 Web Worker、`dangerouslySetInnerHTML` → `iframe sandbox`、全局提取并发控制。

**beta-01 基线落地（v0.7.55）**：
- Web Worker HTML 清洗（3s 超时回退同步）。
- iframe sandbox 替代 dangerouslySetInnerHTML（postMessage 转发点击）。
- 全局提取并发控制（3 路并发 + 10min TTL + 200 条缓存）。
- 同 URL 请求合并（pending Map 去重）。
- CSS 广告/社交按钮过滤（移植 NetNewsWire core.css）。
- WAL 自动 checkpoint（30 分钟检测，>10MB 触发）。

**后续还原与迭代（v0.7.56 ～ v0.7.90）**：
- 正文渲染还原：iframe sandbox → `dangerouslySetInnerHTML`（因 iframe 方案有渲染问题）。
- 自定义数据库文件路径（导入导出/备份恢复，重启生效）。
- 来源管理拆分 RSS/GitHub★/X书签 三 Tab（RSS 分页100 + 导入验证）。
- 阅读配色独立管理（Top30 VSCode 主题 + 快速切换 + 跟随界面 + 自定义编辑）。
- JSON 配置导出导入。
- 白板连线交互重构（hover 四边中点拖拽手柄、贝塞尔曲线、关系标签）。
- 白板卡片 6 类型快捷按钮。
- 白板 React #185 无限渲染修复。
- 连线精度修复（DOM 实测卡片高度）。
- 8 项修复（RSS 删除级联 / 书签白板分隔 / 白板字号 / 配色编辑 / 试听音效 / DB 路径选择器 / 分页删除+重复订阅 / 已订阅 URL 展示）。
- Zen 专注模式（隐藏侧栏/源栏/列表 + Esc 退出）。
- 应用图标切换（`build/logos/` + `nativeImage` + data URL）。
- `logo://` 协议承载中文文件名失败 → 改用 data URL。
- 覆盖安装改用 `ditto`（避免 bulk delete 弹窗）。
- 反复踩坑清单沉淀（`memory/TROUBLESHOOTING.md`）。

---

### 阶段四：对话梳理与文档产出（08-11）

#### 会话 9 · 08-11 07:57 — 对话梳理 + 复刻手册

**用户诉求**：帮我把 workbuddy 对话中关于 capybara 的开发内容梳理出来，从最开始到最新。输出完整的文档让别人可以根据这个文档进行软件的复刻。

**产出**：
- 从 `~/.workbuddy/projects/*/*.jsonl` 扫描出 14 个相关会话，排除 3 个误匹配。
- 导出 git 全量日志（v0.7.22→v0.7.90，78 条提交）。
- 产出第一版《Capybara 复刻手册》。
- 产出完整对话时间线文档（88KB / 1066 行）。

---

### 阶段五：信源发现与 UI 创新（08-14）

#### 会话 11 · 08-14 16:05 ～ 22:45 — 信源发现功能迁移

**用户诉求**：把 feeds 工作空间成果（3 张表 / 2242 条候选源 / 65 角色 / 11825 对映射）迁移到 capybara 项目中。在 RSS 订阅管理中添加信源发现区域，可按分类/角色筛选，点击添加到 RSS 订阅源。

**三个决策点**（均按推荐方案执行）：
1. 数据库归属：3 张表建在 capybara.db 同库。
2. 角色映射数据：自动生成初始映射（基于 tags + description + tier 推导）。
3. 数据导入时机：JSON 资源文件打包进应用，首次启动批量插入，`discover_seeded=1` 防重复。

**数据生成**：`scripts/gen_discover_data.py` 从 feeds 工作空间 `rss_sources_insert.sql` + `schema.sql` 重新生成 `src/main/discover/data.ts`（590KB）。

**核心功能落地**：
- 数据库：`migrateDiscover()` 建表 + `seedDiscover()` 导入 + `discoverFeeds()` 查询（`json_each()` 解 tags JSON 做 OR 筛选 + `LEFT JOIN feeds` 标记已订阅）。
- IPC：`discover:roles` / `discover:tags` / `discover:feeds` / `discover:add`。
- UI：`DiscoverPanel.tsx`，插在 RssManager「手动添加/导入 OPML」与「已订阅」之间。

**后续 UI 打磨（多轮迭代）**：
- 设置页宽度 720px → 1440px（扩大一倍）。
- 分页每页 8 条。
- 星星改五色圆点（T0 红 / T1 橙 / T2 蓝 / T3 绿 / T4 灰）。
- 删权威等级/来源类型筛选。
- 分页器 4 次重做 → 最终方案：吃豆人 thumb + 点状态机（前进吃掉隐藏、后退拉出粑粑）。
- 吃豆人体积随页数变化（14→22px），朝向跟随拖动方向。
- RSS 订阅管理布局调整（内容类型移到添加方式之前）。
- 应用图标 Dock 切换功能（`build/logos/` + data URL 预览）。
- `logo://` 协议中文文件名失败修复 → data URL。
- `毛茸茸.png` 图标入库 + `ditto` 覆盖安装。

**版本**：v0.7.129 ～ v0.7.192。

---

## 12. 版本更新日志（git 权威记录）

> 顺序：最新在下。v0.7.22 是 git 最早提交。

| 版本 | 时间 | 要点 |
|---|---|---|
| v0.7.22～32 | 08-06 00:19～12:48 | 收尾脚本 post-dev.sh / 覆盖安装 / 加源 UX / 启动链路加固 / 预置精选 RSS / RSS 流程逻辑 / 信息流分页 / 来源管理对齐 / 像素级打磨 |
| v0.7.33～42 | 08-06 12:48～23:51 | 刷新诊断模块 / RSS 乱码修复 + HTML 渲染 / 数据库查看器 / JSON Feed + 媒体缩略图 / RSS 摘要解码 / 单层结构 / **锁死 DB 权威路径 + 旧库自动迁移** |
| v0.7.43～54 | 08-07 00:24～08-08 14:43 | DMG 图标布局迭代 / Border Beam 光效（卡片+搜索框）/ 开关垂直对齐修复 / 字体系统全局改造 |
| v0.7.55 | 08-08 21:51 | **beta-01 基线**：RSS 解析与正文渲染全面提升（Worker 异步清洗 + iframe sandbox + 提取队列并发 + CSS 广告过滤 + WAL checkpoint） |
| v0.7.56～57 | 08-09 09:58 | 自定义数据库文件路径（重启生效 + 导入导出/备份恢复）/ 还原正文渲染：iframe → dangerouslySetInnerHTML |
| v0.7.58～63 | 08-09 20:27～20:57 | 字体修改生效修复 / 文案统一 / 移除发现 RSS / 阅读配色快速切换 / 正文阅读配色独立（Top30 VSCode 主题） |
| v0.7.64～66 | 08-09 21:02～21:20 | 数据管理图标修正 / 来源管理拆分 RSS·GitHub★·X书签 三 Tab（RSS 分页100+导入验证） |
| v0.7.67～72 | 08-09 21:20～22:26 | 白板 React #185 无限渲染修复 / 连线精度 / 连线交互重构 / 卡片 6 类型快捷按钮 / 添加卡片面板置顶 |
| v0.7.73 | 08-09 23:57 | JSON 配置导出导入 + 自定义阅读配色复制/编辑/保存 |
| v0.7.74～76 | 08-10 15:16～15:56 | 8 项修复（RSS 删除级联/书签分隔/白板字号/配色编辑/试听/DB 路径/分页删除+重复订阅/已订阅 URL）/ feed_id 级联删除 / 白板字号 / 配色圆形化 |
| v0.7.77～80 | 08-10 16:48～20:11 | 配色 hover 操作按钮圆形化/位置/容器/阴影打磨 |
| v0.7.81～82 | 08-10 20:36 | 删冗余 preview-reader.html |
| v0.7.83～84 | 08-10 20:42 | 更新 README 至 v0.7.82 |
| v0.7.85～86 | 08-10 20:50～21:25 | 配色 hover 按钮复刻信息流卡片操作栏风格 / 配色创建副本修复 |
| v0.7.87 | 08-10 21:50 | Zen 专注模式：隐藏侧栏/源栏/列表 + Esc 退出 |
| v0.7.88 | 08-10 21:52 | 修 React #130 - Maximize 图标 map 缺失致 undefined |
| v0.7.89 | 08-10 21:53 | 删搜索框 placeholder 中(/聚焦)提示 |
| v0.7.90 | 08-10 21:58 | 文章标题改可点击链接，隐藏 url 显示 |
| v0.7.91～128 | 08-11～08-14 | 对话梳理 + 复刻手册 + 应用图标切换 + logo 协议修复 + 信源发现功能迁移 + 吃豆人分页器 + RSS 布局调整 |
| v0.7.129～192 | 08-14～08-21 | 信源发现功能完整落地（2242 源 / 65 角色 / 11825 映射）+ 设置页扩宽 + 分页器迭代 + UI 打磨 + RSS 布局调整 + 图片壁纸主题删除 + Dock 图标归一化 + 构建脚本加固 |
| v0.7.193 | 08-26 11:50 | **改名 Capybara** + GitHub Star 五项升级（Link 分页/仓库元数据/raw README 渲染/Device Flow 登录/safeStorage 加密）+ 构建流程加固 |
| v0.7.194 | 08-26 13:17 | 构建流程修复：bump.sh 去掉 set -u / post-dev.sh osascript 加 timeout 5 |
| v0.7.195 | 08-26 13:31 | 外部链接修复：setWindowOpenHandler 拦截 target=_blank，用系统浏览器打开 |
| v0.7.196 | 08-26 14:08 | GitHub Device Flow 两步改造：UI 醒目展示 8 位验证码 |
| v0.7.197 | 08-26 14:19 | GitHub 登录成功后持久化用户名到数据库 |
| v0.7.198 | 08-26 15:48 | GitHub 登录区显示授权状态标记 |
| v0.7.199 | 08-26 15:54 | GitHub Star 拉取进度提示：webContents.send 推送页进度 |
| v0.7.200～201 | 08-26 16:12 | 默认视图改为全部 + 拉取防超时（60s/500ms 间隔/3 并发/429 限流）+ onPointerDown 替代 onClick |
| v0.7.202 | 08-27 17:03 | GitHub Star 增量同步：整页已存在提前终止 |
| v0.7.203 | 08-27 20:51 | 同步交互动画：旋转动画 + toast 提示 + 手动重试 |
| v0.7.204 | 08-27 20:56 | 同步失败显示具体原因 + 状态文字 |
| v0.7.205 | 08-27 21:19 | UI 大修：同步失败单行 + 暗色主题阅读区 + 字体全局生效 + Cmd+K Raycast 搜索 |
| v0.7.206 | 08-27 22:18 | 增量同步优化 + Cmd+K 搜索 GitHub Star + 菜单字号统一 + 阅读字体跟随 |
| v0.7.207 | 08-27 22:48 | 字体不生效根因修复：system_profiler 获取真实 Family Name + body inline font-family |
| v0.7.208 | 08-27 23:05 | **字体核弹级修复**：!important 全局覆盖 + system_profiler 真实 Family + 诊断面板字体清除重扫 |
| v0.7.209 | 08-28 | 修复字体卡死 P0 + GitHub 验证码括号内容删除 |
| v0.7.210 | 09-08 | 优化音效点击响应速度：latencyHint 改 balanced + pressBtn 即时触发 + 预热优化 |
| v0.7.211 | 09-08 | 卡片操作按钮添加语义色提高辨识度 |
| v0.7.212 | 09-08 | 搭建图标/音效主题套装架构：抽象层+统一接口+一键切换+设置页 UI |
| v0.7.213 | 09-08 | 修复图标主题循环引用+导入路径 |
| v0.7.214 | 09-08 | 修复 icons-map-lucide 文件扩展名为 tsx |
| v0.7.215 | 09-08 | 白板功能优化：合并保存按钮、键盘交互增强、批量框选对齐、连接点扩展卡片、图片渲染修复、白板转列表视图 DFS 投影 |
| v0.7.216 | 09-08 | 修复白板：协议迁移 protocol.handle 修复图片不显示、撤销重做实际执行逆操作、连接点事件冲突、框选 stale 闭包、cardMap useMemo |
| v0.7.217 | 09-08 | 修复白板图片视频无法查看：恢复视频播放、修复协议 URL 解析用 URL API 正确提取 host+pathname、移除图片 onError 隐藏逻辑 |
| v0.7.218 | 09-08 | 卡片编辑器 ESC 快捷键关闭 |
| v0.7.219 | 09-08 | 修复卡片拖拽起点位置闪动 |
| v0.7.220 | 09-08 | 白板工具栏三段居中布局，图标按钮美化 |
| v0.7.221 | 09-08 | 工具栏整体居中、图标加大到 18px、按钮合并居中 |
| v0.7.222 | 09-08 | 去掉批量对齐栏的批量删除按钮 |
| v0.7.223 | 09-08 | 批量对齐栏位置上浮+图标加大 |
| v0.7.224 | 09-08 | 白板工具栏重构：三层分离不重叠 |
| v0.7.225 | 09-08 | Ctrl/Cmd+点击多选卡片 |
| v0.7.226 | 09-08 | 添加自适应画布按钮+卡片类型顶部色条区分 |
| v0.7.227 | 09-08 | 白板工具栏合并到右侧边栏，去掉顶部标题栏 |
| v0.7.228 | 09-08 | 右侧悬浮 Dock 工具栏，类似 macOS Dock |
| v0.7.229 | 09-08 | 列表视图可切回白板+Dock 始终显示+列表精致优化 |
| v0.7.230 | 09-08 | 链接卡片富预览+视频引用路径不拷贝+协议安全检查+发布时间防回退 |
| v0.7.231 | 09-08 | 修复订阅源栏取消订阅按钮点击无反应（onPointerDown preventDefault 阻止了 click 事件） |
| v0.7.232 | 09-08 | 修复订阅源栏删除按钮：移除 onPointerDown 的 preventDefault，改用 onClick 执行 handleUnsubscribe |
| v0.7.233 | 09-08 | 修复第二栏删除按钮：onMouseLeave+popIn 动画导致确认状态被立即清除，改用 3s 超时自动清除 |
| v0.7.234 | 09-08 | 第二栏删除交互重构：点击删除图标后显示取消/确定两个按钮，点确定才删除 |

> v0.7.12～v0.7.21 在更早对话中完成（README 汇总）：移除 react-tweet、UI/动效优化、初始可商用构建。
> v0.7.193～v0.7.234 在 CatPaw IDE 会话中完成（§14 时间线）：改名 Capybara + GitHub Star 全链路升级 + 构建流程修复 + 字体系统核弹级修复 + 主题套装架构 + 白板大重构 + 第二栏删除交互重构。

---

## 13. 复刻优先级建议

**MVP（最小可跑通）**：
- §2 技术栈 + §3 架构 + §4 数据模型（核心 6 表）+ §5 IPC（基础通道）+ 基础四栏 UI（侧栏/信息流/阅读面板）+ RSS 添加/抓取/列表/阅读 + FTS5 搜索 + 构建打包（§8）。

**进阶（对齐当前体验）**：
- 白板（§6.6）、阅读配色与整面配色（§6.7）、GitHub★/X书签/OPML/信源发现（§6.4 + §6.5）、来源管理拆分、Zen 模式、配置导入导出、数据库查看器 + 刷新诊断 + 网络日志（§6.9）、应用图标切换（§6.10）。

**打磨（处女座标准）**：
- Border Beam 光效、像素级对齐、动效令牌、快捷键系统、DMG 自定义背景图、吃豆人分页器、字体系统全局改造。

---

> 全部字段语义、IPC 通道、构建脚本均已在上文逐条给出，按图施工即可复刻出功能等价、视觉对标的「水豚 Capybara」。

---

## 14. CatPaw 对话时间线（2026-08-26 ～ 2026-08-28）

> 下列内容来自 CatPaw IDE 会话记录（存储路径 `~/.catpaw/projects/ide-Users-zhangyu-Workspace-labs-app-readflow/`），4 个会话 / 64 条用户消息 / 1429 次工具调用，按时间排序。git 版本日志为开发事实的权威记录。

### 总览

| # | 时间范围 | 会话 ID | 主题 | 对应 git 版本 |
|---|----------|---------|------|--------------|
| 12 | 08-26 11:50 ～ 12:25 | `697248cb` | 改名 Capybara + 复刻手册产出 + GitHub Star 数据问题分析 | v0.7.193 |
| 13 | 08-26 13:13 ～ 16:35 | `ab0ad0d3` | 构建流程修复 + GitHub Device Flow 登录 + 进度提示 + onPointerDown + 自动同步 | v0.7.194～v0.7.201 |
| 14 | 08-27 12:07 ～ 23:06 | `726b0a3f` | GitHub 增量同步 + 同步交互动画 + UI修复（Cmd+K搜索/字体/主题）+ 字体核弹级修复 | v0.7.202～v0.7.208 |
| 15 | 08-27 23:33 ～ 08-28 08:44 | `0f3d82f0` | 字体预览修复 + 用户字体过滤 + 对话历史梳理入复刻手册 | （未提交） |
| 16 | 09-08 | — | 音效优化 + 主题套装 + 白板大重构 + 链接卡片富预览 + 第二栏删除交互修复 | v0.7.209～v0.7.234 |

---

### 阶段六：改名 Capybara 与文档体系建立（08-26）

#### 会话 12 · 08-26 11:50 — 改名 Capybara + 复刻手册 + GitHub Star 数据

**用户诉求**：将「阅流 ReadFlow」改名为「Capybara」（水豚），寓意佛系、精神减压、关注自己关注的。同时结合之前的 WorkBuddy 对话，按时间线整理输出完整复刻手册。后续发现 GitHub Star 数据存在三个 bug：1000 条上限、排序不对、正文只显示摘要不渲染 README。

**关键决策与产出**：
- **改名 ReadFlow → Capybara**：全项目文件中 `阅流`、`readflow` 等字样逐一替换为 `capybara`（`gen-themes.py`、`db.ts` 等）。
- **复刻手册校对**：检查 markdown 中描述的名称、代码相关内容与程序文件是否一致，以程序代码为基础更新。
- **开发过程文件清理**：删除不再需要的中间产物文件。
- **GitHub Star 三大 bug 分析**：
  1. **数据获取限制 1000 条**：GitHub API 分页只拉到 1000 条就停。
  2. **排序问题**：拉取的 star 数据与 GitHub 上实际 star 时间顺序不一致。
  3. **正文渲染**：点击 GitHub★ 卡片后正文只显示简单描述，未渲染 README Markdown 文件，需实现像 RSS 订阅一样的 TOC 导航 + 正文渲染。
- **目录分析**：分析 `build`、`out`、`release`、`scripts` 四个文件夹用途，清理无用文件。
- **github-star-manager 参考项目**：分析外部 `github-star-manager` 文件夹代码，借鉴其功能实现 Capybara 的 GitHub Star 功能。
- **构建流程断裂发现**：`bump.sh` + post-commit 钩子链路没有自动执行（git commit → 构建 app → 拷贝到 /Applications → 打开 app）。

**对应 git v0.7.193**：GitHub Star 五项升级（Link 分页/仓库元数据/raw README 渲染/Device Flow 登录/safeStorage 加密；构建流程加固）。

---

### 阶段七：构建流程修复与 GitHub 登录打通（08-26）

#### 会话 13 · 08-26 13:13 — 构建流程 + Device Flow 登录 + 进度提示 + onPointerDown + 自动同步

**用户诉求**（按时间顺序，9 条消息）：

1. **构建流程未自动执行**（U1）：`bump.sh` → git commit → post-commit 钩子 → `post-dev.sh` → 构建安装打开的链路断裂。
2. **GitHub 一键登录无反应**（U2）：启动 app 后一键登录 GitHub 没有反应，要求使用系统默认浏览器打开，不要用 Electron 内部打开。
3. **8 位验证码缺失**（U3）：Device Flow 登录需要输入 8 位验证码，但用户不知道从哪获取，怀疑代码逻辑缺失。
4. **登录后状态不更新**（U4）：输入验证码后浏览器登录成功，但 Capybara 软件中状态没更新。
5. **拉取进度提示**（U5）：拉取 GitHub Star 数据时需要进度提示（已拉取多少条 tip 显示），不能一直等待。
6. **默认视图应为「全部」**（U6）：程序打开默认选中 RSS，应该选中「全部」。
7. **GitHub Star 超时**（U7）：确认默认选中「全部」不要 RSS；GitHub 登录授权后抓取 star 经常超时断掉，需排查原因。
8. **onPointerDown 替代 onClick**（U8）：使用鼠标按下事件替代点击事件提升桌面端响应速度。
9. **启动自动同步**（U9）：GitHub Star 启动后如果有授权，自动获取最新数据。

**关键产出与修复**：

- **构建流程修复**（v0.7.194）：`bump.sh` 去掉 `set -u` 防止 `PIDFILE` 不存在时提前退出；`post-dev.sh` 的 `osascript` 加 `timeout 5` 防止 app 启动慢时挂住。
- **外部链接修复**（v0.7.195）：`setWindowOpenHandler` 拦截所有 `target=_blank` / `window.open` 调用，用系统默认浏览器打开，不在 Electron 内开新窗口。
- **Device Flow 两步改造**（v0.7.196）：申请验证码后先在 UI 醒目展示 8 位码再轮询 token，不再仅靠剪贴板。
- **GitHub 用户名持久化**（v0.7.197）：登录成功后持久化用户名到数据库（`github_stars_user`），修复重开设置页状态丢失。
- **授权状态标记**（v0.7.198）：GitHub 登录区显示授权状态标记，修复切换 tab 回来后状态不可见。
- **拉取进度提示**（v0.7.199）：主进程每拉完一页通过 `webContents.send` 推送进度，前端实时显示已获取数量和页码。
- **默认视图 + 防超时**（v0.7.201）：默认视图改为「全部」；GitHub Star 拉取超时 30s→60s、页间暂停 500ms、`storeCover` 并发限制 3 个、增加 429 限流处理。
- **onPointerDown 优化**（v0.7.200→a63590b）：全局用 `onPointerDown` 替代 `onClick`，桌面端即时响应（按下即触发，不等鼠标抬起）。
- **启动自动同步**（4179fe2）：启动时自动拉取 GitHub Star 最新数据。

**技术要点归纳**：
- **GitHub Device Flow 登录**：`startGithubDeviceLogin` 请求验证码 → UI 展示 8 位码 → `pollGithubDeviceLogin` 轮询 token → `safeStorage` 加密存储。
- **进度推送模式**：主进程通过 `webContents.send('github:progress', {count, page})` 推送，前端 `onProgress` 回调更新 UI。
- **onPointerDown 桌面端优化**：`onPointerDown` 比 `onClick` 快约 100ms（鼠标抬起延迟），桌面端感知"即时响应"。注意需排除右键和中间键。

---

### 阶段八：增量同步 + UI 大修 + 字体核弹级修复（08-27）

#### 会话 14 · 08-27 12:07 — GitHub 增量同步 + 同步交互动画 + UI 修复 + 字体系统重做

**用户诉求**（按时间顺序，12 条消息）：

1. **增量同步**（U1）：GitHub 每天有新 star，但同步一次后没有动态更新机制。启动 app 时判断 github 账号状态或有 key 的情况下，补全新 star 数据。
2. **构建覆盖**（U2-U6）：反复追问构建后是否自动拷贝到 /Applications、为什么不直接覆盖。要求每次修改代码后版本号 +1、构建、拷贝到 /Applications。
3. **同步交互动画**（U7）：启动程序等了一会查看 GitHub 没有反应。添加交互动画展示正在同步数据。同步失败也提醒，可以手动刷新拉取。
4. **重试 tooltip**（U8）：鼠标放在"重试"按钮上应统一做 tooltip 提示，说明失败原因。
5. **UI 大修 4 项**（U9）：
   - 错误状态/同步失败时菜单显示两行，需保持单行。
   - 主题不一致：正文白色 + 软件暗色 + 阅读区黑色背景，需全局一致。
   - 字体设置不影响界面，需全局生效（菜单 + 正文）。
   - 菜单栏搜索框移除，改为 Cmd+K 弹出搜索（Raycast 风格），搜索结果关联菜单/卡片。
6. **增量同步优化**（U10）：获取 GitHub 数据时先拉第一页，判断数据库中是否已有内容，补充没有的数据后直接 break。每次启动 100 条就够。Cmd+K 搜不到 GitHub Star 数据。全部文字大小比别的菜单小。切换字体 LXGW WenKai 整个软件基本没有变化。
7. **字体切换无效**（U11）：所有字体都不受切换影响，必须解决。
8. **字体核弹级修复**（U12）：系统罗列的字体只有几个有影响（如 LXGW），很多改了没反应。查询每个字体的提取名字和 CSS 需要的名字，全部检查一遍。诊断面板添加字体缓存清除 + 重扫功能。

**关键产出与修复**：

- **GitHub Star 增量同步**（v0.7.202）：启动时拉取遇到整页已存在数据提前终止，不再全量遍历。第一页 100 条与数据库比对，无新数据即 break。
- **同步交互动画**（v0.7.203）：同步中旋转动画、成功/失败 toast 提示、失败可手动重试。
- **失败原因展示**（v0.7.204）：同步失败时显示具体原因和 toast 提示，同步中显示状态文字。
- **UI 大修**（v0.7.205）：同步失败单行布局、暗色主题阅读区背景修复、字体全局生效（`!important` 注入）、Cmd+K Raycast 风格搜索替代侧栏搜索框。
- **增量同步优化 + 搜索 + 字号 + 字体**（v0.7.206）：GitHub 增量同步优化、Cmd+K 搜索 GitHub Star 数据、菜单字号统一、阅读字体跟随设置。
- **字体不生效根因修复**（v0.7.207）：`scanSystemFonts` 改用 `system_profiler` 获取真实 Family Name（而非文件名推导）+ `body` inline `font-family` 双保险。
- **字体核弹级修复**（v0.7.208）：注入 `!important` 全局样式覆盖、`system_profiler` 获取真实 Family Name、诊断面板添加字体清除重扫功能。

**技术要点归纳**：

- **字体不生效根因分析**：
  1. `scanSystemFonts` 用文件名推导 family name，但 CSS 需要的是 `system_profiler` 报告的真实 Family Name（如文件名 `LXGWWenKai-Medium.ttf` 的真实 Family 是 `LXGW WenKai`，含空格）。
  2. CSS `font-family` 设置在 `:root` 上，但 `body` 和部分组件有 hardcoded `font-family` 覆盖了变量。
  3. **修复方案**：`applyAppearance` 注入 `#font-override` `<style>` 标签，用 `!important` 全局覆盖所有元素。
  4. `system_profiler SPFontsDataType` 解析 `Family:` 行获取真实 family name。
  5. 诊断面板（`DiagPanel.tsx`）添加「清除字体缓存 + 重扫」按钮。

- **Cmd+K Raycast 风格搜索**：
  - 移除侧栏搜索框，改为 `Cmd+K` 全局快捷键弹出搜索面板。
  - 搜索结果关联菜单项（RSS/GitHub★/X 书签/白板）和卡片类型。
  - 支持搜索 GitHub Star 数据（标题/仓库描述）。

- **GitHub Star 增量同步策略**：
  - 启动时如有授权，自动拉取第一页（100 条）。
  - 与数据库比对，如果某条 URL 已存在则认为后续数据也已有（按 star 时间倒序），提前 break。
  - 仅在长时间未同步时才需要翻页拉取全部。

---

### 阶段九：字体预览修复 + 用户字体过滤（08-28）

#### 会话 15 · 08-27 23:33 ～ 08-28 08:44 — 字体预览修复 + 用户字体过滤 + 复刻手册续写

**用户诉求**（按时间顺序，4 条核心消息）：

1. **字体预览框显示错误**（U1）：选择 LXGW WenKai 后 UI 显示不对。要求从头到尾梳理字体替换逻辑、CSS、系统字体扫描逻辑，输出完整流程报告，找出代码逻辑不符合预期的地方。
2. **修复预览 + 用户字体过滤**（U2）：修复预览问题。罗列所有用户安装的字体（排除系统自带），生成 CSS 字体字符串表格，更新软件数据库中的数据，构建 app 运行测试。
3. **对话历史位置**（U3）：询问 CatPaw 历史对话存储在哪个文件夹。
4. **续写复刻手册**（U4）：参考复刻手册之前的风格，按对话历史顺序一步步抽取信息组成时间线，解析从第一次对话到现在的所有内容，写入复刻手册。

**关键产出**：

- **预览框修复**：`SettingsView.tsx` 中字体预览框的 `fontFamily` 从 `appearance.fontFamily || 'inherit'` 改为 `uiFontStack(appearance.fontFamily)`，确保带引号和 fallback stack。
- **字体扫描逻辑更新**：`scanSystemFonts()` 从扫描全部目录（`/System/Library/Fonts`、`/Library/Fonts`、`~/Library/Fonts`）+ blacklist 过滤，改为通过 `system_profiler` 的 `Location:` 字段精确过滤，只返回 `~/Library/Fonts` 下的用户安装字体（78 个唯一 family）。
- **构建测试**：`electron-vite build` + `electron-builder` 成功产出 `Capybara-0.7.208.dmg`。发现预先存在的构建运行时问题（`electron.app.isPackaged` 报 undefined，非本次修改引入）。

**技术要点归纳**：

- **字体预览框 bug 根因**：预览框使用 `appearance.fontFamily`（原始字符串如 `LXGW WenKai`），CSS 需要引号包裹（`"LXGW WenKai"`），否则浏览器把空格后的部分当作下一个 font name。修复：使用 `uiFontStack()` 函数生成带引号和 fallback 的完整 CSS font-family 字符串。
- **用户字体 vs 系统字体**：macOS 字体分三个目录：
  - `/System/Library/Fonts` — 系统自带（Helvetica、PingFang 等），不应出现在选择列表。
  - `/Library/Fonts` — 系统补充（SF Pro、SF Compact 等），不应出现。
  - `~/Library/Fonts` — 用户安装（LXGW WenKai、MiSans、HONOR Sans 等 78 个），应出现。
- **`system_profiler` 解析格式**：
  ```
  Fonts:
      FileName.ttf:                    ← 4空格缩进 + 文件名 + 冒号
        Kind: TrueType                 ← 6空格缩进 + 属性
        Location: ~/Library/Fonts/... ← Location 字段判断是否用户字体
        Typefaces:
          TypefaceName:
            Family: Real Family Name   ← 10空格缩进 + 真实 family name
  ```

---

> v0.7.193～208 的 CatPaw 对话至此梳理完毕。全部技术决策、bug 修复、用户诉求均已按时间线归档，结合上文的 WorkBuddy 时间线（§11），可完整复刻从 v0.1 到 v0.7.208 的全部开发历程。

---

### 阶段十：主题套装 + 白板大重构 + 第二栏删除交互修复（09-08）

#### 会话 16 · 09-08 — 音效优化 → 主题套装 → 白板重构 → 删除交互修复

**用户诉求**（按时间顺序）：

1. **音效与主题套装**（U1-U4）：优化音效点击响应速度；卡片操作按钮添加语义色；搭建图标/音效主题套装架构（抽象层+统一接口+一键切换+设置页 UI）；修复图标主题循环引用和文件扩展名。
2. **白板功能大重构**（U5-U14）：白板功能优化（合并保存按钮、键盘交互增强、批量框选对齐、连接点扩展、白板转列表视图 DFS 投影）；修复协议迁移导致图片不显示、撤销重做逆操作、框选 stale 闭包等；修复图片视频无法查看；卡片编辑器 ESC 关闭；卡片拖拽闪动修复；工具栏三段居中布局+图标加大+三层分离重构；Ctrl/Cmd 多选卡片；自适应画布+卡片色条区分；工具栏合并到右侧悬浮 Dock（macOS 风格）。
3. **链接卡片富预览**（U15）：链接卡片富预览+视频引用路径不拷贝+协议安全检查+发布时间防回退。
4. **第二栏删除按钮修复**（U16-U19）：RSS 订阅列表栏点击删除按钮没反应。经多轮排查，最终根因为 `press` 事件系统中 `onPointerDown` 的 `e.preventDefault()` 阻止了 `click` 事件 + `onMouseLeave` 配合 `popIn` 动画导致确认状态被立即清除。最终重构交互：点击删除图标后原地显示「取消 | 确定」两个按钮，点确定才删除。

**关键产出与修复**：

- **音效响应优化**（v0.7.210）：`latencyHint` 改 `balanced`、`pressBtn` 即时触发、预热优化。
- **卡片语义色**（v0.7.211）：卡片操作按钮添加语义色（删除红/收藏黄/稍后蓝）。
- **主题套装架构**（v0.7.212）：抽象层 `theme-bundles.ts`（`IconTheme` / `SoundTheme` 接口 + `listThemeBundles()`）+ 设置页一键切换 UI + 统一接口。
- **白板大重构**（v0.7.215～v0.229）：
  - 合并保存按钮、键盘交互增强（Delete 删卡 / Cmd+Z 撤销 / Cmd+Shift+Z 重做）。
  - 批量框选 + 对齐工具栏（左/右/上/下/水平等距/垂直等距）。
  - 连接点扩展到卡片四边中点 + 贝塞尔曲线。
  - 白板转列表视图 DFS 投影（`boardToList` 递归遍历连线关系生成有序列表）。
  - 协议迁移修复：`protocol.handle()` + URL API 正确提取 `host+pathname`。
  - 工具栏从顶部标题栏迁移到右侧悬浮 Dock（macOS 风格，始终显示）。
  - 卡片顶部色条区分类型（文本/链接/图片/视频/代码/白板引用）。
- **链接卡片富预览**（v0.7.230）：链接卡片自动抓取 OG 元数据（标题/描述/图片）做富预览，视频引用路径不拷贝（保留远程引用），协议安全检查（只允许 https），发布时间防回退（`published_at` 不晚于 `fetched_at`）。
- **第二栏删除交互修复**（v0.7.231～v0.7.234，4 轮迭代）：
  - **v0.7.231**：首次尝试将 `handleUnsubscribe` 从 `onClick` 移到 `onPointerDown`，但仍有问题。
  - **v0.7.232**：移除 `onPointerDown` 的 `preventDefault`，改回 `onClick` 执行，但仍无效。
  - **v0.7.233**：发现根因——`onMouseLeave` 配合 `popIn` 动画（`scale(0.96)→scale(1)`）导致确认状态在 re-render 后被立即清除。去掉 `onMouseLeave`，改用 3s 超时自动清除。但仍非用户期望的交互。
  - **v0.7.234**：**最终方案**——废弃同按钮二次确认机制，改为点击删除图标后原地显示「取消 | 确定」两个独立按钮，点「确定」才执行 `deleteFeed`，点「取消」还原。与设置页 `RssManager` 的取消订阅交互风格一致。

**技术要点归纳**：

- **`press` 事件系统陷阱**：
  1. `press()` 函数返回 `{ onPointerDown, onPointerUp, onClick }`，内部用闭包变量 `active` 跟踪按下/抬起状态。
  2. `onPointerDown` 上的 `e.preventDefault()` 会阻止 `mousedown` 事件，进而阻止 `click` 事件产生——导致 `onClick` handler 永远不触发。
  3. `stopPropagation()` 在 React 合成事件中只阻止 React 层面冒泡，不影响原生事件冒泡。
  4. 子元素按钮需要同时在 `onPointerDown` 和 `onClick` 上 `stopPropagation` 才能完全阻止父级 `press` handler 触发。

- **`onMouseLeave` + 动画的陷阱**：
  1. 按钮 `popIn` 动画 `scale(0.96)→scale(1)` 会在 re-render 后导致按钮尺寸微变。
  2. 如果 `onMouseLeave` 在动画过程中触发（鼠标瞬间「离开」缩小后的按钮边界），会清除刚设置的确认状态。
  3. 用户表现为「第一次点击没反应」（确认状态被立即清除），「双击才能删除」（第二次点击恰好赶上状态未清除）。
  4. **教训**：不要在需要保持状态的按钮上同时使用 `onMouseLeave` 清除状态和 `popIn` 缩放动画。

- **主题套装架构设计**：
  - `IconTheme` 接口：`iconNames()` 返回图标名→Lucide 组件映射，`listThemeBundles()` 列出可选套装。
  - `SoundTheme` 接口：`play(name: SoundName)` 播放音效，不同套装可加载不同音效文件。
  - 设置页 `AppearanceTab` 展示套装卡片，选中后即时切换全局图标/音效风格。

- **白板转列表视图 DFS 投影**：
  - `boardToList(cards, edges)` 从入口节点出发，沿连线关系递归遍历，生成有序列表。
  - 用于白板「切到列表视图」功能，将空间布局按逻辑顺序展平为一维列表。

---

> v0.7.209～v0.7.234 的 CatPaw 对话至此梳理完毕。新增音效优化、主题套装架构、白板大重构、链接卡片富预览、第二栏删除交互修复等全部技术决策均已归档。