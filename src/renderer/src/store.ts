import { create } from 'zustand'
import type { Item, ItemRow, View, Screen, Feed, Board, Card, BoardLink, RepoInfo, DiscoveredFeed, NetLogEntry } from './env'
import { applyAppearance, persistAppearance, DEFAULT_APPEARANCE, type Appearance } from './lib/appearance'
import { DEFAULT_SHORTCUTS, parseShortcuts, type ShortcutAction } from './lib/shortcuts'
import { setSoundEnabled as audioSetEnabled, setSoundVolume as audioSetVolume, playSound } from './lib/sound'

/** 设置页标签（含新增的「快捷键」）。 */
export type SettingsTab = 'general' | 'appearance' | 'sources' | 'discover' | 'actions' | 'shortcuts' | 'data' | 'diag'

interface State {
  screen: Screen
  view: View
  items: ItemRow[]
  itemsPage: number
  itemsDone: boolean
  itemsLoadingMore: boolean
  counts: Record<View, number>
  sourceCounts: Record<string, number>
  feeds: Feed[]
  boards: Board[]
  selectedId: number | null
  pendingReadId: number | null
  search: string
  quickAddOpen: boolean
  activeBoardId: number | null
  activeSourceType: string | null
  activeFeed: string | null
  cards: Card[]
  links: BoardLink[]
  toast: string

  appearance: Appearance
  soundEnabled: boolean
  soundVolume: number

  developerMode: boolean
  netLog: NetLogEntry[]
  setDeveloperMode: (v: boolean) => void

  settingsTab: SettingsTab
  shortcuts: Record<ShortcutAction, string>

  discoverRepos: RepoInfo[]
  discoverFeeds: Record<string, DiscoveredFeed[]>
  discoverLoading: boolean
  discoverFeedsLoading: string | null

  setScreen: (s: Screen) => void
  setView: (v: View) => void
  setSourceType: (t: string | null) => void
  setSearch: (s: string) => void
  setQuickAddOpen: (open: boolean) => void
  setActiveFeed: (name: string | null) => void
  showToast: (msg: string) => void
  load: () => Promise<void>
  loadMoreItems: () => Promise<void>
  loadFeeds: () => Promise<void>
  loadBoards: () => Promise<void>
  select: (id: number | null, opts?: { click?: boolean }) => void
  flushPending: () => void
  moveSelection: (delta: number) => void
  setStatus: (id: number, status: Item['status']) => Promise<void>
  quickAdd: (url: string) => Promise<void>
  refreshAll: () => Promise<void>
  addFeed: (type: string, name: string, url: string, scheduleMin: number) => Promise<void>
  addManyFeeds: (list: Array<{ type: string; name: string; url: string; schedule_min?: number }>) => Promise<number>
  deleteFeed: (id: number) => Promise<void>
  refreshFeed: (id: number) => Promise<void>
  markAllRead: (view: View) => Promise<void>
  clearInbox: () => Promise<void>
  openInBrowser: (url: string, origin?: { x: number; y: number }) => void
  deleteItem: (id: number) => Promise<void>
  toggleRead: (id: number) => Promise<void>
  openBoard: (id: number) => Promise<void>
  createBoard: () => Promise<void>
  addRefCard: (itemId: number, x: number, y: number) => void
  addCard: (partial: Partial<Card> & { _sourcePath?: string }) => Promise<Card>
  updateCard: (id: number, patch: Partial<Card> & { _sourcePath?: string }) => Promise<void>
  moveCard: (id: number, x: number, y: number) => Promise<void>
  deleteCard: (id: number) => Promise<void>
  renameBoard: (id: number, name: string) => Promise<void>
  deleteBoard: (id: number) => Promise<void>
  loadLinks: (boardId: number) => Promise<void>
  discoverSearch: (query: string) => Promise<void>
  loadRepoFeeds: (repo: RepoInfo) => Promise<void>
  addDiscoveredFeed: (url: string, title: string) => Promise<void>
  addAllDiscovered: (repoFullName: string) => Promise<void>
  addLink: (fromId: number, toId: number) => Promise<void>
  deleteLink: (id: number) => Promise<void>
  updateLink: (id: number, label: string) => Promise<void>
  autoPos: () => { x: number; y: number }
  fetchGithubStars: (username: string) => Promise<{ added: number; total: number }>
  importTwitterBookmarks: () => Promise<{ added: number; total: number }>

