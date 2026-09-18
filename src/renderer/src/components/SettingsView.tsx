import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { useStore, type SettingsTab } from '../store'
import { Icon, type IconName } from './icons'
import { RssManager } from './RssManager'
import { GithubStarManager } from './GithubStarManager'
import { TwitterBookmarkManager } from './TwitterBookmarkManager'
import { BookmarkManager } from './BookmarkManager'
import { DbView } from './DbView'
import { DiagPanel } from './DiagPanel'
import { press, pressBtn } from '../lib/press'
import {
  THEME_OPTIONS, COLOR_THEMES,
  uiFontStack,
  type ThemeMode, type ColorThemeKey, type FontWeight
} from '../lib/appearance'
import { listIconThemes, resolveIconFrom } from '../lib/icon-themes'
import { getMenuPaletteColors, listMenuPalettes } from '../lib/menu-palettes'
import { listSoundThemes } from '../lib/sound-themes'
import { previewSoundTheme } from '../lib/sound'
import { READING_THEMES, FOLLOW_UI_ID, type ReadingTheme, getAllReadingThemes, deleteCustomReadingTheme, upsertCustomReadingTheme } from '../lib/reading-themes'
import {
  SHORTCUT_GROUPS, DEFAULT_SHORTCUTS, formatCombo, eventToCombo,
  type ShortcutAction
} from '../lib/shortcuts'
import { DsSlider } from './DsSlider'

const FONT_BASE_PX = 14
const FONT_MIN_PX = 13
const FONT_MAX_PX = 24

