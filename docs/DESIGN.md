# 阅流 ReadFlow · 产品与技术设计文档

> 版本 v1.0 · 2026-08-03
> 定位：个人知识 Pipeline 桌面客户端 —— 浏览 → 收藏 → 组织 → 输出
> 开发模式：个人开发 + AI 辅助 · Electron + React · 本地优先

---

## 1. 产品定位与核心问题

**痛点**：信息入口多（X 收藏、GitHub Star、公众号、技术周刊、热榜），看完就忘，无法按领域沉淀，更无法转化为输出。

**解法**：一条强制流动的 Pipeline，每个环节都有明确的"下一步动作"，杜绝"收藏即冷藏"：

```
收集(Inbox) → 浏览速读(Triage) → 收藏分类(Library) → 白板组织(Board) → 写作输出(Write)
   全源聚合      5 秒决策          标签+搜索          卡片+连线          引用成文
```

**设计原则**
1. **Inbox Zero 心态**：收集箱不是仓库，每条目只有 4 个去向——归档 / 稍后读 / 收藏入库 / 送上白板。
2. **条目即卡片**：所有内容统一抽象为 `Item`（卡片），白板上的卡片、文档里的引用，都是同一个 Item 的不同视图，一处修改处处生效。
3. **本地优先**：SQLite + 文件仓，断网全功能可用；云同步是可选项，不是依赖。
4. **键盘可达**：全流程快捷键 + ⌘K 命令面板，处理 100 条信息流不用碰鼠标。

---

## 2. 技术架构

### 2.1 技术选型

| 层 | 选型 | 理由 |
|---|---|---|
| 壳 | Electron 33 + electron-vite | 生态成熟，Web 抓取/扩展通信方便；体积代价可接受 |
| 前端 | React 18 + TypeScript + Zustand + TanStack Query | 个人开发效率最高组合 |
| UI | Tailwind CSS + shadcn/ui + lucide 图标 | 快速搭建一致的设计系统 |
| 数据库 | better-sqlite3 + Drizzle ORM + FTS5 | 同步 API 不阻塞主进程；FTS5 全文搜索零依赖 |
| 白板 | **tldraw v3** | 无限画布、自定义 Shape（关键：把 Item 渲染为原生卡片）、本地持久化方案成熟 |
| 编辑器 | **TipTap**（ProseMirror） | 自定义"引用卡片"节点，导出 Markdown/HTML 干净 |
| 阅读模式 | @mozilla/readability + DOMPurify | 正文提取 + XSS 清洗 |
| RSS | rss-parser + cheerio | 标准源解析 + 非标页面抓取 |
| 打包 | electron-builder | macOS dmg / 后续 Windows nsis |

### 2.2 进程架构

```
┌─ Renderer (React) ─────────────────────────────┐
│  Inbox / Library / Board(tldraw) / Write(TipTap)│
│        ↕ window.api (contextBridge, 类型安全)     │
├─ Main 进程 ─────────────────────────────────────┤
│  FetchScheduler 采集调度（并发5/去重/退避重试）      │
│  SearchService (FTS5 查询)                       │
│  BoardStore (白板 JSON 持久化 + 版本快照)          │
│  SyncService (WebDAV, Phase 5)                  │
│        ↕                                         │
│  SQLite (WAL 模式) + 文件仓 ~/Library/…/readflow/  │
└─────────────────────────────────────────────────┘
```

- 渲染进程**不直接碰** Node API，全部经 contextBridge 暴露的类型化 API。
- 采集、正文提取、快照等重活全在 Main 进程的 worker 队列里跑，UI 永不卡顿。
- 数据库开 WAL 模式，读写并发安全；所有写操作走事务。

### 2.3 采集层设计（按你的内容来源）

