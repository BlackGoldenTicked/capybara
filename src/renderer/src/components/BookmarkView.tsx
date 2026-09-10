/**
 * 浏览器收藏夹视图
 *
 * 布局：左栏树形结构 + 右栏详情
 * 逻辑：
 *   - 左栏：VS Code 资源管理器式树（文件夹 + 内联链接），单击文件夹 = 选中 + 展开/收起
 *   - 右栏：当前选中文件夹的子文件夹/链接全宽列表，带面包屑路径
 *   - 首次加载后默认选中并展开根节点
 *   - hover 文件夹显示随机按钮
 *   - 管理功能（导入/AI分类）已移至「设置 → 浏览器收藏夹」
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'
import { press, pressBtn } from '../lib/press'
import type { BookmarkTreeNode, BookmarkLink } from '../env'
import type { CSSProperties } from 'react'

const STORAGE_KEY = 'readflow:bookmark-expanded:v2'

/** 从 localStorage 读取展开状态；从未保存过返回 null（与「手动全部收起」区分） */
function loadExpandedIds(): Set<number> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return new Set(JSON.parse(raw) as number[])
  } catch { /* ignore */ }
  return null
}

/** 保存展开状态到 localStorage */
function saveExpandedIds(ids: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch { /* ignore */ }
}

