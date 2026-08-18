import { useState } from 'react'
import { useStore } from '../store'
import type { Feed, MediaKind } from '../env'
import { Icon } from './icons'
import { DiscoverPanel } from './DiscoverPanel'

const KIND_LABEL: Record<MediaKind, string> = { article: '图文', podcast: '播客', video: '视频' }

export function RssManager() {
  const { feeds, addFeed, deleteFeed, refreshFeed, showToast } = useStore()
  const [rssMethod, setRssMethod] = useState<'add' | 'import'>('add')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [schedule, setSchedule] = useState(120)
  const [kind, setKind] = useState<MediaKind>('article')
  const [opmlMsg, setOpmlMsg] = useState('')
  const [validating, setValidating] = useState(false)

  const submit = async () => {
    if (!url.trim()) { showToast('请填写 RSS 地址'); return }
    setValidating(true)
    try {
      const v = await window.readflow.invoke('feeds:validate', url.trim()) as { valid: boolean; title?: string; error?: string }
      if (!v.valid) { showToast('验证失败：' + (v.error || '无法解析')); return }
      const finalName = name.trim() || v.title || url.trim()
      await addFeed('rss', finalName, url.trim(), schedule, kind)
      showToast('已添加「' + finalName + '」')
      setName(''); setUrl(''); setSchedule(120); setKind('article')
    } catch (e) { showToast('添加失败：' + (e as Error).message) }
    finally { setValidating(false) }
  }

  const importOpml = async () => {
    setOpmlMsg('选择文件中…')
    try {
      const r = await window.readflow.invoke('feeds:importOpml', kind) as { added: number; skipped: number; total: number }
      if (r.total === 0) { setOpmlMsg('已取消或未选择文件'); return }
      await useStore.getState().loadFeeds()
      setOpmlMsg(`导入完成：新增 ${r.added} / 跳过重复 ${r.skipped}（共 ${r.total}）`)
    } catch (e) { setOpmlMsg('失败：' + (e as Error).message) }
  }

  const [errId, setErrId] = useState<number | null>(null)

  return (
    <div className="set-scroll">
      <div className="subs-row">
        <div className="set-card">
          <p className="src-label">RSS 订阅管理</p>

        {/* 类型选择：放最前，全宽 segmented，与下方方式选择视觉对齐 */}
        <div className="src-3way">
          <div className="seg seg-3way">
            <button type="button" className={`seg-btn ${kind === 'article' ? 'active' : ''}`} onClick={() => setKind('article')}>图文</button>
            <button type="button" className={`seg-btn ${kind === 'podcast' ? 'active' : ''}`} onClick={() => setKind('podcast')}>播客</button>
            <button type="button" className={`seg-btn ${kind === 'video' ? 'active' : ''}`} onClick={() => setKind('video')}>视频</button>
          </div>
        </div>

        {/* 方式选择 */}
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
              <input id="rss-name" placeholder="chaordex.com" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="src-field">
              <label htmlFor="rss-url">URL</label>
              <input id="rss-url" placeholder="RSS feed 地址" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="src-field">
              <label htmlFor="rss-schedule">刷新频率</label>
              <div className="src-field-cell">
                <input id="rss-schedule" type="number" min={5} value={schedule} onChange={(e) => setSchedule(Number(e.target.value))} className="src-num" />
                <span className="src-unit">分钟</span>
              </div>
            </div>
            <div className="src-field src-actions-field">
              <div aria-hidden="true" />
              <div className="src-actions src-actions-left">
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

      {/* 已订阅列表（单列，与左侧等高，数据过多滚屏） */}
      <div className="set-card">
        <p className="src-label">已订阅（{feeds.length}）</p>
        {feeds.length === 0 && <p className="src-hint">暂无订阅源。手动粘贴 RSS feed 地址或导入 OPML 文件。</p>}
        {feeds.length > 0 && (
          <div className="subs-wrap">
            {feeds.map((f) => (
              <div key={f.id} className="feed-row">
                  <span className={`badge ${f.kind ?? 'article'}`}>{KIND_LABEL[f.kind ?? 'article']}</span>
                  <div className="fr-info">
                    <span className="fr-name">{f.name || f.url}</span>
                    <span className="fr-url">{f.url}</span>
                  </div>
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
                  <button onClick={() => void deleteFeed(f.id)}>删除</button>
                </div>
              ))}
          </div>
        )}
      </div>
      </div>

      {/* 信源发现：从预置源库按角色/分类筛选订阅 */}
      <DiscoverPanel />
    </div>
  )
}
