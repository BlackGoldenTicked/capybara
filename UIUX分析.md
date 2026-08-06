# ReadFlow UI/UX 不足分析（基于 v0.7.7 源码）

> 分析视角：以「WorkBuddy 设计规范 / emilkowalski 动效纪律 / Vercel 编辑排版」三套既定标准为基准，逐文件核查实际实现。
> 结论先行：**底层设计系统相当成熟**（令牌化主题、强约束动效、深浅双主题 + 12 卡片风格、空状态引导、toast 反馈、虚拟列表性能都已落地）。问题集中在**交互一致性、可访问性、可发现性、以及几处"看起来能点/能拖其实不能"的误导 affordance**。

---

## 一、高优先级：交互一致性（直接影响日常使用体感）

### 1. 原生 `prompt()` / `confirm()` 弹窗破坏设计语言
多处关键操作仍调用浏览器原生对话框，无法主题化、在深色/彩色卡片风格下显脏、且打断沉浸：
- `ReaderPane.tsx:93` 新建标签用 `prompt('新建标签')`
- `ItemList.tsx:49 / 109` 删除条目、清空收集箱用 `confirm()`
- `Sidebar.tsx:77` 删除白板用 `confirm()`
- `BoardView.tsx:231` 删除白板用 `confirm()`

**建议**：复用已有的 `.modal-mask` / `.modal` 体系（如 `QuickAdd`、`CardEditor` 已在用），把确认/输入做成应用内模态，统一强调色与动效。

### 2. 列表卡片 `draggable` 但库视图内无处可放（误导 affordance）
`ItemList.tsx:56` 给卡片加了 `draggable`，但 library 屏内没有任何 drop 目标（白板在另一个 `screen==='board'`）。当前屏里"拖卡片"既无反应也无落点，容易让用户以为能直接拖进白板。

**建议**：要么实现真正的跨屏拖放（拖卡片到侧栏白板项即送入该板），要么移除 `draggable` 避免虚假暗示。

### 3. 阅读器内无法"下一条/上一条"，破坏速读流
已有 J/K（列表内上下）与 E/L/F/B 动作，但阅读面板里没有上一篇/下一篇入口（按钮或快捷键）。沉浸阅读后必须回到列表才能切条目。

**建议**：阅读器底部或右上加 `← / →`（或复用 J/K 联动），并支持阅读位置记忆。

### 4. "送白板"按钮缺快捷键标注，与同组不一致
`ReaderPane.tsx:96-99` 三个动作都标了 `(F)(L)(E)`，唯独"送到白板"没写 `(B)`，而 B 快捷键确实存在（`App.tsx`）。

**建议**：统一补上 `(B)`。

---

## 二、高优先级：可访问性（a11y）缺口

### 5. 键盘焦点可见性缺失
`:focus-visible` 只定义在 `.seg-btn`（app.css:712）和 `.style-opt`（app.css:720）。卡片 `.card`、侧栏项 `.side-item`、订阅源项 `.feed-item`、以及通用 `button` 都**没有焦点环**。Tab 用户完全看不到当前焦点在哪。

**建议**：为所有可交互元素补 `:focus-visible { outline: 2px solid var(--card-accent); outline-offset: 2px }`（可抽成 `.focus-ring` 工具类）。

### 6. 语义 role / aria 几乎为零
- 卡片、侧栏项、动作图标都是 `<div onClick>` / 裸 `<button>`，无 `role`、`aria-label`、`aria-pressed`。
- `.act` 图标按钮仅有 `title`，屏幕阅读器读不出"收藏/稍后读"。
- toast 无 `aria-live`，操作结果不会被读屏软件播报。
- 全局 `:focus-visible` 缺失叠加，使纯键盘/读屏用户基本不可用。

**建议**：卡片与侧栏项补 `role="button"` + `aria-label`；图标动作按钮加 `aria-label` 与 `aria-pressed`；toast 容器加 `role="status" aria-live="polite"`。

### 7. 未读状态仅靠 6px 小圆点，对比弱
`.card.unread .card-title::before`（app.css:152）只是一个 6px 点，标题字重/明度无差异。密集列表里"已读/未读"不易一眼区分。

**建议**：未读标题加 `font-weight:500` 或卡片左侧加一条 accent 竖条（accent 由 `--card-accent` 派生，自动适配主题）。

---

## 三、中优先级：视觉一致性与打磨

### 8. 按钮语言不统一，主操作视觉权重偏低
存在至少 7 种按钮变体：基础 `button`、`.primary`、`.danger`、`.mini`、`.rb-toggle`、`.seg-btn`、`.sc-combo`、`.rail-btn`，无单一 button 组件/令牌。
- 阅读器 `reader-actions` 的「收藏/稍后读/归档/送白板」是无边框默认 button，视觉权重低；而卡片右上悬浮的彩色 `.act` 图标又重复表达了同样的操作，两者互相抢注意力。

**建议**：建立统一 `Button` 组件（variant: primary/ghost/danger/icon），阅读器主操作用 `primary` 或明确分组，避免与悬浮 `.act` 语义重叠。

### 9. 来源徽标双重配色，语义冲突
卡片 badge 背景按 `source_type` 用 success/info/warning 三色（app.css:158-163），同时前面又加 `src-dot` 用 `feedColor()` 哈希色（`ItemList.tsx:61`）。同一个 RSS 源出现**两个不同颜色**，且 badge 背景色与源真实色无关。

