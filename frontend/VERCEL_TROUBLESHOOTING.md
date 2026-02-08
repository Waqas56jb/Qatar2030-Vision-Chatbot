# Vercel 404 Error - Complete Troubleshooting Guide

## ⚠️ If you're seeing "404: NOT_FOUND"

This usually means Vercel can't find your `index.html` file or the routing isn't configured correctly.

## 🔧 Step-by-Step Fix

### Step 1: Verify Root Directory (MOST IMPORTANT!)

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **General**
3. Scroll to **Root Directory**
4. **MUST BE SET TO**: `frontend` (not empty, not `/`, just `frontend`)
5. Click **Save**
6. **Redeploy** your project

### Step 2: Check Build Output

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check **Build Logs**
4. Look for: `✓ built in Xs` or `Build completed`
5. Verify it says: `Output Directory: dist`

### Step 3: Verify Files Exist

After build, these files should exist in `dist`:
- ✅ `dist/index.html`
- ✅ `dist/assets/` (folder with JS/CSS files)
- ✅ `dist/_redirects` (copied from public folder)

### Step 4: Test the Configuration

Run locally to test:
```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173/login` - it should work.

### Step 5: Clear Cache and Redeploy

1. In Vercel Dashboard → **Deployments**
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**
4. Or delete `.vercel` folder and redeploy

## 📁 File Structure Check

Your `frontend` folder should have:
```
frontend/
├── vercel.json          ✅ Must exist
├── public/
│   ├── _redirects      ✅ Must exist
│   └── 404.html        ✅ Optional fallback
├── dist/               ✅ Created after build
│   ├── index.html      ✅ Must exist
│   └── assets/         ✅ Must exist
└── src/
    └── App.jsx         ✅ Routes defined here
```

## 🔍 Common Issues

### Issue 1: "Cannot find module" in build
**Solution**: Make sure all dependencies are in `package.json` and run `npm install`

### Issue 2: Build succeeds but 404 on routes
**Solution**: 
- Check Root Directory is `frontend`
- Verify `vercel.json` exists
- Check `public/_redirects` exists

### Issue 3: Assets not loading
**Solution**: Check `vite.config.js` has `base: '/'`

### Issue 4: Routes work in dev but not production
**Solution**: This is the routing issue - ensure `vercel.json` has the rewrite rule

## 🚀 Manual Deployment Test

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📝 Current Configuration

### vercel.json
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### public/_redirects
```
/*    /index.html   200
```

## ✅ Final Checklist

Before deploying, ensure:
- [ ] Root Directory = `frontend` in Vercel settings
- [ ] `vercel.json` exists in `frontend/` folder
- [ ] `public/_redirects` exists
- [ ] `npm run build` works locally
- [ ] `dist/index.html` exists after build
- [ ] All routes are defined in `src/App.jsx`
- [ ] No build errors in Vercel logs

## 🆘 Still Not Working?

If after all these steps you still get 404:

1. **Check Vercel Build Logs** - Look for any errors
2. **Verify Node Version** - Should be 18+ (check in Vercel settings)
3. **Check Environment Variables** - Make sure none are breaking the build
4. **Try a fresh deployment** - Delete project and re-import
5. **Contact Support** - Share your build logs with Vercel support

## 📞 Quick Test

After fixing, test these URLs:
- `https://your-domain.vercel.app/` ✅ Should work
- `https://your-domain.vercel.app/login` ✅ Should work
- `https://your-domain.vercel.app/signup` ✅ Should work
- `https://your-domain.vercel.app/reset-password` ✅ Should work

If the root (`/`) works but others don't, it's definitely a routing issue - the `vercel.json` rewrite isn't being applied.
