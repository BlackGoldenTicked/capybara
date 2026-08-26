import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'

export function GithubStarManager() {
  const { fetchGithubStars, showToast } = useStore()
  const [tokenInput, setTokenInput] = useState('')
  const [hasToken, setHasToken] = useState(false)
  const [ghUser, setGhUser] = useState('')
  const [clientId, setClientId] = useState('')
  const [ghMsg, setGhMsg] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [fetching, setFetching] = useState(false)
  const [progress, setProgress] = useState<{ fetched: number; page: number } | null>(null)
  // 保持回调引用最新，避免 useEffect 闭包捕获旧值
  const progressCb = useRef<(p: { fetched: number; page: number }) => void>(() => {})
  progressCb.current = (p: { fetched: number; page: number }) => setProgress(p)

  useEffect(() => {
    void (window.capybara.invoke('settings:get', 'github_stars_user') as Promise<string>).then((r) => setGhUser(r || ''))
    void (window.capybara.invoke('settings:get', 'github_client_id') as Promise<string>).then((r) => setClientId(r || ''))
    void (window.capybara.invoke('github:tokenStatus') as Promise<{ has: boolean }>).then((r) => setHasToken(Boolean(r?.has)))
    // 订阅主进程发来的 GitHub Star 拉取进度
    window.capybara.onGithubProgress((p) => progressCb.current(p))
  }, [])

  // 一键登录：OAuth Device Flow（两步：先获取验证码并展示，再轮询 token）
  const deviceLogin = async () => {
    if (!clientId.trim()) { setGhMsg('请先填写 OAuth Client ID'); return }
    await window.capybara.invoke('settings:set', 'github_client_id', clientId.trim())
    setLoggingIn(true)
    setUserCode('')
    setGhMsg('正在获取验证码…')
    try {
      // 第一步：申请验证码，浏览器已自动打开 GitHub 授权页
      const { user_code } = await window.capybara.invoke('github:deviceLogin') as { user_code: string; verification_uri: string }
      setUserCode(user_code)
      setGhMsg('验证码已复制到剪贴板，请粘贴到 GitHub 页面并授权')
      // 第二步：轮询 token（阻塞直到用户授权或超时）
      const { login } = await window.capybara.invoke('github:pollLogin') as { login: string }
      // 登录成功：更新 token 状态 + 持久化用户名到数据库（下次打开仍显示）
      await window.capybara.invoke('settings:set', 'github_stars_user', login)
      setHasToken(true)
      setGhUser(login)
      setUserCode('')
      setGhMsg(`已通过 OAuth 登录为 ${login}`)
      showToast('GitHub 登录成功')
    } catch (e) {
      setGhMsg('登录失败：' + (e as Error).message)
      setUserCode('')
    } finally {
      setLoggingIn(false)
    }
  }

  const saveToken = async () => {
    // 手动 Token：走 safeStorage 加密存储；清空输入 = 清除 Token
    await window.capybara.invoke('github:setToken', tokenInput)
    const r = await window.capybara.invoke('github:tokenStatus') as { has: boolean }
    setHasToken(Boolean(r?.has))
    setTokenInput('')
    setGhMsg(tokenInput ? 'Token 已加密保存' : '已清除 Token')
  }

  const fetchStars = async () => {
    if (!ghUser.trim()) { setGhMsg('请填写 GitHub 用户名'); return }
    setFetching(true)
    setProgress(null)
    setGhMsg('拉取中…')
    try {
      const r = await fetchGithubStars(ghUser.trim())
      setGhMsg(`已拉取 ${r.total} 个 Star / 新增 ${r.added} 条`)
      showToast('GitHub ★ 已更新')
    } catch (e) { setGhMsg('失败：' + (e as Error).message) }
    finally {
      setFetching(false)
      setProgress(null)
    }
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">GitHub Star 管理</p>
        <p className="src-hint">填入 GitHub 用户名，拉取你 starred 的仓库作为阅读条目（按 star 时间倒序，无条数上限）。</p>
        <div className="src-field">
          <label htmlFor="github-user">用户名</label>
          <input id="github-user" placeholder="例如 torvalds" value={ghUser} onChange={(e) => setGhUser(e.target.value)} />
        </div>
        <div className="src-field src-actions-field">
          <div aria-hidden="true" />
          <div className="src-actions">
            <button onClick={() => void fetchStars()} disabled={fetching}><Icon name="github" size={14} /> {fetching ? '拉取中…' : '拉取 Star'}</button>
            <span className="src-hint src-grow">{fetching && progress ? `拉取中… 已获取 ${progress.fetched} 个（第 ${progress.page} 页）` : (ghMsg || (hasToken ? '已授权（Token 加密存储）' : '未设置 Token（公开 API 速率 60 次/小时）'))}</span>
          </div>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">一键登录（推荐）</p>
        <p className="src-hint">OAuth Device Flow 免粘贴 Token：点击后打开 GitHub 授权页，验证码自动复制到剪贴板。需先在 <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer">GitHub 开发者设置</a> 创建 OAuth App（启用 Device Flow）并填入 Client ID。</p>
        <div className="src-grid-2">
          <div className="src-field">
            <label htmlFor="github-clientid">OAuth Client ID</label>
            <input id="github-clientid" placeholder="Iv1.xxxx…（OAuth App 的 Client ID）" value={clientId} onChange={(e) => setClientId(e.target.value)} />
          </div>
          <div className="src-field">
            <label htmlFor="github-login-btn">授权状态</label>
            <div className="src-actions" id="github-login-btn">
              <button onClick={() => void deviceLogin()} disabled={loggingIn}>{loggingIn ? '等待浏览器授权…' : '一键登录 GitHub'}</button>
              <span className="src-hint">{hasToken ? '✓ 已授权' : '未授权'}</span>
            </div>
          </div>
        </div>
        {userCode && (
          <div className="src-field">
            <label>验证码（已复制到剪贴板，粘贴到 GitHub 授权页）</label>
            <div className="github-code-display">{userCode}</div>
          </div>
        )}
      </div>

      <div className="set-card">
        <p className="src-label">手动 Token（备选）</p>
        <p className="src-hint">粘贴 personal access token（<a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer">在此创建</a>，勾选只读 public 权限即可）。保存后用系统钥匙串加密存储，留空保存即清除。</p>
        <div className="src-field">
          <label htmlFor="github-token">Token</label>
          <input id="github-token" type="password" placeholder={hasToken ? '已加密保存（留空保存 = 清除）' : 'ghp_...（可选）'} value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
        </div>
        <div className="src-field src-actions-field">
          <div aria-hidden="true" />
          <div className="src-actions">
            <button onClick={() => void saveToken()}>保存 Token</button>
            <span className="src-hint src-grow">{hasToken ? 'Token 已加密存储' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