| 来源 | 方案 | 备注 |
|---|---|---|
| 技术周刊 / 博客 | 标准 RSS，rss-parser | 内置 20+ 知名周刊 OPML 一键导入 |
| tophub.today | 定时抓取其各榜单页面，cheerio 解析 | 去重键 = 平台+条目ID；热度值入库用于排序 |
| 公众号 | 接入 wechat2rss / feeddd 等第三方 RSS 桥（用户自配 token） | 微信封闭生态，无官方 API；预留自定义 RSSHub 实例地址 |
| X 收藏 | **配套浏览器扩展**（Manifest V3）：一键把当前推/书签同步到本地客户端（原生消息通信或 localhost 端口） | X 官方 Bookmarks API 需付费订阅，扩展方案零成本且稳定 |
| GitHub Star | GitHub REST API（个人 token），每天增量同步 starred repos | 自动打 `#github` 标签，提取 README 摘要 |
| 手动收集 | 全局快捷键 ⌘⇧S 弹快速收集窗：粘 URL → readability 提正文 → 入收集箱 | 兜底一切来源 |

**调度策略**：每源独立频率（热榜 30min / RSS 2h / GitHub 24h），指数退避重试，抓取失败 3 次标记源异常并在 UI 提示，绝不静默丢数据。

### 2.4 X（推特）数据获取详细设计 —— 零 API 费用

**为什么不走官方 API**：读取 Bookmarks 需 Basic 订阅（$200/月），且额度和条款变动频繁，个人工具不值得绑定。

**方案 A（主）：配套浏览器扩展「ReadFlow Clip」**（Manifest V3，Chrome/Arc/Edge 通用）

三种收集方式：
1. **单推保存**：时间线每条推注入"存入阅流"按钮（紧邻原生收藏图标），点击后 content script 从 DOM 提取作者、正文、时间、媒体、引用推，经 background worker 发送到本地客户端。
2. **收藏夹批量同步**：打开 `x.com/i/bookmarks`，扩展面板点"同步收藏"，自动滚动分页、增量抓取（记录最后同步的 tweet ID），一次可同步数百条历史收藏。
3. **线程自动展开**：长线程先触发"显示更多"再抓取，保持完整对话链。

扩展 → 桌面端传输（双通道自动降级）：
- 首选 **localhost HTTP**：Electron Main 进程监听 `127.0.0.1:47832`，首次配对生成随机 token 写入扩展 storage，之后 `POST /ingest` 携带 token。
- 备选 **Native Messaging**：注册 `com.readflow.clip` native host，走 `chrome.runtime.sendNativeMessage`，不依赖端口。

数据落地：tweet ID 作去重键；图片/视频封面下载到本地文件仓（防图床失效）；`raw_json` 保留原始抓取结果，防解析遗漏。

**方案 B（辅）：关注博主时间线 —— RSS 桥**
- RSSHub 的 `twitter/user` 路由（自建实例 + 自己的 cookie）或公共 nitter 实例。
- 适合"常看技术博主的更新流"，拿不到收藏夹，与方案 A 互补。

**方案 C（兜底）：手动通道**
- 复制推文链接 → ⌘⇧S 快速收集窗，readability + oEmbed 兜底解析。
- X 官方数据导出包（Settings → Your X data）可做历史收藏的一次性迁移。

**维护风险与对策**：X 前端改版会使 DOM selector 失效 → 解析逻辑收敛在扩展的 adapter 层，selector 集中为一份 JSON 配置并支持远程热更新，失效时扩展提示并自动降级到方案 C，不必重新发版。工时已含在 Phase 1 的 6h 内。

---

## 3. 数据管理

### 3.1 核心 Schema（SQLite）

```sql
items        -- 统一内容卡片：id, source_type(rss/x/wechat/tophub/github/manual),
             --   url(唯一去重), title, author, summary, content_html, content_text,
             --   cover_path, status(inbox/later/archived/favorite), is_read,
             --   published_at, fetched_at, raw_json
feeds        -- 订阅源：id, type, name, url, config_json, schedule_min, last_fetched_at, error_count
tags         -- id, name, color, parent_id(支持层级)
item_tags    -- item_id, tag_id（多对多）
highlights   -- 划线笔记：id, item_id, quote, note, color, created_at
boards       -- 白板：id, name, snapshot_json(tldraw doc), version, updated_at
board_items  -- board_id, item_id, shape_id（白板卡片 ↔ 条目 双向引用）
documents    -- 文章：id, title, tiptap_json, markdown_cache, status(draft/published), updated_at
doc_refs     -- doc_id, item_id, position（文档引用了哪些条目，用于反向追溯）
settings     -- kv 配置
```

