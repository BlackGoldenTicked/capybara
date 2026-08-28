/**
 * 白板列表视图：将原始 Graph（nodes + edges）投影为可折叠多层级列表
 *
 * 数据逻辑：
 * - 底层保留原始 Graph 结构，仅存储 nodes 节点集合和 edges 有向关系集合
 * - 不将数据改造成树状 children 结构
 * - 前端基于当前展示起点和节点展开状态，通过 DFS 深度优先遍历动态生成列表
 * - 遍历时维护当前 path 集合，避免无限递归
 *
 * 环处理：发现当前节点已存在于 path 中即判定为环，生成环回引用项并停止递归
 * 多父节点：第二次及以后出现的节点统一按引用节点处理
 */

import { useMemo, useState, useCallback } from 'react'
import type { Card, BoardLink } from '../env'
import { Icon } from './icons'

interface Props {
  cards: Card[]
  links: BoardLink[]
  onJumpToCard: (id: number) => void
}

interface ListRow {
  cardId: number
  depth: number
  isRef: boolean      // 引用节点（重复出现）
  isCycle: boolean    // 环回引用
  cycleTarget?: string // 环回到的目标节点名
  expanded: boolean
  hasChildren: boolean
}

/**
 * DFS 遍历：将 Graph 投影为列表行
 */
function projectGraph(
  cards: Card[],
  links: BoardLink[],
  expandedSet: Set<number>
): ListRow[] {
  const cardMap = new Map(cards.map((c) => [c.id, c]))
  // 邻接表：from_id → [to_id...]
  const adj = new Map<number, number[]>()
  // 入边计数：用于找出无头节点（入度为 0 的节点）
  const inDegree = new Map<number, number>()
  for (const c of cards) { adj.set(c.id, []); inDegree.set(c.id, 0) }
  for (const lk of links) {
    if (!adj.has(lk.from_id)) adj.set(lk.from_id, [])
    adj.get(lk.from_id)!.push(lk.to_id)
    inDegree.set(lk.to_id, (inDegree.get(lk.to_id) ?? 0) + 1)
  }

  // 顶层节点：所有无头节点（入度为 0）
  const roots = cards.filter((c) => (inDegree.get(c.id) ?? 0) === 0).map((c) => c.id)

  const rows: ListRow[] = []
  const visited = new Set<number>()      // 全局已出现（用于判断引用节点）
  const pathSet = new Set<number>()      // 当前路径（用于判断环）

  const dfs = (nodeId: number, depth: number) => {
    // 环检测：当前节点已在 path 中
    if (pathSet.has(nodeId)) {
      const card = cardMap.get(nodeId)
      rows.push({
        cardId: nodeId,
        depth,
        isRef: false,
        isCycle: true,
        cycleTarget: card?.title || `#${nodeId}`,
        expanded: false,
        hasChildren: false,
      })
      return
    }

    const children = adj.get(nodeId) ?? []
    const isRef = visited.has(nodeId)   // 引用节点：之前已出现过
    const expanded = expandedSet.has(nodeId) && !isRef

    rows.push({
      cardId: nodeId,
      depth,
      isRef,
      isCycle: false,
      expanded,
      hasChildren: children.length > 0,
    })

    // 引用节点不再展开（避免重复展开）
    if (isRef) return

    visited.add(nodeId)
    pathSet.add(nodeId)

    if (expanded) {
      for (const childId of children) {
        dfs(childId, depth + 1)
      }
    }

    pathSet.delete(nodeId)
  }

  // 遍历所有顶层节点
  for (const rootId of roots) {
    dfs(rootId, 0)
  }

  // 如果没有顶层节点（全环），取所有节点
  if (rows.length === 0 && cards.length > 0) {
    for (const c of cards) {
      if (!visited.has(c.id)) dfs(c.id, 0)
    }
  }

  return rows
}

export function BoardListview({ cards, links, onJumpToCard }: Props) {
  const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set())

  const rows = useMemo(() => projectGraph(cards, links, expandedSet), [cards, links, expandedSet])

  const cardMap = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  const toggle = useCallback((id: number) => {
    setExpandedSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <div className="board-listview">
      <div className="listview-header">
        <Icon name="list" size={16} />
        <span>列表视图 · {cards.length} 个节点 · {links.length} 条关系</span>
      </div>
      <div className="listview-body">
        {rows.length === 0 && (
          <div className="listview-empty">暂无节点</div>
        )}
        {rows.map((row, i) => {
          const card = cardMap.get(row.cardId)
          if (!card) return null
          return (
            <div
              key={`${row.cardId}-${i}`}
              className={`list-row ${row.isRef ? 'row-ref' : ''} ${row.isCycle ? 'row-cycle' : ''}`}
              style={{ paddingLeft: `${row.depth * 24 + 12}px` }}
              onClick={() => {
                if (row.isCycle) return
                if (row.hasChildren && !row.isRef) toggle(row.cardId)
                else onJumpToCard(row.cardId)
              }}
              onDoubleClick={() => !row.isCycle && onJumpToCard(row.cardId)}
            >
              {/* 层级竖线 */}
              {row.depth > 0 && Array.from({ length: row.depth }).map((_, j) => (
                <span key={j} className="list-indent-line" style={{ left: `${j * 24 + 8}px` }} />
              ))}
              {/* 展开/收起箭头 */}
              {row.hasChildren && !row.isRef ? (
                <span className="list-toggle">
                  <Icon name={row.expanded ? 'chevronDown' : 'chevronRight'} size={14} />
                </span>
              ) : (
                <span className="list-toggle-placeholder" />
              )}
              {/* 节点内容 */}
              <span className={`list-icon kind-${card.kind}`}>
                <Icon name={card.kind === 'text' ? 'type' : card.kind === 'link' ? 'link' : card.kind === 'image' ? 'image' : card.kind === 'video' ? 'video' : card.kind === 'file' ? 'file' : 'ref'} size={14} />
              </span>
              <span className="list-title">{card.title || `#${card.id}`}</span>
              {row.isRef && <span className="list-badge ref-badge">引用</span>}
              {row.isCycle && <span className="list-badge cycle-badge">回到 {row.cycleTarget}</span>}
              {row.hasChildren && !row.isRef && !row.expanded && (
                <span className="list-children-count">{(links.filter((l) => l.from_id === row.cardId).length)} 项</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
