import { contextBridge, ipcRenderer, webUtils } from 'electron'

/**
 * 安全基线：contextBridge + 通道白名单，绝不暴露 ipcRenderer。
 * 新增 channels 需同步登记，否则渲染进程调用会抛 Invalid channel。
 */
const validChannels = [
  'app:version',
  'app:bootstrap',
  'shell:openExternal',
  'items:list', 'items:listPage', 'items:get', 'items:counts', 'items:updateStatus', 'items:markRead', 'items:setRead', 'items:delete',
  'items:markAllRead', 'items:clearInbox',
  'feeds:list', 'feeds:add', 'feeds:addMany', 'feeds:delete', 'feeds:refresh', 'sources:refreshAll',
  'items:quickAdd', 'settings:get', 'settings:set', 'settings:purge',
  'boards:list', 'boards:create', 'boards:delete',
  'boards:cards', 'boards:addCard', 'boards:updateCard', 'boards:moveCard', 'boards:deleteCard', 'boards:rename', 'boards:openFile',
  'boards:links', 'boards:addLink', 'boards:deleteLink', 'boards:updateLink',
  'github:fetchStars', 'twitter:importBookmarks', 'items:sourceCounts',
  'feeds:importOpml',
  'discover:repos', 'discover:feeds',
  'sync:backup', 'devtools:toggle',
  'db:tables', 'db:rows'
] as const

type Channel = (typeof validChannels)[number]

contextBridge.exposeInMainWorld('readflow', {
  invoke: async (channel: Channel, ...args: unknown[]) => {
    if (!validChannels.includes(channel)) throw new Error(`Invalid channel: ${channel}`)
    return ipcRenderer.invoke(channel, ...args)
  },
  onSourcesUpdated: (cb: () => void) => {
    ipcRenderer.on('sources:updated', () => cb())
  },
  /** 订阅主进程网络诊断日志（开发者模式开启时，应用内面板会显示） */
  onNetLog: (cb: (entry: unknown) => void) => {
    ipcRenderer.on('net:log', (_e, payload) => cb(payload))
  },
  /** 在隔离渲染进程中拿到 <input type=file> 选择的真实磁盘路径，供主进程拷贝附件 */
  getPathForFile: (file: File): string => webUtils.getPathForFile(file)
})
