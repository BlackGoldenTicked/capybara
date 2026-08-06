/**
 * 刷新诊断面板：执行三步诊断流程，输出详细的 HTTP 级日志与诊断结论。
 *
 * Step 1: 清空本地存储验证（快照→purge→快照，检查 etag 残留）
 * Step 2: 单源刷新诊断（普通刷新+强制刷新，对比 304 行为）
 * Step 3: 全量刷新诊断（所有源刷新，每源 HTTP/耗时/条目）
 */

import { useState } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'

// ============== 类型（与主进程 diag.ts 对齐） ==============

interface DiagFeedState {
  id: number; name: string; url: string; type: string
  itemCount: number; latestItem: string; lastFetchedAt: string
  errorCount: number; etag: string; lastModified: string
}
interface DiagSnapshot { feeds: DiagFeedState[]; totalItems: number; at: string }
interface DiagFetchEntry {
  feedId: number; feedName: string; feedUrl: string
  startedAt: string; endedAt: string; durationMs: number
  httpStatus: number; error: string
  itemsBefore: number; itemsAfter: number; itemsNew: number
  etagUsed: string; lastModifiedUsed: string
  etagReturned: string; lastModifiedReturned: string
  conditionalMatch: boolean
}
interface DiagSingleResult { snapshotBefore: DiagSnapshot; log: DiagFetchEntry | null; snapshotAfter: DiagSnapshot }
interface DiagAllResult { snapshotBefore: DiagSnapshot; logs: DiagFetchEntry[]; snapshotAfter: DiagSnapshot }
interface PurgeCheckResult { snapshotBefore: DiagSnapshot; snapshotAfter: DiagSnapshot; purgedItems: number; etagWarning: boolean }

type DiagStep = 'idle' | 'running' | 'done'

// ============== 辅助 ==============

