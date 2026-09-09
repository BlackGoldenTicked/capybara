/**
 * 浏览器收藏夹视图
 * 当 screen === 'bookmarks' 时展示，替代常规的 FeedsPanel + ItemList + ReaderPane
 *
 * 布局：
 * - 左栏（窄）：树形文件夹结构（可折叠）
 * - 右栏（宽）：选中文件夹内的链接列表 / 随机漫步的链接
 *
 * 功能：
 * - 树形文件夹展示与折叠
 * - 点击文件夹查看内部链接
 * - 随机漫步：从全部书签中随机选一个
 * - AI 自动归类按钮
 */

import { useState, useEffect, useMemo } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'
import { press, pressBtn } from '../lib/press'
import type { BookmarkTreeNode, BookmarkLink } from '../env'
import type { CSSProperties } from 'react'

/** 递归渲染文件夹树 */
function FolderNode({ node, depth, activeFolderId, onSelect, onRename, onDelete }: {
  node: BookmarkTreeNode
  depth: number
  activeFolderId: number | null
  onSelect: (folderId: number) => void
  onRename: (id: number, title: string) => void
  onDelete: (id: number) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(node.folder.title)
  const [confirmDel, setConfirmDel] = useState(false)
  const isActive = activeFolderId === node.folder.id
  const isRoot = node.folder.id <= 1

  const commitRename = () => {
    const t = editTitle.trim()
    if (t && t !== node.folder.title) onRename(node.folder.id, t)
    setEditing(false)
  }

  return (
    <div className="bm-node">
      <div
        className={`bm-folder-row ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: 8 + depth * 12 }}
        role="button" tabIndex={0}
        {...press(() => onSelect(node.folder.id))}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.folder.id) } }}
      >
        {node.children.length > 0 ? (
          <button className="bm-toggle" {...pressBtn((e) => { e.stopPropagation(); setExpanded((v) => !v) })}>
            <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={12} />
          </button>
        ) : (
          <span className="bm-toggle-placeholder" />
        )}
        <span className="bm-folder-icon"><Icon name={isRoot ? 'bookmark' : 'folder'} size={14} /></span>
        {editing ? (
          <input
            className="bm-rename-input"
            value={editTitle}
            autoFocus
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitRename() } if (e.key === 'Escape') { setEditTitle(node.folder.title); setEditing(false) } }}
          />
        ) : (
          <span className="bm-folder-name" onPointerDown={(e) => { if (e.detail === 2) { e.stopPropagation(); setEditing(true) } }}>
            {node.folder.title}
          </span>
        )}
        <span className="bm-count">{node.linkCount || ''}</span>
        {!isRoot && !editing && (
          <button className="bm-folder-del" title="删除文件夹" {...pressBtn((e) => { e.stopPropagation(); setConfirmDel(true) })}>
            <Icon name="trash" size={11} />
          </button>
        )}
        {confirmDel && (
          <span className="bm-del-confirm" onPointerDown={(e) => e.stopPropagation()}>
            <button className="bm-del-cancel" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setConfirmDel(false) }}>取消</button>
            <button className="bm-del-ok" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(node.folder.id); setConfirmDel(false) }}>删除</button>
          </span>
        )}
      </div>
      {expanded && node.children.length > 0 && (
        <div className="bm-children">
          {node.children.map((child) => (
            <FolderNode
              key={child.folder.id}
              node={child}
              depth={depth + 1}
              activeFolderId={activeFolderId}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      {expanded && node.links.length > 0 && (
        <div className="bm-links-inline">
          {node.links.map((link) => (
            <LinkRow key={link.id} link={link} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

/** 文件夹内的链接行（内联在树形中） */
function LinkRow({ link, depth }: { link: BookmarkLink; depth: number }) {
  const { selectBookmarkLink, activeBookmarkLink, openInBrowser, deleteBookmarkLink } = useStore()
  const isActive = activeBookmarkLink?.id === link.id
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <div
      className={`bm-link-row ${isActive ? 'active' : ''}`}
      style={{ paddingLeft: 8 + depth * 12 + 16 }}
      {...press(() => selectBookmarkLink(link))}
    >
      <span className="bm-link-icon"><Icon name="link" size={12} /></span>
      <span className="bm-link-title" title={link.url}>{link.title}</span>
      {link.ai_category && <span className="bm-ai-tag" title={link.ai_category}>{link.ai_category.split(' > ')[0]}</span>}
      <button className="bm-link-del" title="删除" {...pressBtn((e) => { e.stopPropagation(); setConfirmDel(true) })}>
        <Icon name="trash" size={10} />
      </button>
      {confirmDel && (
        <span className="bm-del-confirm" onPointerDown={(e) => e.stopPropagation()}>
          <button className="bm-del-cancel" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setConfirmDel(false) }}>取消</button>
          <button className="bm-del-ok" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); void deleteBookmarkLink(link.id); setConfirmDel(false) }}>删除</button>
        </span>
      )}
    </div>
  )
}

/** 选中文件夹的链接列表（右栏） */
function LinkList({ links }: { links: BookmarkLink[] }) {
  const { selectBookmarkLink, activeBookmarkLink, openInBrowser, deleteBookmarkLink } = useStore()
  const [confirmDel, setConfirmDel] = useState<number | null>(null)

  if (links.length === 0) {
    return <div className="bm-empty">此文件夹暂无链接</div>
  }

  return (
    <div className="bm-link-list">
      {links.map((link) => (
        <div
          key={link.id}
          className={`bm-card ${activeBookmarkLink?.id === link.id ? 'active' : ''}`}
          {...press(() => selectBookmarkLink(link))}
        >
          <div className="bm-card-header">
            <span className="bm-card-favicon">
              {link.icon ? <img src={link.icon} alt="" className="bm-favicon-img" /> : <Icon name="link" size={14} />}
            </span>
            <span className="bm-card-title" title={link.title}>{link.title}</span>
          </div>
          <div className="bm-card-url" title={link.url}>{link.url}</div>
          {link.ai_category && (
            <div className="bm-card-ai">
              <Icon name="sparkles" size={11} /> {link.ai_category}
            </div>
          )}
          <div className="bm-card-actions">
            <button className="bm-card-open" title="在浏览器中打开" {...pressBtn(() => openInBrowser(link.url))}>
              <Icon name="external" size={12} /> 打开
            </button>
            {confirmDel === link.id ? (
              <span className="bm-del-confirm" onPointerDown={(e) => e.stopPropagation()}>
                <button className="bm-del-cancel" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setConfirmDel(null) }}>取消</button>
                <button className="bm-del-ok" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); void deleteBookmarkLink(link.id); setConfirmDel(null) }}>删除</button>
              </span>
            ) : (
              <button className="bm-card-del" title="删除" {...pressBtn((e) => { e.stopPropagation(); setConfirmDel(link.id) })}>
                <Icon name="trash" size={12} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/** 从树中提取某个文件夹的链接 */
function collectLinksFromFolder(nodes: BookmarkTreeNode[], folderId: number): BookmarkLink[] {
  for (const node of nodes) {
    if (node.folder.id === folderId) return node.links
    const found = collectLinksFromFolder(node.children, folderId)
    if (found.length > 0) return found
  }
  return []
}

/** 随机漫步展示区 */
function RandomWalkCard({ link }: { link: BookmarkLink }) {
  const { openInBrowser, selectBookmarkLink } = useStore()
  if (!link) return null
  return (
    <div className="bm-random-card">
      <div className="bm-random-badge">🎲 随机漫步</div>
      <div className="bm-card-header">
        <span className="bm-card-favicon">
          {link.icon ? <img src={link.icon} alt="" className="bm-favicon-img" /> : <Icon name="link" size={16} />}
        </span>
        <span className="bm-card-title">{link.title}</span>
      </div>
      <div className="bm-card-url">{link.url}</div>
      {link.ai_category && (
        <div className="bm-card-ai"><Icon name="sparkles" size={11} /> {link.ai_category}</div>
      )}
      <div className="bm-card-actions">
        <button className="bm-card-open" {...pressBtn(() => openInBrowser(link.url))}>
          <Icon name="external" size={12} /> 打开链接
        </button>
        <button className="bm-card-open" {...pressBtn(() => selectBookmarkLink(link))}>
          <Icon name="info" size={12} /> 详情
        </button>
      </div>
    </div>
  )
}

export function BookmarkView() {
  const {
    bookmarkTree, bookmarkLoading, activeBookmarkFolderId, activeBookmarkLink,
    bookmarkRandomLink, aiClassifying,
    setBookmarkFolder, selectBookmarkLink, importBookmarks,
    renameBookmarkFolder, deleteBookmarkFolder,
    bookmarkRandomWalk, aiClassifyBookmarks, openInBrowser,
  } = useStore()

  useEffect(() => {
    void (async () => {
      // 首次进入时加载树
      if (bookmarkTree.length === 0) {
        await useStore.getState().loadBookmarkTree()
      }
    })()
  }, [bookmarkTree.length])

  // 当前选中文件夹的链接列表
  const currentLinks = useMemo(() => {
    if (activeBookmarkFolderId == null) return []
    return collectLinksFromFolder(bookmarkTree, activeBookmarkFolderId)
  }, [bookmarkTree, activeBookmarkFolderId])

  // 统计总数
  const totalCount = useMemo(() => {
    const count = (nodes: BookmarkTreeNode[]): number =>
      nodes.reduce((sum, n) => sum + n.links.length + count(n.children), 0)
    return count(bookmarkTree)
  }, [bookmarkTree])

  const treeW = 260
  const treeStyle: CSSProperties = { width: treeW, flexShrink: 0 }

  return (
    <div className="bm-view">
      {/* 左栏：文件夹树 */}
      <aside className="bm-tree-panel" style={treeStyle}>
        <div className="bm-tree-head">
          <span>收藏夹</span>
          <span className="bm-total-count">{totalCount || ''}</span>
        </div>
        <div className="bm-tree-actions">
          <button className="bm-action-btn" title="导入浏览器收藏夹" {...pressBtn(() => void importBookmarks())}>
            <Icon name="upload" size={13} /> 导入
          </button>
          <button className="bm-action-btn" title="随机漫步" {...pressBtn(() => void bookmarkRandomWalk())}>
            <Icon name="shuffle" size={13} /> 随机
          </button>
          <button
            className="bm-action-btn"
            title="AI 自动归类"
            disabled={aiClassifying}
            {...pressBtn(() => void aiClassifyBookmarks())}
          >
            {aiClassifying ? <Icon name="refresh" size={13} className="spin" /> : <Icon name="sparkles" size={13} />}
            {aiClassifying ? '归类中' : 'AI 归类'}
          </button>
        </div>
        <div className="bm-tree-body">
          {bookmarkLoading && bookmarkTree.length === 0 ? (
            <div className="bm-loading">加载中…</div>
          ) : bookmarkTree.length === 0 ? (
            <div className="bm-empty-tree">
              <p>暂无收藏夹</p>
              <p className="bm-empty-hint">点击上方「导入」按钮，选择浏览器导出的 bookmarks.html 文件</p>
            </div>
          ) : (
            bookmarkTree.map((node) => (
              <FolderNode
                key={node.folder.id}
                node={node}
                depth={0}
                activeFolderId={activeBookmarkFolderId}
                onSelect={setBookmarkFolder}
                onRename={renameBookmarkFolder}
                onDelete={deleteBookmarkFolder}
              />
            ))
          )}
        </div>
      </aside>

      {/* 右栏：链接列表 / 随机漫步 */}
      <div className="bm-content">
        {bookmarkRandomLink ? (
          <div className="bm-random-section">
            <div className="bm-random-header">
              <h3>🎲 随机漫步</h3>
              <button className="bm-action-btn" {...pressBtn(() => void bookmarkRandomWalk())}>
                <Icon name="refresh" size={13} /> 换一个
              </button>
            </div>
            <RandomWalkCard link={bookmarkRandomLink} />
          </div>
        ) : activeBookmarkLink ? (
          <div className="bm-detail-section">
            <div className="bm-detail-header">
              <button className="bm-back" {...pressBtn(() => selectBookmarkLink(null))}>
                <Icon name="arrowLeft" size={14} /> 返回
              </button>
            </div>
            <div className="bm-detail-card">
              <h2 className="bm-detail-title">{activeBookmarkLink.title}</h2>
              <div className="bm-detail-url">{activeBookmarkLink.url}</div>
              {activeBookmarkLink.ai_category && (
                <div className="bm-card-ai"><Icon name="sparkles" size={12} /> {activeBookmarkLink.ai_category}</div>
              )}
              <div className="bm-card-actions">
                <button className="bm-card-open" {...pressBtn(() => openInBrowser(activeBookmarkLink.url))}>
                  <Icon name="external" size={14} /> 在浏览器中打开
                </button>
              </div>
            </div>
          </div>
        ) : activeBookmarkFolderId != null ? (
          <div className="bm-folder-section">
            <div className="bm-folder-header">
              <h3>链接列表（{currentLinks.length}）</h3>
            </div>
            <LinkList links={currentLinks} />
          </div>
        ) : (
          <div className="bm-placeholder">
            <div className="bm-placeholder-icon"><Icon name="bookmark" size={48} /></div>
            <p>选择一个文件夹查看书签</p>
            <p className="bm-placeholder-hint">或点击「随机」按钮，发现遗忘的宝藏</p>
          </div>
        )}
      </div>
    </div>
  )
}
