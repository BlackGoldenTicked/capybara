// ReadFlow Clip —— content script
// 在 x.com 每条推文注入"存入阅流"按钮；点击即推送到本地 ReadFlow 客户端
const ENDPOINT = 'http://127.0.0.1:47832/ingest'

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get('clipToken', (r) => resolve(r.clipToken || ''))
  })
}

async function pushTweet(data) {
  const token = await getToken()
  if (!token) { console.warn('[ReadFlow] 未配对，请在扩展弹窗点「配对」'); return false }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(data)
    })
    return res.ok
  } catch (e) { console.warn('[ReadFlow] 推送失败，客户端是否运行？', e); return false }
}

function extractTweet(article) {
  const link = article.querySelector('a[href*="/status/"]')
  const url = link ? link.href : location.href
  const textEl = article.querySelector('[data-testid="tweetText"]')
  const title = (textEl?.textContent || '').trim().slice(0, 280) || 'X 推文'
  const handleEl = article.querySelector('a[href$=""] [role]') // 容错
  const author = (article.querySelector('a[role="link"]')?.textContent) || ''
  return { source_type: 'x', source_name: 'X 收藏', url, title, author, content_text: textEl?.textContent?.trim().slice(0, 2000) || '' }
}

function injectButton(article) {
  if (article.dataset.rfInjected) return
  const bar = article.querySelector('[role="group"]')
  if (!bar) return
  article.dataset.rfInjected = '1'
  const btn = document.createElement('button')
  btn.textContent = '存入阅流'
  btn.setAttribute('style', 'border:0;background:transparent;color:#1d9cf0;font-size:13px;cursor:pointer;padding:0 8px;')
  btn.title = '推送到 ReadFlow'
  btn.addEventListener('click', async (e) => {
    e.stopPropagation(); e.preventDefault()
    btn.textContent = '推送中…'
    const ok = await pushTweet(extractTweet(article))
    btn.textContent = ok ? '已存入 ✓' : '失败'
    setTimeout(() => { btn.textContent = '存入阅流' }, 2000)
  })
  bar.appendChild(btn)
}

function scanAndInject() {
  document.querySelectorAll('article[data-testid="tweet"]').forEach(injectButton)
}

const obs = new MutationObserver(() => scanAndInject())
obs.observe(document.body, { childList: true, subtree: true })
scanAndInject()

// 接收弹窗的"同步可见推文"指令
chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => {
  if (msg.action === 'syncVisible') {
    const articles = [...document.querySelectorAll('article[data-testid="tweet"]')]
    Promise.all(articles.map((a) => pushTweet(extractTweet(a)))).then((rs) => {
      sendResponse({ total: articles.length, ok: rs.filter(Boolean).length })
    })
    return true
  }
})
