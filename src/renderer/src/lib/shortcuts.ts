/**
 * ReadFlow 快捷键系统
 *
 * 遵循主流桌面软件约定（macOS 以 ⌘ 为主，Windows/Linux 自动映射为 Ctrl）：
 * - Mod+,        打开系统配置
 * - Mod+F        聚焦搜索
 * - Mod+R        刷新全部源
 * - Mod+N        新建（快速添加）
 * - Mod+1~6      切换 RSS/稍后读/已收藏/已读/归档/全部
 * - Mod+B        切换白板
 * - Mod+/        快捷键帮助（打开快捷键配置页）
 * - j / k        下一条 / 上一条
 * - e / l / f    归档 / 稍后读 / 收藏
 * - o            用浏览器打开当前条目
 * - Escape       关闭面板 / 返回
 *
 * 组合键统一用规范串表示，例如 "Mod+," "Mod+F" "j" "Escape"。
 * Mod = ⌘(mac) 或 Ctrl(其它)；Shift / Alt 原样保留。
 */

export type ShortcutAction =
  | 'openSettings' | 'focusSearch' | 'refresh' | 'quickAdd'
  | 'goRss' | 'goLater' | 'goFavorite' | 'goRead' | 'goArchived' | 'goAll'
  | 'toggleBoard' | 'nextItem' | 'prevItem' | 'archiveItem'
  | 'laterItem' | 'favoriteItem' | 'openLink' | 'help' | 'close'

/** 设置页中分组展示，便于用户理解每项作用 */
export const SHORTCUT_GROUPS: Array<{ title: string; items: Array<{ key: ShortcutAction; label: string; desc: string }> }> = [
  {
    title: '通用',
    items: [
      { key: 'openSettings', label: '打开系统配置', desc: '打开设置窗口' },
      { key: 'focusSearch', label: '聚焦搜索', desc: '光标移到搜索框' },
      { key: 'refresh', label: '刷新全部源', desc: '立即刷新所有订阅源' },
      { key: 'quickAdd', label: '新建条目', desc: '打开快速添加' },
      { key: 'help', label: '快捷键帮助', desc: '打开本配置页' },
      { key: 'close', label: '关闭 / 返回', desc: '关闭弹层、返回列表' }
    ]
  },
  {
    title: '视图切换',
    items: [
      { key: 'goRss', label: 'RSS', desc: '切到 RSS 未读' },
      { key: 'goLater', label: '稍后读', desc: '切到稍后读' },
      { key: 'goFavorite', label: '已收藏', desc: '切到已收藏' },
      { key: 'goRead', label: '已读', desc: '切到已读列表' },
      { key: 'goArchived', label: '归档', desc: '切到归档' },
      { key: 'goAll', label: '全部条目', desc: '切到全部' },
      { key: 'toggleBoard', label: '切换白板', desc: '进入 / 退出白板' }
    ]
  },
  {
    title: '条目操作',
    items: [
      { key: 'nextItem', label: '下一条', desc: '在列表中下移选择' },
      { key: 'prevItem', label: '上一条', desc: '在列表中上移选择' },
      { key: 'archiveItem', label: '归档', desc: '归档当前条目' },
      { key: 'laterItem', label: '稍后读', desc: '标为稍后读' },
      { key: 'favoriteItem', label: '收藏', desc: '收藏当前条目' },
      { key: 'openLink', label: '打开原文', desc: '用浏览器打开当前条目链接' }
    ]
  }
]

export const DEFAULT_SHORTCUTS: Record<ShortcutAction, string> = {
  openSettings: 'Mod+,',
  focusSearch: 'Mod+F',
  refresh: 'Mod+R',
  quickAdd: 'Mod+N',
  goRss: 'Mod+1',
  goLater: 'Mod+2',
  goFavorite: 'Mod+3',
  goRead: 'Mod+4',
  goArchived: 'Mod+5',
  goAll: 'Mod+6',
  toggleBoard: 'Mod+B',
  nextItem: 'j',
  prevItem: 'k',
  archiveItem: 'e',
  laterItem: 'l',
  favoriteItem: 'f',
  openLink: 'o',
  help: 'Mod+/',
  close: 'Escape'
}

/** 把一次键盘事件转成规范组合串。 */
export function eventToCombo(e: KeyboardEvent): string {
  const mod = e.metaKey || e.ctrlKey
  const shift = e.shiftKey
  const alt = e.altKey
  const parts: string[] = []
  if (mod) parts.push('Mod')
  if (shift) parts.push('Shift')
  if (alt) parts.push('Alt')
  let key = e.key
  if (key === ' ') key = 'Space'
  // 单字符统一大写，便于与默认值比较（"Mod+r" === "Mod+R"）
  if (key.length === 1) key = key.toUpperCase()
  parts.push(key)
  return parts.join('+')
}

const SYM: Record<string, string> = {
  Mod: '⌘', Shift: '⇧', Alt: '⌥',
  ',': ',', '.': '.', '/': '/',
  Space: '空格', Escape: 'Esc', Enter: '↩'
}

/** 把规范串渲染成人类可读（mac 风格符号优先）。 */
export function formatCombo(combo: string): string {
  const parts = combo.split('+')
  return parts.map((p) => SYM[p] ?? p).join(parts.length > 1 ? ' ' : '')
}

/** 是否包含全局修饰键（Mod），这类快捷键即使在输入框中也生效。 */
export function isGlobalCombo(combo: string): boolean {
  return combo.includes('Mod')
}

/** 解析存储的 JSON 为快捷键映射，缺项补默认，保证结构完整。 */
export function parseShortcuts(raw: string | null | undefined): Record<ShortcutAction, string> {
  const out = { ...DEFAULT_SHORTCUTS }
  if (!raw) return out
  try {
    const obj = JSON.parse(raw) as Partial<Record<ShortcutAction, string>>
    for (const k of Object.keys(DEFAULT_SHORTCUTS) as ShortcutAction[]) {
      if (typeof obj[k] === 'string' && obj[k]!.trim()) out[k] = obj[k]!.trim()
    }
  } catch { /* 损坏则忽略，用默认 */ }
  return out
}
