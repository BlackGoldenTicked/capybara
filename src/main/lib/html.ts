import { parseHTML } from 'linkedom'

const NAMED_ENTITIES: Record<string, string> = {
  lt: '<', gt: '>', quot: '"', apos: "'", amp: '&',
  nbsp: '\u00A0', copy: '\u00A9', reg: '\u00AE', trade: '\u2122',
  hellip: '\u2026', mdash: '\u2014', ndash: '\u2013', ldquo: '\u201C', rdquo: '\u201D',
  lsquo: '\u2018', rsquo: '\u2019'
}

/** 把 &lt; &gt; &quot; &#39; &#x27; &amp; 等 HTML 实体解码为字面字符（不解析标签）。 */
function decodeEntities(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (_, name: string) => NAMED_ENTITIES[name] ?? `&${name};`)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
}

/**
 * 解码 HTML 实体后把文本当作 HTML 解析，返回可直接作为 innerHTML 渲染的字符串。
 *
 * 这样 RSS description 里常见的 &lt;img src=&quot;...&quot;&gt; 会先解码成 <img src="...">，
 * 再被解析成真正的 <img> 元素，阅读区就能正常渲染图片。
 */
export function decodeHtmlEntities(raw: string): string {
  if (!raw || !raw.trim()) return ''
  const decoded = decodeEntities(raw)
  const { document } = parseHTML(`<!DOCTYPE html><html><body><div id="rf-x">${decoded}</div></body></html>`)
  return document.getElementById('rf-x')?.innerHTML ?? decoded
}

/**
 * 把 HTML / HTML 实体编码的片段转成纯文本摘要（去掉所有标签、解码实体、压空白）。
 * 用于列表卡片摘要、content_text 等只需要可读文本的场景。
 */
export function htmlToSnippet(raw: string): string {
  if (!raw || !raw.trim()) return ''
  const decoded = decodeEntities(raw)
  const { document } = parseHTML(`<!DOCTYPE html><html><body><div id="rf-x">${decoded}</div></body></html>`)
  const text = document.getElementById('rf-x')?.textContent ?? ''
  return text.replace(/\s+/g, ' ').trim().slice(0, 300)
}
