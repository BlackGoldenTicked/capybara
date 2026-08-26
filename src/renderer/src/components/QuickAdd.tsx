import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { press, pressBtn } from '../lib/press'

export function QuickAdd() {
  const { quickAddOpen, setQuickAddOpen, quickAdd } = useStore()
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (quickAddOpen) { setUrl(''); setBusy(false); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [quickAddOpen])

  if (!quickAddOpen) return null

  const submit = async () => {
    if (!url.trim() || busy) return
    setBusy(true)
    await quickAdd(url.trim())
  }

  return (
    <div className="modal-mask" {...press(() => setQuickAddOpen(false))}>
      <div className="modal" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        <p className="modal-title">快速收集</p>
        <input
          ref={inputRef}
          placeholder="粘贴 URL，回车收入 RSS…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void submit(); if (e.key === 'Escape') setQuickAddOpen(false) }}
        />
        <div className="modal-foot">
          <button {...pressBtn(() => setQuickAddOpen(false))}>取消</button>
          <button {...pressBtn(() => void submit())} disabled={busy}>{busy ? '抓取中…' : '收集'}</button>
        </div>
      </div>
    </div>
  )
}