- `items_fts`：FTS5 虚表（title + summary + content_text + tags），中文用 jieba 分词器插件或 trigram 模式。
- **删除策略**：条目删除只删引用，内容软删 30 天后清理；白板快照保留最近 20 个版本。
- **文件仓**：`{userData}/readflow/` 下 `images/ snapshots/ exports/ backups/`，图片下载本地化，防止原文图床失效。

### 3.2 同步与备份（Phase 5，可选）

- WebDAV（坚果云等）单向增量备份：SQLite 快照 + 文件仓打包，每日一次。
- 导出：一键导出全部数据为标准格式（Markdown + OPML + JSON），随时可迁移，**不被工具绑架**。

---

## 4. UI/UX 交互设计

### 4.1 布局

三栏主布局（见交互稿）+ 两个全屏模式（白板、写作）：

- **左栏**：收集（收集箱/稍后读/已收藏/图片板）· 白板列表 · 文档列表 · 标签树。可折叠。
- **中栏**：信息流卡片列表，按来源/标签/状态过滤；卡片 = 来源徽标 + 标题 + 2 行摘要 + 四个动作。
- **右栏**：阅读面板（阅读模式渲染）+ 划线笔记 + 相关条目推荐（同标签）+ 动作按钮（送白板 / 引用到文档）。

### 4.2 核心交互流

**每日 Triage 流（解决"看过就忘"的第一步）**
```
J/K 上下移动 → E 归档 / L 稍后读 / F 收藏 / B 送白板 / T 打标签
目标：每天 10 分钟清空收集箱，每条内容都有去向
```

**收藏即分类**：按 F 收藏时弹出轻量标签建议（基于来源自动预填，如 RSS 源自带分类），回车确认，不打断心流。

**花瓣式图片板**：独立的瀑布流视图（masonry），条目封面图 + 手动收图，支持拖拽分组到"画板"，致敬花瓣的看图体验。

### 4.3 体验细节

- 全局 ⌘K 命令面板：搜条目/跳页面/执行动作，全键盘操作。
- 深色/浅色主题跟随系统，阅读模式衬线字体 + 可调字号。
- 每个空状态都给"下一步引导"（如收集箱为空 → "去添加第一个 RSS 源"）。
- 菜单栏托盘：显示今日未读数，快速收集入口。

### 4.4 设计语言：双重参考体系

本产品的视觉语言由两份规范组合驱动，各有明确分工：

**WorkBuddy 设计令牌 → 产品界面（chrome）**
- 三栏骨架、卡片、徽标、侧栏、弹窗等"工具界面"部分。
- CSS 变量体系（三级背景/文本/边框）、0.5px 扁平边框、8/12 圆角、400/500 双字重、深浅双主题。已在 `tokens.css` 落地。

**Vercel 编辑设计规范（vercel.com/design.md）→ 阅读与写作体验**

适用部分（吸收）：
- **双速阅读**：速读路径（标题/摘要/关键值，对应 Triage 场景）+ 审读路径（原文/出处/数据），正是阅读面板「速读 ⇄ 原文」切换的理论依据。
- **字体排印纪律**：阅读模式正文 60–68 字符行宽、明确的字号角色（display/title/heading/body/caption，禁止任意字号）、数字右对齐 + 等宽数字、段落间距分隔不缩进。
- **单色优先**：界面默认黑白灰，颜色只在承载含义时出现（来源徽标、状态、标签色）——与现有 badge 体系兼容，约束的是"不许为好看而加色"。
- **先间距后边框**：能用留白和排版表达的分组就不加卡片/边框，卡片嵌套是反模式，信息流卡片保持单层。
- **默认静止**：动效只用于状态变化和操作确认，不做滚动驱动动画；尊重 reduced-motion。

