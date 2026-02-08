// Quick check script to verify Vercel configuration
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

console.log('🔍 Checking Vercel Configuration...\n')

// Check vercel.json
const vercelJsonPath = join(process.cwd(), 'vercel.json')
if (existsSync(vercelJsonPath)) {
  console.log('✅ vercel.json exists')
  const vercelJson = JSON.parse(readFileSync(vercelJsonPath, 'utf-8'))
  console.log('   Content:', JSON.stringify(vercelJson, null, 2))
} else {
  console.log('❌ vercel.json NOT FOUND')
}

// Check _redirects
const redirectsPath = join(process.cwd(), 'public', '_redirects')
if (existsSync(redirectsPath)) {
  console.log('✅ public/_redirects exists')
  const redirects = readFileSync(redirectsPath, 'utf-8')
  console.log('   Content:', redirects)
} else {
  console.log('❌ public/_redirects NOT FOUND')
}

// Check dist folder (after build)
const distPath = join(process.cwd(), 'dist')
if (existsSync(distPath)) {
  console.log('✅ dist folder exists')
  const indexHtmlPath = join(distPath, 'index.html')
  if (existsSync(indexHtmlPath)) {
    console.log('✅ dist/index.html exists')
  } else {
    console.log('❌ dist/index.html NOT FOUND')
  }
} else {
  console.log('⚠️  dist folder not found (run npm run build first)')
}

console.log('\n📋 Deployment Checklist:')
console.log('1. Root Directory in Vercel should be set to: frontend')
console.log('2. Build Command: npm run build')
console.log('3. Output Directory: dist')
console.log('4. Framework: Vite (auto-detected)')
