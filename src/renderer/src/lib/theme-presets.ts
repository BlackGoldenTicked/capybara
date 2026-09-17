/**
 * 内置图标库 / 音效库 —— 引导期集中注册
 *
 * main.tsx 首帧前 import 本文件即可完成全部注册，之后：
 *   - `listIconThemes()` / `listSoundThemes()` 返回完整列表，供设置页渲染卡片
 *   - 图标库与音效库彼此独立，各自切换、各自持久化（见 store 的 setIconTheme / setSoundTheme）
 *
 * 扩展新库的步骤：
 *   1. 图标：新建 icons-map-<name>.tsx 导出 IconThemeMap（缺失语义可用 withLucideFallback 回退 Lucide），
 *      然后 registerIconTheme(...)
 *   2. 音效：在 sound-presets.ts 追加一个 SoundThemeMap，然后 registerSoundTheme(...)
 *
 * 素材策略：图标来自各库官方 npm 包（按需引入，tree-shaking 后仅打包用到的语义图标）；
 *           音效零素材，全部由 Web Audio 合成。
 */

import { registerIconTheme } from './icon-themes'
import { registerSoundTheme } from './sound-themes'
import { TABLER_ICON_MAP } from './icons-map-tabler'
import { PHOSPHOR_DUOTONE_ICON_MAP, PHOSPHOR_FILL_ICON_MAP } from './icons-map-phosphor'
import { PIXEL_ICON_MAP } from './icons-map-pixel'
import { SOLAR_BROKEN_ICON_MAP } from './icons-map-solar-broken'
import { SOLAR_LINE_DUOTONE_ICON_MAP } from './icons-map-solar-line-duotone'
import { SOLAR_BOLD_DUOTONE_ICON_MAP } from './icons-map-solar-bold-duotone'
import { SOLAR_BOLD_ICON_MAP } from './icons-map-solar-bold'
import { CARBON_ICON_MAP } from './icons-map-carbon'
import {
  WOODEN_SOUND_MAP,
  MECHANICAL_SOUND_MAP,
  RETRO_SOUND_MAP,
  GLASS_SOUND_MAP,
  LASER_SOUND_MAP,
  METAL_SOUND_MAP,
  BUBBLE_SOUND_MAP
} from './sound-presets'

/* ===================== 图标库 ===================== */

// 全部图标库使用同一组预览语义（rss / star / settings / trash / search），
// 便于在设置页横向对比不同设计语言的差异。
const PREVIEW: ['rss', 'star', 'settings', 'trash', 'search'] = ['rss', 'star', 'settings', 'trash', 'search']

// default（Lucide 线性）已在 icon-themes 内置注册，此处注册其余四种设计语言

registerIconTheme('tabler', TABLER_ICON_MAP, {
  label: 'Tabler 硬朗线性',
  description: '方角端点、网格更密，工程感更强',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('phosphor-duotone', PHOSPHOR_DUOTONE_ICON_MAP, {
  label: 'Phosphor 双色调',
  description: '主体实色 + 同色浅底块，层次最丰富',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('phosphor-fill', PHOSPHOR_FILL_ICON_MAP, {
  label: 'Phosphor 实心',
  description: '纯实色块、高对比，远看辨识度最高',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('pixel', PIXEL_ICON_MAP, {
  label: '像素方块',
  description: '24 网格硬边像素块，复古游戏感',
  preview: PREVIEW,
  builtIn: true
})

// Solar 一套包内含 6 种设计语言，此处取与既有库反差最大的四种
// （linear / outline 与 Lucide、Tabler 同为连续细描边，重复度高，不入列）

registerIconTheme('solar-broken', SOLAR_BROKEN_ICON_MAP, {
  label: 'Solar 断续线',
  description: '线条断开留白，像手绘草稿',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('solar-line-duotone', SOLAR_LINE_DUOTONE_ICON_MAP, {
  label: 'Solar 细线双色',
  description: '细描边 + 半透明副色块',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('solar-bold-duotone', SOLAR_BOLD_DUOTONE_ICON_MAP, {
  label: 'Solar 粗双色调',
  description: '粗主体 + 实色副块，冲击力强',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('solar-bold', SOLAR_BOLD_ICON_MAP, {
  label: 'Solar 粗描边',
  description: '加粗圆端点，厚重直白',
  preview: PREVIEW,
  builtIn: true
})

registerIconTheme('carbon', CARBON_ICON_MAP, {
  label: '直角企业',
  description: 'IBM Carbon 全直角实心，秩序感最强',
  preview: PREVIEW,
  builtIn: true
})

/* ===================== 音效库 ===================== */

// crystal（Crystal 水晶）已在 sound-themes 内置注册，此处注册其余四种音色

registerSoundTheme('wooden', WOODEN_SOUND_MAP, {
  label: '木质温润',
  description: '低频木头质感，短促不打扰',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('mechanical', MECHANICAL_SOUND_MAP, {
  label: '机械键盘',
  description: '方波段落感，打字机手感',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('retro', RETRO_SOUND_MAP, {
  label: '8-bit 复古',
  description: '方波琶音，红白机记忆',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('glass', GLASS_SOUND_MAP, {
  label: '玻璃清亮',
  description: '高频玻璃泛音，明亮通透',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

// 以下三套改用 ZzFX 参数化合成引擎（见 lib/zzfx.ts），
// 提供 tone/noise 表达不了的滑音、噪声混合、位压缩音色

registerSoundTheme('laser', LASER_SOUND_MAP, {
  label: '激光电子',
  description: '锯齿波快速滑音，科技感强',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('metal', METAL_SOUND_MAP, {
  label: '金属敲击',
  description: '噪声 + 位压缩，金属片质感',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})

registerSoundTheme('bubble', BUBBLE_SOUND_MAP, {
  label: '水泡湿润',
  description: '正弦上滑气泡音，柔和圆润',
  preview: ['tap', 'toggle', 'complete', 'open', 'delete'],
  builtIn: true
})