不适用部分（拒绝）：
- Vercel 署名 shell（wordmark/footer）、报告专属组件（vbg 表格/图表/计算器）——那是文档规范不是工具规范。
- "不许出现主题切换器"——阅读工具保留手动切换（跟随系统为默认）。
- 文案口吻类约束（如禁破折号）属 Vercel 品牌要求，不约束本产品。

**一句话原则**：产品骨架学 WorkBuddy（原生工具感），阅读写作学 Vercel（编辑级排版），装饰谁都不学。

---

## 5. 无限白板设计

**选型 tldraw v3 的决定性理由**：自定义 Shape API 可以把 `Item` 渲染成一等公民卡片（标题+摘要+来源+缩略图），而不是贴图片。

**核心操作设计**

| 操作 | 交互 |
|---|---|
| 卡片上板 | 信息流/阅读页拖入白板；或按 B 选择目标白板，自动落在视野中心 |
| 卡片内容 | 单击展开摘要，双击跳回原文；右上角常驻"引用到文档" |
| 连线 | 拖拽卡片边缘吸附点连线，线上可写关系标签（"支持"/"反驳"/"延伸"） |
| 分组 | 套索多选 → ⌘G 生成画框(Frame)，画框即一个"主题/领域" |
| 便签与手绘 | tldraw 原生：便签、箭头、手绘、文本，用于补充思考 |
| 导航 | 小地图 + ⌘滚轮缩放 + 空格拖画布；卡片过多时按视口虚拟化渲染 |

**沉淀逻辑**：白板不是画图板，是"领域知识装配线"。每个画框对应一个领域（如"AI Agent"），框内卡片 + 连线 + 便签 = 该领域的结构化认知，写作时整框引用。

---

## 6. 文章编写与输出

**编辑器**：TipTap，三种自定义节点：

1. **引用卡片节点**：输入 `/` 或从白板拖入 → 插入 Item 引用块（显示标题+来源，可展开原文摘录）。导出时自动转为引用格式 + 文末参考文献列表。
2. **划线引用节点**：把阅读时的 highlight 直接插进文章。
3. **白板画框节点**：嵌入某个画框的只读快照图。

**写作视图**：左侧素材栏（白板画框 / 收藏条目 / 划线笔记，可拖入正文）+ 中间编辑器 + 右侧大纲。

**输出**（解决"沉淀"的最后一公里）：
- 模板：周报模板（自动聚合本周收藏的条目清单）、主题综述模板。
- 导出：Markdown / HTML / PDF / 公众号兼容 HTML（内联样式）。
- 每篇文章保存 `doc_refs`，随时可反向查"这篇文章用了哪些素材"，也可从条目查"被哪些文章引用过"——形成知识闭环。

---

## 7. 落地计划（精确到小时）

> 估算基准：个人开发 + AI 辅助（AI 完成约 40% 样板代码），总计 **180h**（含 10% 缓冲）。
> 节奏换算：业余 15h/周 ≈ **12 周**；全职 40h/周 ≈ **4.5 周**。

### Phase 0 · 脚手架（12h）

| 任务 | 工时 |
|---|---|
| electron-vite + React + TS + Tailwind + shadcn 工程初始化 | 3h |
| better-sqlite3 + Drizzle 迁移体系、WAL、测试数据脚本 | 3h |
| 窗口管理、托盘、深浅主题、路由骨架 | 3h |
| electron-builder 打包出可运行 dmg、ESLint/Prettier | 3h |

### Phase 1 · 数据层 + 采集（34h）—— 里程碑 M1：内容进得来

