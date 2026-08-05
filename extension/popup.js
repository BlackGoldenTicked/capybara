const statusEl = document.getElementById('status')
const PAIR_URL = 'http://127.0.0.1:47832/pair'

async function refreshStatus() {
  const token = await chrome.storage.local.get('clipToken')
  statusEl.textContent = token.clipToken ? '已配对 ✓' : '未配对'
}
refreshStatus()

document.getElementById('pair').addEventListener('click', async () => {
  statusEl.textContent = '配对中…'
  try {
    const res = await fetch(PAIR_URL)
    const data = await res.json()
    await chrome.storage.local.set({ clipToken: data.token })
    statusEl.textContent = '配对成功 ✓'
  } catch {
    statusEl.textContent = '失败：请确保 ReadFlow 客户端正在运行'
  }
})

document.getElementById('sync').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab || !/https?:\/\/(x|twitter)\.com\//.test(tab.url || '')) {
    statusEl.textContent = '请在 x.com 页面使用'
    return
  }
  statusEl.textContent = '同步中…'
  chrome.tabs.sendMessage(tab.id, { action: 'syncVisible' }, (res) => {
    if (chrome.runtime.lastError) { statusEl.textContent = '需刷新 x.com 页面'; return }
    statusEl.textContent = res ? `已推送 ${res.ok}/${res.total}` : '无响应'
  })
})
