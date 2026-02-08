# Vercel Deployment Guide

## Quick Setup

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - **IMPORTANT**: Set **Root Directory** to `frontend` in project settings

2. **Build Settings** (Vercel will auto-detect these from `vercel.json`):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Root Directory**: `frontend` (CRITICAL!)

3. **Environment Variables** (if needed):
   - Add your environment variables in Vercel dashboard
   - Example: `VITE_API_BASE_URL`

## Routing Fix

The `vercel.json` file and `public/_redirects` are configured to handle React Router routing:
- All routes are rewritten to `/index.html`
- React Router handles client-side routing
- This fixes 404 errors when accessing routes directly (e.g., `/login`, `/signup`)

## Troubleshooting 404 Errors

### If you see "404: NOT_FOUND":

1. **Check Root Directory Setting**:
   - Go to Vercel Dashboard → Your Project → Settings → General
   - Under "Root Directory", make sure it's set to `frontend`
   - If not, click "Edit" and set it to `frontend`
   - Redeploy after changing

2. **Verify Build Output**:
   - Check the build logs in Vercel
   - Ensure `dist` folder is created with `index.html` inside
   - The build should show: "✓ built in Xs"

3. **Check vercel.json Location**:
   - Make sure `vercel.json` is in the `frontend` folder (not root)
   - File path should be: `frontend/vercel.json`

4. **Clear Cache and Redeploy**:
   - In Vercel Dashboard → Deployments
   - Click "..." on latest deployment → "Redeploy"
   - Or delete `.vercel` folder and redeploy

5. **Verify Routes in App.jsx**:
   - All routes should be defined in `src/App.jsx`
   - Check that React Router is properly configured

6. **Check Build Logs**:
   - Look for any build errors
   - Ensure all dependencies are installed
   - Check if `dist` folder is generated correctly

## Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

## Common Issues

### Issue: 404 on all routes
**Solution**: Set Root Directory to `frontend` in Vercel settings

### Issue: Assets not loading
**Solution**: Check that `public/_redirects` exists and is copied to `dist` during build

### Issue: Build fails
**Solution**: Check Node version (should be 18+), ensure all dependencies are in package.json
