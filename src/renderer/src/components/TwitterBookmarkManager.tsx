import { useState } from 'react'
import { useStore } from '../store'
import { Icon } from './icons'

export function TwitterBookmarkManager() {
  const { importTwitterBookmarks, showToast } = useStore()
  const [twMsg, setTwMsg] = useState('')

  const importBookmarks = async () => {
    setTwMsg('选择文件中…')
    try {
      const r = await importTwitterBookmarks()
      if (r.total === 0) { setTwMsg('已取消或未选择文件'); return }
      setTwMsg(`导入完成：新增 ${r.added} / 共 ${r.total} 条`)
      showToast('X 书签已更新')
    } catch (e) { setTwMsg('失败：' + (e as Error).message) }
  }

  return (
    <div className="set-scroll">
      <div className="set-card">
        <p className="src-label">X 书签管理</p>
        <p className="src-hint">X 官方 API 读取书签需付费 OAuth 凭证，本地无法实时拉取。请从 X 导出书签文件后在此导入。支持 JSON 数组或 CSV（含 url / text / author / created_at 等字段）。</p>
        <div className="src-actions">
          <button onClick={() => void importBookmarks()}><Icon name="twitter" size={14} /> 导入书签文件</button>
          <span className="src-hint src-grow">{twMsg}</span>
        </div>
      </div>
    </div>
  )
}
