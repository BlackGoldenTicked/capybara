import { Fragment, useEffect, useState } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'
import type { MediaKind } from '../env'

type RssMethod = 'add' | 'import'

const KIND_LABEL: Record<MediaKind, string> = { article: '图文', podcast: '播客', video: '视频' }

/**
 * 来源管理 — 3 类分区卡片：
 *   1) RSS：手动添加 / OPML 导入 + 已订阅列表
 *   2) GitHub Star：用户名 + Token + 拉取
 *   3) Twitter 收藏：导入书签文件
 */
export function SourceManager() {
  const { feeds, addFeed, deleteFeed, refreshFeed, fetchGithubStars, importTwitterBookmarks, showToast } = useStore()
  // ===== RSS =====
  const [rssMethod, setRssMethod] = useState<RssMethod>('add')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [schedule, setSchedule] = useState(120)
  const [kind, setKind] = useState<MediaKind>('article')
  const [opmlMsg, setOpmlMsg] = useState('')
  // ===== GitHub Star =====
  const [tokenInput, setTokenInput] = useState('')
  const [tokenSaved, setTokenSaved] = useState('')
  const [ghUser, setGhUser] = useState('')
  const [ghMsg, setGhMsg] = useState('')
  // ===== Twitter 收藏 =====
  const [twMsg, setTwMsg] = useState('')

  useEffect(() => {
    void (window.readflow.invoke('settings:get', 'github_stars_user') as Promise<string>).then((r) => setGhUser(r || ''))
    void (window.readflow.invoke('settings:get', 'github_token') as Promise<string>).then((r) => setTokenSaved(r ? '1' : ''))
  }, [])

  // ===== RSS =====
  const submit = async () => {
    if (!url.trim()) { showToast('请填写 RSS 地址'); return }
    const finalName = name.trim() || url.trim()
    try {
      await addFeed('rss', finalName, url.trim(), schedule, kind)
      showToast('已添加「' + finalName + '」，正在抓取…')
    } catch (e) { showToast('添加失败：' + (e as Error).message) }
    setName(''); setUrl(''); setSchedule(120); setKind('article')
  }
  const importOpml = async () => {
    setOpmlMsg('选择文件中…')
    try {
      const r = await window.readflow.invoke('feeds:importOpml') as { added: number; skipped: number; total: number }
      if (r.total === 0) { setOpmlMsg('已取消或未选择文件'); return }
      await useStore.getState().loadFeeds()
      setOpmlMsg(`导入完成：新增 ${r.added} 个，跳过已存在 ${r.skipped} 个（共 ${r.total}）`)
    } catch (e) { setOpmlMsg('失败：' + (e as Error).message) }
  }

  // ===== GitHub Star =====
  const saveToken = async () => {
    await window.readflow.invoke('settings:set', 'github_token', tokenInput)
    await window.readflow.invoke('settings:set', 'github_stars_user', ghUser)
    setTokenSaved(tokenInput ? '1' : ''); setTokenInput('')
    setGhMsg('已保存 Token 与用户名')
  }
  const fetchStars = async () => {
    if (!ghUser.trim()) { setGhMsg('请填写 GitHub 用户名'); return }
    setGhMsg('拉取中…')
    try {
      const r = await fetchGithubStars(ghUser.trim())
      setGhMsg(`已拉取 ${r.total} 个 star，新增 ${r.added} 条`)
      showToast('GitHub ★ 已更新')
    } catch (e) { setGhMsg('失败：' + (e as Error).message) }
  }

  // ===== Twitter 收藏 =====
  const importBookmarks = async () => {
    setTwMsg('选择文件中…')
    try {
      const r = await importTwitterBookmarks()
      if (r.total === 0) { setTwMsg('已取消或未选择文件'); return }
      setTwMsg(`导入完成：新增 ${r.added} / 共 ${r.total} 条书签`)
      showToast('Twitter 书签已更新')
    } catch (e) { setTwMsg('失败：' + (e as Error).message) }
  }

  const rssCount = feeds.filter((f) => f.type === 'rss' || f.type === 'tophub').length
  const [errId, setErrId] = useState<number | null>(null)

  return (
    <section className="sources">
      <div className="feed-header"><span className="title">来源管理</span><span className="keys">图文 / 播客 / 视频 / GitHub Star / Twitter 收藏</span></div>
      <div className="sources-body">

        <div className="set-card">
          <p className="src-label">RSS 订阅</p>

          <div className="src-3way">
            <div className="seg seg-2way">
              <button className={`seg-btn ${rssMethod === 'add' ? 'active' : ''}`} onClick={() => setRssMethod('add')}>
                <Icon name="plus" size={13} /> 手动添加
              </button>
              <button className={`seg-btn ${rssMethod === 'import' ? 'active' : ''}`} onClick={() => setRssMethod('import')}>
                <Icon name="upload" size={13} /> 导入 OPML
              </button>
            </div>
          </div>

          {rssMethod === 'add' && (
            <div className="src-form">
              <div className="src-field">
                <label htmlFor="rss-name">源名称</label>
                <input id="rss-name" placeholder="如：前端周刊" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="src-field">
                <label htmlFor="rss-url">URL</label>
                <input id="rss-url" placeholder="RSS feed 地址" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <div className="src-field">
                <label>内容类型</label>
                <div className="seg seg-3way">
                  <button type="button" className={`seg-btn ${kind === 'article' ? 'active' : ''}`} onClick={() => setKind('article')}>图文</button>
                  <button type="button" className={`seg-btn ${kind === 'podcast' ? 'active' : ''}`} onClick={() => setKind('podcast')}>播客</button>
                  <button type="button" className={`seg-btn ${kind === 'video' ? 'active' : ''}`} onClick={() => setKind('video')}>视频</button>
                </div>
              </div>
              <div className="src-field">
                <label htmlFor="rss-schedule">刷新频率</label>
                <div className="src-field-cell">
                  <span className="src-unit">每</span>
                  <input id="rss-schedule" type="number" min={5} value={schedule} onChange={(e) => setSchedule(Number(e.target.value))} className="src-num" />
                  <span className="src-unit">分钟</span>
                </div>
              </div>
              <div className="src-field src-actions-field">
                <div aria-hidden="true" />
                <div className="src-actions">
                  <button onClick={() => void submit()}>添加</button>
                </div>
              </div>
            </div>
          )}

          {rssMethod === 'import' && (
            <div className="src-form">
              <p className="src-hint">支持 OPML / XML 格式；按 url 去重，不会重复添加已有源。</p>
              <div className="src-actions">
                <button onClick={() => void importOpml()}><Icon name="inbox" size={13} /> 选择 OPML 文件</button>
                <span className="src-hint">{opmlMsg}</span>
              </div>
            </div>
          )}
        </div>

        {/* ===== 已订阅（按 图文/播客/视频 分组） ===== */}
        <div className="set-card">
          <p className="src-label">已订阅（{rssCount}）</p>
          {feeds.length === 0 && <p className="src-hint">暂无订阅源。手动粘贴 RSS feed 地址或导入 OPML 文件开始订阅。</p>}
          {(['article', 'podcast', 'video'] as MediaKind[]).map((k) => {
            const group = feeds.filter((f) => (f.kind ?? 'article') === k)
            if (group.length === 0) return null
            return (
              <Fragment key={k}>
                <p className="src-group-label">{KIND_LABEL[k]}（{group.length}）</p>
                {group.map((f) => (
                  <div key={f.id} className="feed-row">
                    <span className={`badge ${f.kind ?? 'article'}`}>{KIND_LABEL[f.kind ?? 'article']}</span>
                    <span className="fr-name">{f.name || f.url}</span>
                    <span className="fr-state" title={f.error_count > 0 ? (f.last_error || '未知错误') : ''} style={f.error_count > 0 ? { color: 'var(--card-accent)' } : undefined}>{f.error_count > 0 ? (f.last_error || '无法获取数据') : (f.last_fetched_at ? '正常' : '未抓取')}</span>
                    {f.error_count > 0 && (
                      <span className="feed-err-wrap">
                        <button className="feed-err-info" title="查看错误详情" aria-label="查看错误详情"
                          onClick={() => setErrId(errId === f.id ? null : f.id)}>
                          <Icon name="info" size={14} />
                        </button>
                        {errId === f.id && (
                          <div className="feed-err-pop" onClick={(e) => e.stopPropagation()}>
                            <div className="feed-err-head">
                              <span>抓取错误详情</span>
                              <button className="feed-err-x" onClick={() => setErrId(null)}>×</button>
                            </div>
                            <div className="feed-err-row"><span className="feed-err-k">源名称</span><span className="feed-err-v">{f.name || f.url}</span></div>
                            <div className="feed-err-row"><span className="feed-err-k">URL</span><span className="feed-err-v feed-err-url">{f.url}</span></div>
                            <div className="feed-err-row"><span className="feed-err-k">失败次数</span><span className="feed-err-v">{f.error_count}</span></div>
                            <div className="feed-err-row"><span className="feed-err-k">最后抓取</span><span className="feed-err-v">{f.last_fetched_at || '—'}</span></div>
                            <div className="feed-err-msg">{f.last_error || '（无具体错误信息）'}</div>
                          </div>
                        )}
                      </span>
                    )}
                    <button onClick={() => void refreshFeed(f.id)}>刷新</button>
                    <button onClick={() => void deleteFeed(f.id)}>删除</button>
                  </div>
                ))}
              </Fragment>
            )
          })}
        </div>

        {/* ===== GitHub Star ===== */}
        <div className="set-card">
          <p className="src-label">GitHub Star</p>
          <p className="src-hint">填入 GitHub 用户名，拉取你 starred 的仓库作为阅读条目（公开 API 约 60 次/小时，填入 Token 可提升额度）。</p>
          <div className="src-grid-2">
            <div className="src-field">
              <label htmlFor="github-user">用户名</label>
              <input id="github-user" placeholder="例如 torvalds" value={ghUser} onChange={(e) => setGhUser(e.target.value)} />
            </div>
            <div className="src-field">
              <label htmlFor="github-token">GitHub Token</label>
              <input id="github-token" type="password" placeholder="ghp_...（可选）" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
            </div>
          </div>
          <div className="src-field src-actions-field">
            <div aria-hidden="true" />
            <div className="src-actions">
              <button onClick={() => void saveToken()}>保存配置</button>
              <button onClick={() => void fetchStars()}><Icon name="github" size={14} /> 拉取 Star</button>
              <span className="src-hint src-grow">{ghMsg || (tokenSaved ? '已设置 Token' : '未设置 Token（公开 API 速率较低）')}</span>
            </div>
          </div>
        </div>

        {/* ===== Twitter 收藏 ===== */}
        <div className="set-card">
          <p className="src-label">Twitter 收藏</p>
          <p className="src-hint">X 官方 API 读取书签需付费 OAuth 凭证，本地无法实时拉取。请从 X 导出书签文件后在此导入。支持 JSON 数组或 CSV（含 url / text / author / created_at 等字段）。</p>
          <div className="src-actions">
            <button onClick={() => void importBookmarks()}><Icon name="twitter" size={14} /> 导入书签文件</button>
            <span className="src-hint src-grow">{twMsg}</span>
          </div>
        </div>

      </div>
    </section>
  )
}
