import { useState } from 'react'
import { type ReadingTheme, upsertCustomReadingTheme } from '../lib/reading-themes'
import { Icon } from './icons'

const COLOR_LABELS: Record<string, string> = {
  '--rt-bg': '背景色', '--rt-fg': '正文文字', '--rt-heading': '标题文字',
  '--rt-link': '链接色', '--rt-meta': '次要信息',
  '--rt-blockquote-bg': '引用块背景', '--rt-blockquote-border': '引用块边框', '--rt-blockquote-fg': '引用块文字',
  '--rt-code-bg': '代码背景', '--rt-code-fg': '代码文字',
  '--rt-table-border': '表格线', '--rt-th-bg': '表头背景',
  '--rt-hr': '分隔线', '--rt-img-bg': '图片占位',
}

interface Props {
  source?: ReadingTheme
  onClose: () => void
  onSaved: () => void
}

export function ThemeEditor({ source, onClose, onSaved }: Props) {
  const isNew = !source?.id
  const base: ReadingTheme = source?.id ? source : {
    id: `custom-${Date.now()}`,
    name: source?.name || '未命名主题',
    mode: source?.mode || 'dark',
    colors: source?.colors || { '--rt-bg': '#1e1e1e', '--rt-fg': '#d4d4d4', '--rt-heading': '#e0e0e0', '--rt-link': '#569cd6',
      '--rt-meta': '#808080', '--rt-blockquote-bg': '#2a2a2a', '--rt-blockquote-border': '#569cd6',
      '--rt-blockquote-fg': '#a0a0a0', '--rt-code-bg': '#2d2d2d', '--rt-code-fg': '#d4d4d4',
      '--rt-table-border': '#3e3e3e', '--rt-th-bg': '#2a2a2a', '--rt-hr': '#3e3e3e', '--rt-img-bg': '#2a2a2a' }
  }

  const [name, setName] = useState(base.name)
  const [mode, setMode] = useState<'dark' | 'light'>(base.mode)
  const [colors, setColors] = useState<Record<string, string>>({ ...base.colors })

  const save = () => {
    upsertCustomReadingTheme({
      id: isNew ? `custom-${Date.now()}` : base.id,
      name: name.trim() || '未命名主题',
      mode,
      colors: { ...colors }
    })
    onSaved()
    onClose()
  }

  return (
    <div className="theme-editor-overlay" onClick={onClose}>
      <div className="theme-editor" onClick={(e) => e.stopPropagation()}>
        <div className="te-header">
          <span className="te-title">{isNew ? '新建阅读配色' : '编辑：' + base.name}</span>
          <button onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        <div className="te-body">
          <div className="te-row">
            <label>主题名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：我的护眼主题" />
          </div>
          <div className="te-row">
            <label>模式</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as 'dark' | 'light')}>
              <option value="dark">暗色</option>
              <option value="light">亮色</option>
            </select>
          </div>
          <p className="te-label">颜色调整</p>
          <div className="te-colors">
            {Object.entries(colors).map(([key, val]) => (
              <div key={key} className="te-color-row">
                <span className="te-color-label">{COLOR_LABELS[key] || key}</span>
                <input type="color" value={val} onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))} />
                <input type="text" value={val} onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))} className="te-color-text" />
              </div>
            ))}
          </div>
        </div>
        <div className="te-footer">
          <button onClick={save}>保存主题</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  )
}