// 仅包裹右侧面板内容：切换左侧子菜单时随 settingsTab 重挂载（重置该 tab 内部状态 + 错误隔离），
// 但外层 .settings-modal 容器保持稳定，从而不会重播 modalIn 进入动画（无感切换）。
class TabErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null }
  static getDerivedStateFromError(err: Error) { return { err } }
  render() {
    if (this.state.err) {
      return (
        <div className="set-scroll">
          <div className="set-card">
            <p className="src-warn">该设置项加载出错：{this.state.err.message}</p>
            <button className="mini-btn" onClick={() => this.setState({ err: null })}>重试</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const TABS: Array<{ key: SettingsTab; label: string; icon: IconName }> = [
  { key: 'appearance', label: '外观', icon: 'palette' },
  { key: 'rss', label: 'RSS 订阅', icon: 'rss' },
  { key: 'github', label: 'GitHub Star', icon: 'github' },
  { key: 'twitter', label: 'X 书签', icon: 'twitter' },
  { key: 'bookmarks', label: '浏览器收藏夹', icon: 'bookmark' },
  { key: 'actions', label: '数据管理', icon: 'archived' },
  { key: 'ai', label: 'AI 模型', icon: 'sparkles' },
  { key: 'shortcuts', label: '快捷键', icon: 'keyboard' },
  { key: 'data', label: '数据查看', icon: 'book' },
  { key: 'diag', label: '刷新诊断', icon: 'activity' },
  { key: 'thanks', label: '致谢', icon: 'heart' }
]

export function SettingsView() {
  const { settingsTab, setSettingsTab, refreshAll, closeSettings, menuPaletteId } = useStore()
  // 菜单配色：设置导航图标与侧边栏图标同步着色
  const navColors = getMenuPaletteColors(menuPaletteId)
  const navStyle = (name: IconName): React.CSSProperties | undefined =>
    navColors[name] ? { color: navColors[name] } : undefined

  return (
    <div className="settings-modal-mask" {...press(() => closeSettings())}>
      <section className="settings settings-modal" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        <nav className="settings-nav">
          {TABS.map((t) => (
            <button key={t.key} className={`set-nav ${settingsTab === t.key ? 'active' : ''}`} {...pressBtn(() => setSettingsTab(t.key))}>
              <Icon name={t.icon} size={16} style={navStyle(t.icon)} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="settings-panel">
          <TabErrorBoundary key={settingsTab}>
            {settingsTab === 'appearance' && <AppearanceTab />}
            {settingsTab === 'rss' && <RssManager />}
            {settingsTab === 'github' && <GithubStarManager />}
            {settingsTab === 'twitter' && <TwitterBookmarkManager />}
            {settingsTab === 'bookmarks' && <BookmarkManager />}
            {settingsTab === 'actions' && <ActionsTab onRefresh={refreshAll} />}
            {settingsTab === 'ai' && <AiModelTab />}
            {settingsTab === 'shortcuts' && <ShortcutsTab />}
            {settingsTab === 'data' && <DbView />}
            {settingsTab === 'diag' && <DiagPanel />}
            {settingsTab === 'thanks' && <ThanksTab />}
          </TabErrorBoundary>
        </div>
        {/* 关闭按钮：弹窗最右上角（与面板右缘滚动条同侧） */}
        <button className="settings-close" title="关闭设置" {...pressBtn(() => closeSettings())}><Icon name="close" size={16} /></button>
      </section>
    </div>
  )
}

/* ===================== 外观 ===================== */
function AppearanceTab() {
  const { appearance, soundEnabled, soundVolume, updateAppearance, setSoundEnabled, setSoundVolume, logo, setLogo, showToast, iconThemeId, setIconTheme, soundThemeId, setSoundTheme, menuPaletteId, setMenuPalette } = useStore()
  // 图标库 / 音效库列表来自模块级注册表（见 lib/theme-presets.ts），切换后由 store 状态驱动重渲染
  const iconThemes = listIconThemes()
  const soundThemes = listSoundThemes()
  // 菜单配色方案（见 lib/menu-palettes.ts）：默认 + 四套多彩，为侧边栏图标着色
  const menuPalettes = listMenuPalettes()
  const [systemFonts, setSystemFonts] = useState<string[]>([])
  const [logos, setLogos] = useState<Array<{ id: string; name: string; thumb: string }>>([])
  const styleGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.capybara.invoke('app:fontList').then((list) => setSystemFonts(list as string[])).catch(() => { })
  }, [])

  // 加载内置 logo 列表（应用图标切换）
  useEffect(() => {
    window.capybara.invoke('app:logoList').then((list) => setLogos(list as Array<{ id: string; name: string; thumb: string }>)).catch(() => { })
  }, [])

  const setTheme = (theme: ThemeMode) => updateAppearance({ theme })
  const setColorTheme = (colorTheme: ColorThemeKey | 'none') => updateAppearance({ colorTheme })
  const setFontWeight = (w: FontWeight) => updateAppearance({ fontWeight: w })
  const setReadingTheme = (id: string) => updateAppearance({ readingTheme: id })
  // 当前显示为「基础字号(px)」，并夹紧到可选区间；写入时换算回 --font-scale 乘子。
  const fontPx = Math.min(FONT_MAX_PX, Math.max(FONT_MIN_PX, Math.round(appearance.fontScale * FONT_BASE_PX)))
  const setFontPx = (px: number) => {
    const clamped = Math.min(FONT_MAX_PX, Math.max(FONT_MIN_PX, px))
    updateAppearance({ fontScale: clamped / FONT_BASE_PX })
  }
  const [, themeTick] = useState(0)

  // Feature1：选中颜色主题后，把焦点与可视区域移到该卡片上
  useEffect(() => {
    const grid = styleGridRef.current
    if (!grid) return
    const active = grid.querySelector('.style-opt.active') as HTMLElement | null
    active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [appearance.colorTheme])

  const currentStyle =
    appearance.colorTheme === 'none'
      ? { label: '默认', preview: 'linear-gradient(135deg,#f1f0eb,#d8d6ce)' }
      : COLOR_THEMES.find((s) => s.key === appearance.colorTheme) ?? { label: '默认', preview: 'linear-gradient(135deg,#f1f0eb,#d8d6ce)' }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">图标库</p>
          <span className="cur-chip">{iconThemes.find((t) => t.id === iconThemeId)?.label || 'Lucide 线性'}</span>
        </div>
        <p className="src-hint">不同设计语言的图标集，点击卡片即时全局生效。各卡片预览的是同一组图标，便于横向对比风格差异。</p>
        <div className="lib-grid">
          {iconThemes.map((t) => (
            <button key={t.id} className={`lib-opt ${iconThemeId === t.id ? 'active' : ''}`}
              onClick={() => setIconTheme(t.id)} title={t.description}>
              <div className="lib-preview">
                {t.preview.map((n) => {
                  const C = resolveIconFrom(t.id, n)
                  return <C key={n} size={16} strokeWidth={1.75} />
                })}
              </div>
              <div className="lib-info">
                <span className="lib-name">{t.label}</span>
                {t.description && <span className="lib-desc">{t.description}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">菜单配色</p>
          <span className="cur-chip">{menuPalettes.find((p) => p.id === menuPaletteId)?.label || '默认'}</span>
        </div>
        <p className="src-hint">为侧边栏菜单图标上色。默认跟随界面配色；四套多彩方案为每个菜单项分配独立颜色，点击卡片即时生效。与图标库组合使用，形状与颜色互不影响。</p>
        <div className="lib-grid">
          {menuPalettes.map((p) => (
            <button key={p.id} className={`lib-opt ${menuPaletteId === p.id ? 'active' : ''}`}
              onClick={() => setMenuPalette(p.id)} title={p.description}>
              <div className="lib-preview">
                {p.preview.map((n) => {
                  const C = resolveIconFrom(iconThemeId, n)
                  const c = p.colors[n]
                  return <C key={n} size={16} strokeWidth={1.75} style={c ? { color: c } : undefined} />
                })}
              </div>
              <div className="lib-info">
                <span className="lib-name">{p.label}</span>
                {p.description && <span className="lib-desc">{p.description}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">音效库</p>
          <span className="cur-chip">{soundThemes.find((t) => t.id === soundThemeId)?.label || 'Crystal 水晶'}</span>
        </div>
        <p className="src-hint">点击卡片右上角的试听按钮预览音色，试听不受全局音效开关影响。</p>
        <div className="lib-grid">
          {soundThemes.map((t) => (
            <button key={t.id} className={`lib-opt ${soundThemeId === t.id ? 'active' : ''}`}
              onClick={() => setSoundTheme(t.id)} title={t.description}>
              <div className="lib-preview">
                <Icon name="music" size={16} />
              </div>
              <div className="lib-info">
                <span className="lib-name">{t.label}</span>
                {t.description && <span className="lib-desc">{t.description}</span>}
              </div>
              <span
                role="button"
                tabIndex={0}
                className="lib-audition"
                title={`试听「${t.label}」音效`}
                aria-label={`试听 ${t.label} 音效`}
                onClick={(e) => { e.stopPropagation(); previewSoundTheme(t.id, t.preview) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); e.stopPropagation(); previewSoundTheme(t.id, t.preview)
                  }
                }}
              >
                <Icon name="music" size={13} />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">主题</p>
        <div className="seg">
          {THEME_OPTIONS.map((o) => (
            <button key={o.key} className={`seg-btn ${appearance.theme === o.key ? 'active' : ''}`} onClick={() => setTheme(o.key)}>{o.label}</button>
          ))}
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">UI 配色</p>
          <span className="cur-chip"><span className="cur-swatch" style={{ background: currentStyle.preview }} />{currentStyle.label}</span>
        </div>
        <p className="src-hint">界面整面配色：选择后主强调色（按钮/选中态/聚焦环）随之切换。</p>
        <div className="style-grid" ref={styleGridRef}>
          <button className={`style-opt ${appearance.colorTheme === 'none' ? 'active' : ''}`}
            onClick={(e) => { setColorTheme('none'); e.currentTarget.focus() }}>
            <span className="style-preview" style={{ background: 'linear-gradient(135deg,#f1f0eb,#d8d6ce)' }} />
            <span className="style-name">默认</span>
          </button>
          {COLOR_THEMES.map((s) => (
            <button key={s.key} className={`style-opt ${appearance.colorTheme === s.key ? 'active' : ''}`}
              onClick={(e) => { setColorTheme(s.key); e.currentTarget.focus() }}>
              <span className="style-preview" style={{ background: s.preview }} />
              <span className="style-name">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">字体</p>
        <label className="src-row" style={{ marginBottom: 10 }}>全局字体
          <select value={appearance.fontFamily}
            onChange={(e) => updateAppearance({ fontFamily: e.target.value })}>
            <option value="">系统默认</option>
            {systemFonts.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
        <div className="src-row" style={{ marginBottom: 6, justifyContent: 'space-between' }}>
          <span>字号</span>
          <span className="fs-pill" aria-live="polite">{fontPx}px</span>
        </div>
        <div className="font-size-slider-wrap" style={{ marginBottom: 12 }}>
          <span className="fs-label-min">小</span>
          <DsSlider
            min={FONT_MIN_PX}
            max={FONT_MAX_PX}
            step={1}
            value={fontPx}
            onChange={setFontPx}
            formatValue={(v) => `${v}px`}
            showTicks={true}
            className="flex-1"
            aria-label="字号"
          />
          <span className="fs-label-max">大</span>
        </div>
        <div
          className="font-preview-box"
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--ds-radius-md, 12px)',
            backgroundColor: 'var(--ds-on-surface, rgba(127, 127, 127, 0.06))',
            fontSize: `${fontPx}px`,
            fontFamily: uiFontStack(appearance.fontFamily),
            fontWeight: appearance.fontWeight === 'thin' ? 300 : appearance.fontWeight === 'bold' ? 700 : 400,
            marginBottom: 10,
            transition: 'font-size var(--ds-motion-soft, 240ms ease)'
          }}
        >
          <p style={{ color: 'var(--ds-text-primary)', lineHeight: 1.6, margin: 0 }}>
            这是字号预览效果：敏捷捕获，从容阅读。沉淀个人知识管道。
          </p>
        </div>
        <label className="src-row">字重
          <div className="seg">
            {(['thin', 'normal', 'bold'] as FontWeight[]).map((w) => (
              <button key={w} className={`seg-btn ${appearance.fontWeight === w ? 'active' : ''}`}
                style={{ fontWeight: w === 'thin' ? 300 : w === 'bold' ? 700 : 400 }}
                onClick={() => setFontWeight(w)}>{w === 'thin' ? '细' : w === 'normal' ? '正常' : '粗'}</button>
            ))}
          </div>
        </label>
        <p className="src-hint">全局字体从系统已安装的全部字体中选择，字号为全局基础字号（13–18px，默认 14px），作用于全部界面与阅读正文。</p>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">阅读配色</p>
        </div>
        <p className="src-hint">选择后仅改变正文阅读区域的配色，不影响左侧列表和设置等界面。新增配色只能通过「导入配色」加载 JSON 文件（含 name / mode / colors）。</p>
        <div className="src-actions" style={{ marginBottom: 10 }}>
          <button onClick={async () => {
            const r = await window.capybara.invoke('readingTheme:import') as {
              ok: boolean; error?: string;
              theme?: { name: string; mode: 'dark' | 'light'; colors: Record<string, string> }
            }
            if (!r.ok) { if (r.error && r.error !== '已取消') showToast('导入失败：' + r.error); return }
            const id = `custom-${Date.now()}`
            upsertCustomReadingTheme({ id, name: r.theme!.name, mode: r.theme!.mode, colors: r.theme!.colors })
            setReadingTheme(id)
            themeTick((t) => t + 1)
            showToast('已导入配色：' + r.theme!.name)
          }}><Icon name="upload" size={14} /> 导入配色</button>
        </div>
        <div className="reading-theme-grid">
          {renderReadingThemes(appearance.readingTheme, (id) => setReadingTheme(id))}
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">应用图标</p>
        </div>
        <p className="src-hint">切换应用在 Dock 中显示的图标。将 PNG 图标放入 build/logos 目录后会自动出现在这里（建议 1024×1024，文件名作为图标名）。</p>
        {logos.length === 0 ? (
          <p className="src-hint">暂无内置图标，请将 PNG 文件放入 build/logos 目录。</p>
        ) : (
          <div className="logo-grid">
            {logos.map((l) => (
              <button key={l.id} className={`logo-opt ${logo === l.id ? 'active' : ''}`}
                onClick={() => setLogo(l.id)} title={l.name}>
                {l.thumb ? <img className="logo-preview" src={l.thumb} alt={l.name} /> : <span className="logo-preview logo-fallback" />}
                <span className="logo-name">{l.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="set-card">
        <p className="src-label">音效</p>
        <label className="switch-row">
          <span>启用界面音效</span>
          <button className={`switch ${soundEnabled ? 'on' : ''}`} role="switch" aria-checked={soundEnabled}
            {...pressBtn(() => setSoundEnabled(!soundEnabled))}><span className="knob" /></button>
        </label>
        <div className="src-row" style={{ marginBottom: 6, justifyContent: 'space-between' }}>
          <span>音量</span>
          <span className="fs-pill" aria-live="polite">{Math.round(soundVolume * 100)}%</span>
        </div>
        <div className="font-size-slider-wrap" style={{ marginBottom: 4 }}>
          <span className="fs-label-min">小</span>
          <DsSlider
            min={0}
            max={100}
            step={1}
            value={Math.round(soundVolume * 100)}
            disabled={!soundEnabled}
            onChange={(v) => setSoundVolume(v / 100)}
            formatValue={(v) => `${v}%`}
            showTicks={false}
            className="flex-1"
            aria-label="音量"
          />
          <span className="fs-label-max">大</span>
        </div>
        <p className="src-hint">克制的合成音：点击、切换、收藏、打开外链等交互反馈。首次需一次点击以解锁音频。</p>
      </div>
    </div>
  )
}

// force re-render key for custom theme list refresh
let _rtTick = 0
function useRtTick() {
  const [, s] = useState(0)
  return [() => { _rtTick++; s(_rtTick) }, _rtTick] as const
}

/* ===================== 快捷键 ===================== */
function ShortcutsTab() {
  const { shortcuts, setShortcuts, resetShortcuts } = useStore()
  const [recording, setRecording] = useState<ShortcutAction | null>(null)

  // 录制：监听下一次按键
  useEffect(() => {
    if (!recording) return
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') { setRecording(null); return }
      const combo = eventToCombo(e)
      setShortcuts({ ...shortcuts, [recording]: combo })
      setRecording(null)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [recording, shortcuts, setShortcuts])

  // 冲突检测：同一组合键被多个动作占用
  const conflicts = new Set<string>()
  const seen = new Map<string, ShortcutAction>()
  for (const a of Object.keys(shortcuts) as ShortcutAction[]) {
    const c = shortcuts[a]
    if (seen.has(c)) { conflicts.add(c); conflicts.add(shortcuts[seen.get(c)!]) }
    else seen.set(c, a)
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">快捷键</p>
          <button className="mini-btn" onClick={() => resetShortcuts()}><Icon name="refresh" size={13} /> 全部重置</button>
        </div>
        <p className="src-hint">点击「录制」后按下想要的组合键即可重新绑定；带 ⌘ 的全局快捷键在输入框聚焦时也生效，单键快捷键仅在非输入状态生效。</p>
        {conflicts.size > 0 && (
          <p className="src-warn">⚠ 存在重复绑定：{[...conflicts].map((c) => formatCombo(c)).join('、')}</p>
        )}
        {SHORTCUT_GROUPS.map((g) => (
          <div key={g.title} className="sc-group">
            <p className="sc-group-title">{g.title}</p>
            {g.items.map((it) => {
              const combo = shortcuts[it.key]
              const isRec = recording === it.key
              return (
                <div key={it.key} className={`sc-row ${conflicts.has(combo) ? 'conflict' : ''}`}>
                  <div className="sc-meta">
                    <span className="sc-label">{it.label}</span>
                    <span className="sc-desc">{it.desc}</span>
                  </div>
                  <div className="sc-actions">
                    <button className={`sc-combo ${isRec ? 'rec' : ''}`}
                      onClick={() => setRecording(isRec ? null : it.key)}>
                      {isRec ? '按下新快捷键…' : formatCombo(combo)}
                    </button>
                    <button className="sc-reset" title="恢复默认"
                      onClick={() => setShortcuts({ ...shortcuts, [it.key]: DEFAULT_SHORTCUTS[it.key] })}>
                      <Icon name="undo" size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===================== AI 模型配置 ===================== */
function AiModelTab() {
  const { showToast } = useStore()
  const [providers, setProviders] = useState<Array<{ id: string; label: string; baseUrl: string; defaultModel: string; keyHint: string; website: string }>>([])
  const [providerId, setProviderId] = useState('deepseek')
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [configured, setConfigured] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; content: string; error: string } | null>(null)

  useEffect(() => {
    void (async () => {
      const ps = await window.capybara.invoke('llm:providers') as typeof providers
      setProviders(ps)
      const cfg = await window.capybara.invoke('llm:config') as { providerId: string; baseUrl: string; apiKey: string; model: string; configured: boolean }
      setProviderId(cfg.providerId || 'deepseek')
      setBaseUrl(cfg.baseUrl)
      setApiKey('')
      setModel(cfg.model)
      setConfigured(cfg.configured)
    })()
  }, [])

  const onProviderChange = (id: string) => {
    setProviderId(id)
    const p = providers.find((x) => x.id === id)
    if (p) {
      setBaseUrl(p.baseUrl)
      setModel(p.defaultModel)
    }
  }

  const save = async () => {
    await window.capybara.invoke('llm:saveConfig', providerId, baseUrl, apiKey, model)
    const cfg = await window.capybara.invoke('llm:config') as { configured: boolean }
    setConfigured(cfg.configured)
    setApiKey('')
    showToast('AI 模型配置已保存')
  }

  const test = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const r = await window.capybara.invoke('llm:test') as { ok: boolean; content: string; error: string }
      setTestResult(r)
      showToast(r.ok ? '测试成功' : '测试失败')
    } catch (e) {
      setTestResult({ ok: false, content: '', error: (e as Error).message })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">AI 模型</p>
        <p className="src-hint">配置在线大语言模型，用于收藏夹自动归类等 AI 功能。支持国内主流模型厂商，统一走 OpenAI 兼容接口。</p>

        <div className="src-grid-2" style={{ marginTop: 12 }}>
          <label className="src-row">模型厂商
            <select className="src-select" value={providerId} onChange={(e) => onProviderChange(e.target.value)}>
              {providers.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
          <label className="src-row">模型名
            <input type="text" className="src-input" value={model} placeholder="如 deepseek-chat" onChange={(e) => setModel(e.target.value)} />
          </label>
        </div>

        <label className="src-row" style={{ marginTop: 12 }}>API Base URL
          <input type="text" className="src-input" value={baseUrl} placeholder="https://api.deepseek.com/v1" onChange={(e) => setBaseUrl(e.target.value)} />
        </label>

        <label className="src-row" style={{ marginTop: 12 }}>API Key
          <input type="password" className="src-input" value={apiKey} placeholder={configured ? '已配置（输入新值覆盖）' : 'sk-...'} onChange={(e) => setApiKey(e.target.value)} />
        </label>

        {(() => {
          const p = providers.find((x) => x.id === providerId)
          return p && p.website ? (
            <p className="src-hint" style={{ marginTop: 8 }}>
              获取 API Key： <a href="#" onClick={(e) => { e.preventDefault(); void window.capybara.invoke('shell:openExternal', p.website) }}>{p.keyHint}</a>
            </p>
          ) : null
        })()}

        <div className="src-actions" style={{ marginTop: 16 }}>
          <button onClick={() => void save()} disabled={!baseUrl || !model || !apiKey}><Icon name="check" size={14} /> 保存配置</button>
          <button onClick={() => void test()} disabled={testing || (!configured && !apiKey)}>
            {testing ? <Icon name="refresh" size={14} className="spin" /> : <Icon name="sparkles" size={14} />}
            {testing ? '测试中…' : '测试连接'}
          </button>
          {configured && !apiKey && <span className="src-hint">✓ 已配置</span>}
        </div>

        {testResult && (
          <div className={`src-card ${testResult.ok ? 'ok-box' : 'warn-box'}`} style={{ marginTop: 12, padding: 12, borderRadius: 8 }}>
            {testResult.ok ? (
              <p>✅ 连接成功！模型返回：{testResult.content.slice(0, 100)}</p>
            ) : (
              <p>❌ 连接失败：{testResult.error}</p>
            )}
          </div>
        )}
      </div>

      <div className="set-card">
        <p className="src-label">使用说明</p>
        <ul style={{ paddingLeft: 16, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <li>AI 模型配置后，可在收藏夹页面点击「AI 归类」按钮自动分类书签</li>
          <li>所有请求通过 Electron net.fetch 发出，尊重系统代理设置</li>
          <li>API Key 存储在本地 SQLite 数据库，不会上传到任何服务器</li>
          <li>支持 DeepSeek、通义千问、智谱 GLM、Moonshot 等国内主流厂商</li>
          <li>选择「自定义」可对接任何 OpenAI 兼容接口</li>
        </ul>
      </div>
    </div>
  )
}

/* ===================== 操作 / 性能 ===================== */
function ActionsTab({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const { clearInbox, purge, showToast, developerMode, setDeveloperMode, dbPath, setDbPath } = useStore()
  const [msg, setMsg] = useState('')
  const [keepDays, setKeepDays] = useState(90)
  const [maxItems, setMaxItems] = useState(2000)
  const [dbPathInput, setDbPathInput] = useState(dbPath)
  const [dbPathMsg, setDbPathMsg] = useState('')

  const refresh = async () => { setMsg('刷新中…'); await onRefresh(); setMsg('已触发全部源刷新'); showToast('已开始刷新') }
  const clear = async () => {
    await clearInbox(); setMsg('RSS 已清空'); showToast('RSS 已清空')
  }
  const doPurge = async () => {
    await purge(keepDays, maxItems)
    setMsg(`已按保留策略清理（保留 ${keepDays} 天内的归档，单库上限 ${maxItems} 条）`)
  }

  return (
    <div className="set-scroll">

      <div className="set-card">
        <p className="src-label">开发者模式</p>
        <p className="src-hint">开启后自动打开 DevTools 并在界面右下角显示网络诊断面板（每个 RSS 请求的状态 / 耗时 / 字节 / 错误），便于排查「无法获取数据」。</p>
        <div className="switch-row">
          <span>启用开发者模式（含网络诊断）</span>
          <button className={`switch ${developerMode ? 'on' : ''}`} onClick={() => setDeveloperMode(!developerMode)}><span className="knob" /></button>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">数据库文件路径</p>
        <p className="src-hint">
          设置自定义数据库文件路径（例如 .db 文件路径或目录）。设置后<b>需重启应用</b>生效。
          可用于导入/导出数据库分享给他人，或从备份恢复。
        </p>
        <div className="src-row" style={{ gap: 8 }}>
          <input
            type="text"
            value={dbPathInput ?? ''}
            placeholder={dbPath || '使用默认路径 (~/Library/Application Support/capybara/capybara.db)'}
            onChange={(e) => setDbPathInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={async () => {
            const r = await setDbPath(dbPathInput ?? '')
            if (r.ok) {
              setDbPathMsg(dbPathInput ? '已保存，重启后生效' : '已恢复默认路径，重启后生效')
              setDbPathInput(dbPathInput)
            } else {
              setDbPathMsg('失败：' + (r.error ?? '未知错误'))
            }
          }}>保存</button>
          <button title="浏览选择数据库文件" onClick={async () => {
            const p = await window.capybara.invoke('settings:pickDbPath') as string
            if (p) setDbPathInput(p)
          }}>浏览…</button>
        </div>
        {dbPathMsg && <p className={`src-hint ${dbPathMsg.includes('失败') ? 'src-warn' : ''}`} style={{ marginTop: 6 }}>{dbPathMsg}</p>}
        {dbPath ? <p className="src-hint" style={{ marginTop: 4 }}>当前自定义路径：{dbPath}</p> : null}
      </div>

      <div className="set-card">
        <p className="src-label">数据操作</p>
        <div className="src-actions">
          <button onClick={() => void refresh()}><Icon name="refresh" size={14} /> 立即刷新全部源</button>
          <button onClick={() => void clear()}><Icon name="trash" size={14} /> 清空 RSS</button>
          <span className="src-hint src-grow">{msg}</span>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">配置导入/导出（JSON）</p>
        <p className="src-hint">导出所有设置项（外观、配色、订阅源列表等）为 JSON 文件，可在另一台电脑或重装后恢复。导入时自动跳过已存在的订阅源。</p>
        <div className="src-actions">
          <button onClick={async () => {
            const ok = await window.capybara.invoke('settings:export')
            showToast(ok ? '配置已导出' : '已取消导出')
          }}><Icon name="upload" size={14} /> 导出配置</button>
          <button onClick={async () => {
            const r = await window.capybara.invoke('settings:import') as { ok: boolean; error?: string; imported?: number }
            if (r.ok) {
              showToast(`已导入 ${r.imported ?? 0} 项设置，请重启应用生效`)
              // 重新加载外观以应用导入的配色
              void useStore.getState().initAppearance()
            } else {
              showToast('导入失败：' + (r.error || '未知错误'))
            }
          }}><Icon name="bookmark" size={14} /> 导入配置</button>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">性能 · 保留策略</p>
        <p className="src-hint">仅清理「已归档」且抓取时间早于阈值的条目，以及单库总量超出上限时最旧的归档；RSS / 稍后读 / 收藏永不被自动清理。</p>
        <div className="src-grid-2">
          <label className="src-row">保留归档
            <span className="src-unit">不少于</span>
            <input type="number" min={0} max={3650} value={keepDays} className="src-num"
              onChange={(e) => setKeepDays(Math.max(0, Number(e.target.value) || 0))} />
            <span className="src-unit">天</span>
          </label>
          <label className="src-row">单库上限
            <input type="number" min={100} max={100000} value={maxItems} className="src-num"
              onChange={(e) => setMaxItems(Math.max(100, Number(e.target.value) || 100))} />
            <span className="src-unit">条</span>
          </label>
        </div>
        <div className="src-actions">
          <button onClick={() => void doPurge()}><Icon name="trash" size={14} /> 立即清理</button>
        </div>
      </div>
    </div>
  )
}

/* ===================== 阅读配色色块渲染 ===================== */
function renderReadingThemes(activeId: string, onSelect: (id: string) => void) {
  const all = getAllReadingThemes()
  const darkThemes = all.filter((t) => t.mode === 'dark')
  const lightThemes = all.filter((t) => t.mode === 'light')
  const isCustom = (id: string) => READING_THEMES.every((bt) => bt.id !== id) && id !== FOLLOW_UI_ID

  const renderGroup = (label: string, themes: readonly ReadingTheme[], showFollow: boolean) => (
    <div key={label} className="rt-group">
      <p className="rt-group-label">{label}主题（{themes.length + (showFollow ? 1 : 0)} 套）</p>
      <div className="rt-grid">
        {showFollow && (
          <button
            className={`rt-chip ${activeId === FOLLOW_UI_ID ? 'active' : ''}`}
            onClick={() => onSelect(FOLLOW_UI_ID)}
            title="跟随界面配色"
          >
            <span className="rt-swatch" style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-secondary)' }} />
            <span className="rt-name">跟随界面</span>
          </button>
        )}
        {themes.map((t) => (
          <div key={t.id} className="rt-chip-wrap">
            <button
              className={`rt-chip ${activeId === t.id ? 'active' : ''}`}
              onClick={() => onSelect(t.id)}
              title={t.name}
            >
              <span className="rt-swatch multi">
                <span style={{ background: t.colors['--rt-bg'] }} />
                <span style={{ background: t.colors['--rt-heading'] }} />
                <span style={{ background: t.colors['--rt-link'] }} />
              </span>
              <span className="rt-name">{t.name.replace(/\(.*\)/, '').trim()}</span>
            </button>
            <span className="rt-chip-actions">
              {isCustom(t.id) && (
                <button className="danger" title="删除" onClick={(e) => { e.stopPropagation(); deleteCustomReadingTheme(t.id); onSelect(FOLLOW_UI_ID) }}><Icon name="trash" size={14} /></button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {renderGroup('暗色', darkThemes, true)}
      {renderGroup('亮色', lightThemes, false)}
    </>
  )
}

/* ===================== 致谢 ===================== */
// 开源软件清单（按用途分组；版本号取自 package.json，许可证以各项目官方声明为准）
const OSS_GROUPS: Array<{ title: string; items: Array<{ name: string; version: string; license: string; role: string }> }> = [
  {
    title: '运行时框架',
    items: [
      { name: 'Electron', version: '^37.2.0', license: 'MIT', role: '跨平台桌面运行时' },
      { name: 'Node.js · node:sqlite', version: '内置', license: 'MIT', role: '本地数据库存储' }
    ]
  },
  {
    title: '界面与状态',
    items: [
      { name: 'React', version: '^18.3.1', license: 'MIT', role: 'UI 框架' },
      { name: 'React DOM', version: '^18.3.1', license: 'MIT', role: 'DOM 渲染' },
      { name: 'react-window', version: '^1.8.11', license: 'MIT', role: '长列表虚拟滚动' },
      { name: 'zustand', version: '^4.5.5', license: 'MIT', role: '轻量状态管理' }
    ]
  },
  {
    title: '图标与音效',
    items: [
      { name: 'lucide-react', version: '^1.28.0', license: 'ISC', role: '线性图标集（默认）' },
      { name: '@tabler/icons-react', version: '^3.46.0', license: 'MIT', role: '硬朗线性图标集' },
      { name: '@solar-icons/react', version: '^2.2.0', license: 'MIT / CC BY 4.0', role: '断续线、细线双色、粗双色调、粗描边图标集（图标设计 © 480 Design）' },
      { name: '@phosphor-icons/react', version: '^2.1.10', license: 'MIT', role: '双色调 / 实心图标集' },
      { name: '@carbon/icons-react', version: '^11.88.0', license: 'Apache-2.0', role: '直角企业图标集（IBM Carbon）' },
      { name: 'pixelarticons', version: '^2.4.1', license: 'MIT', role: '像素风图标集' },
      { name: 'ZzFX', version: '内联 v1.3.2', license: 'MIT', role: '参数化音效合成引擎（Frank Force）' }
    ]
  },
  {
    title: '内容解析',
    items: [
      { name: 'rss-parser', version: '^3.13.0', license: 'MIT', role: 'RSS / Atom 订阅解析' },
      { name: '@mozilla/readability', version: '^0.6.0', license: 'Apache-2.0', role: '正文内容提取' },
      { name: 'cheerio', version: '^1.2.0', license: 'MIT', role: '服务端 HTML 解析' },
      { name: 'linkedom', version: '^0.18.13', license: 'MIT', role: '轻量 DOM 实现' },
      { name: 'dompurify', version: '^3.4.13', license: 'MPL-2.0', role: 'HTML 安全净化' }
    ]
  },
  {
    title: '富文本编辑',
    items: [
      { name: '@tiptap/core', version: '^3.29.2', license: 'MIT', role: '富文本编辑器内核' },
      { name: '@tiptap/pm', version: '^3.29.2', license: 'MIT', role: 'ProseMirror 适配' },
      { name: '@tiptap/react', version: '^3.29.2', license: 'MIT', role: 'React 绑定' },
      { name: '@tiptap/starter-kit', version: '^3.29.2', license: 'MIT', role: '基础功能套件' }
    ]
  },
  {
    title: '构建与开发',
    items: [
      { name: 'electron-vite', version: '^2.3.0', license: 'MIT', role: 'Electron 构建管线' },
      { name: 'vite', version: '^5.4.11', license: 'MIT', role: '前端构建工具' },
      { name: 'typescript', version: '^5.6.3', license: 'Apache-2.0', role: '类型系统' },
      { name: 'electron-builder', version: '^25.1.8', license: 'MIT', role: '应用打包 / DMG' },
      { name: 'sharp', version: '^0.35.3', license: 'Apache-2.0', role: '图片处理' },
      { name: '@vitejs/plugin-react', version: '^4.3.4', license: 'MIT', role: 'React 插件' }
    ]
  }
]

function ThanksTab() {
  const [ver, setVer] = useState('')
  useEffect(() => {
    window.capybara.invoke('app:version').then((v) => setVer((v as string) || '')).catch(() => { })
  }, [])

  return (
    <div className="set-scroll">
      <div className="set-card thanks-hero">
        <div className="thanks-hero-icon"><Icon name="heart" size={22} /></div>
        <div className="thanks-hero-text">
          <h2 className="thanks-title">致谢</h2>
          <p className="thanks-sub">
            Capybara 是一款个人知识管线桌面客户端{ver ? `，当前版本 ${ver}` : ''}。它站在开源社区的肩膀之上。
            本页列出构建它所用的开源软件。
          </p>
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">开源软件清单</p>
        </div>
        <p className="src-hint">Capybara 基于以下开源项目构建（按用途分组）。许可证信息以各项目官方声明为准。</p>
        <div className="oss-list">
          {OSS_GROUPS.map((g) => (
            <div className="oss-group" key={g.title}>
              <p className="oss-group-title">{g.title}</p>
              <div className="oss-table">
                {g.items.map((it) => (
                  <div className="oss-row" key={it.name}>
                    <span className="oss-name">{it.name}</span>
                    <span className="oss-ver">{it.version}</span>
                    <span className="oss-lic">{it.license}</span>
                    <span className="oss-role">{it.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}