**建议**：保留 `feedColor` 单一来源色，去掉 badge 的背景语义色（或仅未读/状态用语义色），让"一个源 = 一个稳定色"成立。

### 10. 分隔条 hover 高亮硬编码蓝，与主题割裂
`.divider.v:hover`（app.css:501）用 `rgba(120,160,255,0.12)` 固定蓝。切换卡片风格时这条高亮色不变，与 `--card-accent` 体系割裂。

**建议**：改为 `color-mix(in srgb, var(--card-accent) 18%, transparent)`。

### 11. 阴影用固定黑 rgba，彩色风格下发灰/不可见
`app.css` 多处 `rgba(0,0,0,.25)`（卡片、白板卡、modal、toast）。在 ocean/sunset 等深色卡片风格下黑阴影几乎不可见。

**建议**：改用 `color-mix(in srgb, var(--color-text-primary) 22%, transparent)`，随主题自适应。

### 12. 死 CSS 增加设计系统噪音
已移除的 Writer / Gallery 模块样式仍在 `app.css`（`.writer` :375、`.gallery` :409、`.masonry` :410 等），以及 `.feed-header .keys`（app.css:134，但 `ItemList` 并未渲染该 span，属死代码）。

**建议**：随模块移除一并清理（非用户可见，但属设计债务）。

---

## 四、中优先级：可发现性与引导

### 13. ⌘K 命令面板未实现（与 DESIGN 规划不符）
`DESIGN.md` 明确规划"全局 ⌘K 命令面板：搜条目/跳页面/执行动作"，但 `App.tsx` 快捷键表无对应 action，全仓 grep 仅 `board-center-palette`（白板内加卡菜单）与之字面相近，并非命令面板。

**建议**：实现真正的 ⌘K 命令面板，否则"全键盘处理 100 条"的承诺打折。

### 14. 快捷键可发现性差
除阅读器空状态一行小字（"J/K 快速浏览"）外，界面无快捷键提示入口；`.feed-header .keys` 的 CSS 是死代码。新用户很难发现 E/L/F/B/←→。

**建议**：设置→快捷键页已存在，可在信息流头部加一个 `?` 或 `⌘K` 提示；并把快捷键速览放到首次启动的引导里。

### 15. 搜索无"无结果"与结果计数反馈
`search` 实际已接 FTS5（`store.ts:132/153` → `items:list`），功能可用；但 `ItemList` 空状态只有「收集箱为空 / 暂无条目」，搜索无匹配时用户分不清是"没结果"还是"本来就没条目"，也没有 `共 N 条` 的计数。

**建议**：区分 `search && items.length===0` 的"无匹配结果"空状态；头部显示结果数。

---

## 五、低优先级：信息密度与布局

### 16. 列表卡片无封面/来源图标预览
固定 80px 纯文本卡（`.card` app.css:149）。Twitter / 图片类内容无视觉预览，密集但单调。

**建议**：可选显示来源 favicon 或封面缩略图（窄列表下可关），提升扫读效率。

### 17. 无"专注阅读"模式
四栏（侧栏 + 订阅源 + 列表 + 阅读）在 <1280px 时拥挤；虽有折叠 rail（拖到很窄），但无一键隐藏侧栏的专注模式。

**建议**：加 `⌘\` 切换侧栏显隐 + 阅读专注模式（隐藏列表，仅留阅读器）。

---

## 六、值得肯定的成熟部分（别动）

- **设计令牌与主题**：`tokens.css` 三级背景/文本/边框 + 12 卡片风格双主题，配色完全由所选风格签名色派生，深浅自适应对比度——完成度高。
- **动效纪律**：统一 `--ease-out`、UI 动效 <300ms、`button:active{scale(.97)}`、尊重 `prefers-reduced-motion`，符合 emilkowalski 水准。
- **空状态与错误提示**：收集箱空态、RSS 抓取失败「无法获取数据」、toast 反馈闭环都已落地。
- **性能**：`react-window` 虚拟列表 + 按需取单条正文（`ReaderPane` 的 `items:get`），长列表不卡。
- **可配置快捷键**：录制/重置/冲突检测齐全。

---

## 七、建议优先级排序

| 优先级 | 项 | 工作量 |
|---|---|---|
| P0 | #1 原生 prompt/confirm → 应用内模态 | 中 |
| P0 | #5/#6 a11y：焦点环 + role/aria + aria-live | 中 |
| P1 | #2 卡片 draggable 误导 → 跨屏拖放或移除 | 小/大 |
| P1 | #3 阅读器上下条导航 | 小 |
| P1 | #13 ⌘K 命令面板 | 大 |
| P2 | #8 统一 Button 组件 | 中 |
| P2 | #9/#10/#11 配色/分隔条/阴影随主题 | 小 |
| P2 | #15 搜索无结果态 + 计数 | 小 |
| P3 | #7 未读强化、#16 封面预览、#17 专注模式、#12 清死 CSS | 小~中 |

> 注：所有"随主题"的颜色改动都应复用 `color-mix(in srgb, var(--card-accent)/var(--color-text-primary) x%, transparent)`，避免再引入硬编码值。
