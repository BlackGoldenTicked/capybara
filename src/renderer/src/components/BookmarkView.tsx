/**
 * 浏览器收藏夹视图
 * 当 screen === 'bookmarks' 时展示，替代常规的 FeedsPanel + ItemList + ReaderPane
 *
 * 布局：
 * - 左栏（窄）：树形文件夹结构（可折叠）
 * - 右栏（宽）：选中文件夹内的链接列表 + 详情
 *
 * 功能：
 * - 树形文件夹展示与折叠（展开/收起全部在标题栏）
 * - 点击文件夹查看内部链接
 * - 文件夹行悬浮时出现随机按钮，点击直接在浏览器打开该文件夹内的随机链接
 * - 导入 / AI 归类 已移至「设置 → 浏览器收藏夹」
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'
import { press, pressBtn } from '../lib/press'
import type { BookmarkTreeNode, BookmarkLink } from '../env'
import type { CSSProperties } from 'react'

/** 递归渲染文件夹树 */
function FolderNode({ node, depth, activeFolderId, onSelect, onRename, onDelete, expandedIds, onToggle, onRandom }: {
  node: BookmarkTreeNode
  depth: number
  activeFolderId: number | null
  onSelect: (folderId: number) => void
  onRename: (id: number, title: string) => void
  onDelete: (id: number) => void
  expandedIds: Set<number>
  onToggle: (id: number) => void
  onRandom: (folderId: number) => void
}) {
  const expanded = expandedIds.has(node.folder.id)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(node.folder.title)
  const [confirmDel, setConfirmDel] = useState(false)
  const [hovered, setHovered] = useState(false)
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...press(() => onSelect(node.folder.id))}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.folder.id) } }}
      >
        {node.children.length > 0 ? (
          <button className="bm-toggle" {...pressBtn((e) => { e.stopPropagation(); onToggle(node.folder.id) })}>
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
        {hovered && (node.linkCount ?? node.links.length) > 0 && (
          <button className="bm-folder-random" title="随机打开一个链接" {...pressBtn((e) => { e.stopPropagation(); onRandom(node.folder.id) })}>
            <Icon name="shuffle" size={11} />
          </button>
        )}
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
              expandedIds={expandedIds}
              onToggle={onToggle}
              onRandom={onRandom}
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
            <button className="bm-card-open" title="在浏览器中打开" onClick={() => openInBrowser(link.url)}>
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

/** 从树中查找某个文件夹节点 */
function findFolderNode(nodes: BookmarkTreeNode[], folderId: number): BookmarkTreeNode | null {
  for (const node of nodes) {
    if (node.folder.id === folderId) return node
    const found = findFolderNode(node.children, folderId)
    if (found) return found
  }
  return null
}

/** 从树中提取某个文件夹的直接链接 */
function collectLinksFromFolder(nodes: BookmarkTreeNode[], folderId: number): BookmarkLink[] {
  const node = findFolderNode(nodes, folderId)
  return node ? node.links : []
}

export function BookmarkView() {
  const {
    bookmarkTree, bookmarkLoading, activeBookmarkFolderId, activeBookmarkLink,
    setBookmarkFolder, selectBookmarkLink,
    renameBookmarkFolder, deleteBookmarkFolder,
    openInBrowser, showToast,
  } = useStore()

  // 树状展开/收起状态管理
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    // 默认展开一层 (根节点的直接子节点)
    const init = new Set<number>()
    bookmarkTree.forEach((n) => { if (n.folder.id > 1) init.add(n.folder.id) })
    return init
  })

  const onToggle = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // 全部展开/收起
  const [allExpanded, setAllExpanded] = useState(false)
  const toggleAll = useCallback(() => {
    if (allExpanded) {
      setExpandedIds(new Set())
      setAllExpanded(false)
    } else {
      const all = new Set<number>()
      const walk = (nodes: BookmarkTreeNode[]) => {
        for (const n of nodes) {
          if (n.children.length > 0) {
            all.add(n.folder.id)
            walk(n.children)
          }
        }
      }
      walk(bookmarkTree)
      setExpandedIds(all)
      setAllExpanded(true)
    }
  }, [allExpanded, bookmarkTree])

  // 树数据变化时重新同步展开状态
  useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set<number>()
      const syncDefault = (nodes: BookmarkTreeNode[]) => {
        for (const n of nodes) {
          if (prev.has(n.folder.id) || n.folder.id > 1) next.add(n.folder.id)
          syncDefault(n.children)
        }
      }
      syncDefault(bookmarkTree)
      return next
    })
  }, [bookmarkTree])

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

  // 从指定文件夹（含子文件夹）中随机选一个链接并直接浏览器打开
  const onRandomFolder = useCallback((folderId: number) => {
    const node = findFolderNode(bookmarkTree, folderId)
    if (!node) return
    const allLinks: BookmarkLink[] = []
    const collect = (n: BookmarkTreeNode) => {
      allLinks.push(...n.links)
      n.children.forEach(collect)
    }
    collect(node)
    if (allLinks.length === 0) { showToast('此文件夹下暂无链接'); return }
    const pick = allLinks[Math.floor(Math.random() * allLinks.length)]
    openInBrowser(pick.url)
  }, [bookmarkTree, openInBrowser, showToast])

  return (
    <div className="bm-view">
      {/* 左栏：文件夹树 */}
      <aside className="bm-tree-panel" style={treeStyle}>
        <div className="bm-tree-head">
          <span>收藏夹</span>
          <span className="bm-total-count">{totalCount || ''}</span>
          <button className="bm-toggle-all" title={allExpanded ? '全部收起' : '全部展开'} {...pressBtn(() => toggleAll())}>
            <Icon name={allExpanded ? 'list' : 'rows'} size={12} />
          </button>
        </div>
        <div className="bm-tree-body">
          {bookmarkLoading && bookmarkTree.length === 0 ? (
            <div className="bm-loading">加载中…</div>
          ) : bookmarkTree.length === 0 ? (
            <div className="bm-empty-tree">
              <p>暂无收藏夹</p>
              <p className="bm-empty-hint">请在「设置 → 浏览器收藏夹」导入 bookmarks.html</p>
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
                expandedIds={expandedIds}
                onToggle={onToggle}
                onRandom={onRandomFolder}
              />
            ))
          )}
        </div>
      </aside>

      {/* 右栏：链接列表 / 详情 */}
      <div className="bm-content">
        {activeBookmarkLink ? (
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
                <button className="bm-card-open" onClick={() => openInBrowser(activeBookmarkLink.url)}>
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
