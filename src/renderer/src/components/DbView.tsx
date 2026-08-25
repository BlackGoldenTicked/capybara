import { useEffect, useState } from 'react'
import { Icon } from './icons'

interface TableInfo { name: string; columns: Array<{ name: string; type: string; pk: boolean }>; rowCount: number }
interface RowsResult { columns: string[]; rows: Array<Record<string, unknown>> }

const PAGE = 100

/** 数据库查看器：列出表结构 + 行数，点击表查看分页数据（开发者排查用） */
export function DbView() {
  const [tables, setTables] = useState<TableInfo[] | null>(null)
  const [tablesErr, setTablesErr] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [data, setData] = useState<RowsResult | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    void (window.capybara.invoke('db:tables') as Promise<TableInfo[]>)
      .then((r) => setTables(r))
      .catch((e: unknown) => setTablesErr(String((e as { message?: string })?.message || e || '未知错误')))
  }, [])

  const openTable = async (name: string) => {
    setActive(name); setPage(0); setErr(''); setData(null)
    await loadRows(name, 0)
  }
  const loadRows = async (name: string, p: number) => {
    setLoading(true)
    try {
      const r = await window.capybara.invoke('db:rows', name, PAGE, p * PAGE) as RowsResult
      setData(r); setPage(p)
    } catch (e: unknown) {
      setErr(String((e as { message?: string })?.message || e || '未知错误'))
    } finally { setLoading(false) }
  }

  if (tables === null && !tablesErr) {
    return <div className="set-scroll"><div className="set-card"><p className="src-hint">读取数据库表结构中…</p></div></div>
  }
  if (tablesErr) {
    return <div className="set-scroll"><div className="set-card"><p className="src-warn">⚠ 读取失败：{tablesErr}</p></div></div>
  }

  // ===== 表数据视图 =====
  if (active && data) {
    return (
      <div className="set-scroll">
        <div className="set-card">
          <div className="src-head-row">
            <p className="src-label">{active} · 共 {data.rows.length} 行/页（第 {page + 1} 页）</p>
            <button className="mini-btn" onClick={() => { setActive(null); setData(null) }}><Icon name="chevronRight" size={13} /> 返回表列表</button>
          </div>
          {err && <p className="src-warn">⚠ {err}</p>}
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>{data.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => (
                  <tr key={i}>
                    {data.columns.map((c) => <td key={c}>{renderCell(row[c])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="src-actions" style={{ marginTop: 10 }}>
            <button disabled={page === 0 || loading} onClick={() => void loadRows(active, page - 1)}>上一页</button>
            <button disabled={data.rows.length < PAGE || loading} onClick={() => void loadRows(active, page + 1)}>下一页</button>
            <span className="src-hint src-grow">{loading ? '加载中…' : `显示 ${data.rows.length} 行`}</span>
          </div>
        </div>
      </div>
    )
  }

  // ===== 表结构列表视图 =====
  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">数据库数据查看</p>
        <p className="src-hint">读取本地 SQLite 文件（{tables!.length} 张表）。点击任意表查看其结构与数据，便于排查问题。</p>
        <div className="db-tables">
          {tables!.map((t) => (
            <button key={t.name} className="db-table-row" onClick={() => void openTable(t.name)}>
              <span className="db-tname">{t.name}</span>
              <span className="db-tcount">{t.rowCount} 行</span>
              <span className="db-tcols">{t.columns.map((c) => c.name + (c.pk ? '*' : '')).join(', ')}</span>
              <Icon name="chevronRight" size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function renderCell(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') {
    try { return JSON.stringify(v) } catch { return String(v) }
  }
  return String(v)
}
