/**
 * 通用 LLM 客户端层
 * 支持国内主流模型厂商（DeepSeek、通义千问、智谱、Moonshot、OpenAI 兼容接口）
 * 作为通用基础设施，其他模块可复用（AI 归类、摘要生成等）
 *
 * 设计要点：
 * - 设置持久化在 settings 表（llm_provider / llm_api_key / llm_model / llm_base_url）
 * - 所有厂商统一走 OpenAI 兼容的 /chat/completions 接口
 * - 超时 60s，失败返回可读错误
 */

import { getSetting } from '../db'
import { netLog, extractError } from '../netlog'
import { net } from 'electron'

/** 支持的模型厂商预设 */
export interface LlmProvider {
  id: string
  label: string
  /** 默认 API 基础 URL（用户可在设置中覆盖） */
  baseUrl: string
  /** 默认模型名 */
  defaultModel: string
  /** 获取 API Key 的指引文案 */
  keyHint: string
  /** 官网链接 */
  website: string
}

/** 内置厂商预设 */
export const LLM_PROVIDERS: LlmProvider[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek（深度求索）',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    keyHint: 'https://platform.deepseek.com/ → API Keys',
    website: 'https://platform.deepseek.com/',
  },
  {
    id: 'qwen',
    label: '通义千问（阿里云百炼）',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    keyHint: 'https://bailian.console.aliyun.com/ → API-KEY',
    website: 'https://bailian.console.aliyun.com/',
  },
  {
    id: 'zhipu',
    label: '智谱 AI（GLM）',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    keyHint: 'https://open.bigmodel.cn/ → API Keys',
    website: 'https://open.bigmodel.cn/',
  },
  {
    id: 'moonshot',
    label: 'Moonshot（月之暗面）',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    keyHint: 'https://platform.moonshot.cn/ → API Key',
    website: 'https://platform.moonshot.cn/',
  },
  {
    id: 'openai-compatible',
    label: '自定义（OpenAI 兼容接口）',
    baseUrl: '',
    defaultModel: '',
    keyHint: '填写基础 URL 和模型名',
    website: '',
  },
]

/** 对话消息 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/** 聊天完成请求参数 */
export interface ChatRequest {
  messages: ChatMessage[]
  /** 温度，0~2，默认 0.3（偏确定性，适合分类/摘要） */
  temperature?: number
  /** 最大输出 token */
  maxTokens?: number
  /** 覆盖模型名（不传则用用户设置中的默认模型） */
  model?: string
}

/** 聊天完成响应 */
export interface ChatResponse {
  content: string
  /** 实际使用的模型名 */
  model: string
  /** 总 token 用量（可能为 undefined） */
  totalTokens?: number
  /** 原始 finish_reason */
  finishReason?: string
}

/** 读取当前 LLM 配置 */
export function getLlmConfig(): {
  providerId: string
  baseUrl: string
  apiKey: string
  model: string
} {
  const providerId = getSetting('llm_provider') || 'deepseek'
  const provider = LLM_PROVIDERS.find((p) => p.id === providerId)
  const baseUrl = getSetting('llm_base_url') || provider?.baseUrl || ''
  const apiKey = getSetting('llm_api_key') || ''
  const model = getSetting('llm_model') || provider?.defaultModel || ''
  return { providerId, baseUrl, apiKey, model }
}

/** 检查 LLM 是否已配置（有 apiKey + baseUrl + model 三者齐全） */
export function isLlmConfigured(): boolean {
  const { apiKey, baseUrl, model } = getLlmConfig()
  return Boolean(apiKey && baseUrl && model)
}

/**
 * 调用 LLM 聊天完成接口（OpenAI 兼容）
 * 超时 60s，使用 Electron net.fetch（尊重系统代理）
 */
export async function chatCompletion(req: ChatRequest): Promise<ChatResponse> {
  const { baseUrl, apiKey, model: defaultModel } = getLlmConfig()
  const model = req.model || defaultModel
  if (!baseUrl || !apiKey || !model) {
    throw new Error('LLM 未配置：请在设置中填写 API Key、Base URL 和模型名')
  }

  const url = baseUrl.replace(/\/+$/, '') + '/chat/completions'
  const body = JSON.stringify({
    model,
    messages: req.messages,
    temperature: req.temperature ?? 0.3,
    max_tokens: req.maxTokens ?? 2000,
  })

  const t0 = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60_000)

    const res = await net.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body,
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const ms = Date.now() - t0
    const text = await res.text()
    const bytes = text.length

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`
      try { const j = JSON.parse(text); errMsg += ` · ${j.error?.message || j.message || ''}` } catch { /* */ }
      netLog({ url, method: 'POST', status: res.status, ms, bytes, ok: false, error: errMsg, source: 'llm' })
      throw new Error(`LLM 请求失败：${errMsg}`)
    }

    netLog({ url, method: 'POST', status: res.status, ms, bytes, ok: true, error: '', source: 'llm' })

    const data = JSON.parse(text) as {
      choices?: Array<{ message?: { content?: string }; finish_reason?: string }>
      model?: string
      usage?: { total_tokens?: number }
    }
    const content = data.choices?.[0]?.message?.content ?? ''
    if (!content) throw new Error('LLM 返回空内容')

    return {
      content,
      model: data.model || model,
      totalTokens: data.usage?.total_tokens,
      finishReason: data.choices?.[0]?.finish_reason,
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      netLog({ url, method: 'POST', status: 0, ms: Date.now() - t0, bytes: 0, ok: false, error: '请求超时 (60s)', source: 'llm' })
      throw new Error('LLM 请求超时（60 秒）')
    }
    throw new Error(`LLM 请求失败：${extractError(err, url)}`)
  }
}

/**
 * 便捷方法：用 system prompt + user prompt 做单轮对话
 * 适用于分类、摘要等简单任务
 */
export async function askLlm(
  systemPrompt: string,
  userPrompt: string,
  opts?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<string> {
  const res = await chatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: opts?.temperature,
    maxTokens: opts?.maxTokens,
    model: opts?.model,
  })
  return res.content
}

/**
 * 便捷方法：JSON 模式对话
 * 要求 LLM 返回 JSON，自动解析；解析失败时抛错
 */
export async function askLlmJson<T>(
  systemPrompt: string,
  userPrompt: string,
  opts?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<T> {
  const content = await askLlm(
    systemPrompt + '\n\n请严格输出 JSON 格式，不要包含 markdown 代码块标记。',
    userPrompt,
    { temperature: opts?.temperature ?? 0, maxTokens: opts?.maxTokens, model: opts?.model }
  )
  // 去除可能的 markdown 代码块标记
  const cleaned = content.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim()
  try {
    return JSON.parse(cleaned) as T
  } catch {
    throw new Error(`LLM 返回的不是合法 JSON：${content.slice(0, 200)}`)
  }
}
