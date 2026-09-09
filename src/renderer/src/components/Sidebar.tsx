import { useState, useRef, useEffect, Fragment, type CSSProperties, type ReactNode } from 'react'
import { useStore } from '../store'
import type { View } from '../env'
import { Icon, type IconName } from './icons'
import { press, pressBtn } from '../lib/press'

// 折叠态（图标栏）仍按原顺序展示全部视图（侧栏收起时）
const NAV: Array<{ key: View; label: string; icon: IconName }> = [
  { key: 'rss', label: 'RSS', icon: 'rss' },
  { key: 'podcast', label: '播客', icon: 'podcast' },
  { key: 'video', label: '视频', icon: 'video' },
  { key: 'later', label: '稍后读', icon: 'later' },
  { key: 'favorite', label: '已收藏', icon: 'favorite' },
  { key: 'all', label: '全部条目', icon: 'all' }
]

// 「全部」常驻分组：RSS / 播客 / 视频 + 两个分类（已删除「已读」「归档」项）
const COLLECT: Array<{ key: View; label: string; icon: IconName }> = [
  { key: 'rss', label: 'RSS', icon: 'rss' },
  { key: 'podcast', label: '播客', icon: 'podcast' },
  { key: 'video', label: '视频', icon: 'video' },
  { key: 'later', label: '稍后阅读', icon: 'later' },
  { key: 'favorite', label: '收藏', icon: 'favorite' }
]

/** 可折叠分组：标题栏点击切换，正文区按需渲染。仅白板使用。 */
function Section({ id, title, collapsedSec, onToggle, action, children }: {
  id: string
  title: string
  collapsedSec: Record<string, boolean>
  onToggle: (id: string) => void
  action?: ReactNode
  children: ReactNode
}) {
  const open = !collapsedSec[id]
  return (
    <div className="sec">
      <div className="sec-head" {...press(() => onToggle(id))}>
        <Icon name={open ? 'chevronDown' : 'chevronRight'} size={13} />
        <span className="sec-title">{title}</span>
        {action}
      </div>
      {open && <div className="sec-body">{children}</div>}
    </div>
  )
}

