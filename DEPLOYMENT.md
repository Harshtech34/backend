# Deployment Guide

## Quick Deploy to Vercel

1. **Connect Repository**
   \`\`\`bash
   git add .
   git commit -m "Deploy real estate platform"
   git push origin main
   \`\`\`

2. **Vercel Auto-Detection**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

3. **Environment Variables**
   Set these in Vercel dashboard:
   \`\`\`
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_APP_NAME=Real Estate Platform
   NODE_ENV=production
   \`\`\`

4. **Build Settings**
   - Node.js Version: 18.x
   - Package Manager: npm
   - Root Directory: ./

## Troubleshooting

- Clear browser cache after deployment
- Check build logs for errors
- Verify environment variables
- Test in incognito mode

## Success Indicators

✅ Build completes without errors
✅ Health check returns 200 status
✅ All pages load correctly
✅ No console errors
\`\`\`

Let's create a simple environment example:
