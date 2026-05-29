import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const index = path.join(dist, 'index.html')
const notFound = path.join(dist, '404.html')

fs.copyFileSync(index, notFound)
console.log('Copied index.html to 404.html for GitHub Pages SPA routing')
