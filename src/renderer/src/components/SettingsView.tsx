import { useEffect, useRef, useState } from 'react'
import { useStore, type SettingsTab } from '../store'
import { Icon, type IconName } from './icons'
import { SourceManager } from './SourceManager'
import { DbView } from './DbView'
import { DiagPanel } from './DiagPanel'
import {
  THEME_OPTIONS, CARD_STYLES,
  type ThemeMode, type CardStyleKey, type FontWeight
} from '../lib/appearance'
import { READING_THEMES, FOLLOW_UI_ID, type ReadingTheme } from '../lib/reading-themes'
import {
  SHORTCUT_GROUPS, DEFAULT_SHORTCUTS, formatCombo, eventToCombo,
  type ShortcutAction
} from '../lib/shortcuts'
import { playSound } from '../lib/sound'

const TABS: Array<{ key: SettingsTab; label: string; icon: IconName }> = [
  { key: 'appearance', label: '外观', icon: 'palette' },
  { key: 'sources', label: '来源管理', icon: 'book' },
  { key: 'actions', label: '操作', icon: 'refresh' },
  { key: 'shortcuts', label: '快捷键', icon: 'keyboard' },
  { key: 'data', label: '数据查看', icon: 'book' },
  { key: 'diag', label: '刷新诊断', icon: 'activity' }
]

export function SettingsView() {
  const { settingsTab, setSettingsTab, refreshAll } = useStore()

  return (
    <section className="settings">
      <nav className="settings-nav">
        {TABS.map((t) => (
          <button key={t.key} className={`set-nav ${settingsTab === t.key ? 'active' : ''}`} onClick={() => setSettingsTab(t.key)}>
            <Icon name={t.icon} size={16} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      <div className="settings-panel">
        {settingsTab === 'appearance' && <AppearanceTab />}
        {settingsTab === 'sources' && <SourceManager />}
        {settingsTab === 'actions' && <ActionsTab onRefresh={refreshAll} />}
        {settingsTab === 'shortcuts' && <ShortcutsTab />}
        {settingsTab === 'data' && <DbView />}
        {settingsTab === 'diag' && <DiagPanel />}
      </div>
    </section>
  )
}

/* ===================== 外观 ===================== */
function AppearanceTab() {
  const { appearance, soundEnabled, soundVolume, updateAppearance, setSoundEnabled, setSoundVolume } = useStore()
  const [systemFonts, setSystemFonts] = useState<string[]>([])
  const styleGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.readflow.invoke('app:fontList').then((list) => setSystemFonts(list as string[])).catch(() => {})
  }, [])

  const setTheme = (theme: ThemeMode) => updateAppearance({ theme })
  const setCardStyle = (cardStyle: CardStyleKey | 'none') => updateAppearance({ cardStyle })
  const setFontWeight = (w: FontWeight) => updateAppearance({ fontWeight: w })
  const setReadingTheme = (id: string) => updateAppearance({ readingTheme: id })

  // Feature1：选中卡片风格后，把焦点与可视区域移到该卡片上
  useEffect(() => {
    const grid = styleGridRef.current
    if (!grid) return
    const active = grid.querySelector('.style-opt.active') as HTMLElement | null
    active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [appearance.cardStyle])

  const currentStyle = appearance.cardStyle === 'none'
    ? { label: '默认', preview: 'linear-gradient(135deg,#f1f0eb,#d8d6ce)' }
    : CARD_STYLES.find((s) => s.key === appearance.cardStyle)!

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
        <div className="style-grid" ref={styleGridRef}>
          <button className={`style-opt ${appearance.cardStyle === 'none' ? 'active' : ''}`}
            onClick={(e) => { setCardStyle('none'); e.currentTarget.focus() }}>
            <span className="style-preview" style={{ background: 'linear-gradient(135deg,#f1f0eb,#d8d6ce)' }} />
            <span className="style-name">默认</span>
          </button>
          {CARD_STYLES.map((s) => (
            <button key={s.key} className={`style-opt ${appearance.cardStyle === s.key ? 'active' : ''}`}
              onClick={(e) => { setCardStyle(s.key); e.currentTarget.focus() }}>
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
          {renderReadingThemes(appearance.readingTheme, (id) => setReadingTheme(id))}
        </div>
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
        <button onClick={() => { setSoundEnabled(true); playSound('complete') }}><Icon name="music" size={14} /> 试听音效</button>
        <p className="src-hint">克制的合成音：点击、切换、收藏、打开外链等交互反馈。首次需一次点击以解锁音频。</p>
      </div>
    </div>
  )
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
  const darkThemes = READING_THEMES.filter((t) => t.mode === 'dark')
  const lightThemes = READING_THEMES.filter((t) => t.mode === 'light')

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
          <button
            key={t.id}
            className={`rt-chip ${activeId === t.id ? 'active' : ''}`}
            onClick={() => onSelect(t.id)}
            title={t.name}
          >
            <span className="rt-swatch" style={{ background: t.colors['--rt-bg'] }} />
            <span className="rt-name">{t.name.replace(/\(.*\)/, '').trim()}</span>
          </button>
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