/**
 * 内置图标 / 音效 / 套装预设 —— 引导期集中注册
 *
 * main.tsx 首帧前 import 本文件即可完成全部注册，之后：
 *   - `listIconThemes()` / `listSoundThemes()` / `listThemeBundles()` 返回完整列表
 *   - `applyThemeBundle(id)` 可切换到任意内置套装
 *
 * 扩展新预设的步骤：
 *   1. 图标：新建 icons-map-<name>.tsx 导出 IconThemeMap，然后 registerIconTheme(...)
 *   2. 音效：在 sound-presets.ts 追加一个 SoundThemeMap，然后 registerSoundTheme(...)
 *   3. 套装：registerThemeBundle({ id, label, iconTheme, soundTheme, description })
 *
 * 设计参考：docs/图标库与音效库资源池.md「三套一键组合」矩阵。
 * 素材策略：图标零新依赖（Lucide 派生），音效零素材（Web Audio 合成），
 *           后续如需接入 Phosphor / Tabler / Iconoir 或 Pixabay 素材包，
 *           仅需在此文件追加注册即可，业务代码无感知。
 */

import { registerIconTheme } from './icon-themes'
import { registerSoundTheme } from './sound-themes'
import { registerThemeBundle } from './theme-bundles'
import {
  LUCIDE_BOLD_ICON_MAP,
  LUCIDE_THIN_ICON_MAP,
  LUCIDE_FILLED_ICON_MAP
} from './icons-map-lucide-variants'
import {
  WOODEN_SOUND_MAP,
  MECHANICAL_SOUND_MAP,
  RETRO_SOUND_MAP,
  GLASS_SOUND_MAP
} from './sound-presets'

/* ===================== 图标主题 ===================== */

registerIconTheme('lucide-bold', LUCIDE_BOLD_ICON_MAP, {
  label: 'Lucide 加粗',
  preview: ['rss', 'star', 'settings', 'trash', 'search'],
  builtIn: true
})

registerIconTheme('lucide-thin', LUCIDE_THIN_ICON_MAP, {
  label: 'Lucide 纤细',
  preview: ['rss', 'star', 'settings', 'trash', 'search'],
  builtIn: true
})

registerIconTheme('lucide-filled', LUCIDE_FILLED_ICON_MAP, {
  label: 'Lucide 实心',
  preview: ['rss', 'star', 'settings', 'trash', 'search'],
  builtIn: true
})

/* ===================== 音效主题 ===================== */

registerSoundTheme('wooden', WOODEN_SOUND_MAP, {
  label: '木质温润',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('mechanical', MECHANICAL_SOUND_MAP, {
  label: '机械键盘',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('retro', RETRO_SOUND_MAP, {
  label: '8-bit 复古',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('glass', GLASS_SOUND_MAP, {
  label: '玻璃清亮',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

/* ===================== 主题套装 ===================== */

registerThemeBundle({
  id: 'calm-tool',
  label: '冷静工具派',
  iconTheme: 'lucide-thin',
  soundTheme: 'wooden',
  description: '纤细线性 × 木质温润，克制不打扰',
  builtIn: true
})

registerThemeBundle({
  id: 'pro-editor',
  label: '细腻专业派',
  iconTheme: 'lucide-bold',
  soundTheme: 'glass',
  description: '加粗笔画 × 玻璃清亮，高频操作更明确',
  builtIn: true
})

registerThemeBundle({
  id: 'mech-key',
  label: '机械键盘派',
  iconTheme: 'lucide-bold',
  soundTheme: 'mechanical',
  description: '加粗笔画 × 方波段落感，打字机手感',
  builtIn: true
})

registerThemeBundle({
  id: 'retro-game',
  label: '复古游戏派',
  iconTheme: 'lucide-filled',
  soundTheme: 'retro',
  description: '实心色块 × 8-bit 琶音，红白机记忆',
  builtIn: true
})
