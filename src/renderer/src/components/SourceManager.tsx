import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'

type RssMethod = 'add' | 'discover' | 'import'

/**
 * 来源管理 — 整合为 4 类分区卡片：
 *   1) RSS：三个平级操作（添加 / 选择 RSS 源 / 导入）+ 已订阅列表紧跟其后
 *   2) GitHub Star：用户名 + Token + 拉取
 *   3) Twitter 收藏：导入书签文件
 *   4) 已订阅（跨 RSS / 热榜）
 */
export function SourceManager({ onOpenDiscover }: { onOpenDiscover?: () => void }) {
  const { feeds, addFeed, deleteFeed, refreshFeed, fetchGithubStars, importTwitterBookmarks, showToast } = useStore()
  // ===== RSS =====
  const [rssMethod, setRssMethod] = useState<RssMethod>('add')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [schedule, setSchedule] = useState(120)
  const [opmlMsg, setOpmlMsg] = useState('')
  // ===== GitHub Star =====
  const [tokenInput, setTokenInput] = useState('')
  const [tokenSaved, setTokenSaved] = useState('')
  const [ghUser, setGhUser] = useState('')
  const [ghMsg, setGhMsg] = useState('')
  // ===== Twitter 收藏 =====
  const [twMsg, setTwMsg] = useState('')

  // 读取设置
  useEffect(() => {
    void (window.readflow.invoke('settings:get', 'github_stars_user') as Promise<string>).then((r) => setGhUser(r || ''))
    void (window.readflow.invoke('settings:get', 'github_token') as Promise<string>).then((r) => setTokenSaved(r ? '1' : ''))
  }, [])

  // ===== RSS =====
  const submit = async () => {
    if (!url || !name) return
    await addFeed('rss', name, url, schedule)
    setName(''); setUrl(''); setSchedule(120)
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

  return (
    <section className="sources">
      <div className="feed-header"><span className="title">来源管理</span><span className="keys">RSS / GitHub Star / Twitter 收藏</span></div>
      <div className="sources-body">

        {/* ===== RSS 分区：三个平级操作 + 已订阅紧随 ===== */}
        <div className="set-card">
          <p className="src-label">RSS 订阅</p>
          <p className="src-hint">三种方式添加 RSS 源：手动粘贴 URL、从发现页挑选热门仓库分享的源、或从 OPML 批量导入。</p>

          {/* 三个平级操作（用 seg 切换；当前面板的内容随方法切换） */}
          <div className="src-3way">
            <div className="seg seg-3way">
              <button className={`seg-btn ${rssMethod === 'add' ? 'active' : ''}`} onClick={() => setRssMethod('add')}>
                <Icon name="plus" size={13} /> 手动添加
              </button>
              <button className={`seg-btn ${rssMethod === 'discover' ? 'active' : ''}`} onClick={() => { setRssMethod('discover'); onOpenDiscover?.() }}>
                <Icon name="search" size={13} /> 选择 RSS 源
              </button>
              <button className={`seg-btn ${rssMethod === 'import' ? 'active' : ''}`} onClick={() => setRssMethod('import')}>
                <Icon name="upload" size={13} /> 导入 OPML
              </button>
            </div>
          </div>

          {rssMethod === 'add' && (
            <div className="src-form">
              <label className="src-row">源名称
                <input placeholder="如：前端周刊" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="src-row">URL
                <input placeholder="RSS feed 地址" value={url} onChange={(e) => setUrl(e.target.value)} />
              </label>
              <label className="src-row">刷新频率
                <span className="src-unit">每</span>
                <input type="number" min={5} value={schedule} onChange={(e) => setSchedule(Number(e.target.value))} className="src-num" />
                <span className="src-unit">分钟</span>
              </label>
              <div className="src-actions">
                <button onClick={() => void submit()}>添加</button>
              </div>
            </div>
          )}

          {rssMethod === 'discover' && (
            <div className="src-form">
              <p className="src-hint">从 GitHub 高星仓库的 README 抓取分享的 RSS 源，可逐条挑选添加。</p>
              <div className="src-actions">
                <button onClick={() => onOpenDiscover?.()}><Icon name="search" size={13} /> 打开 RSS 发现</button>
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

        {/* ===== 已订阅（紧跟 RSS 区块） ===== */}
        <div className="set-card">
          <p className="src-label">已订阅（{rssCount}）</p>
          {feeds.length === 0 && <p className="src-hint">暂无订阅源。可一键添加：名称「热榜」类型 tophub；或粘贴任意 RSS feed。</p>}
          {feeds.map((f) => (
            <div key={f.id} className="feed-row">
              <span className={`badge ${f.type}`}>{f.type}</span>
              <span className="fr-name">{f.name || f.url}</span>
              <span className="fr-state" title={f.error_count > 0 ? (f.last_error || '未知错误') : ''} style={f.error_count > 0 ? { color: 'var(--card-accent)' } : undefined}>{f.error_count > 0 ? (f.last_error || '无法获取数据') : (f.last_fetched_at ? '正常' : '未抓取')}</span>
              <button onClick={() => void refreshFeed(f.id)}>刷新</button>
              <button onClick={() => void deleteFeed(f.id)}>删除</button>
            </div>
          ))}
        </div>

        {/* ===== GitHub Star 分区 ===== */}
        <div className="set-card">
          <p className="src-label">GitHub Star</p>
          <p className="src-hint">填入 GitHub 用户名，拉取你 starred 的仓库作为阅读条目（公开 API 约 60 次/小时，填入 Token 可提升额度）。</p>
          <div className="src-grid-2">
            <label className="src-row">用户名
              <input placeholder="例如 torvalds" value={ghUser} onChange={(e) => setGhUser(e.target.value)} />
            </label>
            <label className="src-row">GitHub Token
              <input type="password" placeholder="ghp_...（可选）" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
            </label>
          </div>
          <div className="src-actions">
            <button onClick={() => void saveToken()}>保存配置</button>
            <button onClick={() => void fetchStars()}><Icon name="github" size={14} /> 拉取 Star</button>
            <span className="src-hint src-grow">{ghMsg || (tokenSaved ? '已设置 Token' : '未设置 Token（公开 API 速率较低）')}</span>
          </div>
        </div>

        {/* ===== Twitter 收藏 分区 ===== */}
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
