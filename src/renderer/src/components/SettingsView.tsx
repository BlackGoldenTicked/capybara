import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { useStore, type SettingsTab } from '../store'
import { Icon, type IconName } from './icons'
import { RssManager } from './RssManager'
import { GithubStarManager } from './GithubStarManager'
import { TwitterBookmarkManager } from './TwitterBookmarkManager'
import { DbView } from './DbView'
import { DiagPanel } from './DiagPanel'
import {
  THEME_OPTIONS, COLOR_THEMES, IMAGE_WALLPAPERS, rerollRandomPalette,
  type ThemeMode, type ColorThemeKey, type FontWeight
} from '../lib/appearance'
import { READING_THEMES, FOLLOW_UI_ID, type ReadingTheme, getAllReadingThemes, deleteCustomReadingTheme } from '../lib/reading-themes'
import { ThemeEditor } from './ThemeEditor'
import {
  SHORTCUT_GROUPS, DEFAULT_SHORTCUTS, formatCombo, eventToCombo,
  type ShortcutAction
} from '../lib/shortcuts'
import { playSound } from '../lib/sound'

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
  { key: 'actions', label: '数据管理', icon: 'archived' },
  { key: 'shortcuts', label: '快捷键', icon: 'keyboard' },
  { key: 'data', label: '数据查看', icon: 'book' },
  { key: 'diag', label: '刷新诊断', icon: 'activity' },
  { key: 'thanks', label: '致谢', icon: 'heart' }
]

