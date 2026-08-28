import { useEffect, useRef, useState } from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { useStore } from '../store'
import type { ItemRow } from '../env'
import { Icon } from './icons'
import { plainTextFromHtml } from '../lib/reader'
import { press, pressBtn } from '../lib/press'

const SOURCE_LABEL: Record<string, string> = {
  rss: 'RSS', x: 'X', wechat: '公众号', tophub: '热榜', github: 'GitHub', x_bookmark: 'X书签', manual: '手动'
}

function relTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z')
  const m = Math.floor((Date.now() - d.getTime()) / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m} 分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小时前`
  return `${Math.floor(h / 24)} 天前`
}

// 信息流卡片高度（紧凑密度，标题 + 摘要 + 留白 ≈ 156px 可视区域）
const ITEM_SIZE = 164
// 列表视图行高（卡片式：标签/时间一行 + 标题两行 + 内边距 + 底部间距）
const LIST_ITEM_SIZE = 88

interface RowData {
  items: ItemRow[]
  selectedId: number | null
  mode: 'card' | 'list'
  onSelect: (id: number) => void
  onOpen: (url: string) => void
  onToggleRead: (id: number) => void
  onLater: (id: number) => void
  onFavorite: (id: number) => void
  onDelete: (id: number) => void
}

function Row({ index, style, data }: ListChildComponentProps<RowData>) {
  const item = data.items[index]
  const later = item.status === 'later'
  const fav = item.status === 'favorite'
  const read = item.is_read === 1
  const stop = (e: React.MouseEvent) => { e.stopPropagation() }

  const open = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); data.onOpen(item.url) }
  const toggleRead = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); data.onToggleRead(item.id) }
  const laterFn = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); data.onLater(item.id) }
  const favFn = (e: React.PointerEvent) => { e.stopPropagation(); e.preventDefault(); data.onFavorite(item.id) }
  const del = (e: React.PointerEvent) => {
    e.stopPropagation(); e.preventDefault()
    data.onDelete(item.id)
  }

  const dragProps = {
    draggable: true,
    onDragStart: (e: React.DragEvent) => { e.dataTransfer.setData('application/x-item-id', String(item.id)); e.dataTransfer.effectAllowed = 'copy' }
  }

  // 列表视图：卡片式紧凑展示（标签 + 时间一行，标题两行），不显示描述
  if (data.mode === 'list') {
    return (
      <div style={style}>
        <div
          className={`list-row beam-border ${data.selectedId === item.id ? 'selected' : ''} ${read ? '' : 'unread'}`}
          {...dragProps}
          {...press(() => data.onSelect(item.id))}>
          <div className="list-top">
            <span className={`list-badge ${item.source_type}`}>{SOURCE_LABEL[item.source_type]}</span>
            <span className="list-time">{relTime(item.published_at || item.fetched_at)}</span>
          </div>
          <div className="list-title">{item.title}</div>
          <div className="list-actions" onClick={stop} onDragStart={stop}>
            <button className="act" data-act="open" title="用系统默认浏览器打开" onPointerDown={open} onClick={stop}><Icon name="external" size={14} /></button>
            <button className={`act ${read ? 'on' : ''}`} data-act="read" title={read ? '标记为未读' : '标记为已读'} onPointerDown={toggleRead} onClick={stop}><Icon name="check" size={14} /></button>
            <button className={`act ${later ? 'on' : ''}`} data-act="later" title="稍后读" onPointerDown={laterFn} onClick={stop}><Icon name="later" size={14} /></button>
            <button className={`act ${fav ? 'on' : ''}`} data-act="fav" title="收藏" onPointerDown={favFn} onClick={stop}><Icon name="favorite" size={14} fill={fav ? 'currentColor' : 'none'} /></button>
            <button className="act danger" title="删除" onPointerDown={del} onClick={stop}><Icon name="trash" size={14} /></button>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div style={style}>
        <div
          className={`card beam-border ${data.selectedId === item.id ? 'selected' : ''} ${read ? '' : 'unread'}`}
          {...dragProps}
          {...press(() => data.onSelect(item.id))}>
          <div className="card-meta">
            <span className={`badge ${item.source_type}`}>
              {SOURCE_LABEL[item.source_type]} · {item.source_name}
            </span>
            <span className="card-time">{relTime(item.published_at || item.fetched_at)}</span>
          </div>
          <p className="card-title">{item.title}</p>
          {item.summary && <p className="card-summary">{plainTextFromHtml(item.summary)}</p>}

          <div className="card-actions" onClick={stop} onDragStart={stop}>
            <button className="act" data-act="open" title="用系统默认浏览器打开" onPointerDown={open} onClick={stop}><Icon name="external" size={15} /></button>
            <button className={`act ${read ? 'on' : ''}`} data-act="read" title={read ? '标记为未读' : '标记为已读'} onPointerDown={toggleRead} onClick={stop}><Icon name="check" size={15} /></button>
            <button className={`act ${later ? 'on' : ''}`} data-act="later" title="稍后读" onPointerDown={laterFn} onClick={stop}><Icon name="later" size={15} /></button>
            <button className={`act ${fav ? 'on' : ''}`} data-act="fav" title="收藏" onPointerDown={favFn} onClick={stop}><Icon name="favorite" size={15} fill={fav ? 'currentColor' : 'none'} /></button>
            <button className="act danger" title="删除" onPointerDown={del} onClick={stop}><Icon name="trash" size={15} /></button>
          </div>
        </div>
      </div>
  )
}

export function ItemList() {
  const { items, selectedId, select, view, activeSourceType, markAllRead, clearInbox, showToast,
    openInBrowser, toggleRead, setStatus, deleteItem, feeds, itemsLoadingMore, itemsDone, loadMoreItems } = useStore()
  const viewLabel = { rss: 'RSS', podcast: '播客', video: '视频', later: '稍后读', favorite: '已收藏', archived: '归档', all: '全部条目' }[view]
  const sourceLabelMap: Record<string, string> = { github: 'GitHub ★', x_bookmark: 'Twitter 书签' }
  const headerLabel = activeSourceType ? (sourceLabelMap[activeSourceType] || SOURCE_LABEL[activeSourceType] || '来源') : viewLabel

  // 订阅源抓取失败（error_count>0）时，RSS 空状态提示「无法获取数据」并列出真实原因，而非一长串引导文案
  const rssErrFeeds = feeds.filter((f) => f.error_count > 0 && f.type === 'rss')
  const showFetchError = view === 'rss' && !activeSourceType && rssErrFeeds.length > 0
  const emptyTitle = view === 'rss' ? 'RSS 为空' : '暂无条目'
  const emptyHint = view === 'rss'
    ? '按 N 收集一个链接，或左侧「来源管理」添加订阅源。'
    : '当前视图没有条目。'

  const wrapRef = useRef<HTMLDivElement>(null)
  const scrollTimerRef = useRef<number>(0)
  const [height, setHeight] = useState(400)
  const [listMode, setListMode] = useState<'card' | 'list'>('card')
  useEffect(() => {
    // 读取持久化的列表视图模式（card 默认 / list 紧凑）
    void (window.capybara.invoke('settings:get', 'list_mode') as Promise<string>).then((r) => { if (r === 'list') setListMode('list') })
  }, [])
  const setListModeAndPersist = (m: 'card' | 'list') => {
    setListMode(m)
    void window.capybara.invoke('settings:set', 'list_mode', m)
  }
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => { setHeight(Math.max(120, entries[0].contentRect.height)) })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 底部状态栏高度（与列表分离，始终可见，提示翻页进度）
  const FOOTER_H = 44
  const listHeight = Math.max(80, height - FOOTER_H)

  // 滚动到底部阈值内即触发加载下一页（FOUC 无关，纯翻页）
  const onListScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    // 滚动期间显示滚动条 thumb（配合 CSS 自动隐藏，停止 900ms 后淡出）
    const el = wrapRef.current
    if (el) {
      el.classList.add('is-scrolling')
      window.clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = window.setTimeout(() => el.classList.remove('is-scrolling'), 900)
    }
    if (itemsDone || itemsLoadingMore || items.length === 0) return
    const rowH = listMode === 'list' ? LIST_ITEM_SIZE : ITEM_SIZE
    const total = items.length * rowH
    if (scrollOffset + listHeight >= total - rowH * 0.8) void loadMoreItems()
  }

  const onClear = () => {
    if (view !== 'rss') { showToast('仅「RSS」可清空'); return }
    void clearInbox()
  }

  const rowData: RowData = {
    items, selectedId, mode: listMode,
    onSelect: (id) => select(id, { click: true }),
    onOpen: (url) => openInBrowser(url),
    onToggleRead: (id) => void toggleRead(id),
    onLater: (id) => void setStatus(id, 'later'),
    onFavorite: (id) => void setStatus(id, 'favorite'),
    onDelete: (id) => void deleteItem(id)
  }

  return (
    <section className="feed">
      <div className="feed-header">
        <span className="title">{headerLabel}</span>
        <div className="feed-right">
          <span className="feed-actions">
            <div className="view-toggle">
              <button
                className={listMode === 'card' ? 'active' : ''}
                title="卡片视图"
                {...pressBtn(() => setListModeAndPersist('card'))}>
                <Icon name="board" size={15} />
              </button>
              <button
                className={listMode === 'list' ? 'active' : ''}
                title="列表视图"
                {...pressBtn(() => setListModeAndPersist('list'))}>
                <Icon name="list" size={15} />
              </button>
            </div>
            {(view === 'rss' || view === 'podcast' || view === 'video') && (
              <>
                <button className="mini" title={`把${viewLabel}未读全部标为已读`} {...pressBtn(() => void markAllRead(view))}>
                  <Icon name="check" size={13} /> 标为已读
                </button>
                {view === 'rss' && (
                  <button className="mini" title="清空 RSS（保留收藏与白板引用）" {...pressBtn(() => onClear())}>
                    <Icon name="trash" size={13} /> 清空
                  </button>
                )}
              </>
            )}
          </span>
        </div>
      </div>
      <div className="feed-list" ref={wrapRef}>
        {items.length === 0 ? (
          showFetchError ? (
            <div className="empty">
              <p className="empty-title">无法获取数据</p>
              <p>以下订阅源抓取失败，请检查网络或源地址：</p>
              <ul className="err-list">
                {rssErrFeeds.map((f) => (
                  <li key={f.id}><b>{f.name || f.url}</b>：{f.last_error || '未知错误'}</li>
                ))}
              </ul>
              <p className="src-hint">可在「来源管理」手动刷新单个源，或检查是否需要代理 / VPN。</p>
            </div>
          ) : (
            <div className="empty">
              <p className="empty-title">{emptyTitle}</p>
              <p>{emptyHint}</p>
            </div>
          )
        ) : (
          <>
            <FixedSizeList
              height={listHeight}
              width="100%"
              itemCount={items.length}
              itemSize={listMode === 'list' ? LIST_ITEM_SIZE : ITEM_SIZE}
              itemData={rowData}
              overscanCount={6}
              onScroll={onListScroll}
            >
              {Row}
            </FixedSizeList>
            <div className="feed-footer">
              {itemsLoadingMore
                ? <><span className="spin" /> 加载中…</>
                : itemsDone
                  ? `已显示全部 ${items.length} 条`
                  : `已显示 ${items.length} 条 · 滚动到底部加载更多`}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
