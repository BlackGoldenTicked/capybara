import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import type { DiscoverFeed, DiscoverRole, MediaKind } from '../env'
import { Icon } from './icons'

const PAGE_SIZE = 5
const KIND_LABEL: Record<MediaKind, string> = { article: '图文', podcast: '播客', video: '视频' }

/** 信源发现：从预置 2242 条 RSS 源库按角色/分类筛选，一键订阅 */
export function DiscoverPanel() {
  const { addFeed, showToast } = useStore()

  // 字典
  const [roles, setRoles] = useState<DiscoverRole[]>([])
  const [tags, setTags] = useState<string[]>([])

  // 筛选条件
  const [roleId, setRoleId] = useState(0) // 0 = 全部角色
  const [selTags, setSelTags] = useState<string[]>([])
  const [lang, setLang] = useState<'all' | 'zh' | 'en'>('all')
  const [keyword, setKeyword] = useState('')

  // 结果
  const [rows, setRows] = useState<DiscoverFeed[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [pageInput, setPageInput] = useState('1')
  const [thumbPct, setThumbPct] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // 添加交互：picking = 正在选分类的源 id
  const [picking, setPicking] = useState<number | null>(null)
  const [pickKind, setPickKind] = useState<MediaKind>('article')
  const [adding, setAdding] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const tickCount = totalPages <= 20 ? totalPages : 20
  const dragRatio = Math.max(0, Math.min(1, thumbPct / 100))
  const currentTick = Math.min(tickCount - 1, Math.max(0, Math.round(dragRatio * (tickCount - 1))))

  const roleGroups = useMemo(() => {
    const m = new Map<string, DiscoverRole[]>()
    for (const r of roles) {
      const list = m.get(r.domain) ?? []
      list.push(r)
      m.set(r.domain, list)
    }
    return [...m.entries()]
  }, [roles])

  useEffect(() => {
    void (window.readflow.invoke('discover:roles') as Promise<DiscoverRole[]>).then(setRoles)
    void (window.readflow.invoke('discover:tags') as Promise<string[]>).then(setTags)
  }, [])

  const query = async (p: number) => {
    try {
      const r = await window.readflow.invoke('discover:feeds', {
        roleIds: roleId ? [roleId] : [],
        tags: selTags,
        languages: lang === 'all' ? [] : [lang],
        keyword: keyword.trim() || undefined,
        page: p,
        pageSize: PAGE_SIZE
      }) as { rows: DiscoverFeed[]; total: number }
      setRows(r.rows)
      setTotal(r.total)
      setPage(p)
      setPageInput(String(p + 1))
      const tp = r.total > 0 ? Math.min(100, (p / Math.max(1, Math.ceil(r.total / PAGE_SIZE) - 1)) * 100) : 0
      setThumbPct(tp)
      setLoaded(true)
    } catch (e) {
      showToast('筛选失败：' + (e as Error).message)
    }
  }

  // 筛选条件变化即自动查询（关键词除外，回车/按钮触发）
  useEffect(() => { void query(0) }, [roleId, selTags, lang])

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  }

  const doAdd = async (feed: DiscoverFeed) => {
    setAdding(true)
    try {
      await addFeed('rss', feed.title, feed.xml_url, 120, pickKind)
      showToast(`已添加「${feed.title}」为${KIND_LABEL[pickKind]}`)
      setPicking(null)
      setRows((prev) => prev.map((x) => (x.id === feed.id ? { ...x, subscribed: 1 } : x)))
    } catch (e) {
      showToast('添加失败：' + (e as Error).message)
    } finally {
      setAdding(false)
    }
  }

  /** 页码跳转：clamp 到 [1, totalPages]，有效才查询 */
  const gotoPage = () => {
    const n = parseInt(pageInput, 10)
    if (isNaN(n)) { setPageInput(String(page + 1)); return }
    const target = Math.max(1, Math.min(totalPages, n)) - 1
    if (target !== page) void query(target)
    else setPageInput(String(page + 1))
  }

  /** 圆点分页：拖动/点击跳转，位置 rAF 节流，拖动中不查列表，松手才查询 */
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const pendingPct = useRef(0)
  const scheduleThumb = (pct: number) => {
    pendingPct.current = pct
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const p = pendingPct.current
      setThumbPct(p)
      setPageInput(String(Math.round((p / 100) * (totalPages - 1)) + 1))
    })
  }
  const seekToClientX = (clientX: number, final: boolean) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const PAD = 6
    const usable = rect.width - PAD * 2
    const ratio = usable > 0 ? Math.max(0, Math.min(1, (clientX - rect.left - PAD) / usable)) : 0
    scheduleThumb(ratio * 100)
    if (final) {
      const target = Math.round(ratio * (totalPages - 1))
      if (target !== page) void query(target)
    }
  }
  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    seekToClientX(e.clientX, false)
    const onMove = (em: PointerEvent) => seekToClientX(em.clientX, false)
    const onUp = (eu: PointerEvent) => {
      seekToClientX(eu.clientX, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const tickCls = (i: number) => (i === currentTick ? 'pager-tick current' : 'pager-tick')

  return (
    <div className="set-card">
      <p className="src-label">信源发现（{loaded ? total : '…'} 个候选源）</p>

      <div className="src-grid-2">
        <div className="src-field">
          <label htmlFor="discover-role">按用户角色筛选</label>
          <select id="discover-role" value={roleId} onChange={(e) => setRoleId(Number(e.target.value))}>
            <option value={0}>全部角色</option>
            {roleGroups.map(([domain, list]) => (
              <optgroup key={domain} label={domain}>
                {list.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="src-field">
          <label htmlFor="discover-keyword">搜索</label>
          <div className="disc-search">
            <input
              id="discover-keyword"
              placeholder="标题或 URL 关键词"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void query(0) }}
            />
            <button onClick={() => void query(0)}><Icon name="search" size={13} /> 搜索</button>
          </div>
        </div>
      </div>

      <div className="src-field">
        <label>分类标签</label>
        <div className="disc-chips">
          {tags.map((t) => (
            <button key={t} type="button" className={`chip ${selTags.includes(t) ? 'active' : ''}`} onClick={() => toggle(selTags, t, setSelTags)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="src-field">
        <label>语言</label>
        <div className="disc-chips">
          {([['all', '全部'], ['zh', '中文'], ['en', '英文']] as const).map(([v, l]) => (
            <button key={v} type="button" className={`chip ${lang === v ? 'active' : ''}`} onClick={() => setLang(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="feed-rows discover-list">
        {!loaded && <p className="src-hint">加载中…</p>}
        {loaded && rows.length === 0 && <p className="src-hint">无匹配结果，试试放宽筛选条件。</p>}
        {rows.map((f) => (
          <div key={f.id} className={`feed-row2 ${f.subscribed ? 'added' : ''}`}>
            <div className="feed-info">
              <span className="feed-title">{f.title}</span>
              <span className="feed-url">{f.xml_url}</span>
              <span className="fr-tags">
                <span className="badge">{f.source_type} · {f.tier}</span>
                {f.tags.slice(0, 4).map((t) => <span key={t} className="badge">{t}</span>)}
              </span>
            </div>
            {f.subscribed ? (
              <span className="feed-mark">已订阅</span>
            ) : picking === f.id ? (
              <div className="discover-pick" onClick={(e) => e.stopPropagation()}>
                <div className="seg seg-3way">
                  {(['article', 'podcast', 'video'] as MediaKind[]).map((k) => (
                    <button key={k} type="button" className={`seg-btn ${pickKind === k ? 'active' : ''}`} onClick={() => setPickKind(k)}>{KIND_LABEL[k]}</button>
                  ))}
                </div>
                <button className="discover-confirm" onClick={() => void doAdd(f)} disabled={adding}>{adding ? '添加中…' : '确认'}</button>
                <button className="discover-cancel" onClick={() => setPicking(null)}>取消</button>
              </div>
            ) : (
              <button type="button" className="chip add-one" onClick={() => { setPicking(f.id); setPickKind('article') }}>
                <Icon name="plus" size={13} /> 添加
              </button>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="feed-pager">
          <div className="pager-track" ref={trackRef} onPointerDown={onTrackPointerDown}>
            <div className="pager-ticks" aria-hidden="true">
              {Array.from({ length: tickCount }).map((_, i) => (
                <span key={i} className={tickCls(i)} />
              ))}
            </div>
          </div>
          <input
            className="pager-jump"
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') gotoPage() }}
            onBlur={gotoPage}
            title={`精确跳转：1 - ${totalPages}`}
          />
        </div>
      )}
    </div>
  )
}