/** 递归渲染文件夹树（嵌套缩进 + 引导线，单击文件夹 = 选中 + 展开/收起） */
function FolderNode({ node, activeFolderId, onSelect, onRename, onDelete, expandedIds, onToggle, onRandom }: {
  node: BookmarkTreeNode
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
  const hasContent = node.children.length > 0 || node.links.length > 0

  const commitRename = () => {
    const t = editTitle.trim()
    if (t && t !== node.folder.title) onRename(node.folder.id, t)
    setEditing(false)
  }

  return (
    <div className="bm-node">
      <div
        className={`bm-folder-row ${isActive ? 'active' : ''}`}
        role="button" tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...press(() => { onSelect(node.folder.id); if (hasContent) onToggle(node.folder.id) })}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.folder.id); if (hasContent) onToggle(node.folder.id) } }}
      >
        {hasContent ? (
          <button className="bm-toggle" {...pressBtn((e) => { e.stopPropagation(); onToggle(node.folder.id) })}>
            <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={12} />
          </button>
        ) : (
          <span className="bm-toggle-placeholder" />
        )}
        <span className={`bm-folder-icon ${expanded ? 'open' : ''}`}>
          <Icon name="folder" size={14} />
        </span>
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
        <span className="bm-actions">
          {hovered && (node.linkCount ?? node.links.length) > 0 && (
            <button className="bm-folder-random" title="随机打开一个链接" {...pressBtn((e) => { e.stopPropagation(); onRandom(node.folder.id) })}>
              <Icon name="shuffle" size={12} />
            </button>
          )}
        </span>
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
      {expanded && (
        <div className="bm-children">
          {node.children.map((child) => (
            <FolderNode
              key={child.folder.id}
              node={child}
              activeFolderId={activeFolderId}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onRandom={onRandom}
            />
          ))}
          {node.links.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  )
}

/** 文件夹内的链接行（内联在树形中） */
function LinkRow({ link }: { link: BookmarkLink }) {
  const { selectBookmarkLink, activeBookmarkLink, deleteBookmarkLink } = useStore()
  const isActive = activeBookmarkLink?.id === link.id
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <div
      className={`bm-link-row ${isActive ? 'active' : ''}`}
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

/** 从树中查找某个文件夹节点 */
function findFolderNode(nodes: BookmarkTreeNode[], folderId: number): BookmarkTreeNode | null {
  for (const node of nodes) {
    if (node.folder.id === folderId) return node
    const found = findFolderNode(node.children, folderId)
    if (found) return found
  }
  return null
}

/** 从树中查找到某文件夹的路径（含自身，用于面包屑） */
function findFolderPath(nodes: BookmarkTreeNode[], folderId: number, trail: BookmarkTreeNode[] = []): BookmarkTreeNode[] | null {
  for (const node of nodes) {
    const next = [...trail, node]
    if (node.folder.id === folderId) return next
    const found = findFolderPath(node.children, folderId, next)
    if (found) return found
  }
  return null
}

/** 右栏：子文件夹列表（全宽行，铺满主窗口） */
function SubFolderList({ nodes, onSelect }: { nodes: BookmarkTreeNode[]; onSelect: (id: number) => void }) {
  if (nodes.length === 0) return null
  return (
    <div className="bm-subfolders">
      <div className="bm-subfolders-title">子文件夹</div>
      <div className="bm-subfolder-list">
        {nodes.map((n) => (
          <div
            key={n.folder.id}
            className="bm-subrow"
            role="button" tabIndex={0}
            {...press(() => onSelect(n.folder.id))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(n.folder.id) } }}
          >
            <span className="bm-subrow-icon"><Icon name="folder" size={15} /></span>
            <span className="bm-subrow-name">{n.folder.title}</span>
            <span className="bm-subrow-meta">
              {n.children.length > 0 && `${n.children.length} 个子文件夹 · `}
              {n.linkCount ?? n.links.length} 个链接
            </span>
            <span className="bm-subrow-arrow"><Icon name="chevronRight" size={14} /></span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 右栏：链接列表（全宽行） */
function LinkList({ links }: { links: BookmarkLink[] }) {
  const { selectBookmarkLink, activeBookmarkLink, openInBrowser, deleteBookmarkLink } = useStore()
  const [confirmDel, setConfirmDel] = useState<number | null>(null)

  if (links.length === 0) return null

  return (
    <div className="bm-link-list">
      <div className="bm-link-list-title">链接 ({links.length})</div>
      <div className="bm-link-rows">
        {links.map((link) => (
          <div
            key={link.id}
            className={`bm-linkrow ${activeBookmarkLink?.id === link.id ? 'active' : ''}`}
            {...press(() => selectBookmarkLink(link))}
          >
            <span className="bm-linkrow-favicon">
              {link.icon ? <img src={link.icon} alt="" className="bm-favicon-img" /> : <Icon name="link" size={13} />}
            </span>
            <span className="bm-linkrow-title" title={link.title}>{link.title}</span>
            <span className="bm-linkrow-url" title={link.url}>{link.url}</span>
            {link.ai_category && <span className="bm-ai-tag" title={link.ai_category}>{link.ai_category.split(' > ')[0]}</span>}
            <span className="bm-linkrow-actions">
              <button className="bm-card-open" title="在浏览器中打开" {...pressBtn((e) => { e.stopPropagation(); openInBrowser(link.url) })}>
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
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BookmarkView() {
  const {
    bookmarkTree, bookmarkLoading, activeBookmarkFolderId, activeBookmarkLink,
    setBookmarkFolder, selectBookmarkLink,
    renameBookmarkFolder, deleteBookmarkFolder,
    openInBrowser, showToast,
  } = useStore()

  // 树状展开/收起状态管理（持久化；无持久化状态时首次加载后默认展开顶层节点）
  const [savedExpanded] = useState(() => loadExpandedIds())
  const hasSavedRef = useRef(savedExpanded != null)
  const touchedRef = useRef(false)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => savedExpanded ?? new Set())

  const onToggle = useCallback((id: number) => {
    touchedRef.current = true
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveExpandedIds(next)
      return next
    })
  }, [])

  // 全部展开/收起
  const [allExpanded, setAllExpanded] = useState(false)
  const toggleAll = useCallback(() => {
    touchedRef.current = true
    if (allExpanded) {
      setExpandedIds(new Set())
      saveExpandedIds(new Set())
      setAllExpanded(false)
    } else {
      const all = new Set<number>()
      const walk = (nodes: BookmarkTreeNode[]) => {
        for (const n of nodes) {
          if (n.children.length > 0 || n.links.length > 0) {
            all.add(n.folder.id)
            walk(n.children)
          }
        }
      }
      walk(bookmarkTree)
      setExpandedIds(all)
      saveExpandedIds(all)
      setAllExpanded(true)
    }
  }, [allExpanded, bookmarkTree])

  // 树首次加载后：无持久化状态且用户未手动展开/收起过时，
  // 默认展开顶层节点（VS Code 资源管理器初始视野）；之后完全尊重用户状态
  useEffect(() => {
    if (bookmarkTree.length === 0 || hasSavedRef.current || touchedRef.current) return
    setExpandedIds((prev) => {
      if (prev.size > 0) return prev
      const init = new Set<number>()
      bookmarkTree.forEach((n) => { if (n.children.length > 0 || n.links.length > 0) init.add(n.folder.id) })
      hasSavedRef.current = true
      saveExpandedIds(init)
      return init
    })
  }, [bookmarkTree])

  // 首次进入时加载树
  useEffect(() => {
    if (bookmarkTree.length === 0) {
      void useStore.getState().loadBookmarkTree()
    }
  }, [bookmarkTree.length])

  // 默认选中根节点（第一个节点）
  useEffect(() => {
    if (bookmarkTree.length > 0 && activeBookmarkFolderId == null) {
      setBookmarkFolder(bookmarkTree[0].folder.id)
    }
  }, [bookmarkTree, activeBookmarkFolderId, setBookmarkFolder])

  // 当前选中文件夹的面包屑路径（末项为当前节点）
  const currentPath = useMemo(() => {
    if (activeBookmarkFolderId == null) return null
    return findFolderPath(bookmarkTree, activeBookmarkFolderId)
  }, [bookmarkTree, activeBookmarkFolderId])
  const currentNode = currentPath ? currentPath[currentPath.length - 1] : null

  // 统计总数
  const totalCount = useMemo(() => {
    const count = (nodes: BookmarkTreeNode[]): number =>
      nodes.reduce((sum, n) => sum + n.links.length + count(n.children), 0)
    return count(bookmarkTree)
  }, [bookmarkTree])

  const treeW = 280
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

      {/* 右栏：子文件夹 + 链接列表 / 链接详情 */}
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
        ) : currentNode ? (
          <div className="bm-folder-section">
            <div className="bm-folder-header">
              <div className="bm-crumb">
                {currentPath?.map((n, i) => (
                  <span key={n.folder.id} className="bm-crumb-item">
                    {i > 0 && <Icon name="chevronRight" size={12} />}
                    {i === currentPath.length - 1 ? (
                      <span className="bm-crumb-current">{n.folder.title}</span>
                    ) : (
                      <button {...pressBtn(() => setBookmarkFolder(n.folder.id))}>{n.folder.title}</button>
                    )}
                  </span>
                ))}
              </div>
              <span className="bm-folder-meta">
                {currentNode.children.length > 0 && `${currentNode.children.length} 个子文件夹`}
                {currentNode.children.length > 0 && currentNode.links.length > 0 && ' · '}
                {currentNode.links.length > 0 && `${currentNode.links.length} 个链接`}
              </span>
            </div>
            <div className="bm-folder-content">
              <SubFolderList nodes={currentNode.children} onSelect={setBookmarkFolder} />
              <LinkList links={currentNode.links} />
              {currentNode.children.length === 0 && currentNode.links.length === 0 && (
                <div className="bm-empty-folder">此文件夹为空</div>
              )}
            </div>
          </div>
        ) : (
          <div className="bm-placeholder">
            <div className="bm-placeholder-icon"><Icon name="bookmark" size={48} /></div>
            <p>选择一个文件夹查看书签</p>
          </div>
        )}
      </div>
    </div>
  )
}
