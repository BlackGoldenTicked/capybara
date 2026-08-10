import { useEffect, useRef, useState, Component, type ReactNode, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useStore } from './store'
import { Sidebar } from './components/Sidebar'
import { ItemList } from './components/ItemList'
import { ReaderPane } from './components/ReaderPane'
import { QuickAdd } from './components/QuickAdd'
import { BoardView } from './components/BoardView'
import { SettingsView } from './components/SettingsView'
import { FeedsPanel } from './components/FeedsPanel'
import { playSound, primeAudio } from './lib/sound'
import { eventToCombo, isGlobalCombo, type ShortcutAction } from './lib/shortcuts'

class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null }
  static getDerivedStateFromError(err: Error) { return { err } }
  render() {
    if (this.state.err) return (
      <div style={{ padding: 40, color: 'var(--color-text-primary)' }}>
        <h2>界面出错</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-warning)' }}>{String(this.state.err?.stack || this.state.err)}</pre>
      </div>
    )
    return this.props.children
  }
}

type DividerWhich = 'side' | 'feed' | 'list'
interface DragState { which: DividerWhich; startX: number; startW: number }

export default function App() {
  const { screen, load, loadFeeds, loadBoards, moveSelection, setStatus, selectedId, items, setQuickAddOpen, toast: toastMsg, view, activeSourceType, developerMode, zenMode, exitZenMode } = useStore()
  const searchRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const [sideW, setSideW] = useState(196)
  const [listW, setListW] = useState(320)
  const [feedW, setFeedW] = useState(188)
  const [sideCollapsed, setSideCollapsed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [version, setVersion] = useState('')

  useEffect(() => {
    void load(); void loadFeeds(); void loadBoards()
    void useStore.getState().initAppearance()
    // 恢复上次布局宽度
    void (window.readflow.invoke('settings:get', 'side_w') as Promise<string>).then((r) => { const n = Number(r); if (n >= 120) setSideW(n) })
    void (window.readflow.invoke('settings:get', 'list_w') as Promise<string>).then((r) => { const n = Number(r); if (n >= 260) setListW(n) })
    void (window.readflow.invoke('settings:get', 'feed_w') as Promise<string>).then((r) => { const n = Number(r); if (n >= 140) setFeedW(n) })
    void (window.readflow.invoke('settings:get', 'side_collapsed') as Promise<string>).then((r) => { if (r === '1') setSideCollapsed(true) })
    void (window.readflow.invoke('app:version') as Promise<string>).then((r) => setVersion(r || ''))
  }, [load, loadFeeds, loadBoards])

  // 全局轻触音效：仅在可交互元素上触发，随设置开关；首次手势预热音频上下文
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const s = useStore.getState()
      if (!s.soundEnabled) return
      primeAudio()
      const t = e.target as HTMLElement
      if (t.closest('button, a, [role="button"], .side-item, .card, .chip, .tag-chip, .rail-btn, .bc-title')) {
        playSound('tap')
      }
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  useEffect(() => {
    const cb = () => { void useStore.getState().load(); void useStore.getState().loadFeeds() }
    window.readflow.onSourcesUpdated(cb)
  }, [])

  // 全局快捷键：使用「设置 → 快捷键」中可配置的组合键
  useEffect(() => {
    const runAction = (action: ShortcutAction, st: ReturnType<typeof useStore.getState>) => {
      const item = st.items.find((i) => i.id === st.selectedId)
      switch (action) {
        case 'openSettings': st.openSettings('appearance'); break
        case 'focusSearch': searchRef.current?.focus(); break
        case 'refresh': void st.refreshAll(); break
        case 'quickAdd': st.setQuickAddOpen(true); break
        case 'goRss': st.setView('rss'); break
        case 'goLater': st.setView('later'); break
        case 'goFavorite': st.setView('favorite'); break
        case 'goRead': st.setView('read'); break
        case 'goArchived': st.setView('archived'); break
        case 'goAll': st.setView('all'); break
        case 'toggleBoard':
          if (st.screen === 'board') st.setScreen('library')
          else if (st.boards.length) void st.openBoard(st.boards[0].id)
          else void st.createBoard()
          break
        case 'nextItem': st.moveSelection(1); break
        case 'prevItem': st.moveSelection(-1); break
        case 'archiveItem': if (item) void st.setStatus(item.id, 'archived'); break
        case 'laterItem': if (item) void st.setStatus(item.id, 'later'); break
        case 'favoriteItem': if (item) void st.setStatus(item.id, 'favorite'); break
        case 'openLink': if (item) st.openInBrowser(item.url); break
        case 'help': st.openSettings('shortcuts'); break
        case 'close':
          (document.activeElement as HTMLElement | null)?.blur?.()
          if (st.screen === 'settings') st.setScreen('library')
          if (st.quickAddOpen) st.setQuickAddOpen(false)
          break
      }
    }

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // Esc：优先退出 Zen 模式，其次失焦/关闭弹层
      if (e.key === 'Escape') {
        ;(target as HTMLElement).blur?.()
        const st = useStore.getState()
        if (st.zenMode) { st.exitZenMode(); e.preventDefault(); return }
        if (st.screen === 'settings') st.setScreen('library')
        if (st.quickAddOpen) st.setQuickAddOpen(false)
        e.preventDefault()
        return
      }

      // 「/」便利键：聚焦搜索（与可配置快捷键并存，且输入时不触发）
      if (e.key === '/' && !typing) { e.preventDefault(); searchRef.current?.focus(); return }

      const st = useStore.getState()
      const combo = eventToCombo(e)
      const byCombo = new Map<string, ShortcutAction>()
      for (const k of Object.keys(st.shortcuts) as ShortcutAction[]) byCombo.set(st.shortcuts[k], k)
      const action = byCombo.get(combo)
      if (!action) return
      // 带 ⌘/Ctrl 的全局快捷键即使在输入框中也生效；单键快捷键仅在非输入时触发
      if (!isGlobalCombo(combo) && typing) return
      e.preventDefault()
      runAction(action, st)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onDividerDown = (which: DividerWhich) => (e: ReactPointerEvent) => {
    dragRef.current = { which, startX: e.clientX, startW: which === 'side' ? sideW : which === 'feed' ? feedW : listW }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onDividerMove = (e: ReactPointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    if (d.which === 'side') {
      const nw = d.startW + dx
      if (nw <= 96) { setSideCollapsed(true); setSideW(56) }
      else { setSideCollapsed(false); setSideW(Math.min(320, Math.max(130, nw))) }
    } else if (d.which === 'feed') {
      setFeedW(Math.min(280, Math.max(140, d.startW + dx)))
    } else {
      setListW(Math.min(400, Math.max(260, d.startW + dx)))
    }
  }
  const onDividerUp = () => {
    const d = dragRef.current
    dragRef.current = null
    setDragging(false)
    if (!d) return
    void window.readflow.invoke('settings:set', 'side_w', String(sideW))
    void window.readflow.invoke('settings:set', 'list_w', String(listW))
    void window.readflow.invoke('settings:set', 'feed_w', String(feedW))
    void window.readflow.invoke('settings:set', 'side_collapsed', sideCollapsed ? '1' : '0')
  }

  const sidebarStyle: CSSProperties = { width: sideCollapsed ? 56 : sideW }

  // 订阅源栏（第四栏）仅在与 RSS 订阅源相关的视图显示：
  // RSS / 稍后读 / 已收藏 / 已读 / 全部（activeSourceType 为 null），
  // 在 GitHub★ / Twitter 书签（按来源筛选）与「归档」中隐藏。
  const showFeeds = activeSourceType == null && view !== 'archived'

  // Zen 模式下隐藏全部左侧列
  const isZen = zenMode && screen === 'library'

  return (
    <div className="app">
      <div className="titlebar">
        <span className="hint">{version || 'v0.7.6'}</span>
      </div>
      <div className="main">
        {!isZen && <Sidebar collapsed={sideCollapsed} style={sidebarStyle} dragging={dragging} searchRef={searchRef} />}
        {!isZen && <div className="divider v" onPointerDown={onDividerDown('side')} onPointerMove={onDividerMove} onPointerUp={onDividerUp} />}
        <div className="content">
          <ErrorBoundary>
            {screen === 'library' && (
              <>
                {!isZen && showFeeds && <FeedsPanel width={feedW} />}
                {!isZen && showFeeds && <div className="divider v" onPointerDown={onDividerDown('feed')} onPointerMove={onDividerMove} onPointerUp={onDividerUp} />}
                {!isZen && <div className="list-pane" style={{ width: listW }}>
                  <ItemList />
                </div>}
                {!isZen && <div className="divider v" onPointerDown={onDividerDown('list')} onPointerMove={onDividerMove} onPointerUp={onDividerUp} />}
                <ReaderPane />
              </>
            )}
            {screen === 'board' && <BoardView />}
            {screen === 'settings' && <SettingsView />}
          </ErrorBoundary>
        </div>
      </div>
      <QuickAdd />
      {toastMsg && <div className="toast">{toastMsg}</div>}
      {developerMode && <NetPanel />}
    </div>
  )
}

/** 开发者模式下的浮动网络诊断面板：实时显示每个 RSS 请求的状态/耗时/字节/错误 */
function NetPanel() {
  const { netLog, setDeveloperMode } = useStore()
  const shown = netLog.slice(-80).reverse()
  const failed = netLog.filter((e) => !e.ok).length
  return (
    <div className="net-panel">
      <div className="net-head">
        <span>网络诊断{netLog.length ? ` · ${netLog.length} 条` : ''}{failed ? <b className="net-bad"> · {failed} 失败</b> : ''}</span>
        <button className="net-db" title="查看数据库" onClick={() => useStore.getState().openSettings('data')}>数据库查看 →</button>
        <button className="net-close" title="关闭开发者模式" onClick={() => setDeveloperMode(false)}>×</button>
      </div>
      <div className="net-body">
        {shown.length === 0 && <div className="net-empty">暂无请求。点「立即刷新全部源」或等待调度器抓取即可看到日志。</div>}
        {shown.map((e, i) => (
          <div key={(e.time) + '-' + i} className={`net-row ${e.ok ? '' : 'fail'}`}>
            <span className="net-status">{e.ok ? (e.status || 'OK') : (e.status || 'ERR')}</span>
            <span className="net-method">{e.method || 'GET'}</span>
            <span className="net-url" title={e.url}>{e.url}</span>
            <span className="net-meta">{e.ms}ms · {e.bytes}B</span>
            {e.error && <span className="net-err" title={e.error}>{e.error}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
