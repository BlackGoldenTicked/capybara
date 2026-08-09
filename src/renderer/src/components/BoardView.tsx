import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import type { ItemRow, Card, CardKind, CardPayload, BoardLink } from '../env'
import { CardEditor } from './CardEditor'
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

  // 拖拽期间的本地覆盖位置（rAF 节流，松手才提交一次，避免每帧全画布重渲染 #3）
  const [localPos, setLocalPos] = useState<Record<number, { x: number; y: number }>>({})
  const rafRef = useRef<number | null>(null)
  const dragRef = useRef<{ mode: 'pan' | 'node' | null; id?: number; sx: number; sy: number; ox: number; oy: number; moved: boolean }>(
    { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false }
  )
  const linkRef = useRef<{ fromId: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingKind = useRef<CardKind | null>(null)
  // 卡片实际渲染高度（DOM 测量）—— card.h 字段是 140 默认值不可靠，长卡片会超出
  const [cardHeights, setCardHeights] = useState<Record<number, number>>({})

  useEffect(() => {
    window.readflow.invoke('items:list', 'all', '').then((r) => {
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
    else if (d.mode === 'node' && d.id != null) {
      d.moved = true
      const nx = d.ox + (e.clientX - d.sx) / zoom
      const ny = d.oy + (e.clientY - d.sy) / zoom
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const id = d.id
      rafRef.current = requestAnimationFrame(() => setLocalPos((prev) => ({ ...prev, [id]: { x: nx, y: ny } })))
    }
  }
  const endDrag = (e: React.PointerEvent) => {
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
      if (p) { void moveCard(d.id, p.x, p.y) }
      setLocalPos((prev) => { const n = { ...prev }; delete n[d.id!]; return n })
    }
    dragRef.current = { mode: null, sx: 0, sy: 0, ox: 0, oy: 0, moved: false }
  }

  const startNodeDrag = (e: React.PointerEvent, card: Card) => {
    const t = e.target as HTMLElement
    if (t.closest('a,button,input,textarea,.card-del,.card-edit,.card-link-dot')) return
    e.stopPropagation()
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
      const path = window.readflow.getPathForFile(f)
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
    const path = window.readflow.getPathForFile(f)
    const pos = autoPos()
    void addCard({ kind, _sourcePath: path, title: f.name, x: pos.x, y: pos.y }).then((c) => setEditingId(c.id))
  }

  const openPicker = async () => {
    setPickerOpen(true)
    const list = await window.readflow.invoke('items:list', 'all', '') as ItemRow[]
    setPickerItems(list)
  }
  const pickItem = (it: ItemRow) => {
    const pos = autoPos(); setPickerOpen(false); addRefCard(it.id, pos.x, pos.y); showToast('已引用条目')
  }

  const fit = () => { setPan({ x: 0, y: 0 }); setZoom(1) }
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
  const cardMap = new Map(cardsView.map((cv) => [cv.card.id, cv]))
  const center = (c: Card) => { const p = posOf(c); const h = cardHeights[c.id] || c.h; return { x: p.x + c.w / 2, y: p.y + h / 2 } }
  const linkMid = (a: Card, b: Card) => { const ca = center(a), cb = center(b); return { x: (ca.x + cb.x) / 2, y: (ca.y + cb.y) / 2 } }
  /**
   * 取连线锚点：根据两卡相对方向，取较远方向的边中点；返回边类型供曲线选切线。
   * 使用 DOM 实测高度（card.h 字段是 140 默认值，长卡片不可靠）。
   */
  const edgeAnchor = (from: Card, to: Card): { x: number; y: number; side: 'top'|'right'|'bottom'|'left' } => {
    const fp = posOf(from)
    const tp = posOf(to)
    const fh = cardHeights[from.id] || from.h
    const th = cardHeights[to.id] || to.h
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
      <div className="board-toolbar" onPointerDown={(e) => e.stopPropagation()}>
        {editingName ? (
          <input ref={nameRef} className="board-name-input" value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingName(false) }} />
        ) : (
          <span className="title" onDoubleClick={beginRename} title="双击重命名">{board?.name ?? '白板'}</span>
        )}
        <span className="board-card-btns">
          {CARD_TYPES.map((t) => (
            <button key={t.kind} title={t.desc} onClick={() => onPickType(t.kind)}>
              <Icon name={t.icon} size={15} /> {t.label}
            </button>
          ))}
        </span>
        <span className="board-tools">
          <button title="缩小" onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))}><Icon name="minus" size={16} /></button>
          <button title="还原视图" onClick={fit} style={{ minWidth: 52, fontVariantNumeric: 'tabular-nums' }}>{Math.round(zoom * 100)}%</button>
          <button title="放大" onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}><Icon name="plus" size={16} /></button>
          <button className="danger" title="删除白板" onClick={() => {
            if (activeBoardId == null) return
            if (!confirm('确定要删除「' + (board?.name ?? '白板') + '」吗？此操作不可撤销。')) return
            void deleteBoard(activeBoardId)
          }}><Icon name="trash" size={15} /></button>
        </span>
      </div>

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
                  <path d={d} className="edge-hit" fill="none" />
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

          {cardsView.map(({ card, p }) => {
            const pos = posOf(card)
            const it = card.item_id != null ? itemMap[card.item_id] : undefined
            const assetSrc = p.file ? `board-asset://${p.file}` : (p.url || '')
            return (
              <div key={card.id} data-card-id={card.id} className={`board-card kind-${card.kind}`}
                style={{ left: pos.x, top: pos.y, width: card.w }}
                ref={(el) => {
                  // 实测卡片渲染高度（card.h 字段是 140 默认值不可靠），存 state 里供 edgeAnchor 使用
                  if (el) {
                    const h = el.offsetHeight
                    setCardHeights((prev) => prev[card.id] === h ? prev : { ...prev, [card.id]: h })
                  } else {
                    setCardHeights((prev) => { if (!(card.id in prev)) return prev; const n = { ...prev }; delete n[card.id]; return n })
                  }
                }}
                onPointerDown={(e) => startNodeDrag(e, card)} onDoubleClick={() => setEditingId(card.id)}
                onMouseEnter={() => setHoveredId(card.id)} onMouseLeave={() => setHoveredId((prev) => prev === card.id ? null : prev)}>
                <span className="card-edit" title="编辑" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setEditingId(card.id) }}><Icon name="edit" size={13} /></span>
                <span className="card-del" title="删除" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); void deleteCard(card.id) }}><Icon name="close" size={13} /></span>
                {/* 连线手柄：四边中点，hover 或被作为连线目标时显示 */}
                {(hoveredId === card.id || linking != null) && (
                  <>
                    <span className="card-link-dot card-link-top" title="从上边连线" onPointerDown={(e) => startLink(e, card)} />
                    <span className="card-link-dot card-link-right" title="从右边连线" onPointerDown={(e) => startLink(e, card)} />
                    <span className="card-link-dot card-link-bottom" title="从下边连线" onPointerDown={(e) => startLink(e, card)} />
                    <span className="card-link-dot card-link-left" title="从左边连线" onPointerDown={(e) => startLink(e, card)} />
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
                    <img className="bc-media" src={assetSrc} alt={p.name || card.title} />
                    {p.name && <p className="bc-fname">{p.name}</p>}
                  </>
                )}
                {card.kind === 'video' && assetSrc && (
                  <>
                    <p className="bc-kind"><Icon name="video" size={12} /> 视频</p>
                    <video className="bc-media" src={assetSrc} controls preload="metadata" />
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

        {/* 空白白板：居中引导面板 */}
        {cards.length === 0 && (
          <div className="board-center-palette" onPointerDown={(e) => e.stopPropagation()}>
            <div className="bcp-card">
              <p className="bcp-title">从一张卡片开始</p>
              <p className="bcp-sub">选择一种类型，把想法、收藏或文件摆上白板</p>
              <div className="bcp-grid">
                {CARD_TYPES.map((t) => (
                  <button key={t.kind} className="bcp-btn" onClick={() => onPickType(t.kind)}>
                    <span className="bcp-icon"><Icon name={t.icon} size={22} strokeWidth={1.6} /></span>
                    <span className="bcp-label">{t.label}</span>
                    <span className="bcp-desc">{t.desc}</span>
                  </button>
                ))}
              </div>
              <p className="bcp-foot">也可以把左侧信息流或本地文件直接拖进画布</p>
            </div>
          </div>
        )}
      </div>

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
