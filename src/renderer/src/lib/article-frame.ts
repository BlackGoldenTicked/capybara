/**
 * 构建注入 iframe srcdoc 的完整文章页面。
 * 把所有 CSS 内联，让 iframe 完全自包含，不依赖父窗口样式表。
 */

// 对应 app.css 中 .reader-content 的核心排版规则（精简版，内联到 iframe）
const ARTICLE_CSS = `
/* 基础排版 */
:root { color-scheme: light dark; --font-reading: system-ui, -apple-system, sans-serif; }
html { scrollbar-gutter: stable; font-size: 16px; }
body { margin: 0; padding: 24px 32px; font-family: var(--font-reading); line-height: 1.75; overflow-wrap: anywhere; word-break: break-word; }

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  body { background: #1a1a2e; color: #d0d0e0; }
  a { color: #7ba5f0; }
  blockquote { border-left-color: #4a4a6a; color: #aaaacc; }
  code, pre { background: #252540; color: #d0d0e0; }
  th { background: #252540; }
  table { border-color: #3a3a5a; }
  img { background: #252540; }
  hr { border-color: #3a3a5a; }
}
@media (prefers-color-scheme: light) {
  body { background: #fafafa; color: #333; }
  a { color: #2563eb; }
  blockquote { border-left-color: #bbb; color: #555; }
  code, pre { background: #f0f0f0; color: #333; }
  th { background: #f0f0f0; }
  table { border-color: #ddd; }
  img { background: #f0f0f0; }
  hr { border-color: #ddd; }
}

/* 标题 */
h1 { font-size: 1.6em; line-height: 1.35; margin: 1.2em 0 0.5em; font-weight: 700; }
h2 { font-size: 1.3em; line-height: 1.4; margin: 1.1em 0 0.5em; font-weight: 650; }
h3 { font-size: 1.1em; line-height: 1.4; margin: 1em 0 0.4em; font-weight: 600; }
h4 { font-size: 1em; margin: 0.9em 0 0.3em; font-weight: 600; }

/* 段落 */
p { margin: 0 0 1.1em; }

/* 链接 */
a { text-decoration: underline; text-underline-offset: 2px; cursor: pointer; word-break: break-word; }
a:hover { opacity: 0.82; }

/* 列表 */
ul, ol { padding-left: 1.6em; margin: 0 0 1.1em; }
li { margin: 0.35em 0; }

/* 图片/视频 */
img, video, picture { max-width: 100%; height: auto; border-radius: 8px; margin: 0.8em 0; display: block; }
img { cursor: zoom-in; }
figure { margin: 1.1em 0; }
figure img { margin: 0; }
figcaption { font-size: 0.85em; opacity: 0.7; text-align: center; margin-top: 0.5em; }

/* 引用块 */
blockquote { border-left: 3px solid #999; padding-left: 14px; margin: 1em 0; opacity: 0.85; }

/* 代码 */
code, pre { font-family: 'SF Mono', Menlo, Monaco, monospace; font-size: 14px; border-radius: 6px; }
code { padding: 2px 6px; }
pre { padding: 12px; overflow-x: auto; margin: 1.1em 0; line-height: 1.6; }
pre code { padding: 0; background: none; }

/* 表格 */
table { width: 100%; border-collapse: collapse; margin: 1.1em 0; display: block; overflow-x: auto; font-size: 0.92em; }
th, td { border: 0.5px solid; padding: 6px 10px; text-align: left; vertical-align: top; }
th { font-weight: 600; }

/* 分割线 */
hr { border: none; border-top: 0.5px solid; margin: 1.6em 0; }

/* 嵌入回退 */
.embed-fallback { font-size: 0.9em; opacity: 0.7; padding: 10px 14px; border: 0.5px dashed; border-radius: 8px; margin: 1.1em 0; }

/* 广告/社交过滤 */
iframe[src*="feedads"], iframe[src*="doubleclick"], iframe[src*="plusone.google"] { display: none !important; }
a[href*="feedburner"], a[href*="feedblitz"], a[href*="twitter.com/home?"], a[href*="facebook.com/share.php?"],
a[href*="linkedin.com/shareArticle?"], a[href*="addtoany.com/share_save"], a[href*="digg.com/submit?"],
a[href*="tumblr.com/share?"], a[href*="delicious.com/post?"], a[href*="api.tweetmeme"] { display: none !important; }
img[src*="feedburner"], img[src*="feedads"], img[src*="doubleclick"], img[src*="share-buttons"],
img[src*="/img/social/"], img[src*=".ads."], img[src*="//ads."] { display: none !important; }
.social_items, .mcnFollowBlock { display: none !important; }
.twemoji, .wp-smiley, img.emoji, img.wp-smiley { height: 1em !important; max-height: 1em !important; width: auto; }

/* no-img 模式 */
.no-img img, .no-img video, .no-img picture, .no-img figure { display: none !important; }

/* 文章头部元信息 */
.article-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 0.5px solid; opacity: 0.6; }
.article-title { font-size: 1.6em; font-weight: 700; margin: 0 0 8px; line-height: 1.35; }
.article-meta { font-size: 0.85em; margin: 0; }
.article-meta a { font-size: 0.9em; }

/* 滚动条 */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { border-radius: 3px; }
@media (prefers-color-scheme: dark) { ::-webkit-scrollbar-thumb { background: #444; } }
@media (prefers-color-scheme: light) { ::-webkit-scrollbar-thumb { background: #ccc; } }
`.trim()

export interface ArticlePageOptions {
  title: string
  author?: string
  sourceName?: string
  url?: string
  bodyHtml: string
  noImg?: boolean
}

/** 构建注入 iframe srcdoc 的完整 HTML 页面 */
export function buildArticlePage(opts: ArticlePageOptions): string {
  const { title, author, sourceName, url, bodyHtml, noImg } = opts

  const metaParts: string[] = []
  if (author) metaParts.push(escapeHtml(author))
  if (sourceName) metaParts.push(escapeHtml(sourceName))
  const meta = metaParts.join(' · ')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${ARTICLE_CSS}</style>
</head>
<body class="${noImg ? 'no-img' : ''}">
  <div class="article-header">
    <h1 class="article-title">${escapeHtml(title)}</h1>
    <p class="article-meta">
      ${meta ? `<span>${meta}</span>` : ''}
      ${url ? ` · <a href="${escapeAttr(url)}" class="article-link">${escapeHtml(url)}</a>` : ''}
    </p>
  </div>
  <div class="article-body">${bodyHtml}</div>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
