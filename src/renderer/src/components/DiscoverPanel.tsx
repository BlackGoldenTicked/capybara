import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import type { DiscoverFeed, DiscoverRole, MediaKind } from '../env'
import { Icon } from './icons'

const PAGE_SIZE = 20
const KIND_LABEL: Record<MediaKind, string> = { article: '图文', podcast: '播客', video: '视频' }
const TIERS = ['T0', 'T1', 'T2', 'T3', 'T4'] as const
const SOURCE_TYPES = ['企业', '个人', '机构'] as const

/** 信源发现：从预置 2242 条 RSS 源库按角色/分类/星级筛选，一键订阅 */
export function DiscoverPanel() {
  const { addFeed, showToast } = useStore()

  // 字典
  const [roles, setRoles] = useState<DiscoverRole[]>([])
  const [tags, setTags] = useState<string[]>([])

  // 筛选条件
  const [roleId, setRoleId] = useState(0) // 0 = 全部角色
  const [selTags, setSelTags] = useState<string[]>([])
  const [selTiers, setSelTiers] = useState<string[]>([])
  const [selTypes, setSelTypes] = useState<string[]>([])
  const [lang, setLang] = useState<'all' | 'zh' | 'en'>('all')
  const [keyword, setKeyword] = useState('')

  // 结果
  const [rows, setRows] = useState<DiscoverFeed[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // 添加交互：picking = 正在选分类的源 id
  const [picking, setPicking] = useState<number | null>(null)
  const [pickKind, setPickKind] = useState<MediaKind>('article')
  const [adding, setAdding] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

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
    setLoading(true)
    try {
      const r = await window.readflow.invoke('discover:feeds', {
        roleIds: roleId ? [roleId] : [],
        tags: selTags,
        tiers: selTiers,
        sourceTypes: selTypes,
        languages: lang === 'all' ? [] : [lang],
        keyword: keyword.trim() || undefined,
        page: p,
        pageSize: PAGE_SIZE
      }) as { rows: DiscoverFeed[]; total: number }
      setRows(r.rows)
      setTotal(r.total)
      setPage(p)
      setLoaded(true)
    } catch (e) {
      showToast('筛选失败：' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // 筛选条件变化即自动查询（关键词除外，回车/按钮触发）
  useEffect(() => { void query(0) }, [roleId, selTags, selTiers, selTypes, lang])

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

  return (
    <div className="set-card">
      <p className="src-label">信源发现（{loaded ? total : '…'} 个候选源）</p>
      <p className="src-hint">从预置 RSS 源库按「角色 / 分类 / 权威等级」筛选，点击添加即订阅。</p>

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
        <label>分类标签（可多选）</label>
        <div className="disc-chips">
          {tags.map((t) => (
            <button key={t} type="button" className={`chip ${selTags.includes(t) ? 'active' : ''}`} onClick={() => toggle(selTags, t, setSelTags)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="src-field">
        <label>权威等级（T0 官方/实验室 → T4 个人长尾）</label>
        <div className="disc-chips">
          {TIERS.map((t) => (
            <button key={t} type="button" className={`chip ${selTiers.includes(t) ? 'active' : ''}`} onClick={() => toggle(selTiers, t, setSelTiers)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="src-field">
        <label>来源类型</label>
        <div className="disc-chips">
          {SOURCE_TYPES.map((t) => (
            <button key={t} type="button" className={`chip ${selTypes.includes(t) ? 'active' : ''}`} onClick={() => toggle(selTypes, t, setSelTypes)}>{t}</button>
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
        {loading && <p className="src-hint">加载中…</p>}
        {!loading && loaded && rows.length === 0 && <p className="src-hint">无匹配结果，试试放宽筛选条件。</p>}
        {rows.map((f) => (
          <div key={f.id} className={`feed-row2 ${f.subscribed ? 'added' : ''}`}>
            <span className="fr-stars" title={`权威等级 ${f.tier}`}>{'★'.repeat(f.stars)}</span>
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
          <button disabled={page <= 0} onClick={() => void query(page - 1)}>上一页</button>
          <span>{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => void query(page + 1)}>下一页</button>
        </div>
      )}
    </div>
  )
}