export function Sidebar({ collapsed = false, style, dragging = false }: {
  collapsed?: boolean
  style?: CSSProperties
  dragging?: boolean
}) {
  const { screen, setScreen, setView, view, activeSourceType, setSourceType, counts, sourceCounts, boards, createBoard, openSettings, settingsOpen, ghSyncing, ghSyncError, retryGithubStars } = useStore()
  const [editingBoard, setEditingBoard] = useState<number | null>(null)
  const [boardName, setBoardName] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)
  const [collapsedSec, setCollapsedSec] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (editingBoard != null && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [editingBoard])

  // 恢复上次折叠状态（持久化在 settings 表 sidebar_collapsed，JSON 记录各分组开关）
  useEffect(() => {
    void (window.capybara.invoke('settings:get', 'sidebar_collapsed') as Promise<string>).then((r) => {
      if (r) { try { setCollapsedSec(JSON.parse(r)) } catch { /* 忽略损坏数据 */ } }
    })
  }, [])
  const toggleSec = (id: string) => {
    const next = { ...collapsedSec, [id]: !collapsedSec[id] }
    setCollapsedSec(next)
    void window.capybara.invoke('settings:set', 'sidebar_collapsed', JSON.stringify(next))
  }

  const commitRename = (id: number) => {
    void useStore.getState().renameBoard(id, boardName.trim() || '未命名白板')
    setEditingBoard(null)
  }
  const removeBoard = async (id: number) => {
    await useStore.getState().deleteBoard(id)
    useStore.getState().showToast('已删除白板')
  }

  if (collapsed) {
    return (
      <aside className={`sidebar collapsed ${dragging ? 'dragging' : ''}`} style={style} title="展开侧栏请向右拖动分隔条">
        {NAV.map((n) => (
          <button key={n.key} className={`rail-btn ${screen === 'library' && view === n.key && !activeSourceType ? 'active' : ''}`}
            title={`${n.label}（${counts[n.key] || 0}）`} {...pressBtn(() => setView(n.key))}>
            <span className="rail-icon"><Icon name={n.icon} size={19} /></span>
          </button>
        ))}
        <button className={`rail-btn ${activeSourceType === 'github' ? 'active' : ''}`} title={`GitHub ★（${sourceCounts['github'] || 0}）${ghSyncing ? ' · 同步中…' : ghSyncError ? ` · 同步失败：${ghSyncError}` : ''}`} {...pressBtn(() => ghSyncError ? retryGithubStars() : setSourceType('github'))}>
          <span className="rail-icon">
            {ghSyncing ? <Icon name="refresh" size={19} className="spin" /> : <Icon name="github" size={19} />}
          </span>
        </button>
        <button className={`rail-btn ${activeSourceType === 'x_bookmark' ? 'active' : ''}`} title={`Twitter 书签（${sourceCounts['x_bookmark'] || 0}）`} {...pressBtn(() => setSourceType('x_bookmark'))}><span className="rail-icon"><Icon name="twitter" size={19} /></span></button>
        <button className={`rail-btn ${screen === 'bookmarks' ? 'active' : ''}`} title="浏览器收藏夹" {...pressBtn(() => setScreen('bookmarks'))}><span className="rail-icon"><Icon name="bookmark" size={19} /></span></button>
        <div className="rail-sep" />
        <button className={`rail-btn ${screen === 'board' ? 'active' : ''}`} title="白板" {...pressBtn(() => setScreen('board'))}><span className="rail-icon"><Icon name="board" size={19} /></span></button>
        <button className="rail-btn" title="新建白板" {...pressBtn(() => void createBoard())}><span className="rail-icon"><Icon name="plus" size={19} /></span></button>
        <div className="rail-sep" />
        <button className={`rail-btn ${settingsOpen ? 'active' : ''}`} title="系统配置" {...pressBtn(() => openSettings())}><span className="rail-icon"><Icon name="settings" size={19} /></span></button>
      </aside>
    )
  }

  return (
    <aside className={`sidebar ${dragging ? 'dragging' : ''}`} style={style}>
      {/* 全部（常驻，不折叠）：未读收件箱 + 三个分类，组内不加分隔线 */}
      <nav className="nav-group">
        {/* 「全部」分组标题：补左侧图标列，使标题文字与下方条目文字在同一基线对齐 */}
        <div className={`nav-group-title ${screen === 'library' && view === 'all' && !activeSourceType ? 'active' : ''}`}
          role="button" tabIndex={0}
          {...press(() => setView('all'))}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('all') } }}>
          <span className="side-ico"><Icon name="all" size={16} /></span>
          <span>全部</span>
          <span className="count">{counts['all'] || ''}</span>
        </div>
        {COLLECT.map((n) => (
          <div key={n.key} role="button" tabIndex={0}
            className={`side-item ${screen === 'library' && view === n.key && !activeSourceType ? 'active' : ''}`}
            {...press(() => setView(n.key))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView(n.key) } }}>
            <span className="side-ico"><Icon name={n.icon} size={16} /></span>
            <span>{n.label}</span>
            <span className="count">{counts[n.key] || ''}</span>
          </div>
        ))}
      </nav>

      <div className="nav-sep" />

      {/* GitHub ★（常驻，不折叠） */}
      <div className={`side-item ${activeSourceType === 'github' ? 'active' : ''}`} role="button" tabIndex={0}
        {...press(() => setSourceType('github'))}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSourceType('github') } }}>
        <span className="side-ico">
          {ghSyncing ? <Icon name="refresh" size={16} className="spin" /> : <Icon name="github" size={16} />}
        </span>
        <span>GitHub ★</span>
        {ghSyncing ? (
          <span className="gh-sync-status">同步中…</span>
        ) : ghSyncError ? (
          <span className="gh-sync-retry" title={`同步失败：${ghSyncError}，点击重试`} onClick={(e) => { e.stopPropagation(); void retryGithubStars() }}>
            失败·重试
          </span>
        ) : (
          <span className="count">{sourceCounts['github'] || ''}</span>
        )}
      </div>

      <div className="nav-sep" />

      {/* Twitter 书签（常驻，不折叠） */}
      <div className={`side-item ${activeSourceType === 'x_bookmark' ? 'active' : ''}`} role="button" tabIndex={0}
        {...press(() => setSourceType('x_bookmark'))}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSourceType('x_bookmark') } }}>
        <span className="side-ico"><Icon name="twitter" size={16} /></span>
        <span>书签</span>
        <span className="count">{sourceCounts['x_bookmark'] || ''}</span>
      </div>

      <div className="nav-sep" />

      {/* 浏览器收藏夹（常驻，不折叠） */}
      <div className={`side-item ${screen === 'bookmarks' ? 'active' : ''}`} role="button" tabIndex={0}
        {...press(() => setScreen('bookmarks'))}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setScreen('bookmarks') } }}>
        <span className="side-ico"><Icon name="bookmark" size={16} /></span>
        <span>收藏夹</span>
      </div>

      <div className="nav-sep" />

      {/* 白板（可折叠，无分隔线） */}
      <Section
        id="board"
        title="白板"
        collapsedSec={collapsedSec}
        onToggle={toggleSec}
        action={<span className="sec-add" title="新建白板" onClick={(e) => { e.stopPropagation(); void createBoard() }}><Icon name="plus" size={13} /></span>}
      >
        {boards.length === 0 && <div className="side-item disabled"><span>暂无白板</span></div>}
        {boards.map((b) => {
          const isActive = screen === 'board' && useStore.getState().activeBoardId === b.id
          const isEditing = editingBoard === b.id
          return (
            <div key={b.id} className={`side-item ${isActive ? 'active' : ''}`}
              onClick={() => { if (!isEditing) void useStore.getState().openBoard(b.id) }}>
              <span className="side-ico"><Icon name="board" size={16} /></span>
              {isEditing ? (
                <input ref={renameInputRef} className="side-rename" value={boardName}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setBoardName(e.target.value)}
                  onBlur={() => commitRename(b.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitRename(b.id); if (e.key === 'Escape') setEditingBoard(null) }} />
              ) : (
                <span className="side-label">{(b.name || '未命名白板').slice(0, 14)}</span>
              )}
              <span className="side-actions">
                <button className="side-act" title="重命名" onClick={(e) => { e.stopPropagation(); setEditingBoard(b.id); setBoardName(b.name || '未命名白板') }}><Icon name="edit" size={13} /></button>
                <button className="side-act danger" title="删除白板" onClick={(e) => { e.stopPropagation(); void removeBoard(b.id) }}><Icon name="trash" size={13} /></button>
              </span>
            </div>
          )
        })}
      </Section>

      {/* 系统设置（底部，常驻，不折叠） */}
      <div className={`side-item sys-item ${settingsOpen ? 'active' : ''}`} role="button" tabIndex={0}
        {...press(() => openSettings())}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSettings() } }}>
        <span className="side-ico"><Icon name="settings" size={16} /></span>
        <span>系统设置</span>
      </div>
    </aside>
  )
}
