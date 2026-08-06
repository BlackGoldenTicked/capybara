# ReadFlow 代码审核报告（v0.3 修复前 → 修复后）

> 用户反馈：收藏/稍后读/送白板点击无反应；白板创建后无反应、无法平移；满屏模拟数据、无真实财经数据。
> 本次从头通读 `src/main/*` 与 `src/renderer/*` 全部源码，定位并修复以下问题。

## 一、确认的真实 Bug

### 1. 白板无法平移（高危，用户明确报出）
**文件**：`src/renderer/src/components/BoardView.tsx`
**原因**：`.board-layer` 用 `position:absolute; inset:0` 铺满画布，成为指针事件的实际 `target`；而 `startPan` 里写死 `if (e.target !== canvasRef.current) return`，导致点击网格背景时 `target` 永远是 layer 而非 canvas → 平移分支永远进不去。滚轮缩放虽能冒泡触发，但拖拽平移完全失效。
**修复**：改为「点中 `.board-card` 才视为拖卡片，其余一律判为平移背景」，并对 canvas 用 `setPointerCapture` 保证拖拽连贯。
**附带**：新增可见工具条（缩放 −／百分比／＋、新建、删除）与空状态提示「把卡片拖到这里 · 空白处拖动平移 · 滚轮缩放」。

### 2. 自动采集到的数据不刷新到界面（中危，导致"都是模拟数据"观感）
**文件**：`src/main/sources/scheduler.ts` + `src/main/index.ts`
**原因**：`runDue()`（定时/首轮自动调度）抓完条目后**没有通知渲染进程**；只有手动「立即刷新全部源」才发 `sources:updated`。于是真实数据进了库，但界面要等重启或手动刷新才出现，用户看到的一直是初始的几条。
**修复**：`startScheduler(notifyRefresh)`，每轮 `runDue` 结束后回调 `mainWindow.webContents.send('sources:updated')`，前端 `App` 的监听会自动 `load()` 刷新。

### 3. 默认只有 tophub 一个源 + 6 条写死模拟数据（中危，用户明确报出）
**文件**：`src/main/db.ts` → `seedIfEmpty`
**原因**：首版只用 tophub（常被墙/结构易变）当默认源，且 `seed` 里硬编码了 6 条假数据（Karpathy 线程、前端周刊、机器之心…）。
**修复**：
- 默认订阅 **7 个真实 RSS 源**（按 url 幂等播种）：36氪、钛媒体、阮一峰周刊（大陆直连）+ CNBC Markets、Bloomberg Markets、Investing.com（国际财经，需 VPN）+ tophub 热榜。
- 删除 6 条已知演示假数据（按 url 精确清理，不动用户真实数据）。
- 全新安装只放 1 条引导卡，真实数据由采集器几秒后补齐。

### 4. "送白板"按钮在无白板时禁用且无引导（体验，易误判为"没反应"）
**文件**：`src/renderer/src/components/ReaderPane.tsx` + `store.ts`
**原因**：按钮 `disabled={!activeBoardId}`，没打开任何白板时点不了，用户以为功能坏了。
**修复**：无激活白板时点击 → 自动新建白板并把条目放进去，给出 toast。

## 二、健壮性增强（消除"静默无反应"）

- **ErrorBoundary**（`App.tsx`）：渲染崩溃时显示堆栈而非白屏。
- **Toast 反馈**（`store.toast` + `.toast` 样式）：收藏/稍后读/归档/送白板均弹「已收藏」等提示；`setStatus` 任何 IPC 异常都会弹「操作失败：…」，不再静默吞错。
- **封面兜底**：`readability.ts` 正文提取封面图，og:image / twitter:image 缺失时退而取正文首图，相对地址补成绝对，避免图片板全空。

## 三、实测结论（修复后，全新安装）

| 项 | 结果 |
|---|---|
| 7 个真实源抓取 | 全部成功，error_count=0 |
| 真实条目入库 | 83 条 RSS 真实条目 + 1 引导卡，**0 条模拟数据** |
| FTS5 全文搜索 | 索引 84 行，MATCH 正常；触发器 UPDATE/DELETE 经单测验证不抛错 |
| 白板平移/缩放 | 代码修复 + 工具条可见 |
| 构建 | `npm run build` 全绿（main 8 模块 / renderer 99 模块） |

## 四、验证方式（可复现）

1. 数据库权威路径固定为 `~/Library/Application Support/readflow/readflow/readflow.db`（所有数据集中在 `readflow/` 子目录下）。
   历史旧路径（扁平的 `.../readflow/readflow.db`）若含数据，会在启动时**自动迁移**到权威位置并改名 `.migrated` 备份，无需手动处理，也**绝不要手动删除权威库**。
2. 启动应用，等待 ~30s，查库：
   ```
   node /tmp/qitems.cjs "<上述路径>"
   ```
3. 用 `test-feeds.mjs` 可独立验证 6 个真实源能被 `rss-parser` 解析出标题。
4. `npm run dist` 产出带背景图的 dmg。

## 五、仍待办（非阻塞）

- X 收藏浏览器扩展本体已随 dmg 打包，但未在本机联调（需 Chrome 加载 `extension/` 并配对）。
- WebDAV 同步已就绪（坚果云等），需用户提供地址/账号实测。
- 花瓣图片板依赖封面图，部分 RSS 无 og:image 时仍可能稀疏。
- 主线程单测缺失，目前靠端到端脚本验证。
