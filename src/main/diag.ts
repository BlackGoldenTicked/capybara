/**
 * 刷新诊断模块：对 fetchRssFeed / refreshFeed / refreshAllFeeds 注入可开关的轻量打点，
 * 提供「清空前/后 → 单源刷新 → 全量刷新」的三步对照诊断流程。
 *
 * 核心能力：
 * 1. 状态快照（feeds/item 计数/最新时间戳）
 * 2. HTTP 级打点（状态码/耗时/etag 匹配/新增条目数）
 * 3. 强制刷新（先清 etag 再请求，直击 304 缓存问题）
 */

import { getDb, listFeeds, clearFeedCache, clearAllFeedCache, purgeOldItems, type Feed } from './db'
import { refreshFeed, refreshAllFeeds } from './sources/scheduler'

// ============== 类型 ==============

export interface DiagFetchEntry {
  feedId: number
  feedName: string
  feedUrl: string
  startedAt: string       // ISO
  endedAt: string          // ISO
  durationMs: number
  httpStatus: number       // 0 = 网络错误未发出
  error: string
  itemsBefore: number
  itemsAfter: number
  itemsNew: number
  etagUsed: string
  lastModifiedUsed: string
  etagReturned: string
  lastModifiedReturned: string
  conditionalMatch: boolean // true = 304 / etag 匹配，未下载新内容
}

export interface DiagFeedState {
  id: number
  name: string
  url: string
  type: string
  itemCount: number
  latestItem: string       // 最新条目的 published_at，空串 = 无条目
  lastFetchedAt: string
  errorCount: number
  etag: string
  lastModified: string
}

export interface DiagSnapshot {
  feeds: DiagFeedState[]
  totalItems: number
  at: string
}

export interface DiagSingleResult {
  snapshotBefore: DiagSnapshot
  log: DiagFetchEntry
  snapshotAfter: DiagSnapshot
}

export interface DiagAllResult {
  snapshotBefore: DiagSnapshot
  logs: DiagFetchEntry[]
  snapshotAfter: DiagSnapshot
}

// ============== 状态 ==============

let _enabled = false
const _logs: DiagFetchEntry[] = []

// ============== 开关 ==============

export function enableDiag() { _enabled = true }
export function disableDiag() { _enabled = false }
export function isDiagEnabled() { return _enabled }

export function getDiagLogs(): DiagFetchEntry[] { return [..._logs] }
export function clearDiagLogs() { _logs.length = 0 }

// ============== 打点（由 fetchRssFeed 调用） ==============

let _pendingStart: { feedId: number; itemsBefore: number } | null = null

function _countItemsForFeed(sourceName: string): number {
  const db = getDb()
  const r = db.prepare('SELECT COUNT(*) as c FROM items WHERE source_name = ?').get(sourceName) as { c: number } | undefined
  return r?.c ?? 0
}

export function diagFetchStart(feedId: number, feedName: string) {
  if (!_enabled) return
  _pendingStart = { feedId, itemsBefore: _countItemsForFeed(feedName) }
}

export function diagFetchEnd(feed: Feed, httpStatus: number, durationMs: number, itemsNew: number, etagRet: string, lmRet: string, error: string) {
  if (!_enabled || !_pendingStart || _pendingStart.feedId !== feed.id) return
  const itemsAfter = _pendingStart.itemsBefore + itemsNew
  const entry: DiagFetchEntry = {
    feedId: feed.id,
    feedName: feed.name,
    feedUrl: feed.url,
    startedAt: new Date(Date.now() - durationMs).toISOString(),
    endedAt: new Date().toISOString(),
    durationMs,
    httpStatus,
    error,
    itemsBefore: _pendingStart.itemsBefore,
    itemsAfter,
    itemsNew,
    etagUsed: feed.etag,
    lastModifiedUsed: feed.last_modified,
    etagReturned: etagRet,
    lastModifiedReturned: lmRet,
    conditionalMatch: httpStatus === 304 || (feed.etag !== '' && etagRet === feed.etag && itemsNew === 0)
  }
  _logs.push(entry)
  _pendingStart = null
}

// ============== 快照 ==============

