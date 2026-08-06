import { useEffect, useRef, useState } from 'react'
import { useStore, type SettingsTab } from '../store'
import { Icon, type IconName } from './icons'
import { SourceManager } from './SourceManager'
import { DiscoverView } from './DiscoverView'
import { DbView } from './DbView'
import { DiagPanel } from './DiagPanel'
import {
  THEME_OPTIONS, CARD_STYLES,
  type ThemeMode, type CardStyleKey, type FontWeight
} from '../lib/appearance'
import { detectMonospaceFonts } from '../lib/monospace'
import {
  SHORTCUT_GROUPS, DEFAULT_SHORTCUTS, formatCombo, eventToCombo,
  type ShortcutAction
} from '../lib/shortcuts'
import { playSound } from '../lib/sound'

const TABS: Array<{ key: SettingsTab; label: string; icon: IconName }> = [
  { key: 'appearance', label: '外观', icon: 'palette' },
  { key: 'sources', label: '来源管理', icon: 'book' },
  { key: 'discover', label: '发现 RSS', icon: 'search' },
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
        {settingsTab === 'sources' && <SourceManager onOpenDiscover={() => setSettingsTab('discover')} />}
        {settingsTab === 'discover' && <DiscoverView />}
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
  const [monoFonts, setMonoFonts] = useState<string[]>([])
  const styleGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMonoFonts(detectMonospaceFonts()) }, [])

  const setTheme = (theme: ThemeMode) => updateAppearance({ theme })
  const setCardStyle = (cardStyle: CardStyleKey | 'none') => updateAppearance({ cardStyle })
  const setFontWeight = (w: FontWeight) => updateAppearance({ fontWeight: w })

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
          <p className="src-label">卡片风格（整面配色 · 共 12 种，选其一即确定全站配色）</p>
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
        <label className="src-row" style={{ marginBottom: 10 }}>等宽字体
          <select value={appearance.fontFamily}
            onChange={(e) => updateAppearance({ fontFamily: e.target.value })}>
            <option value="">系统默认等宽</option>
            {monoFonts.map((f) => <option key={f} value={f}>{f}</option>)}
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
        <p className="src-hint">等宽字体从系统中探测到的可用字体里选择；字号为全局缩放（70%–200%），字重作用于阅读正文。</p>
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
  const { clearInbox, purge, showToast, developerMode, setDeveloperMode } = useStore()
  const [msg, setMsg] = useState('')
  const [keepDays, setKeepDays] = useState(90)
  const [maxItems, setMaxItems] = useState(2000)
  const [dbFile, setDbFile] = useState('')
  const [dbErr, setDbErr] = useState('')

  useEffect(() => {
    const w = window as unknown as { readflow?: { invoke: (c: string, ...a: unknown[]) => Promise<unknown> } }
    let cancelled = false
    const load = (attempt = 0) => {
      w.readflow?.invoke('app:dbFile')
        .then((r) => { if (!cancelled) setDbFile(String(r || '')) })
        .catch((e: unknown) => {
          if (cancelled) return
          if (attempt < 3) { setTimeout(() => load(attempt + 1), 400) }
          else { setDbErr(String((e as { message?: string })?.message || e || '未知错误')) }
        })
    }
    load()
    return () => { cancelled = true }
  }, [])

  const refresh = async () => { setMsg('刷新中…'); await onRefresh(); setMsg('已触发全部源刷新'); showToast('已开始刷新') }
  const clear = async () => {
    await clearInbox(); setMsg('RSS 已清空'); showToast('RSS 已清空')
  }
  const doPurge = async () => {
    await purge(keepDays, maxItems)
    setMsg(`已按保留策略清理（保留 ${keepDays} 天内的归档，单库上限 ${maxItems} 条）`)
  }
  const copyDbPath = async () => {
    try { await navigator.clipboard.writeText(dbFile); showToast('数据库路径已复制') } catch { showToast('复制失败') }
  }
  const openDbDir = async () => {
    const w = window as unknown as { readflow?: { invoke: (c: string, ...a: unknown[]) => Promise<unknown> } }
    await w.readflow?.invoke('app:openDbDir')
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">数据库位置</p>
        <p className="src-hint">本应用所有订阅源与文章都存于本地 SQLite 文件。若你看到「没数据」，先核对这里显示的<strong>是否就是下面这个有数据的文件</strong>：</p>
        {dbErr
          ? <p className="src-hint db-err">⚠ 读取数据库路径失败：{dbErr}（主进程可能未就绪，请彻底退出后重开应用）</p>
          : <code className="db-path">{dbFile || '加载中…'}</code>}
        <div className="src-actions">
          <button onClick={() => void copyDbPath()}><Icon name="file" size={14} /> 复制路径</button>
          <button onClick={() => void openDbDir()}><Icon name="external" size={14} /> 在访达中打开</button>
        </div>
      </div>

      <div className="set-card">
        <p className="src-label">开发者模式</p>
        <p className="src-hint">开启后自动打开 DevTools 并在界面右下角显示网络诊断面板（每个 RSS 请求的状态 / 耗时 / 字节 / 错误），便于排查「无法获取数据」。</p>
        <div className="switch-row">
          <span>启用开发者模式（含网络诊断）</span>
          <button className={`switch ${developerMode ? 'on' : ''}`} onClick={() => setDeveloperMode(!developerMode)}><span className="knob" /></button>
        </div>
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
