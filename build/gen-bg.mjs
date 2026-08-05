import sharp from 'sharp'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
const dir = fs.realpathSync(new URL('.', import.meta.url))
const svg = fs.readFileSync(dir + '/dmg-background.svg')

// 标准分辨率（与 SVG 像素尺寸一致）
await sharp(svg, { density: 72 }).png().toFile(dir + '/dmg-background.png')
// Retina 2x
await sharp(svg, { density: 144 }).resize(1320, 880).png().toFile(dir + '/dmg-background@2x.png')
console.log('dmg-background.png + dmg-background@2x.png generated')