function countItemsForFeed(sourceName: string): number {
  const db = getDb()
  const r = db.prepare('SELECT COUNT(*) as c FROM items WHERE source_name = ?').get(sourceName) as { c: number } | undefined
  return r?.c ?? 0
}

function latestItemForFeed(sourceName: string): string {
  const db = getDb()
  const r = db.prepare('SELECT published_at FROM items WHERE source_name = ? AND published_at != \'\' ORDER BY published_at DESC LIMIT 1').get(sourceName) as { published_at: string } | undefined
  return r?.published_at ?? ''
}

export function diagSnapshot(): DiagSnapshot {
  const feeds = listFeeds()
  const db = getDb()
  const totalR = db.prepare('SELECT COUNT(*) as c FROM items').get() as { c: number } | undefined
  return {
    feeds: feeds.map((f) => ({
      id: f.id,
      name: f.name,
      url: f.url,
      type: f.type,
      itemCount: countItemsForFeed(f.name),
      latestItem: latestItemForFeed(f.name),
      lastFetchedAt: f.last_fetched_at,
      errorCount: f.error_count,
      etag: f.etag,
      lastModified: f.last_modified
    })),
    totalItems: totalR?.c ?? 0,
    at: new Date().toISOString()
  }
}

// ============== 强制刷新（清除 etag 后请求） ==============

/** 清除指定 feed 的 etag 与 last_modified，然后执行刷新（绕过条件请求，强制全量拉取）。 */
export async function forceRefreshFeed(id: number): Promise<DiagSingleResult> {
  enableDiag()
  clearDiagLogs()
  // 清除缓存头，让下次请求不走 304
  clearFeedCache(Number(id))
  const before = diagSnapshot()
  await refreshFeed(id)
  const after = diagSnapshot()
  disableDiag()
  return { snapshotBefore: before, log: _logs[0] ?? null as unknown as DiagFetchEntry, snapshotAfter: after }
}

/** 清除所有 feed 的 etag 与 last_modified，然后执行全量刷新。 */
export async function forceRefreshAll(): Promise<DiagAllResult> {
  enableDiag()
  clearDiagLogs()
  clearAllFeedCache()
  const before = diagSnapshot()
  await refreshAllFeeds()
  const after = diagSnapshot()
  disableDiag()
  return { snapshotBefore: before, logs: [..._logs], snapshotAfter: after }
}

// ============== 普通刷新诊断（保留 etag，观察 304 行为） ==============

/** 对单个源做普通刷新，捕捉打点。 */
export async function diagRefreshFeed(id: number): Promise<DiagSingleResult> {
  enableDiag()
  clearDiagLogs()
  const before = diagSnapshot()
  await refreshFeed(id)
  const after = diagSnapshot()
  disableDiag()
  return { snapshotBefore: before, log: _logs[0] ?? null as unknown as DiagFetchEntry, snapshotAfter: after }
}

/** 全量普通刷新。 */
export async function diagRefreshAll(): Promise<DiagAllResult> {
  enableDiag()
  clearDiagLogs()
  const before = diagSnapshot()
  await refreshAllFeeds()
  const after = diagSnapshot()
  disableDiag()
  return { snapshotBefore: before, logs: [..._logs], snapshotAfter: after }
}

// ============== 清空验证 ==============

export interface PurgeCheckResult {
  snapshotBefore: DiagSnapshot
  snapshotAfter: DiagSnapshot
  purgedItems: number
  etagWarning: boolean  // true = feeds 表仍有 etag/last_modified，下次刷新可能 304
}

/** 执行 purgeOldItems 并返回前后快照对比 + etag 残留警告 */
export function diagTestPurge(keepDays: number, maxItems: number): PurgeCheckResult {
  const before = diagSnapshot()
  purgeOldItems(keepDays, maxItems)
  const after = diagSnapshot()
  const purgedItems = before.totalItems - after.totalItems
  const etagWarning = after.feeds.some((f) => f.etag !== '' || f.lastModified !== '')
  return { snapshotBefore: before, snapshotAfter: after, purgedItems: Math.max(0, purgedItems), etagWarning }
}