export function SettingsView() {
  const { settingsTab, setSettingsTab, refreshAll, closeSettings } = useStore()

  return (
    <div className="settings-modal-mask" onClick={closeSettings}>
      <section className="settings settings-modal" onClick={(e) => e.stopPropagation()}>
        <nav className="settings-nav">
          {TABS.map((t) => (
            <button key={t.key} className={`set-nav ${settingsTab === t.key ? 'active' : ''}`} onClick={() => setSettingsTab(t.key)}>
              <Icon name={t.icon} size={16} />
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
            {settingsTab === 'actions' && <ActionsTab onRefresh={refreshAll} />}
            {settingsTab === 'shortcuts' && <ShortcutsTab />}
            {settingsTab === 'data' && <DbView />}
            {settingsTab === 'diag' && <DiagPanel />}
            {settingsTab === 'thanks' && <ThanksTab />}
          </TabErrorBoundary>
        </div>
        <button className="settings-close" title="关闭设置" onClick={closeSettings}><Icon name="close" size={16} /></button>
      </section>
    </div>
  )
}

/* ===================== 外观 ===================== */
function AppearanceTab() {
  const { appearance, soundEnabled, soundVolume, updateAppearance, setSoundEnabled, setSoundVolume, logo, setLogo } = useStore()
  const [systemFonts, setSystemFonts] = useState<string[]>([])
  const [logos, setLogos] = useState<Array<{ id: string; name: string; thumb: string }>>([])
  const styleGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.readflow.invoke('app:fontList').then((list) => setSystemFonts(list as string[])).catch(() => {})
  }, [])

  // 加载内置 logo 列表（应用图标切换）
  useEffect(() => {
    window.readflow.invoke('app:logoList').then((list) => setLogos(list as Array<{ id: string; name: string; thumb: string }>)).catch(() => {})
  }, [])

  const setTheme = (theme: ThemeMode) => updateAppearance({ theme })
  const setColorTheme = (colorTheme: ColorThemeKey | 'none') => updateAppearance({ colorTheme })
  const setFontWeight = (w: FontWeight) => updateAppearance({ fontWeight: w })
  const setReadingTheme = (id: string) => updateAppearance({ readingTheme: id })
  const setWallpaperBlur = (v: boolean) => updateAppearance({ wallpaperBlur: v })
  /** 点击「随机」按钮：切换到 random 主题并重摇一次种子，注入新的 --ds-* 集。 */
  const pickRandom = () => {
    rerollRandomPalette()
    updateAppearance({ colorTheme: 'random' })
  }
  const [themeEdit, setThemeEdit] = useState<ReadingTheme | undefined>(undefined)
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
      : appearance.colorTheme === 'random'
        ? { label: '随机', preview: 'conic-gradient(from 0deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#9b59b6,#ff6b6b)' }
        : appearance.colorTheme.startsWith('image-')
          ? {
              label: IMAGE_WALLPAPERS.find((w) => w.key === appearance.colorTheme)?.label ?? '图片主题',
              preview: IMAGE_WALLPAPERS.find((w) => w.key === appearance.colorTheme)?.thumb ?? 'transparent'
            }
          : COLOR_THEMES.find((s) => s.key === appearance.colorTheme) ?? { label: '默认', preview: 'linear-gradient(135deg,#f1f0eb,#d8d6ce)' }

  return (
    <div className="set-scroll">
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
              onClick={(e) => {
                if (s.key === 'random') pickRandom()
                else { setColorTheme(s.key); e.currentTarget.focus() }
              }}>
              <span className="style-preview" style={{ background: s.key === 'random' ? 'conic-gradient(from 0deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#9b59b6,#ff6b6b)' : s.preview }} />
              <span className="style-name">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">图片主题</p>
          <span className="cur-chip">
            <span className="cur-swatch" style={{
              background: appearance.colorTheme.startsWith('image-')
                ? IMAGE_WALLPAPERS.find((w) => w.key === appearance.colorTheme)?.thumb
                : 'transparent'
            }} />
            {appearance.colorTheme.startsWith('image-')
              ? IMAGE_WALLPAPERS.find((w) => w.key === appearance.colorTheme)?.label ?? '未选择'
              : '未选择'}
          </span>
        </div>
        <p className="src-hint">壁纸主题：用图片作为主区域背景，沿用默认深色基准（不重定义色板）。</p>
        <div className="wallpaper-grid">
          {IMAGE_WALLPAPERS.map((w) => (
            <button key={w.key}
              className={`wallpaper-opt ${appearance.colorTheme === w.key ? 'active' : ''}`}
              onClick={() => setColorTheme(w.key)}
              title={w.label}>
              <span className="wallpaper-thumb" style={{ backgroundImage: `url(${w.thumb})` }} />
              <span className="wallpaper-name">{w.label}</span>
            </button>
          ))}
        </div>
        {appearance.colorTheme.startsWith('image-') && (
          <label className="switch-row" style={{ marginTop: 4 }}>
            <span>模糊背景</span>
            <button className={`switch ${appearance.wallpaperBlur ? 'on' : ''}`} role="switch" aria-checked={appearance.wallpaperBlur}
              onClick={() => setWallpaperBlur(!appearance.wallpaperBlur)}><span className="knob" /></button>
          </label>
        )}
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
        <label className="src-row" style={{ marginBottom: 10 }}>
          字号 {Math.round(appearance.fontScale * 100)}%
          <input type="range" min={70} max={200} value={Math.round(appearance.fontScale * 100)}
            onChange={(e) => updateAppearance({ fontScale: Number(e.target.value) / 100 })} />
        </label>
        <label className="src-row">字重
          <div className="seg">
            {(['thin', 'normal', 'bold'] as FontWeight[]).map((w) => (
              <button key={w} className={`seg-btn ${appearance.fontWeight === w ? 'active' : ''}`}
                style={{ fontWeight: w === 'thin' ? 300 : w === 'bold' ? 700 : 400 }}
                onClick={() => setFontWeight(w)}>{w === 'thin' ? '细' : w === 'normal' ? '正常' : '粗'}</button>
            ))}
          </div>
        </label>
        <p className="src-hint">全局字体从系统已安装的全部字体中选择，字号为全局缩放（70%–200%），字重作用于全部文字。</p>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">阅读配色</p>
        </div>
        <p className="src-hint">选择后仅改变正文阅读区域的配色，不影响左侧列表和设置等界面。</p>
        <div className="reading-theme-grid">
          {renderReadingThemes(appearance.readingTheme, (id) => setReadingTheme(id), (t) => setThemeEdit(t))}
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
            onClick={() => setSoundEnabled(!soundEnabled)}><span className="knob" /></button>
        </label>
        <label className="src-row" style={{ marginTop: 4 }}>
          音量 {Math.round(soundVolume * 100)}%
          <input type="range" min={0} max={100} value={Math.round(soundVolume * 100)}
            disabled={!soundEnabled} onChange={(e) => setSoundVolume(Number(e.target.value) / 100)} />
        </label>
        <p className="src-hint">克制的合成音：点击、切换、收藏、打开外链等交互反馈。首次需一次点击以解锁音频。</p>
      </div>
      {themeEdit && (
        <ThemeEditor source={themeEdit}
          onClose={() => setThemeEdit(undefined)}
          onSaved={() => { setThemeEdit(undefined); setTick((t: number) => t + 1) }} />
      )}
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
            placeholder={dbPath || '使用默认路径 (~/Library/Application Support/readflow/readflow.db)'}
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
            const p = await window.readflow.invoke('settings:pickDbPath') as string
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
            const ok = await window.readflow.invoke('settings:export')
            showToast(ok ? '配置已导出' : '已取消导出')
          }}><Icon name="upload" size={14} /> 导出配置</button>
          <button onClick={async () => {
            const r = await window.readflow.invoke('settings:import') as { ok: boolean; error?: string; imported?: number }
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
function renderReadingThemes(activeId: string, onSelect: (id: string) => void, _onEdit?: (theme?: ReadingTheme) => void) {
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
              <button title="创建副本并编辑" onClick={(e) => { e.stopPropagation(); _onEdit?.({ ...t, id: '', name: t.name + ' 副本' } as ReadingTheme) }}><Icon name="plus" size={14} /></button>
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
// 设计风格致谢卡片（仅作界面/交互参考的鸣谢，无商业关联）
const THANKS_CARDS: Array<{ icon: IconName; accent: string; title: string; desc: string; url: string }> = [
  {
    icon: 'sparkles',
    accent: '#10a37f',
    title: 'ChatGPT · OpenAI',
    desc: '感谢 OpenAI ChatGPT 在交互思路、文案润色与开发过程中的启发与协作——大量界面决策与自动化脚本受益于与其的对话。',
    url: 'https://openai.com/chatgpt'
  },
  {
    icon: 'palette',
    accent: '#6c5ce7',
    title: 'NewMax',
    desc: '感谢 NewMax 的设计语言参考：配色体系、间距节奏与组件规范为 ReadFlow 的视觉风格提供了重要借鉴。',
    url: ''
  }
]

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
      { name: 'zustand', version: '^4.5.5', license: 'MIT', role: '轻量状态管理' },
      { name: 'lucide-react', version: '^1.28.0', license: 'ISC', role: '线性图标集' }
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
    window.readflow.invoke('app:version').then((v) => setVer((v as string) || '')).catch(() => {})
  }, [])

  return (
    <div className="set-scroll">
      <div className="set-card thanks-hero">
        <div className="thanks-hero-icon"><Icon name="heart" size={22} /></div>
        <div className="thanks-hero-text">
          <h2 className="thanks-title">致谢</h2>
          <p className="thanks-sub">
            ReadFlow 是一款个人知识管线桌面客户端{ver ? `，当前版本 ${ver}` : ''}。它站在开源社区与优秀产品设计者的肩膀之上。
            本页列出构建它所用的开源软件，并向给予设计启发与开发辅助的产品致以谢意。
          </p>
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">设计风格致谢</p>
        </div>
        <p className="src-hint">以下产品的设计语言为 ReadFlow 的界面与交互提供了重要参考。</p>
        <div className="thanks-cards">
          {THANKS_CARDS.map((c) => (
            <div className="thanks-card" key={c.title}>
              <div className="thanks-card-icon" style={{ background: `color-mix(in srgb, ${c.accent} 14%, transparent)`, color: c.accent }}>
                <Icon name={c.icon} size={20} />
              </div>
              <div className="thanks-card-body">
                <p className="thanks-card-title">{c.title}</p>
                <p className="thanks-card-desc">{c.desc}</p>
                {c.url && (
                  <a className="thanks-card-link" href={c.url}
                    onClick={(e) => { e.preventDefault(); void window.readflow.invoke('shell:openExternal', c.url) }}>
                    <Icon name="external" size={13} /> 访问官网 ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="set-card">
        <div className="src-head-row">
          <p className="src-label">开源软件清单</p>
        </div>
        <p className="src-hint">ReadFlow 基于以下开源项目构建（按用途分组）。许可证信息以各项目官方声明为准。</p>
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