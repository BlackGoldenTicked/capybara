/**
 * Netscape Bookmark HTML 解析器
 * 解析浏览器导出的 bookmarks.html（Chrome / Edge / Firefox / Safari 兼容）
 *
 * 格式示例：
 * <DT><H3 ADD_DATE="..." >文件夹名</H3>
 * <DL><p>
 *   <DT><A HREF="https://..." ADD_DATE="..." ICON="data:...">链接标题</A>
 *   ...
 * </DL><p>
 */

import * as cheerio from 'cheerio'

/** 解析出的书签条目 */
export interface ParsedBookmark {
  title: string
  url: string
  icon: string
  addDate: number
  /** 从根目录开始的文件夹路径，如 ["书签栏", "技术", "前端"] */
  folderPath: string[]
}

/**
 * 解析 Netscape Bookmark HTML
 * 使用 cheerio 递归遍历 DL > DT 结构
 */
export function parseBookmarkHtml(html: string): ParsedBookmark[] {
  const $ = cheerio.load(html)
  const results: ParsedBookmark[] = []

  /**
   * 递归处理 DL 元素
   * @param $dl 当前 DL 元素
   * @param currentPath 当前文件夹路径
   */
  function processDl($dl: cheerio.Cheerio<unknown>, currentPath: string[]): void {
    // DL 下直接的 DT 子元素（不递归到子 DL 中的 DT）
    $dl.children('dt').each((_, dt) => {
      const $dt = $(dt)
      const $h3 = $dt.find('> h3').first()
      const $a = $dt.find('> a').first()

      if ($h3.length > 0) {
        // 文件夹：收集标题，递归处理子 DL
        const title = $h3.text().trim()
        if (title) {
          const newPath = [...currentPath, title]
          // 找紧随 H3 后面的 DL（同一 DT 内）
          const $subDl = $dt.find('> dl').first()
          if ($subDl.length > 0) {
            processDl($subDl, newPath)
          }
        }
      } else if ($a.length > 0) {
        // 链接
        const href = $a.attr('href') || ''
        if (!href || !/^https?:\/\//i.test(href)) return // 只保留 http/https 链接
        const title = $a.text().trim() || href
        const icon = $a.attr('icon') || ''
        const addDateStr = $a.attr('add_date') || ''
        const addDate = addDateStr ? parseInt(addDateStr, 10) : 0
        results.push({ title, url: href, icon, addDate: Number.isFinite(addDate) ? addDate : 0, folderPath: currentPath })
      }
    })
  }

  // 从第一个 DL 开始处理（通常在 body 内）
  const rootDl = $('dl').first()
  if (rootDl.length > 0) {
    processDl(rootDl, [])
  } else {
    // 如果没有 DL 结构，尝试直接找所有 A 标签
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || ''
      if (!href || !/^https?:\/\//i.test(href)) return
      results.push({
        title: $(el).text().trim() || href,
        url: href,
        icon: $(el).attr('icon') || '',
        addDate: parseInt($(el).attr('add_date') || '0', 10) || 0,
        folderPath: [],
      })
    })
  }

  return results
}

/**
 * 将解析出的文件夹路径映射为数据库中的文件夹 ID
 * 需要配合 db.ts 的 createBookmarkFolder 使用
 * 这里返回一个结构化结果，让调用方处理数据库操作
 */
export interface ParsedBookmarkWithFolder extends ParsedBookmark {
  /** 解析时确定的文件夹 ID（由调用方设置） */
  folderId: number
}

/**
 * 将解析的书签按文件夹路径分组，返回扁平的链接列表
 * 文件夹路径用 " > " 连接作为分组键
 */
export function groupByFolderPath(bookmarks: ParsedBookmark[]): Map<string, ParsedBookmark[]> {
  const groups = new Map<string, ParsedBookmark[]>()
  for (const bm of bookmarks) {
    const key = bm.folderPath.length > 0 ? bm.folderPath.join(' > ') : '未分类'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(bm)
  }
  return groups
}
