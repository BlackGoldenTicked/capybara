import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import type { ItemRow, Card, CardKind, CardPayload, BoardLink } from '../env'
import { CardEditor } from './CardEditor'
import { BoardListview } from './BoardListview'
import { Icon, type IconName } from './icons'

const CARD_TYPES: Array<{ kind: CardKind; label: string; icon: IconName; desc: string }> = [
  { kind: 'text', label: '文本', icon: 'type', desc: '一段想法或笔记' },
  { kind: 'link', label: '链接', icon: 'link', desc: '收藏一个网页' },
  { kind: 'image', label: '图片', icon: 'image', desc: '本地或远程图片' },
  { kind: 'video', label: '视频', icon: 'video', desc: '本地视频片段' },
  { kind: 'file', label: '文件', icon: 'file', desc: '任意本地文件' },
  { kind: 'ref', label: '引用条目', icon: 'ref', desc: '从信息流引用' }
]

function fmtSize(n?: number): string {
  if (!n) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
function safeParse(p: string): CardPayload { try { return p ? JSON.parse(p) : {} } catch { return {} } }

/** 这些元素上的按下不应触发画布平移 / 也不应被画布吞掉点击 */
const NO_PAN = 'button, a, input, textarea, .board-toolbar, .board-center-palette, .card-edit, .card-del, .card-link-dot'

/** 框选多卡片的功能键（默认 Shift，仅硬编码；若需配置可从 settings 读取） */

export function BoardView() {
  const { cards, links, activeBoardId, boards, createBoard, addRefCard, addCard, moveCard, deleteCard, showToast, addLink, deleteLink, updateLink, renameBoard, deleteBoard, autoPos } = useStore()
  const [itemMap, setItemMap] = useState<Record<number, ItemRow>>({})
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [linking, setLinking] = useState<number | null>(null)
  const [linkCursor, setLinkCursor] = useState<{ x: number; y: number } | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerItems, setPickerItems] = useState<ItemRow[]>([])
  const [pickerQ, setPickerQ] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null)
  const [linkLabelDraft, setLinkLabelDraft] = useState('')

  // 选中状态：单选 / 多选 / 框选
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectBox, setSelectBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  // 框选 ref 镜像，避免 endDrag 中 stale 闭包
  const selectBoxRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)
  // 剪贴板：复制的卡片数据
  const clipboardRef = useRef<Card[]>([])
  // 撤销/重做栈
  interface UndoAction {
    type: 'delete' | 'move'
    cards: Card[]                  // 删除：被删的卡片快照；移动：旧坐标
    links?: BoardLink[]            // 删除时附带的连线
  }
  const undoStack = useRef<UndoAction[]>([])
  const redoStack = useRef<UndoAction[]>([])
  // 视图模式：board 白板 / list 列表
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')

  // 拖拽期间的本地覆盖位置（rAF 节流，松手才提交一次，避免每帧全画布重渲染 #3）
  const [localPos, setLocalPos] = useState<Record<number, { x: number; y: number }>>({})
  const rafRef = useRef<number | null>(null)
  const dragRef = useRef<{ mode: 'pan' | 'node' | 'select' | null; id?: number; sx: number; sy: number; ox: number; oy: number; moved: boolean }>(
    { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false }
  )
  const linkRef = useRef<{ fromId: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingKind = useRef<CardKind | null>(null)
  // 卡片实际渲染高度（DOM 测量）—— card.h 字段是 140 默认值不可靠，长卡片会超出
  // 用 ref + 手动触发 tick，避免在 ref 回调中 setState 引发的无限渲染
  const cardHeightsRef = useRef<Record<number, number>>({})
  const [, heightTick] = useState(0)

  useEffect(() => {
    window.capybara.invoke('items:list', 'all', '').then((r) => {
      const map: Record<number, ItemRow> = {}
      for (const it of r as ItemRow[]) map[it.id] = it
      setItemMap(map)
    })
  }, [])

  const posOf = (c: Card) => localPos[c.id] ?? { x: c.x, y: c.y }

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom((z) => Math.min(2.5, Math.max(0.3, z * (e.deltaY > 0 ? 0.9 : 1.1))))
  }

  const startPan = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement
    if (t.closest(NO_PAN)) return        // 关键修复：UI 控件上的按下不触发平移，也不吞点击
    if (linkRef.current) return
    if (t.closest('.board-card')) return // 卡片拖动单独处理
    // 按住功能键时启动框选模式
    if (e.shiftKey) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const sx = (e.clientX - rect.left - pan.x) / zoom
      const sy = (e.clientY - rect.top - pan.y) / zoom
      dragRef.current = { mode: 'select', sx: e.clientX, sy: e.clientY, ox: sx, oy: sy, moved: false }
      setSelectBox({ x: sx, y: sy, w: 0, h: 0 })
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      return
    }
    // 点击空白处取消选中
    setSelectedIds(new Set())
    dragRef.current = { mode: 'pan', sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (linkRef.current) {
      const rect = canvasRef.current!.getBoundingClientRect()
      setLinkCursor({ x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom })
      return
    }
    const d = dragRef.current
    if (d.mode === 'pan') setPan({ x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) })
    else if (d.mode === 'select') {
      const rect = canvasRef.current!.getBoundingClientRect()
      const cx = (e.clientX - rect.left - pan.x) / zoom
      const cy = (e.clientY - rect.top - pan.y) / zoom
      const x = Math.min(d.ox, cx), y = Math.min(d.oy, cy)
      const w = Math.abs(cx - d.ox), h = Math.abs(cy - d.oy)
      const box = { x, y, w, h }
      selectBoxRef.current = box
      setSelectBox(box)
    }
    else if (d.mode === 'node' && d.id != null) {
      d.moved = true
      const nx = d.ox + (e.clientX - d.sx) / zoom
      const ny = d.oy + (e.clientY - d.sy) / zoom
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const id = d.id
      rafRef.current = requestAnimationFrame(() => setLocalPos((prev) => ({ ...prev, [id]: { x: nx, y: ny } })))
    }
  }
  const endDrag = async (e: React.PointerEvent) => {
    if (linkRef.current) {
      const from = linkRef.current.fromId
      linkRef.current = null
      setLinking(null); setLinkCursor(null)
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.board-card') as HTMLElement | null
      const toId = el?.getAttribute('data-card-id')
      if (toId && Number(toId) !== from) { void addLink(from, Number(toId)); showToast('已建立连线') }
      return
    }
    const d = dragRef.current
    if (d.mode === 'node' && d.id != null && d.moved) {
      const p = localPos[d.id]
      // 先重置 dragRef，避免 onMove 在 await 期间继续写入 localPos
      dragRef.current = { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false }
      if (p) {
        // 等 store 乐观更新完成后再清 localPos，否则 cards 尚未更新就删覆盖 → 闪回起点
        await moveCard(d.id, p.x, p.y)
      }
      setLocalPos((prev) => { const n = { ...prev }; delete n[d.id!]; return n })
      return
    }
    // 框选结束：计算选中的卡片（用 ref 避免 stale 闭包）
    if (d.mode === 'select' && selectBoxRef.current) {
      const box = selectBoxRef.current
      const hit = cards.filter((c) => {
        const p = posOf(c)
        const h = cardHeightsRef.current[c.id] || c.h
        return p.x < box.x + box.w && p.x + c.w > box.x && p.y < box.y + box.h && p.y + h > box.y
      })
      setSelectedIds(new Set(hit.map((c) => c.id)))
      setSelectBox(null)
      selectBoxRef.current = null
    }
    dragRef.current = { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false }
  }

  // ===== 连接点扩展：点击端点创建新卡片+连线 =====
  const expandFromDot = async (fromCard: Card, side: 'top' | 'right' | 'bottom' | 'left') => {
    const offset = 280
    const fp = posOf(fromCard)
    let nx = fp.x, ny = fp.y
    if (side === 'right') nx += offset
    else if (side === 'left') nx -= offset
    else if (side === 'bottom') ny += offset + 60
    else if (side === 'top') ny -= offset + 60
    const newCard = await addCard({ kind: 'text', x: nx, y: ny, title: '', body: '' })
    await addLink(fromCard.id, newCard.id)
    setEditingId(newCard.id)
    showToast('已创建新卡片并连线')
  }

  // ===== 批量对齐 =====
  const alignSelected = (type: 'left' | 'right' | 'top' | 'bottom') => {
    const sel = cards.filter((c) => selectedIds.has(c.id))
    if (sel.length < 2) return
    if (type === 'left') { const min = Math.min(...sel.map((c) => c.x)); sel.forEach((c) => void moveCard(c.id, min, c.y)) }
    else if (type === 'right') { const max = Math.max(...sel.map((c) => c.x + c.w)); sel.forEach((c) => void moveCard(c.id, max - c.w, c.y)) }
    else if (type === 'top') { const min = Math.min(...sel.map((c) => c.y)); sel.forEach((c) => void moveCard(c.id, c.x, min)) }
    else if (type === 'bottom') { const max = Math.max(...sel.map((c) => c.y + (cardHeightsRef.current[c.id] || c.h))); sel.forEach((c) => void moveCard(c.id, c.x, max - (cardHeightsRef.current[c.id] || c.h))) }
    showToast(`已${type === 'left' ? '左' : type === 'right' ? '右' : type === 'top' ? '上' : '下'}对齐`)
  }
  const distributeSelected = (dir: 'h' | 'v') => {
    const sel = cards.filter((c) => selectedIds.has(c.id))
    if (sel.length < 3) return
    if (dir === 'h') {
      const sorted = [...sel].sort((a, b) => a.x - b.x)
      const totalW = sorted.reduce((s, c) => s + c.w, 0)
      const gap = (sorted[sorted.length - 1].x + sorted[sorted.length - 1].w - sorted[0].x - totalW) / (sorted.length - 1)
      let x = sorted[0].x
      sorted.forEach((c) => { void moveCard(c.id, x, c.y); x += c.w + gap })
    } else {
      const sorted = [...sel].sort((a, b) => a.y - b.y)
      const totalH = sorted.reduce((s, c) => s + (cardHeightsRef.current[c.id] || c.h), 0)
      const gap = (sorted[sorted.length - 1].y + (cardHeightsRef.current[sorted[sorted.length - 1].id] || sorted[sorted.length - 1].h) - sorted[0].y - totalH) / (sorted.length - 1)
      let y = sorted[0].y
      sorted.forEach((c) => { void moveCard(c.id, c.x, y); y += (cardHeightsRef.current[c.id] || c.h) + gap })
    }
    showToast('已等距分布')
  }

  // ===== 键盘交互 =====
  // ref 镜像：避免 effect 依赖 selectedIds/cards 导致频繁重绑
  const selectedIdsRef = useRef<Set<number>>(new Set())
  selectedIdsRef.current = selectedIds
  const cardsRef = useRef<Card[]>(cards)
  cardsRef.current = cards
  const linksRef = useRef<BoardLink[]>(links)
  linksRef.current = links

  // 撤销：执行逆操作
  const executeUndo = (action: UndoAction) => {
    if (action.type === 'delete') {
      // 逆操作：重新创建被删卡片 + 连线
      action.cards.forEach((c) => { void addCard({ kind: c.kind, x: c.x, y: c.y, w: c.w, h: c.h, title: c.title, body: c.body, payload: c.payload, item_id: c.item_id ?? undefined }) })
      // 连线会在新卡片上重建（但 ID 会变，所以连线只能手动恢复）
      showToast('已撤销删除')
    } else if (action.type === 'move') {
      // 逆操作：恢复旧坐标
      action.cards.forEach((c) => { void moveCard(c.id, c.x, c.y) })
      showToast('已撤销移动')
    }
  }
  // 重做：重新执行操作
  const executeRedo = (action: UndoAction) => {
    if (action.type === 'delete') {
      action.cards.forEach((c) => { void deleteCard(c.id) })
      showToast('已重做删除')
    } else if (action.type === 'move') {
      // move 的 redo 需要新坐标——存储在 action 中
      const newCoords = (action as UndoAction & { newCoords?: { id: number; x: number; y: number }[] }).newCoords
      if (newCoords) newCoords.forEach((nc) => { void moveCard(nc.id, nc.x, nc.y) })
      showToast('已重做移动')
    }
  }

  useEffect(() => {
    if (viewMode !== 'board') return
    const onKey = (e: KeyboardEvent) => {
      // 编辑卡片时不拦截键盘
      if (editingId != null || editingName || pickerOpen) return
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      // ESC 取消选中
      if (e.key === 'Escape') { setSelectedIds(new Set()); setLinking(null); return }
      // Ctrl+A 全选
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') { e.preventDefault(); setSelectedIds(new Set(cardsRef.current.map((c) => c.id))); return }
      // Ctrl+Z 撤销
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); const action = undoStack.current.pop(); if (action) { redoStack.current.push(action); executeUndo(action) } return
      }
      // Ctrl+Shift+Z 重做
      if ((e.metaKey || e.ctrlKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault(); const action = redoStack.current.pop(); if (action) { undoStack.current.push(action); executeRedo(action) } return
      }

      const sel = selectedIdsRef.current
      if (sel.size === 0) return
      const ids = [...sel]
      const curCards = cardsRef.current

      // Delete/Backspace 删除
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        const deleted = ids.map((id) => curCards.find((c) => c.id === id)).filter(Boolean) as Card[]
        const deletedLinks = linksRef.current.filter((l) => ids.includes(l.from_id) || ids.includes(l.to_id))
        undoStack.current.push({ type: 'delete', cards: deleted, links: deletedLinks })
        ids.forEach((id) => void deleteCard(id))
        setSelectedIds(new Set())
        showToast(`已删除 ${ids.length} 个卡片`)
        return
      }
      // Enter 打开编辑
      if (e.key === 'Enter' && ids.length === 1) { e.preventDefault(); setEditingId(ids[0]); return }
      // Ctrl+C 复制
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault()
        clipboardRef.current = ids.map((id) => curCards.find((c) => c.id === id)).filter(Boolean) as Card[]
        showToast(`已复制 ${ids.length} 个卡片`)
        return
      }
      // Ctrl+V 粘贴（附件卡片通过 payload.file 共享资产文件，不复制物理文件）
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault()
        const clip = clipboardRef.current
        clip.forEach((c) => {
          void addCard({ kind: c.kind, x: c.x + 30, y: c.y + 30, title: c.title, body: c.body, payload: c.payload, item_id: c.item_id ?? undefined })
        })
        showToast(`已粘贴 ${clip.length} 个卡片`)
        return
      }
      // 方向键移动
      const step = e.shiftKey ? 20 : 5
      let dx = 0, dy = 0
      if (e.key === 'ArrowLeft') dx = -step
      else if (e.key === 'ArrowRight') dx = step
      else if (e.key === 'ArrowUp') dy = -step
      else if (e.key === 'ArrowDown') dy = step
      if (dx !== 0 || dy !== 0) {
        e.preventDefault()
        const oldCoords = ids.map((id) => { const c = curCards.find((x) => x.id === id); return c ? { id, x: c.x, y: c.y } : null }).filter(Boolean) as { id: number; x: number; y: number }[]
        const newCoords = oldCoords.map((oc) => ({ id: oc.id, x: oc.x + dx, y: oc.y + dy }))
        undoStack.current.push({ type: 'move', cards: ids.map((id) => { const c = curCards.find((x) => x.id === id); return c! }).map((c) => ({ ...c })), ...{ newCoords } } as UndoAction)
        newCoords.forEach((nc) => { void moveCard(nc.id, nc.x, nc.y) })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, editingId, editingName, pickerOpen])

  const startNodeDrag = (e: React.PointerEvent, card: Card) => {
    const t = e.target as HTMLElement
    if (t.closest('a,button,input,textarea,.card-del,.card-edit,.card-link-dot')) return
    e.stopPropagation()
    // 选中逻辑：Shift 或 Ctrl/Cmd 多选，普通点击单选
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds((prev) => { const n = new Set(prev); if (n.has(card.id)) n.delete(card.id); else n.add(card.id); return n })
    } else if (!selectedIds.has(card.id)) {
      setSelectedIds(new Set([card.id]))
    }
    dragRef.current = { mode: 'node', id: card.id, sx: e.clientX, sy: e.clientY, ox: card.x, oy: card.y, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const startLink = (e: React.PointerEvent, card: Card) => {
    e.stopPropagation()
    linkRef.current = { fromId: card.id }
    setLinking(card.id)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const dropPos = (e: React.DragEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom }
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const itemId = Number(e.dataTransfer.getData('application/x-item-id'))
    if (itemId) { const { x, y } = dropPos(e); addRefCard(itemId, x - 120, y - 65); showToast('已放入白板'); return }
    const files = Array.from(e.dataTransfer.files)
    const { x, y } = dropPos(e)
    files.forEach((f, i) => {
      const path = window.capybara.getPathForFile(f)
      const kind: CardKind = f.type.startsWith('image/') ? 'image'
        : f.type.startsWith('video/') ? 'video'
        : f.type.startsWith('audio/') ? 'video' : 'file'
      void addCard({ kind, _sourcePath: path, title: f.name, x: x + i * 24, y: y + i * 24 })
    })
    if (files.length) showToast(`已添加 ${files.length} 个附件`)
  }

  const onPickType = (kind: CardKind) => {
    const pos = autoPos()
    if (kind === 'ref') { void openPicker(); return }
    if (kind === 'image' || kind === 'video' || kind === 'file') { pendingKind.current = kind; fileRef.current?.click(); return }
    void addCard({ kind, x: pos.x, y: pos.y, title: '', body: '' }).then((c) => setEditingId(c.id))
  }
  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ''
    const kind = pendingKind.current; if (!f || !kind) return
    const path = window.capybara.getPathForFile(f)
    const pos = autoPos()
    void addCard({ kind, _sourcePath: path, title: f.name, x: pos.x, y: pos.y }).then((c) => setEditingId(c.id))
  }

  const openPicker = async () => {
    setPickerOpen(true)
    const list = await window.capybara.invoke('items:list', 'all', '') as ItemRow[]
    setPickerItems(list)
  }
  const pickItem = (it: ItemRow) => {
    const pos = autoPos(); setPickerOpen(false); addRefCard(it.id, pos.x, pos.y); showToast('已引用条目')
  }

  const fit = () => { setPan({ x: 0, y: 0 }); setZoom(1) }
  // 一键自适应：计算所有卡片的包围盒，缩放到画布可见区内，留 40px padding
  const fitAll = () => {
    if (cards.length === 0 || !canvasRef.current) { setPan({ x: 0, y: 0 }); setZoom(1); return }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const c of cards) {
      const p = posOf(c)
      const h = cardHeightsRef.current[c.id] || c.h
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x + c.w > maxX) maxX = p.x + c.w
      if (p.y + h > maxY) maxY = p.y + h
    }
    const rect = canvasRef.current.getBoundingClientRect()
    const pad = 40
    const availW = rect.width - pad * 2
    const availH = rect.height - pad * 2
    const contentW = maxX - minX
    const contentH = maxY - minY
    // 极少卡片时不要放太大，限制最大缩放为 1.5
    const scale = Math.min(availW / contentW, availH / contentH, 1.5)
    const z = Math.max(0.3, Math.min(2.5, scale))
    // 居中：让卡片组的中心对齐画布中心
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    setZoom(z)
    setPan({ x: rect.width / 2 - cx * z, y: rect.height / 2 - cy * z })
  }
  const beginRename = () => { const b = boards.find((x) => x.id === activeBoardId); setEditingName(true); setNameDraft(b?.name ?? '') }
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (editingName && nameRef.current) { nameRef.current.focus(); nameRef.current.select() }
  }, [editingName])
  const commitRename = () => { if (activeBoardId != null) void useStore.getState().renameBoard(activeBoardId, nameDraft.trim() || '未命名白板'); setEditingName(false) }
  const openItemInReader = (itemId: number) => {
    useStore.getState().select(itemId)
    useStore.getState().setScreen('library')
    setEditingId(null)
  }
  const beginEditLink = (lk: BoardLink) => { setEditingLinkId(lk.id); setLinkLabelDraft(lk.label || '') }
  const commitEditLink = () => {
    if (editingLinkId != null) { void updateLink(editingLinkId, linkLabelDraft.trim()); showToast('已更新连线说明') }
    setEditingLinkId(null)
  }

  // 卡片 payload 只解析一次（性能 #20）
  const cardsView = useMemo(() => cards.map((c) => ({ card: c, p: safeParse(c.payload) })), [cards])
  const cardMap = useMemo(() => new Map(cardsView.map((cv) => [cv.card.id, cv])), [cardsView])
  const center = (c: Card) => { const p = posOf(c); const h = cardHeightsRef.current[c.id] || c.h; return { x: p.x + c.w / 2, y: p.y + h / 2 } }
  const linkMid = (a: Card, b: Card) => { const ca = center(a), cb = center(b); return { x: (ca.x + cb.x) / 2, y: (ca.y + cb.y) / 2 } }
  /**
   * 取连线锚点：根据两卡相对方向，取较远方向的边中点；返回边类型供曲线选切线。
   * 使用 DOM 实测高度（card.h 字段是 140 默认值，长卡片不可靠）。
   */
  const edgeAnchor = (from: Card, to: Card): { x: number; y: number; side: 'top'|'right'|'bottom'|'left' } => {
    const fp = posOf(from)
    const tp = posOf(to)
    const fh = cardHeightsRef.current[from.id] || from.h
    const th = cardHeightsRef.current[to.id] || to.h
    const fcx = fp.x + from.w / 2, fcy = fp.y + fh / 2
    const tcx = tp.x + to.w / 2, tcy = tp.y + th / 2
    const dx = tcx - fcx, dy = tcy - fcy
    if (Math.abs(dx) >= Math.abs(dy)) {
      const side = dx >= 0 ? 'right' : 'left'
      return { x: dx >= 0 ? fp.x + from.w : fp.x, y: fcy, side }
    }
    const side = dy >= 0 ? 'bottom' : 'top'
    return { x: fcx, y: dy >= 0 ? fp.y + fh : fp.y, side }
  }
  /** 端点切线方向：曲线从锚点出发远离卡片的方向 */
  const tangentOut = (a: { side: 'top'|'right'|'bottom'|'left' }) => {
    switch (a.side) {
      case 'right': return { x: 1, y: 0 }
      case 'left':  return { x: -1, y: 0 }
      case 'bottom': return { x: 0, y: 1 }
      case 'top':   return { x: 0, y: -1 }
    }
  }

  if (!activeBoardId) {
    return (
      <section className="board-empty">
        <div className="be-art"><Icon name="board" size={40} strokeWidth={1.4} /></div>
        <p className="empty-title">还没有打开白板</p>
        <p>在左侧「白板 <Icon name="plus" size={12} />」新建一个，用来把收藏条目、文本、图片、链接、文件、视频摆开组织成领域认知</p>
        <button className="primary" onClick={() => void createBoard()}><Icon name="plus" size={15} /> 新建白板</button>
      </section>
    )
  }
  const board = boards.find((b) => b.id === activeBoardId)
  const linkingFrom = linking != null ? cardMap.get(linking)?.card : undefined

  return (
    <section className="board">
      {/* 顶部：仅白板标题 */}
      <div className="board-header" onPointerDown={(e) => e.stopPropagation()}>
        {editingName ? (
          <input ref={nameRef} className="board-name-input" value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingName(false) }} />
        ) : (
          <span className="title" onDoubleClick={beginRename} title="双击重命名">{board?.name ?? '白板'}</span>
        )}
      </div>

      {/* 画布上方浮层：卡片创建按钮 */}
      {viewMode === 'board' && (
        <div className="board-float-toolbar" onPointerDown={(e) => e.stopPropagation()}>
          <span className="board-card-btns">
            {CARD_TYPES.map((t) => (
              <button key={t.kind} title={t.desc} onClick={() => onPickType(t.kind)}>
                <Icon name={t.icon} size={16} /> {t.label}
              </button>
            ))}
          </span>
        </div>
      )}

      {/* 选中多卡片时：对齐工具浮在画布上方（卡片组上方） */}
      {selectedIds.size >= 2 && viewMode === 'board' && (
        <div className="board-align-bar">
          <span>已选 {selectedIds.size} 项</span>
          <button title="左对齐" onClick={() => alignSelected('left')}><Icon name="alignLeft" size={16} /></button>
          <button title="右对齐" onClick={() => alignSelected('right')}><Icon name="alignRight" size={16} /></button>
          <button title="上对齐" onClick={() => alignSelected('top')}><Icon name="alignTop" size={16} /></button>
          <button title="下对齐" onClick={() => alignSelected('bottom')}><Icon name="alignBottom" size={16} /></button>
          <button title="水平等距" onClick={() => distributeSelected('h')}><Icon name="distributeH" size={16} /></button>
          <button title="垂直等距" onClick={() => distributeSelected('v')}><Icon name="distributeV" size={16} /></button>
        </div>
      )}

      {viewMode === 'list' ? (
        <BoardListview cards={cards} links={links} onJumpToCard={(id) => {
          setViewMode('board')
          // 选中并居中到目标卡片
          setSelectedIds(new Set([id]))
          const c = cards.find((x) => x.id === id)
          if (c) setPan({ x: -c.x + 200, y: -c.y + 200 })
        }} />
      ) : (
      <>
      <input ref={fileRef} type="file" hidden onChange={onFileChosen} />
      <div className="board-canvas" ref={canvasRef}
        onWheel={onWheel} onPointerDown={startPan} onPointerMove={onMove} onPointerUp={endDrag} onPointerLeave={endDrag}
        onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
        <div className="board-layer" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>

          {/* 连线层 */}
          <svg className="board-edges" width="100%" height="100%">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,3 L0,6 Z" fill="var(--accent-info)" />
              </marker>
            </defs>
            {links.map((lk: BoardLink) => {
              const a = cardMap.get(lk.from_id)?.card, b = cardMap.get(lk.to_id)?.card
              if (!a || !b) return null
              const sa = edgeAnchor(a, b), sb = edgeAnchor(b, a)
              const ta = tangentOut(sa), tb = tangentOut(sb)
              // 控制点：沿切线方向走 max(40, 距离×0.4)，让曲线自然垂直出发 / 垂直到达
              const dist = Math.hypot(sb.x - sa.x, sb.y - sa.y)
              const reach = Math.max(40, dist * 0.4)
              const cp1 = { x: sa.x + ta.x * reach, y: sa.y + ta.y * reach }
              const cp2 = { x: sb.x + tb.x * reach, y: sb.y + tb.y * reach }
              const mid = { x: (sa.x + sb.x) / 2, y: (sa.y + sb.y) / 2 }
              const isEditing = editingLinkId === lk.id
              const d = `M ${sa.x} ${sa.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${sb.x} ${sb.y}`
              return (
                <g key={lk.id} className="edge">
                  {/* 连线交互优化：扩大可触发选区至连线四周整圈，高亮半透明 */}
                  <path d={d} className="edge-hit-wide" fill="none" />
                  <path d={d} className="edge-line" markerEnd="url(#arrow)" fill="none" />
                  <circle className="edge-del" cx={mid.x} cy={mid.y} r={9}
                    onClick={(e) => { e.stopPropagation(); void deleteLink(lk.id); showToast('已删除连线') }}>
                    <title>删除连线</title>
                  </circle>
                  {lk.label && !isEditing && <text className="edge-label" x={mid.x} y={mid.y - 12} onClick={(e) => { e.stopPropagation(); beginEditLink(lk) }}>{lk.label}</text>}
                </g>
              )
            })}
            {linkingFrom && linkCursor && (() => {
              // 拖拽中的临时线：从源卡片锚点（edgeAnchor 沿另一卡方向）指向光标
              const anyOther = cardsView.find((cv) => cv.card.id !== linkingFrom.id)
              const sa = anyOther ? edgeAnchor(linkingFrom, anyOther.card) : center(linkingFrom)
              return <path d={`M ${sa.x} ${sa.y} L ${linkCursor.x} ${linkCursor.y}`} className="edge-temp" />
            })()}
          </svg>

          {/* 框选矩形 */}
          {selectBox && (
            <div className="board-select-box" style={{ left: selectBox.x, top: selectBox.y, width: selectBox.w, height: selectBox.h }} />
          )}

          {cardsView.map(({ card, p }) => {
            const pos = posOf(card)
            const it = card.item_id != null ? itemMap[card.item_id] : undefined
            const assetSrc = p.file ? `board-asset://${p.file}` : (p.url || '')
            const isSelected = selectedIds.has(card.id)
            return (
              <div key={card.id} data-card-id={card.id} className={`board-card kind-${card.kind} ${isSelected ? 'card-selected' : ''}`}
                style={{ left: pos.x, top: pos.y, width: card.w }}
                ref={(el) => {
                  // 实测卡片渲染高度（card.h 字段是 140 默认值不可靠）
                  // 仅在挂载时记录；不要在 cleanup 时 delete（StrictMode 每次渲染都会
                  // 触发 cleanup→attach 循环，delete 会让 attach 误以为高度变了再触发 setState）
                  if (!el) return
                  const h = el.offsetHeight
                  if (cardHeightsRef.current[card.id] !== h) {
                    cardHeightsRef.current[card.id] = h
                    heightTick((t) => (t + 1) & 0xffff)
                  }
                }}
                onPointerDown={(e) => startNodeDrag(e, card)} onDoubleClick={() => setEditingId(card.id)}
                onMouseEnter={() => setHoveredId(card.id)} onMouseLeave={() => setHoveredId((prev) => prev === card.id ? null : prev)}>
                <span className="card-edit" title="编辑" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setEditingId(card.id) }}><Icon name="edit" size={13} /></span>
                <span className="card-del" title="删除" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); void deleteCard(card.id) }}><Icon name="close" size={13} /></span>
                {/* 连线手柄：四边中点，点击扩展创建新卡片；拖拽离开则连线 */}
                {(hoveredId === card.id || isSelected || linking != null) && (
                  <>
                    <span className="card-link-dot card-link-top" title="点击创建新卡片"
                      onPointerDown={(e) => startLink(e, card)}
                      onClick={(e) => { e.stopPropagation(); if (!linkRef.current) void expandFromDot(card, 'top') }} />
                    <span className="card-link-dot card-link-right" title="点击创建新卡片"
                      onPointerDown={(e) => startLink(e, card)}
                      onClick={(e) => { e.stopPropagation(); if (!linkRef.current) void expandFromDot(card, 'right') }} />
                    <span className="card-link-dot card-link-bottom" title="点击创建新卡片"
                      onPointerDown={(e) => startLink(e, card)}
                      onClick={(e) => { e.stopPropagation(); if (!linkRef.current) void expandFromDot(card, 'bottom') }} />
                    <span className="card-link-dot card-link-left" title="点击创建新卡片"
                      onPointerDown={(e) => startLink(e, card)}
                      onClick={(e) => { e.stopPropagation(); if (!linkRef.current) void expandFromDot(card, 'left') }} />
                  </>
                )}
                {card.kind === 'ref' && (
                  it ? (<>
                    <p className="bc-kind"><Icon name="ref" size={12} /> 引用 · {it.source_name}</p>
                    <p className="bc-title">{card.title || it.title}</p>
                    <p className="bc-summary">{card.body || it.summary || '（无摘要）'}</p>
                  </>) : <p className="bc-title">{card.title || `条目 #${card.item_id}（已删除）`}</p>
                )}
                {card.kind === 'text' && (
                  <>
                    <p className="bc-kind"><Icon name="type" size={12} /> 文本</p>
                    {card.title && <p className="bc-title">{card.title}</p>}
                    <p className="bc-summary">{card.body || '（空）'}</p>
                  </>
                )}
                {card.kind === 'link' && (
                  <>
                    <p className="bc-kind"><Icon name="link" size={12} /> 链接</p>
                    {card.title && <p className="bc-title">{card.title}</p>}
                    <a className="bc-link" href={p.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{p.url}</a>
                    {card.body && <p className="bc-summary">{card.body}</p>}
                  </>
                )}
                {card.kind === 'image' && assetSrc && (
                  <>
                    <p className="bc-kind"><Icon name="image" size={12} /> 图片</p>
                    <img className="bc-media" src={assetSrc} alt={p.name || card.title}
                      draggable={false} />
                    {p.name && <p className="bc-fname">{p.name}</p>}
                  </>
                )}
                {card.kind === 'image' && !assetSrc && (
                  <>
                    <p className="bc-kind"><Icon name="image" size={12} /> 图片</p>
                    <p className="bc-summary">（图片加载中或不可用）</p>
                  </>
                )}
                {card.kind === 'video' && assetSrc && (
                  <>
                    <p className="bc-kind"><Icon name="video" size={12} /> 视频</p>
                    <video className="bc-media" src={assetSrc} controls preload="metadata" />
                  </>
                )}
                {card.kind === 'video' && !assetSrc && (
                  <>
                    <p className="bc-kind"><Icon name="video" size={12} /> 视频</p>
                    <p className="bc-summary">（视频加载中或不可用）</p>
                  </>
                )}
                {card.kind === 'file' && (
                  <>
                    <p className="bc-kind"><Icon name="file" size={12} /> 文件</p>
                    <p className="bc-title">{p.name || card.title}</p>
                    <p className="bc-fname">{fmtSize(p.size)}</p>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* 连线文字编辑浮层（不随缩放，定位到屏幕坐标） */}
        {editingLinkId != null && (() => {
          const lk = links.find((l) => l.id === editingLinkId)
          if (!lk) return null
          const a = cardMap.get(lk.from_id)?.card, b = cardMap.get(lk.to_id)?.card
          if (!a || !b) return null
          const m = linkMid(a, b)
          return (
            <input className="link-label-input" autoFocus
              style={{ left: pan.x + m.x * zoom, top: pan.y + m.y * zoom }}
              value={linkLabelDraft}
              placeholder="连线说明（可选）"
              onChange={(e) => setLinkLabelDraft(e.target.value)}
              onBlur={commitEditLink}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEditLink(); if (e.key === 'Escape') setEditingLinkId(null) }} />
          )
        })()}

        {/* 右下角视图控制浮层 */}
        {viewMode === 'board' && (
          <div className="board-view-controls" onPointerDown={(e) => e.stopPropagation()}>
            <button title="切换列表视图" onClick={() => setViewMode((v) => v === 'board' ? 'list' : 'board')}>
              <Icon name="list" size={16} />
            </button>
            <button title="缩小" onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))}><Icon name="minus" size={16} /></button>
            <span className="bvc-zoom">{Math.round(zoom * 100)}%</span>
            <button title="放大" onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}><Icon name="plus" size={16} /></button>
            <button title="还原视图" onClick={fit}><Icon name="maximize" size={16} /></button>
            <button title="自适应全部卡片" onClick={fitAll}><Icon name="frame" size={16} /></button>
            <button className="danger" title="删除白板" onClick={() => {
              if (activeBoardId == null) return
              if (!confirm('确定要删除「' + (board?.name ?? '白板') + '」吗？此操作不可撤销。')) return
              void deleteBoard(activeBoardId)
            }}><Icon name="trash" size={16} /></button>
          </div>
        )}
      </div>
      </>
      )}

      {editingId != null && (() => {
        const cv = cardsView.find((c) => c.card.id === editingId)
        if (!cv) return null
        return (
          <CardEditor card={cv.card} itemMap={itemMap} onClose={() => setEditingId(null)}
            onSave={(patch) => { void useStore.getState().updateCard(cv.card.id, patch) }}
            onDelete={() => { void deleteCard(cv.card.id) }}
            onOpenItem={openItemInReader} />
        )
      })()}

      {pickerOpen && (
        <div className="modal-mask" onClick={() => setPickerOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">引用条目</div>
            <input className="picker-search" placeholder="搜索标题 / 摘要…" value={pickerQ} onChange={(e) => setPickerQ(e.target.value)} />
            <div className="picker-list">
              {pickerItems.filter((it) => !pickerQ || (it.title + it.summary).toLowerCase().includes(pickerQ.toLowerCase())).slice(0, 200).map((it) => (
                <div key={it.id} className="picker-item" onClick={() => pickItem(it)}>
                  <span className="pi-title">{it.title}</span>
                  <span className="pi-src">{it.source_name}</span>
                </div>
              ))}
            </div>
            <div className="modal-foot"><button onClick={() => setPickerOpen(false)}>取消</button></div>
          </div>
        </div>
      )}
    </section>
  )
}