  initAppearance: () => Promise<void>
  updateAppearance: (patch: Partial<Appearance>) => void
  setSoundEnabled: (enabled: boolean) => void
  setSettingsTab: (t: SettingsTab) => void
  openSettings: (tab?: SettingsTab) => void
  setShortcuts: (next: Record<ShortcutAction, string>) => void
  resetShortcuts: () => void
  setSoundVolume: (volume: number) => void
  purge: (keepArchivedDays: number, maxItems: number) => Promise<void>
}

/** 信息流每次分页加载条目数（滚动到底部翻页浏览历史） */
const PAGE_SIZE = 15

const emptyCounts: Record<View, number> = { rss: 0, read: 0, later: 0, favorite: 0, archived: 0, all: 0 }

export const useStore = create<State>((set, get) => ({
  screen: 'library',
  view: 'rss',
  items: [], itemsPage: 0, itemsDone: false, itemsLoadingMore: false, counts: emptyCounts, sourceCounts: {}, feeds: [], boards: [],
  selectedId: null, pendingReadId: null, search: '', quickAddOpen: false,
  activeBoardId: null, activeSourceType: null, activeFeed: null, cards: [], links: [], toast: '',
  discoverRepos: [], discoverFeeds: {}, discoverLoading: false, discoverFeedsLoading: null,

  appearance: DEFAULT_APPEARANCE,
  soundEnabled: false,
  soundVolume: 0.7,

  developerMode: false,
  netLog: [],

  settingsTab: 'appearance',
  shortcuts: { ...DEFAULT_SHORTCUTS },

  setScreen: (screen) => {
    set({ screen })
    if (screen === 'board') void get().loadBoards()
    if (screen === 'settings') void get().loadFeeds()
  },
  setView: (view) => { get().flushPending(); set({ view, selectedId: null, activeSourceType: null, activeFeed: null, screen: 'library' }); void get().load() },
  setSourceType: (t) => {
    // 按来源过滤时展示该来源全部条目（view=all），不再受 inbox/later 等状态限制
    get().flushPending()
    set({ activeSourceType: t, view: 'all', selectedId: null, activeFeed: null, screen: 'library' })
    void get().load()
  },
  setSearch: (search) => { set({ search }); void get().load() },
  setQuickAddOpen: (quickAddOpen) => set({ quickAddOpen }),
  setActiveFeed: (name) => {
    const next = get().activeFeed === name ? null : name
    get().flushPending()
    set({ activeFeed: next, selectedId: null })
    void get().load()
  },
  showToast: (msg) => {
    set({ toast: msg })
    setTimeout(() => { if (get().toast === msg) set({ toast: '' }) }, 1800)
  },

  load: async () => {
    const { view, search, activeSourceType, activeFeed } = get()
    try {
      const [counts, sourceCounts, page0] = await Promise.all([
        window.readflow.invoke('items:counts') as Promise<Record<View, number>>,
        window.readflow.invoke('items:sourceCounts') as Promise<Record<string, number>>,
        window.readflow.invoke('items:listPage', view, search, activeSourceType, activeFeed, 0, PAGE_SIZE) as Promise<ItemRow[]>
      ])
      set({ items: page0, itemsPage: 0, itemsDone: page0.length < PAGE_SIZE, itemsLoadingMore: false, counts, sourceCounts })
    } catch (e) {
      const msg = (e as Error).message || String(e)
      console.error('[load] 失败:', msg, { view, activeSourceType, activeFeed })
      get().showToast('加载失败：' + msg)
    }
  },
  loadMoreItems: async () => {
    const { itemsDone, itemsLoadingMore, itemsPage, view, search, activeSourceType, activeFeed } = get()
    if (itemsDone || itemsLoadingMore) return
    set({ itemsLoadingMore: true })
    try {
      const more = await window.readflow.invoke('items:listPage', view, search, activeSourceType, activeFeed, itemsPage + 1, PAGE_SIZE) as Promise<ItemRow[]>
      if (more.length < PAGE_SIZE) set({ itemsDone: true })
      if (more.length > 0) {
        const existing = new Set(get().items.map((i) => i.id))
        const merged = get().items.concat(more.filter((i) => !existing.has(i.id)))
        set({ items: merged, itemsPage: get().itemsPage + 1 })
      }
    } finally {
      set({ itemsLoadingMore: false })
    }
  },
  loadFeeds: async () => { set({ feeds: await window.readflow.invoke('feeds:list') as Feed[] }) },
  loadBoards: async () => { set({ boards: await window.readflow.invoke('boards:list') as Board[] }) },

  // 把上一张「待读」卡片标记已读（切走 / 关闭面板 / 切换视图时调用）。仅标记，不在此处重载列表。
  flushPending: () => {
    const p = get().pendingReadId
    if (p == null) return
    void window.readflow.invoke('items:markRead', p)
    set({ pendingReadId: null })
  },
  select: (id, opts) => {
    const pending = get().pendingReadId
    // 取消选中 / 关闭阅读面板：把当前待读卡片标记已读，并在 RSS 视图乐观移出未读列表
    if (id == null) {
      if (pending != null) {
        void window.readflow.invoke('items:markRead', pending)
        set({ pendingReadId: null })
        if (get().view === 'rss') {
          set({ items: get().items.filter((i) => i.id !== pending), counts: { ...get().counts, rss: get().counts.rss - 1, read: get().counts.read + 1 } })
        }
      }
      set({ selectedId: null })
      return
    }
    // 切换到另一张卡片：先把上一张（pending）标为已读，乐观移出 RSS 未读列表，避免列表跳动
    if (pending != null && pending !== id) {
      void window.readflow.invoke('items:markRead', pending)
      set({ pendingReadId: null })
      if (get().view === 'rss') {
        set({ items: get().items.filter((i) => i.id !== pending), counts: { ...get().counts, rss: get().counts.rss - 1, read: get().counts.read + 1 } })
      }
    }
    set({ selectedId: id })
    const it = get().items.find((i) => i.id === id)
    if (get().view === 'rss' && it && it.is_read === 0) {
      // RSS 未读视图：仅记为「待读」，等切走时再标已读，避免点一下就从列表消失、影响连续阅读
      set({ pendingReadId: id })
    } else if (it && it.is_read === 0) {
      // 其它视图点击未读卡片：立即标已读，并在本地即时反映（不再重载整列）
      void window.readflow.invoke('items:markRead', id)
      set({ items: get().items.map((i) => i.id === id ? { ...i, is_read: 1 } : i), counts: { ...get().counts, read: get().counts.read + 1 } })
    } else {
      void window.readflow.invoke('items:markRead', id)
    }
  },
  moveSelection: (delta) => {
    const { items, selectedId } = get()
    if (!items.length) return
    const idx = items.findIndex((i) => i.id === selectedId)
    const next = idx === -1 ? 0 : Math.min(items.length - 1, Math.max(0, idx + delta))
    get().select(items[next].id)
  },
  setStatus: async (id, status) => {
    if (get().pendingReadId === id) set({ pendingReadId: null })
    const label = { favorite: '已收藏', later: '已稍后读', archived: '已归档', inbox: '已退回收集箱' }[status]
    try {
      const counts = await window.readflow.invoke('items:updateStatus', id, status) as Record<View, number>
      set({ counts })
      const { items } = get()
      const next = items.filter((i) => i.id !== id)
      const removedIdx = items.findIndex((i) => i.id === id)
      const nextSel = next[Math.min(removedIdx, next.length - 1)]
      set({ items: get().view === 'all' ? items : next, selectedId: nextSel?.id ?? null })
      if (label) { get().showToast(label); playSound('mark') }
    } catch (e) {
      get().showToast('操作失败：' + (e as Error).message)
    }
  },
  quickAdd: async (url) => { await window.readflow.invoke('items:quickAdd', url); set({ quickAddOpen: false }); await get().load() },
  refreshAll: async () => {
    await window.readflow.invoke('sources:refreshAll')
    await Promise.all([get().load(), get().loadFeeds()])
    const bad = get().feeds.find((f) => f.error_count > 0)
    if (bad) get().showToast('无法获取数据：' + (bad.last_error || '未知错误'))
  },

  addFeed: async (type, name, url, scheduleMin) => {
    const existed = get().feeds.some((f) => f.url === url)
    try {
      const feed = await window.readflow.invoke('feeds:add', type, name, url, scheduleMin) as Feed
      await get().loadFeeds()
      if (existed) { get().showToast('该 RSS 源已存在，已跳过'); return }
      // 新增即抓取：用户添加后立刻拉取，无需等待 ≤60s 调度（修复 RSS 逻辑：新增即刷新）
      if (feed?.id) await get().refreshFeed(feed.id)
      else get().showToast('添加失败：地址可能无效')
    } catch (e) { get().showToast('添加失败：' + (e as Error).message) }
  },
  addManyFeeds: async (list) => {
    const n = await window.readflow.invoke('feeds:addMany', list) as number
    await get().loadFeeds()
    // 批量新增后强制刷新全部（含新源），立即见效（修复 RSS 逻辑：Discover 一键添加即抓取）
    if (n > 0) await get().refreshAll()
    return n
  },
  deleteFeed: async (id) => { await window.readflow.invoke('feeds:delete', id); await get().loadFeeds() },
  refreshFeed: async (id) => {
    const n = await window.readflow.invoke('feeds:refresh', id) as number
    if (n < 0) {
      const bad = get().feeds.find((f) => f.id === id)
      get().showToast('无法获取数据：' + (bad?.last_error || '未知错误'))
    }
    await Promise.all([get().load(), get().loadFeeds()])
  },
  markAllRead: async (view) => { const counts = await window.readflow.invoke('items:markAllRead', view) as Record<View, number>; set({ counts }); playSound('complete'); await get().load() },
  clearInbox: async () => { const counts = await window.readflow.invoke('items:clearInbox') as Record<View, number>; set({ counts }); playSound('complete'); await get().load() },

  openInBrowser: (url, origin) => {
    if (url) {
      void window.readflow.invoke('shell:openExternal', url)
      playSound('open')
    }
  },
  deleteItem: async (id) => {
    get().flushPending()
    playSound('delete')
    await window.readflow.invoke('items:delete', id)
    // 乐观移除，随后重载以刷新计数
    set({ items: get().items.filter((i) => i.id !== id), selectedId: get().selectedId === id ? null : get().selectedId })
    await get().load()
  },
  toggleRead: async (id) => {
    const it = get().items.find((i) => i.id === id)
    const next = !(it?.is_read)
    await window.readflow.invoke('items:setRead', id, next)
    set({ items: get().items.map((i) => i.id === id ? { ...i, is_read: next ? 1 : 0 } : i) })
    // 手动切换已读态时，若该卡片正是当前待读项，清除 pending 以免重复标记
    if (next && get().pendingReadId === id) set({ pendingReadId: null })
    // RSS（未读）视图中标记为已读后，立即重载使其离开未读列表
    if (get().view === 'rss' && next) void get().load()
  },

  openBoard: async (id) => {
    const [cards, links] = await Promise.all([
      window.readflow.invoke('boards:cards', id) as Promise<Card[]>,
      window.readflow.invoke('boards:links', id) as Promise<BoardLink[]>
    ])
    set({ activeBoardId: id, cards, links, screen: 'board' })
  },
  createBoard: async () => {
    const b = await window.readflow.invoke('boards:create', '未命名白板') as Board
    set({ activeBoardId: b.id, cards: [], screen: 'board' })
    await get().loadBoards()
  },
  addRefCard: (itemId, x?, y?) => {
    // 自包含：把引用条目的标题/摘要直接写进卡片，避免白板再去整库 join（修复 #9）
    const it = get().items.find((i) => i.id === itemId)
    const pos = (x != null && y != null) ? { x, y } : get().autoPos()
    void get().addCard({
      kind: 'ref', item_id: itemId, x: pos.x, y: pos.y, w: 240, h: 140,
      title: it?.title ?? '', body: it?.summary ?? ''
    })
  },
  addCard: async (partial) => {
    const id = get().activeBoardId
    if (id == null) { get().showToast('请先打开一个白板'); throw new Error('no active board') }
    const card = await window.readflow.invoke('boards:addCard', {
      board_id: id,
      kind: partial.kind ?? 'text',
      item_id: partial.item_id ?? null,
      x: partial.x ?? 80, y: partial.y ?? 80, w: partial.w ?? 240, h: partial.h ?? 140,
      title: partial.title ?? '', body: partial.body ?? '', payload: partial.payload ?? '{}',
      _sourcePath: (partial as { _sourcePath?: string })._sourcePath
    }) as Card
    set({ cards: [...get().cards, card] })
    playSound('lift')
    return card
  },
  updateCard: async (cid, patch) => {
    const card = await window.readflow.invoke('boards:updateCard', cid, {
      title: patch.title, body: patch.body, payload: patch.payload,
      w: patch.w, h: patch.h, kind: patch.kind, item_id: patch.item_id
    }, (patch as { _sourcePath?: string })._sourcePath) as Card
    set({ cards: get().cards.map((c) => c.id === cid ? card : c) })
  },
  moveCard: async (cid, x, y) => {
    await window.readflow.invoke('boards:moveCard', cid, x, y)
    set({ cards: get().cards.map((c) => c.id === cid ? { ...c, x, y } : c) })
  },
  deleteCard: async (cid) => {
    await window.readflow.invoke('boards:deleteCard', cid)
    set({ cards: get().cards.filter((c) => c.id !== cid), links: get().links.filter((l) => l.from_id !== cid && l.to_id !== cid) })
  },
  loadLinks: async (boardId) => { set({ links: await window.readflow.invoke('boards:links', boardId) as BoardLink[] }) },
  addLink: async (fromId, toId) => {
    const id = get().activeBoardId
    if (id == null) return
    const link = await window.readflow.invoke('boards:addLink', id, fromId, toId) as BoardLink | null
    if (link) set({ links: [...get().links, link] })
    else get().showToast('已存在该连线')
  },
  deleteLink: async (lid) => { await window.readflow.invoke('boards:deleteLink', lid); set({ links: get().links.filter((l) => l.id !== lid) }) },
  updateLink: async (lid, label) => {
    await window.readflow.invoke('boards:updateLink', lid, label)
    set({ links: get().links.map((l) => l.id === lid ? { ...l, label } : l) })
  },
  autoPos: () => {
    const cards = get().cards
    const W = 240, H = 140, gap = 24, ox = 40, oy = 40, cols = 4
    for (let row = 0; row < 60; row++) {
      for (let col = 0; col < cols; col++) {
        const x = ox + col * (W + gap), y = oy + row * (H + gap)
        const hit = cards.some((c) => c.x < x + W && x < c.x + W && c.y < y + H && y < c.y + H)
        if (!hit) return { x, y }
      }
    }
    return { x: ox, y: oy }
  },
  renameBoard: async (id, name) => {
    try {
      await window.readflow.invoke('boards:rename', id, name)
      set({ boards: get().boards.map((b) => b.id === id ? { ...b, name } : b) })
    } catch (err) {
      get().showToast('重命名失败：' + (err instanceof Error ? err.message : String(err)))
    }
  },
  deleteBoard: async (id) => {
    await window.readflow.invoke('boards:delete', id)
    const boards = get().boards.filter((b) => b.id !== id)
    const wasActive = get().activeBoardId === id
    set({
      boards,
      activeBoardId: wasActive ? null : get().activeBoardId,
      screen: wasActive ? 'library' : get().screen,
      cards: wasActive ? [] : get().cards,
      links: wasActive ? [] : get().links
    })
  },

  discoverSearch: async (query) => {
    set({ discoverLoading: true })
    try {
      const repos = await window.readflow.invoke('discover:repos', query) as RepoInfo[]
      set({ discoverRepos: repos, discoverLoading: false })
    } catch (e) {
      set({ discoverLoading: false })
      get().showToast('发现失败：' + (e as Error).message)
    }
  },
  loadRepoFeeds: async (repo) => {
    set({ discoverFeedsLoading: repo.full_name })
    try {
      const feeds = await window.readflow.invoke('discover:feeds', repo.full_name, repo.default_branch) as DiscoveredFeed[]
      set({ discoverFeeds: { ...get().discoverFeeds, [repo.full_name]: feeds }, discoverFeedsLoading: null })
    } catch (e) {
      set({ discoverFeedsLoading: null })
      get().showToast('解析失败：' + (e as Error).message)
    }
  },
  addDiscoveredFeed: async (url, title) => {
    if (get().feeds.some((f) => f.url === url)) { get().showToast('该源已添加'); return }
    await get().addFeed('rss', title, url, 60)
    get().showToast('已添加：' + title)
  },
  addAllDiscovered: async (repoFullName) => {
    const feeds = get().discoverFeeds[repoFullName] || []
    const have = new Set(get().feeds.map((f) => f.url))
    const toAdd = feeds.filter((f) => !have.has(f.url)).map((f) => ({ type: 'rss', name: f.title, url: f.url, schedule_min: 60 }))
    if (!toAdd.length) { get().showToast('已全部添加，无新增'); return }
    const added = await get().addManyFeeds(toAdd)
    get().showToast(`已批量添加 ${added} 个订阅源`)
  },

  fetchGithubStars: async (username) => {
    const r = await window.readflow.invoke('github:fetchStars', username) as { added: number; total: number }
    await get().load()
    return r
  },
  importTwitterBookmarks: async () => {
    const r = await window.readflow.invoke('twitter:importBookmarks') as { added: number; total: number }
    await get().load()
    return r
  },

  initAppearance: async () => {
    // 一次性拉取启动所需的全部设置（外观 / 音效 / 快捷键 / 开发者模式），把原先多次顺序 IPC 合并为 1 次，缩短首屏
    const boot = await window.readflow.invoke('app:bootstrap') as {
      appearance: Appearance
      soundEnabled: boolean
      soundVolume: number
      shortcuts?: string | null
      developerMode: boolean
    }
    const a = boot.appearance
    applyAppearance(a)
    audioSetEnabled(boot.soundEnabled)
    audioSetVolume(boot.soundVolume)
    set({ appearance: a, soundEnabled: boot.soundEnabled, soundVolume: boot.soundVolume, shortcuts: parseShortcuts(boot.shortcuts), developerMode: boot.developerMode })
    // 网络诊断日志：开发者模式下持续追加，供应用内浮动面板显示（最多保留 300 条）
    window.readflow.onNetLog((entry) => {
      if (!get().developerMode) return
      const next = get().netLog.concat(entry)
      if (next.length > 300) next.splice(0, next.length - 300)
      set({ netLog: next })
    })
  },
  setDeveloperMode: (v) => {
    void window.readflow.invoke('settings:set', 'developer_mode', v ? '1' : '0')
    void window.readflow.invoke('devtools:toggle')
    set({ developerMode: v })
  },
  updateAppearance: (patch) => {
    const next = { ...get().appearance, ...patch }
    persistAppearance(patch)
    applyAppearance(next)
    set({ appearance: next })
    playSound('style')
  },
  setSoundEnabled: (enabled) => {
    audioSetEnabled(enabled)
    void window.readflow.invoke('settings:set', 'sound_enabled', enabled ? '1' : '0')
    set({ soundEnabled: enabled })
    if (enabled) playSound('toggle')
  },
  setSoundVolume: (v) => {
    audioSetVolume(v)
    void window.readflow.invoke('settings:set', 'sound_volume', String(v))
    set({ soundVolume: v })
  },
  setSettingsTab: (t) => set({ settingsTab: t }),
  openSettings: (tab) => {
    if (tab) set({ settingsTab: tab })
    set({ screen: 'settings' })
  },
  setShortcuts: (next) => {
    void window.readflow.invoke('settings:set', 'shortcuts', JSON.stringify(next))
    set({ shortcuts: next })
  },
  resetShortcuts: () => {
    void window.readflow.invoke('settings:set', 'shortcuts', JSON.stringify(DEFAULT_SHORTCUTS))
    set({ shortcuts: { ...DEFAULT_SHORTCUTS } })
  },
  purge: async (keepDays, maxItems) => {
    const r = await window.readflow.invoke('settings:purge', keepDays, maxItems) as { purged: number }
    playSound('complete')
    get().showToast(`已清理 ${r.purged} 条归档内容`)
    await get().load()
  }
}))
