import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { bootAppearance } from './lib/appearance'
// 注册内置图标库 / 音效库，必须早于 store.initAppearance 中的图标库与音效库恢复执行
import './lib/theme-presets'
import './styles/tokens.css'
import './styles/themes.css'
import './styles/app.css'

// 首帧前同步铺好主题 / 卡片风格 / 字体，消除「默认→切换」的启动闪烁（DB 权威值在 initAppearance 异步覆盖）
bootAppearance()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
