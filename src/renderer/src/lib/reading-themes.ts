/**
 * 阅读正文配色主题（独立于 UI 卡片风格，类似 VSCode 编辑器配色与界面配色分离）。
 *
 * 每套主题定义一组 CSS 变量值，应用到 .reader-content 区域：
 *   --rt-bg          背景色
 *   --rt-fg          正文文字色
 *   --rt-heading     标题文字色
 *   --rt-link        链接色
 *   --rt-meta        次要信息色（日期/作者等）
 *   --rt-blockquote-bg    引用块背景
 *   --rt-blockquote-border 引用块左边框
 *   --rt-blockquote-fg    引用块文字
 *   --rt-code-bg     代码/预格式背景
 *   --rt-code-fg     代码文字
 *   --rt-table-border 表格线
 *   --rt-th-bg       表头背景
 *   --rt-hr          分隔线颜色
 *   --rt-img-bg      图片占位底色
 *
 * 30 套主题来源于 VSCode 市场最热门的主题，覆盖亮色/暗色各风格。
 */

export interface ReadingTheme {
  id: string
  name: string
  /** 'dark' | 'light' — 用于 UI 上的标签归类 */
  mode: 'dark' | 'light'
  colors: Record<string, string>
}

export const READING_THEMES: ReadingTheme[] = [
  // ===== 暗色主题 =====
  {
    id: 'dark-plus', name: 'Dark+ (默认暗色)', mode: 'dark',
    colors: { '--rt-bg': '#1e1e1e', '--rt-fg': '#d4d4d4', '--rt-heading': '#e0e0e0', '--rt-link': '#569cd6', '--rt-meta': '#808080', '--rt-blockquote-bg': '#2a2a2a', '--rt-blockquote-border': '#569cd6', '--rt-blockquote-fg': '#a0a0a0', '--rt-code-bg': '#2d2d2d', '--rt-code-fg': '#d4d4d4', '--rt-table-border': '#3e3e3e', '--rt-th-bg': '#2a2a2a', '--rt-hr': '#3e3e3e', '--rt-img-bg': '#2a2a2a' }
  },
  {
    id: 'monokai', name: 'Monokai', mode: 'dark',
    colors: { '--rt-bg': '#272822', '--rt-fg': '#f8f8f2', '--rt-heading': '#f8f8f0', '--rt-link': '#66d9ef', '--rt-meta': '#75715e', '--rt-blockquote-bg': '#3e3d32', '--rt-blockquote-border': '#a6e22e', '--rt-blockquote-fg': '#cfcfc2', '--rt-code-bg': '#3e3d32', '--rt-code-fg': '#f8f8f2', '--rt-table-border': '#49483e', '--rt-th-bg': '#3e3d32', '--rt-hr': '#49483e', '--rt-img-bg': '#3e3d32' }
  },
  {
    id: 'one-dark-pro', name: 'One Dark Pro', mode: 'dark',
    colors: { '--rt-bg': '#282c34', '--rt-fg': '#abb2bf', '--rt-heading': '#e5c07b', '--rt-link': '#61afef', '--rt-meta': '#5c6370', '--rt-blockquote-bg': '#2c313a', '--rt-blockquote-border': '#528bff', '--rt-blockquote-fg': '#828997', '--rt-code-bg': '#2c313a', '--rt-code-fg': '#abb2bf', '--rt-table-border': '#3e4451', '--rt-th-bg': '#2c313a', '--rt-hr': '#3e4451', '--rt-img-bg': '#2c313a' }
  },
  {
    id: 'dracula', name: 'Dracula', mode: 'dark',
    colors: { '--rt-bg': '#282a36', '--rt-fg': '#f8f8f2', '--rt-heading': '#ff79c6', '--rt-link': '#8be9fd', '--rt-meta': '#6272a4', '--rt-blockquote-bg': '#44475a', '--rt-blockquote-border': '#ff79c6', '--rt-blockquote-fg': '#cfcfc2', '--rt-code-bg': '#383a4a', '--rt-code-fg': '#f8f8f2', '--rt-table-border': '#44475a', '--rt-th-bg': '#383a4a', '--rt-hr': '#44475a', '--rt-img-bg': '#383a4a' }
  },
  {
    id: 'nord', name: 'Nord', mode: 'dark',
    colors: { '--rt-bg': '#2e3440', '--rt-fg': '#d8dee9', '--rt-heading': '#88c0d0', '--rt-link': '#81a1c1', '--rt-meta': '#4c566a', '--rt-blockquote-bg': '#3b4252', '--rt-blockquote-border': '#88c0d0', '--rt-blockquote-fg': '#a8b4c4', '--rt-code-bg': '#3b4252', '--rt-code-fg': '#d8dee9', '--rt-table-border': '#434c5e', '--rt-th-bg': '#3b4252', '--rt-hr': '#434c5e', '--rt-img-bg': '#3b4252' }
  },
  {
    id: 'tokyo-night', name: 'Tokyo Night', mode: 'dark',
    colors: { '--rt-bg': '#1a1b26', '--rt-fg': '#c0caf5', '--rt-heading': '#7aa2f7', '--rt-link': '#7dcfff', '--rt-meta': '#565f89', '--rt-blockquote-bg': '#24283b', '--rt-blockquote-border': '#7aa2f7', '--rt-blockquote-fg': '#a9b1d6', '--rt-code-bg': '#1f2335', '--rt-code-fg': '#c0caf5', '--rt-table-border': '#292e42', '--rt-th-bg': '#24283b', '--rt-hr': '#292e42', '--rt-img-bg': '#24283b' }
  },
  {
    id: 'catppuccin-mocha', name: 'Catppuccin Mocha', mode: 'dark',
    colors: { '--rt-bg': '#1e1e2e', '--rt-fg': '#cdd6f4', '--rt-heading': '#cba6f7', '--rt-link': '#89b4fa', '--rt-meta': '#585b70', '--rt-blockquote-bg': '#313244', '--rt-blockquote-border': '#cba6f7', '--rt-blockquote-fg': '#bac2de', '--rt-code-bg': '#313244', '--rt-code-fg': '#cdd6f4', '--rt-table-border': '#45475a', '--rt-th-bg': '#313244', '--rt-hr': '#45475a', '--rt-img-bg': '#313244' }
  },
  {
    id: 'github-dark', name: 'GitHub Dark', mode: 'dark',
    colors: { '--rt-bg': '#0d1117', '--rt-fg': '#e6edf3', '--rt-heading': '#79c0ff', '--rt-link': '#58a6ff', '--rt-meta': '#8b949e', '--rt-blockquote-bg': '#161b22', '--rt-blockquote-border': '#58a6ff', '--rt-blockquote-fg': '#c9d1d9', '--rt-code-bg': '#161b22', '--rt-code-fg': '#e6edf3', '--rt-table-border': '#30363d', '--rt-th-bg': '#161b22', '--rt-hr': '#30363d', '--rt-img-bg': '#161b22' }
  },
  {
    id: 'solarized-dark', name: 'Solarized Dark', mode: 'dark',
    colors: { '--rt-bg': '#002b36', '--rt-fg': '#839496', '--rt-heading': '#b58900', '--rt-link': '#268bd2', '--rt-meta': '#586e75', '--rt-blockquote-bg': '#073642', '--rt-blockquote-border': '#268bd2', '--rt-blockquote-fg': '#93a1a1', '--rt-code-bg': '#073642', '--rt-code-fg': '#839496', '--rt-table-border': '#003b48', '--rt-th-bg': '#073642', '--rt-hr': '#003b48', '--rt-img-bg': '#073642' }
  },
  {
    id: 'gruvbox-dark', name: 'Gruvbox Dark', mode: 'dark',
    colors: { '--rt-bg': '#282828', '--rt-fg': '#ebdbb2', '--rt-heading': '#fabd2f', '--rt-link': '#83a598', '--rt-meta': '#7c6f64', '--rt-blockquote-bg': '#3c3836', '--rt-blockquote-border': '#b8bb26', '--rt-blockquote-fg': '#d5c4a1', '--rt-code-bg': '#3c3836', '--rt-code-fg': '#ebdbb2', '--rt-table-border': '#504945', '--rt-th-bg': '#3c3836', '--rt-hr': '#504945', '--rt-img-bg': '#3c3836' }
  },
  {
    id: 'ayu-dark', name: 'Ayu Dark', mode: 'dark',
    colors: { '--rt-bg': '#1a1e29', '--rt-fg': '#bfbab0', '--rt-heading': '#ffd580', '--rt-link': '#59c2ff', '--rt-meta': '#6b717d', '--rt-blockquote-bg': '#242936', '--rt-blockquote-border': '#ffd580', '--rt-blockquote-fg': '#a9a59b', '--rt-code-bg': '#232834', '--rt-code-fg': '#bfbab0', '--rt-table-border': '#2f3543', '--rt-th-bg': '#242936', '--rt-hr': '#2f3543', '--rt-img-bg': '#242936' }
  },
  {
    id: 'night-owl', name: 'Night Owl', mode: 'dark',
    colors: { '--rt-bg': '#011627', '--rt-fg': '#d6deeb', '--rt-heading': '#c792ea', '--rt-link': '#82aaff', '--rt-meta': '#5f7e97', '--rt-blockquote-bg': '#0e293f', '--rt-blockquote-border': '#c792ea', '--rt-blockquote-fg': '#aebac7', '--rt-code-bg': '#0b2941', '--rt-code-fg': '#d6deeb', '--rt-table-border': '#1d3b53', '--rt-th-bg': '#0e293f', '--rt-hr': '#1d3b53', '--rt-img-bg': '#0e293f' }
  },
  {
    id: 'palenight', name: 'Palenight', mode: 'dark',
    colors: { '--rt-bg': '#292d3e', '--rt-fg': '#a6accd', '--rt-heading': '#c792ea', '--rt-link': '#82aaff', '--rt-meta': '#676e95', '--rt-blockquote-bg': '#333747', '--rt-blockquote-border': '#c792ea', '--rt-blockquote-fg': '#8b92b5', '--rt-code-bg': '#31364a', '--rt-code-fg': '#a6accd', '--rt-table-border': '#434863', '--rt-th-bg': '#333747', '--rt-hr': '#434863', '--rt-img-bg': '#333747' }
  },
  {
    id: 'material-darker', name: 'Material Darker', mode: 'dark',
    colors: { '--rt-bg': '#212121', '--rt-fg': '#eeffff', '--rt-heading': '#ffcb6b', '--rt-link': '#82aaff', '--rt-meta': '#616161', '--rt-blockquote-bg': '#303030', '--rt-blockquote-border': '#ffcb6b', '--rt-blockquote-fg': '#b2ccd6', '--rt-code-bg': '#2e2e2e', '--rt-code-fg': '#eeffff', '--rt-table-border': '#424242', '--rt-th-bg': '#303030', '--rt-hr': '#424242', '--rt-img-bg': '#303030' }
  },
  {
    id: 'synthwave-84', name: 'SynthWave \'84', mode: 'dark',
    colors: { '--rt-bg': '#262335', '--rt-fg': '#d4d4d4', '--rt-heading': '#f92aad', '--rt-link': '#36f9f6', '--rt-meta': '#5b4c8c', '--rt-blockquote-bg': '#362f44', '--rt-blockquote-border': '#f92aad', '--rt-blockquote-fg': '#a8a8b8', '--rt-code-bg': '#342c45', '--rt-code-fg': '#d4d4d4', '--rt-table-border': '#434052', '--rt-th-bg': '#362f44', '--rt-hr': '#434052', '--rt-img-bg': '#362f44' }
  },
  {
    id: 'cobalt2', name: 'Cobalt2', mode: 'dark',
    colors: { '--rt-bg': '#193549', '--rt-fg': '#ffffff', '--rt-heading': '#ffc600', '--rt-link': '#0088ff', '--rt-meta': '#5b7e9a', '--rt-blockquote-bg': '#1f4060', '--rt-blockquote-border': '#ffc600', '--rt-blockquote-fg': '#c8d6e5', '--rt-code-bg': '#1b3d57', '--rt-code-fg': '#ffffff', '--rt-table-border': '#234d6e', '--rt-th-bg': '#1f4060', '--rt-hr': '#234d6e', '--rt-img-bg': '#1f4060' }
  },
  {
    id: 'shades-of-purple', name: 'Shades of Purple', mode: 'dark',
    colors: { '--rt-bg': '#2d2b55', '--rt-fg': '#ffffff', '--rt-heading': '#ffd700', '--rt-link': '#fad000', '--rt-meta': '#7e76b5', '--rt-blockquote-bg': '#3f3d6e', '--rt-blockquote-border': '#a599e9', '--rt-blockquote-fg': '#d4d0f0', '--rt-code-bg': '#3a3864', '--rt-code-fg': '#ffffff', '--rt-table-border': '#4d4b7c', '--rt-th-bg': '#3f3d6e', '--rt-hr': '#4d4b7c', '--rt-img-bg': '#3f3d6e' }
  },
  {
    id: 'horizon', name: 'Horizon', mode: 'dark',
    colors: { '--rt-bg': '#1c1e26', '--rt-fg': '#d5d8da', '--rt-heading': '#e95678', '--rt-link': '#26bbd9', '--rt-meta': '#6c6f93', '--rt-blockquote-bg': '#2a2d3b', '--rt-blockquote-border': '#e95678', '--rt-blockquote-fg': '#b1b4c2', '--rt-code-bg': '#252837', '--rt-code-fg': '#d5d8da', '--rt-table-border': '#3a3d4d', '--rt-th-bg': '#2a2d3b', '--rt-hr': '#3a3d4d', '--rt-img-bg': '#2a2d3b' }
  },
  {
    id: 'atom-one-dark', name: 'Atom One Dark', mode: 'dark',
    colors: { '--rt-bg': '#282c34', '--rt-fg': '#abb2bf', '--rt-heading': '#e5c07b', '--rt-link': '#61afef', '--rt-meta': '#636d83', '--rt-blockquote-bg': '#2c313c', '--rt-blockquote-border': '#98c379', '--rt-blockquote-fg': '#939ba9', '--rt-code-bg': '#21252b', '--rt-code-fg': '#abb2bf', '--rt-table-border': '#3e4451', '--rt-th-bg': '#2c313c', '--rt-hr': '#3e4451', '--rt-img-bg': '#2c313c' }
  },
  {
    id: 'panda', name: 'Panda', mode: 'dark',
    colors: { '--rt-bg': '#292a2b', '--rt-fg': '#e6e6e6', '--rt-heading': '#ffb86c', '--rt-link': '#45a9f9', '--rt-meta': '#6b6b6b', '--rt-blockquote-bg': '#383a3b', '--rt-blockquote-border': '#ffb86c', '--rt-blockquote-fg': '#c0c0c0', '--rt-code-bg': '#363839', '--rt-code-fg': '#e6e6e6', '--rt-table-border': '#454748', '--rt-th-bg': '#383a3b', '--rt-hr': '#454748', '--rt-img-bg': '#383a3b' }
  },
  {
    id: 'kanagawa', name: 'Kanagawa', mode: 'dark',
    colors: { '--rt-bg': '#1f1f28', '--rt-fg': '#dcd7ba', '--rt-heading': '#e6c384', '--rt-link': '#7e9cd8', '--rt-meta': '#727169', '--rt-blockquote-bg': '#2a2a37', '--rt-blockquote-border': '#e6c384', '--rt-blockquote-fg': '#c0bca0', '--rt-code-bg': '#252535', '--rt-code-fg': '#dcd7ba', '--rt-table-border': '#3a3a4a', '--rt-th-bg': '#2a2a37', '--rt-hr': '#3a3a4a', '--rt-img-bg': '#2a2a37' }
  },

  // ===== 亮色主题 =====
  {
    id: 'light-plus', name: 'Light+ (默认亮色)', mode: 'light',
    colors: { '--rt-bg': '#ffffff', '--rt-fg': '#333333', '--rt-heading': '#000000', '--rt-link': '#007acc', '--rt-meta': '#999999', '--rt-blockquote-bg': '#f5f5f5', '--rt-blockquote-border': '#007acc', '--rt-blockquote-fg': '#666666', '--rt-code-bg': '#f3f3f3', '--rt-code-fg': '#333333', '--rt-table-border': '#d9d9d9', '--rt-th-bg': '#f0f0f0', '--rt-hr': '#d9d9d9', '--rt-img-bg': '#f0f0f0' }
  },
  {
    id: 'github-light', name: 'GitHub Light', mode: 'light',
    colors: { '--rt-bg': '#ffffff', '--rt-fg': '#24292e', '--rt-heading': '#000000', '--rt-link': '#0366d6', '--rt-meta': '#6a737d', '--rt-blockquote-bg': '#f6f8fa', '--rt-blockquote-border': '#0366d6', '--rt-blockquote-fg': '#666666', '--rt-code-bg': '#f6f8fa', '--rt-code-fg': '#24292e', '--rt-table-border': '#e1e4e8', '--rt-th-bg': '#f6f8fa', '--rt-hr': '#e1e4e8', '--rt-img-bg': '#f6f8fa' }
  },
  {
    id: 'solarized-light', name: 'Solarized Light', mode: 'light',
    colors: { '--rt-bg': '#fdf6e3', '--rt-fg': '#657b83', '--rt-heading': '#b58900', '--rt-link': '#268bd2', '--rt-meta': '#93a1a1', '--rt-blockquote-bg': '#eee8d5', '--rt-blockquote-border': '#268bd2', '--rt-blockquote-fg': '#586e75', '--rt-code-bg': '#eee8d5', '--rt-code-fg': '#657b83', '--rt-table-border': '#dbd2bd', '--rt-th-bg': '#eee8d5', '--rt-hr': '#dbd2bd', '--rt-img-bg': '#eee8d5' }
  },
  {
    id: 'gruvbox-light', name: 'Gruvbox Light', mode: 'light',
    colors: { '--rt-bg': '#fbf1c7', '--rt-fg': '#3c3836', '--rt-heading': '#b57614', '--rt-link': '#076678', '--rt-meta': '#928374', '--rt-blockquote-bg': '#f2e5bc', '--rt-blockquote-border': '#98971a', '--rt-blockquote-fg': '#665c54', '--rt-code-bg': '#f2e5bc', '--rt-code-fg': '#3c3836', '--rt-table-border': '#ebdbb2', '--rt-th-bg': '#f2e5bc', '--rt-hr': '#ebdbb2', '--rt-img-bg': '#f2e5bc' }
  },
  {
    id: 'catppuccin-latte', name: 'Catppuccin Latte', mode: 'light',
    colors: { '--rt-bg': '#eff1f5', '--rt-fg': '#4c4f69', '--rt-heading': '#8839ef', '--rt-link': '#1e66f5', '--rt-meta': '#9ca0b0', '--rt-blockquote-bg': '#e6e9ef', '--rt-blockquote-border': '#8839ef', '--rt-blockquote-fg': '#585b70', '--rt-code-bg': '#e6e9ef', '--rt-code-fg': '#4c4f69', '--rt-table-border': '#ccd0da', '--rt-th-bg': '#e6e9ef', '--rt-hr': '#ccd0da', '--rt-img-bg': '#e6e9ef' }
  },
  {
    id: 'ayu-light', name: 'Ayu Light', mode: 'light',
    colors: { '--rt-bg': '#fafafa', '--rt-fg': '#5c6166', '--rt-heading': '#fa8d3e', '--rt-link': '#399ee6', '--rt-meta': '#abb0b6', '--rt-blockquote-bg': '#f0f0f0', '--rt-blockquote-border': '#fa8d3e', '--rt-blockquote-fg': '#6c7178', '--rt-code-bg': '#f0f0f0', '--rt-code-fg': '#5c6166', '--rt-table-border': '#e0e0e0', '--rt-th-bg': '#f0f0f0', '--rt-hr': '#e0e0e0', '--rt-img-bg': '#f0f0f0' }
  },
  {
    id: 'material-lighter', name: 'Material Lighter', mode: 'light',
    colors: { '--rt-bg': '#fafafa', '--rt-fg': '#546e7a', '--rt-heading': '#e53935', '--rt-link': '#39adb5', '--rt-meta': '#999999', '--rt-blockquote-bg': '#f0f0f0', '--rt-blockquote-border': '#90a4ae', '--rt-blockquote-fg': '#6e839a', '--rt-code-bg': '#f0f0f0', '--rt-code-fg': '#546e7a', '--rt-table-border': '#e0e0e0', '--rt-th-bg': '#f0f0f0', '--rt-hr': '#e0e0e0', '--rt-img-bg': '#f0f0f0' }
  },
  {
    id: 'atom-one-light', name: 'Atom One Light', mode: 'light',
    colors: { '--rt-bg': '#fafafa', '--rt-fg': '#383a42', '--rt-heading': '#e45649', '--rt-link': '#4078f2', '--rt-meta': '#a0a1a7', '--rt-blockquote-bg': '#f0f0f0', '--rt-blockquote-border': '#50a14f', '--rt-blockquote-fg': '#696c77', '--rt-code-bg': '#eaeaeb', '--rt-code-fg': '#383a42', '--rt-table-border': '#e0e0e0', '--rt-th-bg': '#f0f0f0', '--rt-hr': '#e0e0e0', '--rt-img-bg': '#f0f0f0' }
  },
] as const

