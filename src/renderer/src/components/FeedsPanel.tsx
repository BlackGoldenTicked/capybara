import { Fragment, useState } from 'react'
import { useStore } from '../store'
import { feedColor } from '../lib/feedColor'
import { Icon } from './icons'
import { press, pressBtn } from '../lib/press'
import type { CSSProperties } from 'react'
import type { MediaKind } from '../env'

const KIND_LABEL: Record<MediaKind, string> = { article: '图文', podcast: '播客', video: '视频' }

/**
 * 订阅源分类栏（第二栏）：按 RSS 订阅源筛选信息流。
 * 每一行末尾放一个刷新 icon（hover 才明显），点击只刷新该源，
 * 失败时显示该源真实的 last_error（hover 看完整）。
 */
export function FeedsPanel({ width = 188 }: { width?: number }) {
  const { feeds, view, activeFeed, setActiveFeed, refreshFeed, refreshAll, deleteFeed, showToast } = useStore()
  // 仅列出 RSS 订阅源（其采集器会把 feed.name 写入 item.source_name，筛选才可靠）；
  // 并根据当前视图过滤内容形态：RSS/播客/视频 菜单只显示对应 kind 的源，其余视图显示全部
  const rssFeeds = feeds.filter((f) => {
    if (f.type !== 'rss') return false
    const kind = f.kind ?? 'article'
    if (view === 'rss') return kind === 'article'
    if (view === 'podcast') return kind === 'podcast'
    if (view === 'video') return kind === 'video'
    return true
  })

  const style: CSSProperties = { width, flexShrink: 0 }
  const [refreshingId, setRefreshingId] = useState<number | 'all' | null>(null)
  const refreshOne = async (id: number) => {
    setRefreshingId(id)
    try { await refreshFeed(id) } finally { setRefreshingId(null) }
  }
  const refreshAllFeeds = async () => {
    setRefreshingId('all')
    try { await refreshAll() } finally { setRefreshingId(null) }
  }

  // 取消订阅二次确认
  const [confirmUnsub, setConfirmUnsub] = useState<number | null>(null)
  const handleUnsubscribe = (f: { id: number; name: string; url: string }) => {
    if (confirmUnsub === f.id) {
      void deleteFeed(f.id)
      setConfirmUnsub(null)
      showToast(`已取消订阅「${f.name || f.url}」`)
    } else {
      setConfirmUnsub(f.id)
    }
  }

  return (
    <aside className="feeds-panel" style={style}>
      <div className="feeds-head">
        <span>订阅源</span>
        <button
          className={`feed-refresh-all ${refreshingId === 'all' ? 'spinning' : ''}`}
          title="立即刷新全部源"
          {...pressBtn(() => void refreshAllFeeds())}>
          <Icon name="refresh" size={13} />
        </button>
      </div>
      <div className="feeds-list">
        <button
          className={`feed-item ${activeFeed == null ? 'active' : ''}`}
          {...pressBtn(() => setActiveFeed(null))}>
          <span className="feed-dot all" />
          <span className="feed-name">全部</span>
        </button>
        {(['article', 'podcast', 'video'] as MediaKind[]).map((kind) => {
          const group = rssFeeds.filter((f) => (f.kind ?? 'article') === kind)
          if (group.length === 0) return null
          return (
            <Fragment key={kind}>
              <div className="feeds-group-label">{KIND_LABEL[kind]}</div>
              {group.map((f) => {
                const err = f.error_count > 0
                return (
                  <div
                    key={f.id}
                    className={`feed-item ${activeFeed === f.name ? 'active' : ''} ${err ? 'err' : ''}`}
                    title={err ? `${f.name}\n${f.last_error || '未知错误'}` : f.name}
                    {...press(() => setActiveFeed(activeFeed === f.name ? null : f.name))}>
                    <span className="feed-dot" style={{ background: feedColor(f.name) }} />
                    <span className="feed-name">{f.name}</span>
                    {err && <span className="feed-err-dot" aria-label="抓取失败" />}
                    <button
                      className={`feed-refresh ${refreshingId === f.id ? 'spinning' : ''}`}
                      title="只刷新此源"
                      onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); void refreshOne(f.id) }}
                      onClick={(e) => e.stopPropagation()}>
                      <Icon name="refresh" size={12} />
                    </button>
                    <button
                      className={`feed-unsub ${confirmUnsub === f.id ? 'confirm' : ''}`}
                      title={confirmUnsub === f.id ? '再次点击确认取消订阅' : '取消订阅'}
                      onPointerDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                      onClick={(e) => { e.stopPropagation(); handleUnsubscribe(f) }}
                      onMouseLeave={() => { if (confirmUnsub === f.id) setConfirmUnsub(null) }}>
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                )
              })}
            </Fragment>
          )
        })}
        {rssFeeds.length === 0 && <p className="feeds-empty">暂无 RSS 订阅源</p>}
      </div>
    </aside>
  )
}
