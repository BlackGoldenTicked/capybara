import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store'
import type { ItemRow } from '../env'
import { Icon } from './icons'
import { press } from '../lib/press'

let searchTimer: ReturnType<typeof setTimeout> | null = null

export function CommandSearch() {
  const { cmdkOpen, setCmdkOpen, setSearch, select, setSourceType, setView } = useStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 打开时聚焦输入框
  useEffect(() => {
    if (cmdkOpen) {
      setQuery('')
      setResults([])
      setActiveIndex(0)
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [cmdkOpen])

  // 防抖搜索
  useEffect(() => {
    if (!cmdkOpen) return
    if (searchTimer) clearTimeout(searchTimer)
    if (!query.trim()) { setResults([]); setLoading(false); return }
    setLoading(true)
    searchTimer = setTimeout(async () => {
      try {
        const rows = await window.capybara.invoke('items:list', 'all', query.trim(), null, null) as ItemRow[]
        setResults(rows.slice(0, 50))
      } catch { setResults([]) }
      setLoading(false)
    }, 200)
    return () => { if (searchTimer) clearTimeout(searchTimer) }
  }, [query, cmdkOpen])

  // 滚动到激活项
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleSelect = useCallback((item: ItemRow) => {
    // 根据来源类型导航到对应视图
    if (item.source_type === 'github') {
      setSourceType('github')
    } else if (item.source_type === 'x_bookmark') {
      setSourceType('x_bookmark')
    } else {
      setSourceType(null)
      setView('all')
    }
    // 设置搜索词以便列表中过滤到该项
    setSearch('')
    // 选中该条目并跳到阅读视图
    setTimeout(() => select(item.id, { click: true }), 50)
    setCmdkOpen(false)
  }, [setSourceType, setView, setSearch, select, setCmdkOpen])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); const item = results[activeIndex]; if (item) handleSelect(item) }
    else if (e.key === 'Escape') { e.preventDefault(); setCmdkOpen(false) }
  }

  if (!cmdkOpen) return null

  const typeLabel = (t: string): string => {
    const map: Record<string, string> = { github: 'GitHub', x_bookmark: 'Twitter', rss: 'RSS', wechat: '微信', tophub: '热榜', manual: '手动' }
    return map[t] || t
  }

  return (
    <div className="cmdk-mask" {...press(() => setCmdkOpen(false))}>
      <div className="cmdk-panel" onPointerDown={(e) => e.stopPropagation()}>
        <div className="cmdk-input-wrap">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="搜索条目…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
            onKeyDown={onKeyDown}
          />
          {loading && <Icon name="refresh" size={16} className="spin" />}
          <kbd className="cmdk-kbd">ESC</kbd>
        </div>
        <div className="cmdk-results" ref={listRef}>
          {results.length === 0 && !loading && query.trim() && (
            <div className="cmdk-empty">未找到「{query}」相关条目</div>
          )}
          {results.length === 0 && !loading && !query.trim() && (
            <div className="cmdk-empty">输入关键词搜索全部条目</div>
          )}
          {results.map((item, i) => (
            <div key={item.id} data-idx={i}
              className={`cmdk-item ${i === activeIndex ? 'active' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => handleSelect(item)}
            >
              <span className="cmdk-item-type">{typeLabel(item.source_type)}</span>
              <div className="cmdk-item-body">
                <span className="cmdk-item-title">{item.title}</span>
                {item.summary && <span className="cmdk-item-summary">{item.summary.slice(0, 80)}</span>}
              </div>
              <span className="cmdk-item-source">{item.source_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
