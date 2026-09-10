/**
 * 浏览器收藏夹管理（设置页）
 * 包括：导入、AI 归类、数据概览
 * 阅读页只负责浏览和随机打开链接，管理功能全部收拢到这里
 */

import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'
import { pressBtn } from '../lib/press'
import type { BookmarkTreeNode } from '../env'

/** 收集树中全部链接数与总文件夹数 */
function tally(nodes: BookmarkTreeNode[]): { links: number; folders: number } {
  let links = 0, folders = 0
  const walk = (list: BookmarkTreeNode[]) => {
    for (const n of list) {
      folders++
      links += n.links.length
      walk(n.children)
    }
  }
  walk(nodes)
  return { links, folders }
}

export function BookmarkManager() {
  const {
    bookmarkTree, importBookmarks, aiClassifyBookmarks, aiClassifying, showToast,
  } = useStore()

  const [importing, setImporting] = useState(false)
  const { links, folders } = tally(bookmarkTree)

  // 进入此 tab 时确保树已加载
  useEffect(() => {
    if (bookmarkTree.length === 0) {
      void useStore.getState().loadBookmarkTree()
    }
  }, [bookmarkTree.length])

  const handleImport = async () => {
    setImporting(true)
    try {
      await importBookmarks()
    } catch {
      // toast already shown in store
    } finally {
      setImporting(false)
    }
  }

  const handleAiClassify = async () => {
    if (links === 0) {
      showToast('请先导入书签')
      return
    }
    await aiClassifyBookmarks()
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">导入浏览器收藏夹</p>
        </div>
        <p className="src-hint">
          从 Chrome / Edge / Safari / Firefox 导出的 <code>bookmarks.html</code> 文件导入。
          支持多浏览器书签合并：已存在的文件夹会被复用，不会重复创建。
        </p>
        <div className="bm-stats" style={{ margin: '12px 0' }}>
          <div className="bm-stat">
            <span className="bm-stat-num">{folders}</span>
            <span className="bm-stat-label">文件夹</span>
          </div>
          <div className="bm-stat">
            <span className="bm-stat-num">{links}</span>
            <span className="bm-stat-label">书签</span>
          </div>
        </div>
        <div className="src-actions">
          <button onClick={() => void handleImport()} disabled={importing}>
            <Icon name={importing ? 'refresh' : 'upload'} size={14} className={importing ? 'spin' : ''} />
            {importing ? '导入中…' : '导入 bookmarks.html'}
          </button>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">AI 自动归类</p>
        <p className="src-hint">
          使用配置的 AI 模型对所有未归类的书签进行智能分类，自动归入或创建子文件夹。
          需先在「AI 模型」tab 中配置 API Key。
        </p>
        <div className="src-actions">
          <button onClick={() => void handleAiClassify()} disabled={aiClassifying || links === 0}>
            {aiClassifying ? <Icon name="refresh" size={14} className="spin" /> : <Icon name="sparkles" size={14} />}
            {aiClassifying ? '归类中…' : '开始 AI 归类'}
          </button>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">使用说明</p>
        <ul style={{ paddingLeft: 16, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <li>导入后可在「收藏夹」页面浏览树状结构</li>
          <li>鼠标悬浮文件夹时右侧出现 🎲 按钮，点击直接从该文件夹中随机打开一个链接</li>
          <li>支持双击文件夹名重命名、🗑 图标删除</li>
          <li>导入支持增量合并：重复导入不会创建重复文件夹</li>
        </ul>
      </div>
    </div>
  )
}
