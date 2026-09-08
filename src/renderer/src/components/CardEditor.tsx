import { useEffect, useRef, useState } from 'react'
import type { Card, CardPayload, ItemRow } from '../env'
import { Icon } from './icons'
import { useStore } from '../store'

function fmtSize(n?: number): string {
  if (!n) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

interface Props {
  card: Card
  itemMap: Record<number, ItemRow>
  onClose: () => void
  onSave: (patch: Partial<Card> & { _sourcePath?: string }) => void
  onDelete: () => void
  onOpenItem: (itemId: number) => void
}

export function CardEditor({ card, itemMap, onClose, onSave, onDelete, onOpenItem }: Props) {
  const p = (card.payload ? JSON.parse(card.payload) : {}) as CardPayload
  const [title, setTitle] = useState(card.title)
  const [body, setBody] = useState(card.body)
  const [url, setUrl] = useState(p.url ?? '')
  const [note, setNote] = useState(p.note ?? card.body ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  // 视频用 local-path:// 引用原始路径（不拷贝）；图片/文件用 board-asset://
  const assetSrc = p.localPath ? `local-path://${p.localPath}` : (p.file ? `board-asset://${p.file}` : (p.url || ''))

  // ESC 关闭编辑器（全局键盘监听，不干扰 input/textarea 内的 ESC）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const [linkFetching, setLinkFetching] = useState(false)

  const saveText = () => onSave({ title, body })
  const saveLink = async () => {
    // 自动抓取链接 OG 元数据，实现富卡片预览
    let preview: { previewTitle?: string; previewDesc?: string; previewImage?: string; previewSite?: string } = {}
    if (url && /^https?:\/\//.test(url)) {
      setLinkFetching(true)
      try {
        const r = await window.capybara.invoke('boards:fetchLinkPreview', url) as { title: string; desc: string; image: string; site: string } | null
        if (r) preview = { previewTitle: r.title, previewDesc: r.desc, previewImage: r.image, previewSite: r.site }
      } catch { /* 网络失败时静默回退普通链接 */ }
      setLinkFetching(false)
    }
    onSave({ title, body: note, payload: JSON.stringify({ url, note, ...preview }) })
    useStore.getState().showToast(preview.previewTitle ? '链接预览已抓取' : '链接已保存')
  }
  const saveAsset = (sourcePath?: string) => {
    // 用当前 note 构建 payload，保留原有的 file/name/size 等字段
    const newPayload = JSON.stringify({ ...p, note })
    const patch: Parameters<typeof onSave>[0] = { body: note, payload: newPayload }
    if (sourcePath) (patch as Partial<Card> & { _sourcePath?: string })._sourcePath = sourcePath
    onSave(patch)
  }

  const onReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const path = window.capybara.getPathForFile(f)
    saveAsset(path)
    e.target.value = ''
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal card-editor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          编辑卡片
          <span className="card-kind-badge">{card.kind}</span>
        </div>

        {card.kind === 'ref' && (() => {
          const it = card.item_id != null ? itemMap[card.item_id] : undefined
          return (
            <div className="ref-edit">
              {it ? (
                <>
                  <p className="ref-edit-title">{it.title}</p>
                  <p className="ref-edit-src">{it.source_name} · <a href={it.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{it.url}</a></p>
                  <p className="ref-edit-sum">{it.summary || '（无摘要）'}</p>
                  <button onClick={() => { if (card.item_id != null) onOpenItem(card.item_id) }}>在阅读面板打开</button>
                </>
              ) : <p className="ref-edit-sum">引用的条目已被删除。</p>}
            </div>
          )
        })()}

        {card.kind === 'text' && (
          <div className="edit-body">
            <input className="edit-title" placeholder="标题（可选）" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="edit-text" placeholder="写点什么…" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
        )}

        {card.kind === 'link' && (
          <div className="edit-body">
            <input className="edit-title" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="edit-url" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
            <textarea className="edit-text" placeholder="备注 / 描述（可选）" value={note} onChange={(e) => setNote(e.target.value)} />
            {url && <a className="edit-open-link" href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}><Icon name="external" size={13} /> 打开链接</a>}
          </div>
        )}

        {(card.kind === 'image' || card.kind === 'video' || card.kind === 'file') && (
          <div className="edit-body">
            <div className="asset-preview">
              {card.kind === 'image' && assetSrc && <img src={assetSrc} alt={p.name || title} />}
              {card.kind === 'video' && assetSrc && <video src={assetSrc} controls preload="metadata" />}
              {card.kind === 'video' && !assetSrc && <p className="ref-edit-sum">视频文件不可用</p>}
              {card.kind === 'file' && (
                <div className="file-meta">
                  <span className="file-icon"><Icon name="file" size={20} /></span>
                  <span>{p.name || title}</span>
                  <span className="file-size">{fmtSize(p.size)}</span>
                  <button onClick={() => void window.capybara.invoke('boards:openFile', p.file!)}><Icon name="external" size={13} /> 用默认程序打开</button>
                </div>
              )}
            </div>
            <textarea className="edit-text" placeholder="备注（可选）" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="replace-btn" onClick={() => fileRef.current?.click()}><Icon name="upload" size={13} /> 替换文件…</button>
            <input ref={fileRef} type="file" hidden onChange={onReplace} />
          </div>
        )}

        <div className="modal-foot">
          <button className="danger" onClick={() => { onDelete(); onClose() }}><Icon name="trash" size={14} /> 删除卡片</button>
          <button className="primary" disabled={linkFetching} onClick={async () => {
            if (card.kind === 'text') saveText()
            else if (card.kind === 'link') await saveLink()
            else saveAsset()
            onClose()
          }}>{linkFetching ? '抓取中…' : <><Icon name="check" size={14} /> 保存</>}</button>
        </div>
      </div>
    </div>
  )
}
