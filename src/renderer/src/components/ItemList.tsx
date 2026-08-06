import { useEffect, useRef, useState } from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import { useStore } from '../store'
import type { ItemRow } from '../env'
import { Icon } from './icons'
import { feedColor } from '../lib/feedColor'

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

// 信息流卡片高度（约普通两倍，留出标题/摘要/操作三行空间，参考 WorkBuddy 卡片密度）
const ITEM_SIZE = 196

interface RowData {
  items: ItemRow[]
  selectedId: number | null
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

  const open = (e: React.MouseEvent) => { stop(e); data.onOpen(item.url) }
  const toggleRead = (e: React.MouseEvent) => { stop(e); data.onToggleRead(item.id) }
  const laterFn = (e: React.MouseEvent) => { stop(e); data.onLater(item.id) }
  const favFn = (e: React.MouseEvent) => { stop(e); data.onFavorite(item.id) }
  const del = (e: React.MouseEvent) => {
    stop(e)
    data.onDelete(item.id)
  }

  return (
    <div style={style}>
      <div
        className={`card ${data.selectedId === item.id ? 'selected' : ''} ${read ? '' : 'unread'}`}
        draggable
        onDragStart={(e) => { e.dataTransfer.setData('application/x-item-id', String(item.id)); e.dataTransfer.effectAllowed = 'copy' }}
        onClick={() => data.onSelect(item.id)}>
        <div className="card-meta">
          <span className={`badge ${item.source_type}`}>
            <span className="src-dot" style={{ background: feedColor(item.source_name) }} />
            {SOURCE_LABEL[item.source_type]} · {item.source_name}
          </span>
          <span className="card-time">{relTime(item.published_at || item.fetched_at)}</span>
        </div>
        <p className="card-title">{item.title}</p>
        {item.summary && <p className="card-summary">{item.summary}</p>}

        <div className="card-actions" onClick={stop} onDragStart={stop}>
          <button className="act" title="用系统默认浏览器打开" onClick={open}><Icon name="external" size={15} /></button>
          <button className={`act ${read ? 'on' : ''}`} title={read ? '标记为未读' : '标记为已读'} onClick={toggleRead}><Icon name="check" size={15} /></button>
          <button className={`act ${later ? 'on' : ''}`} title="稍后读" onClick={laterFn}><Icon name="later" size={15} /></button>
          <button className={`act ${fav ? 'on' : ''}`} title="收藏" onClick={favFn}><Icon name="favorite" size={15} fill={fav ? 'currentColor' : 'none'} /></button>
          <button className="act danger" title="删除" onClick={del}><Icon name="trash" size={15} /></button>
        </div>
      </div>
    </div>
  )
}

export function ItemList() {
  const { items, selectedId, select, view, activeSourceType, markAllRead, clearInbox, showToast,
    openInBrowser, toggleRead, setStatus, deleteItem, feeds, itemsLoadingMore, itemsDone, loadMoreItems } = useStore()
  const viewLabel = { rss: 'RSS', later: '稍后读', favorite: '已收藏', read: '已读', archived: '归档', all: '全部条目' }[view]
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
  const [height, setHeight] = useState(400)
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
    if (itemsDone || itemsLoadingMore || items.length === 0) return
    const total = items.length * ITEM_SIZE
    if (scrollOffset + listHeight >= total - ITEM_SIZE * 0.8) void loadMoreItems()
  }

  const onClear = () => {
    if (view !== 'rss') { showToast('仅「RSS」可清空'); return }
    void clearInbox()
  }

  const rowData: RowData = {
    items, selectedId, onSelect: (id) => select(id, { click: true }),
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
        <span className="feed-actions">
          {view === 'rss' && (
            <>
              <button className="mini" title="把 RSS 未读全部标为已读" onClick={() => void markAllRead(view)}>标为已读</button>
              <button className="mini" title="清空 RSS（保留收藏与白板引用）" onClick={onClear}>清空</button>
            </>
          )}
        </span>
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
              itemSize={ITEM_SIZE}
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
