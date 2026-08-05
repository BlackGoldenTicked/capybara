import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { RepoInfo } from '../env'
import { Icon } from './icons'

/**
 * 发现 RSS 页面（极简版）：
 * - 进入页面自动用合并查询（去重）一次性获取全部 RSS 分享仓库
 * - 卡片可点击展开 → 显示 README 解析出的 RSS 源
 * - 正常模式：每条 feed 行可点击直接添加（无显眼按钮）
 * - 开发者模式：额外显示「添加 / 全部添加」按钮 + feed 原始 URL（诊断用）
 * - 容器 max-width 640px 自适应，避免极宽屏被拉成单条
 */
const ALL_QUERIES = [
  'awesome rss feed list',
  'RSS 订阅源 清单',
  'all rss feeds collection',
  'topic:rss awesome'
]

export function DiscoverView() {
  const { feeds, discoverRepos, discoverFeeds, discoverLoading, discoverFeedsLoading, discoverSearch, loadRepoFeeds, addDiscoveredFeed, addAllDiscovered, developerMode } = useStore()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [autoLoaded, setAutoLoaded] = useState(false)

  // 进入页面自动拉取所有预设查询（去重合并）
  useEffect(() => {
    if (autoLoaded) return
    setAutoLoaded(true)
    void fetchAll()
  }, [autoLoaded])

  const fetchAll = async () => {
    useStore.setState({ discoverLoading: true })
    const all: RepoInfo[] = []
    const seen = new Set<string>()
    try {
      for (const q of ALL_QUERIES) {
        try {
          const repos = await window.readflow.invoke('discover:repos', q) as RepoInfo[]
          for (const r of repos) if (!seen.has(r.full_name)) { seen.add(r.full_name); all.push(r) }
        } catch { /* 单个查询失败不阻塞其它 */ }
      }
    } finally {
      useStore.setState({ discoverRepos: all, discoverLoading: false })
    }
  }

  const search = async () => {
    if (!query.trim()) return
    await discoverSearch(query.trim())
    // 合并到现有列表
    const existing = useStore.getState().discoverRepos
    const seen = new Set(existing.map((r) => r.full_name))
    const merged = [...existing]
    for (const r of useStore.getState().discoverRepos) if (!seen.has(r.full_name)) merged.push(r)
    useStore.setState({ discoverRepos: merged })
  }

  const addedUrls = new Set(feeds.map((f) => f.url))

  return (
    <section className="discover">
      <div className="feed-header">
        <span className="title">RSS 发现 · 来自 GitHub 高星仓库</span>
        <span className="keys">自动汇总全部 RSS 分享仓库</span>
      </div>

      <div className="disc-toolbar">
        <div className="disc-search">
          <input placeholder="追加搜索（如：awesome rss）" value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') search() }} />
          <button onClick={search}>搜索</button>
        </div>
      </div>

      {discoverLoading && (
        <div className="repo-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="repo-card repo-skel">
              <div className="sk-line w60" />
              <div className="sk-line w90 mt8" />
              <div className="sk-line w50 mt12" />
            </div>
          ))}
        </div>
      )}
      {!discoverLoading && discoverRepos.length === 0 && (
        <div className="disc-empty">正在抓取全部 RSS 分享仓库，请稍候。<br />（未登录 GitHub API 速率约 10 次/分钟）</div>
      )}

      {!discoverLoading && discoverRepos.length > 0 && (
        <div className="repo-grid">
          {discoverRepos.map((repo) => (
            <RepoCard key={repo.full_name} repo={repo} feeds={discoverFeeds[repo.full_name] || []}
              loading={discoverFeedsLoading === repo.full_name}
              open={!!expanded[repo.full_name]}
              addedUrls={addedUrls}
              developerMode={developerMode}
              onToggle={() => {
                const willOpen = !expanded[repo.full_name]
                setExpanded((e) => ({ ...e, [repo.full_name]: willOpen }))
                if (willOpen && !discoverFeeds[repo.full_name]) void loadRepoFeeds(repo)
                else useStore.setState({ activeFeed: repo.full_name })
              }}
              onAdd={(u, t) => void addDiscoveredFeed(u, t)}
              onAddAll={() => void addAllDiscovered(repo.full_name)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function RepoCard({ repo, feeds, loading, open, addedUrls, developerMode, onToggle, onAdd, onAddAll }: {
  repo: RepoInfo
  feeds: { url: string; title: string }[]
  loading: boolean
  open: boolean
  addedUrls: Set<string>
  developerMode: boolean
  onToggle: () => void
  onAdd: (url: string, title: string) => void
  onAddAll: () => void
}) {
  const starTxt = repo.stargazers_count >= 1000 ? (repo.stargazers_count / 1000).toFixed(1) + 'k' : String(repo.stargazers_count)
  return (
    <div className={`repo-card ${open ? 'open' : ''}`}>
      <div className="repo-head" onClick={onToggle}>
        <div className="repo-main">
          <div className="repo-name">{repo.name || repo.full_name}<span className="repo-owner"> / {repo.owner}</span></div>
          <div className="repo-desc">{repo.description || '（无描述）'}</div>
          <div className="repo-meta">
            <span className="star"><Icon name="favorite" size={13} /> {starTxt}</span>
            {repo.language && <span className="lang">{repo.language}</span>}
            {developerMode && (
              <a href={repo.html_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                <Icon name="external" size={12} /> 在 GitHub 打开
              </a>
            )}
          </div>
        </div>
        <div className="repo-caret"><Icon name={open ? 'chevronDown' : 'chevronRight'} size={16} /></div>
      </div>

      {open && (
        <div className="repo-feeds">
          {loading && <div className="disc-loading small">正在解析 README 中的订阅源…</div>}
          {!loading && feeds.length === 0 && <div className="disc-empty small">该仓库 README 中未发现可识别的 RSS 源。</div>}
          {!loading && feeds.length > 0 && (
            <>
              {/* 开发者模式：显示「全部添加」批量按钮；正常模式隐藏（单条直接点 feed 行添加） */}
              {developerMode && (
                <div className="repo-feeds-bar">
                  <span>共 {feeds.length} 个订阅源</span>
                  <button className="chip add-all" onClick={onAddAll}><Icon name="plus" size={13} /> 全部添加</button>
                </div>
              )}
              <div className="feed-rows">
                {feeds.map((f) => {
                  const added = addedUrls.has(f.url)
                  return (
                    <div key={f.url} className={`feed-row2 ${added ? 'added' : ''}`}
                      // 正常模式：直接点行就添加（无按钮）；开发者模式：行展开显示「添加」按钮
                      onClick={developerMode ? undefined : () => !added && onAdd(f.url, f.title)}
                      role={developerMode ? undefined : 'button'}
                      tabIndex={developerMode ? -1 : 0}>
                      <div className="feed-info">
                        <div className="feed-title">{f.title}</div>
                        {developerMode
                          ? <div className="feed-url">{f.url}</div>
                          : <div className="feed-host">{(() => { try { return new URL(f.url).hostname.replace(/^www\./, '') } catch { return f.url } })()}</div>}
                      </div>
                      {developerMode && (
                        <button className="chip add-one" disabled={added}
                          onClick={(e) => { e.stopPropagation(); onAdd(f.url, f.title) }}>
                          {added ? '已添加' : <><Icon name="plus" size={13} /> 添加</>}
                        </button>
                      )}
                      {!developerMode && (added ? <span className="feed-mark">已添加</span> : <span className="feed-mark hint">点击添加</span>)}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
