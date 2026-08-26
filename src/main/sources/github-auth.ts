import { app, safeStorage, shell, clipboard } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { getSetting, setSetting } from '../db'

/**
 * GitHub 凭证模块：
 * - Token 用 Electron safeStorage 加密后存 userData 下的 JSON 文件（任务：安全存储），
 *   历史明文（settings 表 github_token）读取时自动迁移并清除。
 * - Device Flow 一键登录（任务：OAuth），client_id 在设置中配置。
 */

const DEVICE_CODE_URL = 'https://github.com/login/device/code'
const TOKEN_URL = 'https://github.com/login/oauth/access_token'

/** 加密凭证文件路径 */
function credPath(): string {
  return path.join(app.getPath('userData'), 'github-credentials.json')
}

/** 读取加密文件中的 Token，失败返回 '' */
function readEncrypted(): string {
  try {
    const j = JSON.parse(fs.readFileSync(credPath(), 'utf8')) as { token?: string }
    if (!j.token || !safeStorage.isEncryptionAvailable()) return ''
    return safeStorage.decryptString(Buffer.from(j.token, 'base64'))
  } catch { return '' }
}

/**
 * 读取 GitHub Token：优先加密存储；否则回退 settings 表明文并自动迁移。
 */
export function getGithubToken(): string {
  const enc = readEncrypted()
  if (enc) return enc
  const legacy = getSetting('github_token') || ''
  if (legacy) {
    // 自动迁移：历史明文 → 加密存储，并清掉明文
    setGithubToken(legacy)
    return legacy
  }
  return ''
}

/** 写入 Token（空串 = 清除）。safeStorage 不可用时降级存 settings 表。 */
export function setGithubToken(token: string): void {
  const value = token.trim()
  if (!value) {
    try { fs.rmSync(credPath(), { force: true }) } catch { /* ignore */ }
    setSetting('github_token', '')
    return
  }
  if (safeStorage.isEncryptionAvailable()) {
    const enc = safeStorage.encryptString(value).toString('base64')
    fs.mkdirSync(path.dirname(credPath()), { recursive: true })
    fs.writeFileSync(credPath(), JSON.stringify({ token: enc }), { mode: 0o600 })
    setSetting('github_token', '') // 清掉历史明文
  } else {
    setSetting('github_token', value)
  }
}

/** 是否已配置 Token（供设置页展示状态，不回传明文） */
export function hasGithubToken(): boolean {
  return Boolean(getGithubToken())
}

/** Device Flow 中断标记 */
let deviceLoginAborted = false

/** 中断进行中的 Device Flow 轮询（如用户关闭弹窗） */
export function abortGithubDeviceLogin(): void {
  deviceLoginAborted = true
}

/** 缓存当前 Device Flow 的设备码信息，供 pollGithubDeviceLogin 使用 */
let deviceCodeCache: { device_code: string; user_code: string; verification_uri: string; interval: number; expires_in: number } | null = null

/**
 * GitHub OAuth Device Flow 第一步：申请设备码 + 验证码。
 * 返回 { user_code, verification_uri } 供前端展示，同时打开浏览器、复制验证码到剪贴板。
 * 需要先在设置中填 OAuth App 的 client_id（App 须启用 Device Flow）。
 */
export async function startGithubDeviceLogin(): Promise<{ user_code: string; verification_uri: string }> {
  const clientId = (getSetting('github_client_id') || '').trim()
  if (!clientId) throw new Error('请先填写 GitHub OAuth Client ID（github.com/settings/developers 创建 OAuth App 并启用 Device Flow）')

  deviceLoginAborted = false
  // 1) 申请设备码
  const codeRes = await fetch(DEVICE_CODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, scope: 'read:user' })
  })
  if (!codeRes.ok) throw new Error('获取设备码失败 ' + codeRes.status)
  const code = await codeRes.json() as {
    device_code: string; user_code: string; verification_uri: string
    interval?: number; expires_in?: number
  }

  // 缓存设备码，供后续 pollGithubDeviceLogin 轮询使用
  deviceCodeCache = {
    device_code: code.device_code,
    user_code: code.user_code,
    verification_uri: code.verification_uri,
    interval: Math.max(5, code.interval ?? 5),
    expires_in: code.expires_in ?? 900
  }

  // 打开浏览器 + 复制验证码到剪贴板
  try { clipboard.writeText(code.user_code) } catch { /* 剪贴板不可用则手动输入 */ }
  await shell.openExternal(code.verification_uri)

  return { user_code: code.user_code, verification_uri: code.verification_uri }
}

/**
 * GitHub OAuth Device Flow 第二步：轮询 access_token。
 * 在前端展示验证码后调用，阻塞直到用户在浏览器中授权（或超时/拒绝）。
 */
export async function pollGithubDeviceLogin(): Promise<{ login: string }> {
  if (!deviceCodeCache) throw new Error('请先点击「一键登录」获取验证码')
  const { device_code, interval, expires_in } = deviceCodeCache
  const clientId = (getSetting('github_client_id') || '').trim()
  const deadline = Date.now() + expires_in * 1000

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, interval * 1000))
    if (deviceLoginAborted) throw new Error('已取消登录')
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, device_code, grant_type: 'urn:ietf:params:oauth:grant-type:device_code' })
    })
    const j = await res.json() as {
      access_token?: string; error?: string; error_description?: string
    }
    if (j.access_token) {
      // 拿登录名
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${j.access_token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'Capybara' }
      })
      if (!userRes.ok) throw new Error('Token 已获取但校验用户失败 ' + userRes.status)
      const user = await userRes.json() as { login: string }
      setGithubToken(j.access_token)
      deviceCodeCache = null
      return { login: user.login }
    }
    if (j.error === 'authorization_pending') continue
    if (j.error === 'slow_down') { await new Promise((r) => setTimeout(r, interval * 1000)); continue }
    if (j.error === 'expired_token') { deviceCodeCache = null; throw new Error('设备码已过期，请重新登录') }
    if (j.error === 'access_denied') { deviceCodeCache = null; throw new Error('已拒绝授权') }
    deviceCodeCache = null
    throw new Error(j.error_description || j.error || '登录失败')
  }
  deviceCodeCache = null
  throw new Error('登录超时，请重试')
}
