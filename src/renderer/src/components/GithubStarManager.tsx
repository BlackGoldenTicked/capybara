import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'

export function GithubStarManager() {
  const { fetchGithubStars, showToast } = useStore()
  const [tokenInput, setTokenInput] = useState('')
  const [tokenSaved, setTokenSaved] = useState('')
  const [ghUser, setGhUser] = useState('')
  const [ghMsg, setGhMsg] = useState('')

  useEffect(() => {
    void (window.readflow.invoke('settings:get', 'github_stars_user') as Promise<string>).then((r) => setGhUser(r || ''))
    void (window.readflow.invoke('settings:get', 'github_token') as Promise<string>).then((r) => setTokenSaved(r ? '1' : ''))
  }, [])

  const saveToken = async () => {
    await window.readflow.invoke('settings:set', 'github_token', tokenInput)
    await window.readflow.invoke('settings:set', 'github_stars_user', ghUser)
    setTokenSaved(tokenInput ? '1' : ''); setTokenInput('')
    setGhMsg('已保存')
  }

  const fetchStars = async () => {
    if (!ghUser.trim()) { setGhMsg('请填写 GitHub 用户名'); return }
    setGhMsg('拉取中…')
    try {
      const r = await fetchGithubStars(ghUser.trim())
      setGhMsg(`已拉取 ${r.total} 个 Star / 新增 ${r.added} 条`)
      showToast('GitHub ★ 已更新')
    } catch (e) { setGhMsg('失败：' + (e as Error).message) }
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">GitHub Star 管理</p>
        <p className="src-hint">填入 GitHub 用户名，拉取你 starred 的仓库作为阅读条目（公开 API 约 60 次/小时，填入 Token 可提升额度）。</p>
        <div className="src-grid-2">
          <div className="src-field">
            <label htmlFor="github-user">用户名</label>
            <input id="github-user" placeholder="例如 torvalds" value={ghUser} onChange={(e) => setGhUser(e.target.value)} />
          </div>
          <div className="src-field">
            <label htmlFor="github-token">GitHub Token</label>
            <input id="github-token" type="password" placeholder="ghp_...（可选）" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
          </div>
        </div>
        <div className="src-field src-actions-field">
          <div aria-hidden="true" />
          <div className="src-actions">
            <button onClick={() => void saveToken()}>保存配置</button>
            <button onClick={() => void fetchStars()}><Icon name="github" size={14} /> 拉取 Star</button>
            <span className="src-hint src-grow">{ghMsg || (tokenSaved ? '已设置 Token' : '未设置 Token（公开 API 速率较低）')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