const dispMs = (ms: number) => ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`
const dispStatus = (s: number) => s === 0 ? '网络错误' : s === 304 ? '304 未修改' : `${s} OK`
const dispTime = (iso: string) => iso ? new Date(iso).toLocaleString('zh-CN') : '无'

// ============== 组件 ==============

export function DiagPanel() {
  const { feeds, load, loadFeeds, showToast } = useStore()

  // 步骤状态
  const [step1Status, setStep1Status] = useState<DiagStep>('idle')
  const [step2Status, setStep2Status] = useState<DiagStep>('idle')
  const [step3Status, setStep3Status] = useState<DiagStep>('idle')

  // Step 1 结果
  const [purgeResult, setPurgeResult] = useState<PurgeCheckResult | null>(null)
  const [purgeDays, setPurgeDays] = useState(90)
  const [purgeMax, setPurgeMax] = useState(2000)

  // Step 2 选择 + 结果
  const [selectedFeedId, setSelectedFeedId] = useState<number>(0)
  const [singleNormal, setSingleNormal] = useState<DiagSingleResult | null>(null)
  const [singleForce, setSingleForce] = useState<DiagSingleResult | null>(null)

  // Step 3 结果
  const [allNormal, setAllNormal] = useState<DiagAllResult | null>(null)
  const [allForce, setAllForce] = useState<DiagAllResult | null>(null)

  // ========== Step 1: 清空验证 ==========

  const runStep1 = async () => {
    setStep1Status('running')
    setPurgeResult(null)
    try {
      const r = await window.readflow.invoke('diag:testPurge', purgeDays, purgeMax) as PurgeCheckResult
      setPurgeResult(r)
      await loadFeeds()
      await load()
      setStep1Status('done')
    } catch (e) {
      showToast('诊断失败：' + (e as Error).message)
      setStep1Status('idle')
    }
  }

  // ========== Step 2: 单源刷新 ==========

  const runStep2Normal = async () => {
    if (!selectedFeedId) { showToast('请先选择订阅源'); return }
    setStep2Status('running')
    setSingleNormal(null)
    setSingleForce(null)
    try {
      const r = await window.readflow.invoke('diag:testRefreshOne', selectedFeedId) as DiagSingleResult
      setSingleNormal(r)
      await loadFeeds()
      await load()
    } catch (e) {
      showToast('普通刷新失败：' + (e as Error).message)
    }
    setStep2Status('idle')
  }

  const runStep2Force = async () => {
    if (!selectedFeedId) { showToast('请先选择订阅源'); return }
    setStep2Status('running')
    try {
      const r = await window.readflow.invoke('diag:testForceOne', selectedFeedId) as DiagSingleResult
      setSingleForce(r)
      await loadFeeds()
      await load()
      setStep2Status('done')
    } catch (e) {
      showToast('强制刷新失败：' + (e as Error).message)
      setStep2Status('idle')
    }
  }

  // ========== Step 3: 全量刷新 ==========

  const runStep3Normal = async () => {
    setStep3Status('running')
    setAllNormal(null)
    setAllForce(null)
    try {
      const r = await window.readflow.invoke('diag:testRefreshAll') as DiagAllResult
      setAllNormal(r)
      await loadFeeds()
      await load()
    } catch (e) {
      showToast('全量刷新失败：' + (e as Error).message)
    }
    setStep3Status('idle')
  }

  const runStep3Force = async () => {
    setStep3Status('running')
    try {
      const r = await window.readflow.invoke('diag:testForceAll') as DiagAllResult
      setAllForce(r)
      await loadFeeds()
      await load()
      setStep3Status('done')
    } catch (e) {
      showToast('强制全量刷新失败：' + (e as Error).message)
      setStep3Status('idle')
    }
  }

  // ========== 诊断结论 ==========
  const conclusion = (): string[] => {
    const lines: string[] = []
    // Step 1: etag 残留
    if (purgeResult?.etagWarning) {
      lines.push('⚠ 清空数据后 feeds 表仍保留 etag/last_modified 缓存头，下一次刷新会携带这些头 → 服务器可能返回 304，导致「刷新无效」')
    }
    // Step 2: 304 行为
    if (singleNormal?.log?.conditionalMatch) {
      lines.push('⚠ 单源刷新命中 etag 匹配（HTTP 304 或 etag 未变+无新条目），服务器告知「未修改」，未下载新内容')
      if (singleForce?.log && singleForce.log.itemsNew > 0) {
        lines.push(`✓ 强制刷新（清除 etag 后请求）成功拉取 ${singleForce.log.itemsNew} 条新数据，证明服务器有新内容，仅因 etag 缓存拦截`)
      }
    }
    // Step 3: 多源 304 汇总
    if (allNormal) {
      const c304 = allNormal.logs.filter((l) => l.conditionalMatch).length
      const errs = allNormal.logs.filter((l) => l.httpStatus === 0 || l.error).length
      if (c304 > 0) lines.push(`⚠ 全量刷新中 ${c304}/${allNormal.logs.length} 个源因 etag 匹配跳过下载（304）`)
      if (errs > 0) lines.push(`⚠ 全量刷新中 ${errs} 个源请求失败（网络/解析错误）`)
      if (c304 === 0 && errs === 0) lines.push('✓ 全量刷新正常，所有源均返回 200 且有新数据')
    }
    if (lines.length === 0) lines.push('请执行上述诊断步骤以生成结论')
    return lines
  }

  // ========== 渲染 Entry ==========

  const renderLog = (entry: DiagFetchEntry | null, idx?: number) => {
    if (!entry) return <div className="diag-empty">（无读取信息）</div>
    const ok = entry.httpStatus === 200 && !entry.error && entry.itemsNew > 0
    const warn = entry.conditionalMatch
    const err = entry.httpStatus === 0 || !!entry.error
    return (
      <div className={`diag-log ${ok ? 'ok' : warn ? 'warn' : err ? 'err' : ''}`} key={idx ?? 0}>
        <div className="diag-log-row">
          <span className="diag-log-label">请求</span>
          <span>GET → {dispStatus(entry.httpStatus)}</span>
          <span className="diag-log-time">{dispMs(entry.durationMs)}</span>
        </div>
        <div className="diag-log-row">
          <span className="diag-log-label">条目</span>
          <span>前 {entry.itemsBefore} → 后 {entry.itemsAfter}（新增 {entry.itemsNew} 条）</span>
        </div>
        {entry.conditionalMatch && (
          <div className="diag-log-row warn-text">
            <span className="diag-log-label">缓存</span>
            <span>etag 匹配: "{entry.etagUsed?.slice(0, 20)}{entry.etagUsed && entry.etagUsed.length > 20 ? '…' : ''}" → 服务器返回 304 或内容无变化，未下载</span>
          </div>
        )}
        {entry.etagReturned && !entry.conditionalMatch && (
          <div className="diag-log-row">
            <span className="diag-log-label">新 etag</span>
            <span className="diag-mono">{entry.etagReturned.slice(0, 40)}{entry.etagReturned.length > 40 ? '…' : ''}</span>
          </div>
        )}
        {entry.error && (
          <div className="diag-log-row err-text">
            <span className="diag-log-label">错误</span>
            <span>{entry.error}</span>
          </div>
        )}
      </div>
    )
  }

  const renderFeedRow = (s: DiagFeedState) => (
    <div key={s.id} className="diag-feed-row">
      <span className="diag-feed-name">{s.name}</span>
      <span className="diag-mono dim">{s.itemCount} 条</span>
      {s.etag && <span className="diag-tag">etag</span>}
      {s.lastModified && <span className="diag-tag">lm</span>}
      {s.errorCount > 0 && <span className="diag-tag err-tag">错误×{s.errorCount}</span>}
    </div>
  )

  // ========== UI ==========

  return (
    <div className="diag-panel">
      <h2 className="diag-title">
        <Icon name="activity" size={18} /> 刷新诊断
      </h2>

      {/* ===== Step 1 ===== */}
      <section className="diag-step">
        <h3>
          <span className="diag-step-num">1</span> 清空本地存储验证
        </h3>
        <div className="diag-step-controls">
          <label>保留天数 <input type="number" value={purgeDays} onChange={(e) => setPurgeDays(Number(e.target.value))} className="diag-input" /></label>
          <label>最大条目 <input type="number" value={purgeMax} onChange={(e) => setPurgeMax(Number(e.target.value))} className="diag-input" /></label>
          <button onClick={runStep1} disabled={step1Status === 'running'} className="diag-btn">
            {step1Status === 'running' ? '执行中…' : '执行清空'}
          </button>
        </div>
        {purgeResult && (
          <div className={`diag-result ${purgeResult.etagWarning ? 'warn-box' : 'ok-box'}`}>
            <div className="diag-result-row">清空前: {purgeResult.snapshotBefore.totalItems} 条项目</div>
            <div className="diag-result-row">清空后: {purgeResult.snapshotAfter.totalItems} 条项目（删除 {purgeResult.purgedItems} 条）</div>
            {purgeResult.etagWarning && (
              <div className="diag-result-row warn-text">
                ⚠ 检测到 feeds 表仍有 etag/last_modified 缓存头，下次刷新时可能命中 304 跳过下载。<br/>
                原因：清空仅删除 items 表数据，未清除 feeds 表的条件请求缓存。
              </div>
            )}
            <details className="diag-details">
              <summary>源状态快照（清空前）</summary>
              {purgeResult.snapshotBefore.feeds.map(renderFeedRow)}
            </details>
          </div>
        )}
      </section>

      {/* ===== Step 2 ===== */}
      <section className="diag-step">
        <h3>
          <span className="diag-step-num">2</span> 单源刷新诊断
        </h3>
        <div className="diag-step-controls">
          <select value={selectedFeedId} onChange={(e) => setSelectedFeedId(Number(e.target.value))} className="diag-select">
            <option value={0}>-- 选择订阅源 --</option>
            {feeds.filter((f) => f.enabled !== 0).map((f) => (
              <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
            ))}
          </select>
          <button onClick={runStep2Normal} disabled={step2Status === 'running' || !selectedFeedId} className="diag-btn">
            普通刷新
          </button>
          <button onClick={runStep2Force} disabled={step2Status === 'running' || !selectedFeedId} className="diag-btn force">
            强制刷新（清 etag）
          </button>
        </div>
        {singleNormal && (
          <div className="diag-step-result">
            <div className="diag-subtitle">普通刷新（保留 etag）</div>
            {renderLog(singleNormal.log)}
          </div>
        )}
        {singleForce && (
          <div className="diag-step-result">
            <div className="diag-subtitle">强制刷新（已清除 etag）</div>
            {renderLog(singleForce.log)}
          </div>
        )}
      </section>

      {/* ===== Step 3 ===== */}
      <section className="diag-step">
        <h3>
          <span className="diag-step-num">3</span> 全量刷新诊断
        </h3>
        <div className="diag-step-controls">
          <button onClick={runStep3Normal} disabled={step3Status === 'running'} className="diag-btn">
            普通全量刷新
          </button>
          <button onClick={runStep3Force} disabled={step3Status === 'running'} className="diag-btn force">
            强制全量刷新（清全部 etag）
          </button>
        </div>
        {allNormal && (
          <div className="diag-step-result">
            <div className="diag-subtitle">全量刷新结果（{allNormal.logs.length} 个源）</div>
            <div className="diag-all-grid">
              {allNormal.logs.map((l, i) => (
                <div key={i} className={`diag-all-card ${l.conditionalMatch ? 'warn-card' : l.httpStatus === 0 || l.error ? 'err-card' : 'ok-card'}`}>
                  <div className="diag-all-name">{l.feedName}</div>
                  <div className="diag-all-stat">{dispStatus(l.httpStatus)}</div>
                  <div className="diag-all-stat">{l.itemsNew > 0 ? `+${l.itemsNew} 条` : '无新增'}</div>
                  <div className="diag-all-stat dim">{dispMs(l.durationMs)}</div>
                  {l.conditionalMatch && <div className="diag-all-stat warn-text">etag 匹配</div>}
                  {l.error && <div className="diag-all-stat err-text">{l.error}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        {allForce && (
          <div className="diag-step-result">
            <div className="diag-subtitle">强制全量刷新结果（{allForce.logs.length} 个源）</div>
            <div className="diag-all-grid">
              {allForce.logs.map((l, i) => (
                <div key={i} className={`diag-all-card ${l.conditionalMatch ? 'warn-card' : l.httpStatus === 0 || l.error ? 'err-card' : 'ok-card'}`}>
                  <div className="diag-all-name">{l.feedName}</div>
                  <div className="diag-all-stat">{dispStatus(l.httpStatus)}</div>
                  <div className="diag-all-stat">{l.itemsNew > 0 ? `+${l.itemsNew} 条` : '无新增'}</div>
                  <div className="diag-all-stat dim">{dispMs(l.durationMs)}</div>
                  {l.error && <div className="diag-all-stat err-text">{l.error}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== 诊断结论 ===== */}
      <section className="diag-conclusion">
        <h3>📋 诊断结论</h3>
        <ul>
          {conclusion().map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