/** 总套数 */
export const READING_THEME_COUNT = READING_THEMES.length

/** 缺失时回退的默认阅读配色（Dark+） */
export const DEFAULT_READING_THEME_ID = 'dark-plus'

/** 不选择的哨兵值——表示跟随界面（使用 UI 的 CSS 变量，不注入 --rt-* 变量） */
export const FOLLOW_UI_ID = '__follow_ui__'

export function getReadingThemeById(id: string): ReadingTheme | undefined {
  return READING_THEMES.find((t) => t.id === id) ?? getCustomReadingThemes().find((t) => t.id === id)
}

/** 获取所有可用的阅读主题（内置 + 自定义） */
export function getAllReadingThemes(): ReadingTheme[] {
  return [...READING_THEMES, ...getCustomReadingThemes()]
}

const CUSTOM_RT_KEY = 'readflow:custom-reading-themes'

/** 从 localStorage 加载自定义阅读主题 */
export function getCustomReadingThemes(): ReadingTheme[] {
  try {
    const raw = localStorage.getItem(CUSTOM_RT_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ReadingTheme[]
  } catch { return [] }
}

/** 保存自定义阅读主题到 localStorage */
export function saveCustomReadingThemes(themes: ReadingTheme[]): void {
  localStorage.setItem(CUSTOM_RT_KEY, JSON.stringify(themes))
}

/** 添加或更新自定义阅读主题 */
export function upsertCustomReadingTheme(theme: ReadingTheme): void {
  const themes = getCustomReadingThemes()
  const idx = themes.findIndex((t) => t.id === theme.id)
  if (idx >= 0) themes[idx] = theme
  else themes.push(theme)
  saveCustomReadingThemes(themes)
}

/** 删除自定义阅读主题 */
export function deleteCustomReadingTheme(id: string): void {
  saveCustomReadingThemes(getCustomReadingThemes().filter((t) => t.id !== id))
}
