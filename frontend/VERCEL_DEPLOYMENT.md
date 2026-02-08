# Vercel Deployment Guide

## Quick Setup

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Select the `frontend` folder as the root directory

2. **Build Settings** (Vercel will auto-detect these from `vercel.json`):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables** (if needed):
   - Add your environment variables in Vercel dashboard
   - Example: `VITE_API_BASE_URL`

## Routing Fix

The `vercel.json` file is configured to handle React Router routing:
- All routes are rewritten to `/index.html`
- React Router handles client-side routing
- This fixes 404 errors when accessing routes directly (e.g., `/login`, `/signup`)

## Troubleshooting

If you still see 404 errors:
1. Make sure `vercel.json` is in the `frontend` folder
2. Verify the build output directory is `dist`
3. Check that all routes are defined in `App.jsx`
4. Clear Vercel cache and redeploy

## Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```