| 任务 | 工时 |
|---|---|
| 核心 schema + FTS5 + 初始迁移 | 4h |
| RSS 订阅管理 UI（增删改、OPML 导入） | 5h |
| 采集调度器（并发/去重/退避/源健康状态） | 6h |
| readability 正文提取 + DOMPurify + 图片本地化 | 4h |
| tophub 热榜采集器（cheerio + 热度入库） | 4h |
| 公众号 RSS 桥接入（wechat2rss/RSSHub 配置化） | 3h |
| GitHub Star 同步（token 配置 + 增量） | 2h |
| X 收藏浏览器扩展（MV3 + 本地通信 + 快速收集窗） | 6h |

### Phase 2 · 浏览 / 收藏 / 分类（30h）—— 里程碑 M2：每日 Triage 可用

| 任务 | 工时 |
|---|---|
| 三栏布局 + 信息流卡片列表（过滤/排序/虚拟滚动） | 6h |
| 阅读面板（阅读模式渲染 + 字号/字体设置） | 4h |
| 四动作流转（归档/稍后读/收藏/送白板）+ J/K/E/L/F 快捷键 | 4h |
| 标签系统（层级、自动建议、批量打标） | 4h |
| FTS5 搜索 + ⌘K 命令面板 | 5h |
| 花瓣式图片板（瀑布流 + 拖拽分组画板） | 5h |
| 空状态 / 加载 / 错误态统一打磨 | 2h |

**>>> MVP 截止点（76h，业余约 5 周）：已经可以每天用起来 <<<**

### Phase 3 · 无限白板（36h）—— 里程碑 M3：知识可组织

| 任务 | 工时 |
|---|---|
| tldraw 集成 + 自定义 Item 卡片 Shape | 8h |
| 条目拖入白板（HTML5 DnD 数据通道 + 落点定位） | 5h |
| 连线/关系标签/画框分组 | 5h |
| 多白板管理 + 缩略图列表 + 小地图导航 | 5h |
| 持久化（增量保存 + 20 版本快照 + 崩溃恢复） | 5h |
| 大画布性能（视口虚拟化、500+ 卡片压测优化） | 6h |
| 白板内搜索定位卡片 | 2h |

### Phase 4 · 写作输出（28h）—— 里程碑 M4：Pipeline 闭环

| 任务 | 工时 |
|---|---|
| TipTap 编辑器 + 排版样式 + 大纲栏 | 6h |
| 引用卡片节点 + 文末参考文献自动生成 | 6h |
| 素材侧栏（白板画框/收藏/划线拖入正文） | 5h |
| 模板系统（周报模板自动聚合本周收藏） | 4h |
| 导出 Markdown / HTML / PDF / 公众号格式 | 5h |
| doc_refs 双向追溯 UI | 2h |

### Phase 5 · 打磨与发布（24h）

| 任务 | 工时 |
|---|---|
| WebDAV 增量备份 + 恢复流程 | 8h |
| 全量导出（Markdown + OPML + JSON） | 4h |
| 性能与内存优化（长列表、图片缓存） | 4h |
| 打包签名 + 自动更新（electron-updater） | 4h |
| Dogfooding 自用一周修 bug | 4h |

### 风险与对策

| 风险 | 对策 |
|---|---|
| X/公众号反爬导致采集不稳 | 一律走"浏览器扩展手动同步"兜底，自动采集只是增强 |
| tldraw 自定义 Shape 学习曲线 | 预留 8h，先抄官方 custom-shape 示例改；实在不行降级为图片卡片 |
| 范围蔓延 | MVP（76h）先上线自用，每周复盘再决定后续 |
| Electron 体积/内存 | 图片懒加载 + 列表虚拟化；不内嵌 Chromium 开网页，一律 readability |

---

## 8. 第一周行动清单（今天就能开始）

1. `npm create @quick-start/electron` 初始化工程（2h 内跑起 Hello Window）
2. 建好 SQLite schema 和迁移脚本（Phase 0/1 重叠）
3. 订阅 5 个最常看的 RSS 源，验证采集链路跑通
4. 用铅笔在纸上画一遍你的"每日 Triage"动线，对照 4.2 节调整
