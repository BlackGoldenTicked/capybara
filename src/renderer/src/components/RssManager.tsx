import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { Feed } from '../env'
import { Icon } from './icons'

const PAGE_SIZE = 100

export function RssManager() {
  const { feeds, addFeed, deleteFeed, refreshFeed, showToast } = useStore()
  const [rssMethod, setRssMethod] = useState<'add' | 'import'>('add')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [schedule, setSchedule] = useState(120)
  const [opmlMsg, setOpmlMsg] = useState('')
  const [validating, setValidating] = useState(false)

  // 分页
  const [page, setPage] = useState(0)
  const [totalFeeds, setTotalFeeds] = useState(0)
  const [pagedFeeds, setPagedFeeds] = useState<Feed[]>([])
  const totalPages = Math.ceil(totalFeeds / PAGE_SIZE)

  const loadPage = async (p: number) => {
    const [list, count] = await Promise.all([
      window.readflow.invoke('feeds:listPage', p, PAGE_SIZE) as Promise<Feed[]>,
      window.readflow.invoke('feeds:count') as Promise<number>
    ])
    setPagedFeeds(list)
    setTotalFeeds(count)
  }

  useEffect(() => { void loadPage(0) }, [feeds.length])

  const submit = async () => {
    if (!url.trim()) { showToast('请填写 RSS 地址'); return }
    setValidating(true)
    try {
      const v = await window.readflow.invoke('feeds:validate', url.trim()) as { valid: boolean; title?: string; error?: string }
      if (!v.valid) { showToast('验证失败：' + (v.error || '无法解析')); return }
      const finalName = name.trim() || v.title || url.trim()
      await addFeed('rss', finalName, url.trim(), schedule)
      showToast('已添加「' + finalName + '」')
      setName(''); setUrl(''); setSchedule(120); setPage(0)
      void loadPage(0)
    } catch (e) { showToast('添加失败：' + (e as Error).message) }
    finally { setValidating(false) }
  }

  const importOpml = async () => {
    setOpmlMsg('选择文件中…')
    try {
      const r = await window.readflow.invoke('feeds:importOpml') as { added: number; skipped: number; total: number }
      if (r.total === 0) { setOpmlMsg('已取消或未选择文件'); return }
      await useStore.getState().loadFeeds()
      setOpmlMsg(`导入完成：新增 ${r.added} / 跳过重复 ${r.skipped}（共 ${r.total}）`)
      void loadPage(page)
    } catch (e) { setOpmlMsg('失败：' + (e as Error).message) }
  }

  const [errId, setErrId] = useState<number | null>(null)

  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">RSS 订阅管理</p>
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
              <label htmlFor="rss-name">源名称（可选，留空自动识别）</label>
              <input id="rss-name" placeholder="如：前端周刊" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="src-field">
              <label htmlFor="rss-url">URL</label>
              <input id="rss-url" placeholder="RSS feed 地址" value={url} onChange={(e) => setUrl(e.target.value)} />
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
                <button onClick={() => void submit()} disabled={validating}>{validating ? '验证中…' : '添加'}</button>
              </div>
            </div>
          </div>
        )}

        {rssMethod === 'import' && (
          <div className="src-form">
            <p className="src-hint">支持 OPML / XML 格式。导入时自动验证，无效源跳过，已存在的不重复添加。</p>
            <div className="src-actions">
              <button onClick={() => void importOpml()}><Icon name="inbox" size={13} /> 选择 OPML 文件</button>
              <span className="src-hint">{opmlMsg}</span>
            </div>
          </div>
        )}
      </div>

      {/* 已订阅列表（分页） */}
      <div className="set-card">
        <p className="src-label">已订阅（{totalFeeds}）</p>
        {pagedFeeds.length === 0 && <p className="src-hint">暂无订阅源。手动粘贴 RSS feed 地址或导入 OPML 文件。</p>}
        {pagedFeeds.map((f) => (
          <div key={f.id} className="feed-row">
            <span className={`badge ${f.type}`}>{f.type}</span>
            <span className="fr-name">{f.name || f.url}</span>
            <span className="fr-state" title={f.error_count > 0 ? (f.last_error || '未知错误') : ''} style={f.error_count > 0 ? { color: 'var(--card-accent)' } : undefined}>{f.error_count > 0 ? (f.last_error || '错误') : (f.last_fetched_at ? '正常' : '未抓取')}</span>
            {f.error_count > 0 && (
              <span className="feed-err-wrap">
                <button className="feed-err-info" title="查看错误详情" onClick={() => setErrId(errId === f.id ? null : f.id)}>
                  <Icon name="info" size={14} />
                </button>
                {errId === f.id && (
                  <div className="feed-err-pop" onClick={(e) => e.stopPropagation()}>
                    <div className="feed-err-head"><span>抓取错误详情</span><button className="feed-err-x" onClick={() => setErrId(null)}>×</button></div>
                    <div className="feed-err-row"><span className="feed-err-k">源名称</span><span className="feed-err-v">{f.name || f.url}</span></div>
                    <div className="feed-err-row"><span className="feed-err-k">URL</span><span className="feed-err-v feed-err-url">{f.url}</span></div>
                    <div className="feed-err-row"><span className="feed-err-k">失败次数</span><span className="feed-err-v">{f.error_count}</span></div>
                    <div className="feed-err-msg">{f.last_error || '（无具体错误信息）'}</div>
                  </div>
                )}
              </span>
            )}
            <button onClick={() => void refreshFeed(f.id)}>刷新</button>
            <button onClick={() => { void deleteFeed(f.id); void loadPage(page) }}>删除</button>
          </div>
        ))}
        {totalPages > 1 && (
          <div className="feed-pager">
            <button disabled={page <= 0} onClick={() => { const p = page - 1; setPage(p); void loadPage(p) }}>上一页</button>
            <span>{page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => { const p = page + 1; setPage(p); void loadPage(p) }}>下一页</button>
          </div>
        )}
      </div>
    </div>
  )
}
