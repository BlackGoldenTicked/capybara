/**
 * 桌面端即时响应：用 onPointerDown 替代 onClick，省去鼠标抬起后的 ~100-200ms 延迟。
 *
 * 用法：
 *   <button {...press(() => doSomething())}>点击</button>
 *   <div {...press(() => select(id))}>选中</div>
 *
 * 注意：
 * - 不会在拖拽中触发（pointermove 超过 5px 判定为拖拽，不触发）
 * - 不影响键盘可访问性（保留 onClick 兜底，Enter/Space 仍可用）
 * - 不影响 stopPropagation（press 事件天然支持 e.stopPropagation()）
 * - 仅左键触发（button === 0），右键菜单不受影响
 */

const DRAG_THRESHOLD = 5

/**
 * 生成一组事件 props，绑定到任意元素上即可获得"按下即响应"的即时交互。
 * 返回 { onPointerDown, onClick } —— onClick 作为键盘操作的兜底。
 */
export function press(handler: (e: React.PointerEvent | React.MouseEvent) => void) {
  let startX = 0
  let startY = 0
  let active = false

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return // 仅左键
      startX = e.clientX
      startY = e.clientY
      active = true
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!active || e.button !== 0) return
      active = false
      const dx = Math.abs(e.clientX - startX)
      const dy = Math.abs(e.clientY - startY)
      if (dx <= DRAG_THRESHOLD && dy <= DRAG_THRESHOLD) {
        e.preventDefault()
        handler(e)
      }
    },
    // 键盘兜底：Enter / Space 触发（不影响 Tab 聚焦）
    onClick: (e: React.MouseEvent) => {
      // pointerDown→pointerUp 已处理过的不再重复触发
      // 但键盘 Enter/Space 会触发 click 且不会有 pointerDown，这里兜底
      if (e.detail === 0) handler(e)
    }
  }
}

/**
 * 简化版：仅给 onPointerDown，不防拖拽（适合纯按钮，不会出现在可拖拽容器上）。
 * 更轻量，适合操作按钮（已读/收藏/删除等）。
 */
export function pressBtn(handler: (e: React.PointerEvent) => void) {
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      handler(e)
    }
  }
}
