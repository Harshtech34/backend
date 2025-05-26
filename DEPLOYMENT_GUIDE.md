# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Changes Not Reflecting After Deployment

**Symptoms:**
- Clicking "Deploy" multiple times
- Changes not visible immediately
- Need to redeploy to see frontend

**Solutions:**

#### A. Clear Browser Cache
\`\`\`bash
# Hard refresh in browser
Ctrl+F5 (Windows/Linux)
Cmd+Shift+R (Mac)

# Or open Developer Tools and right-click refresh button
# Select "Empty Cache and Hard Reload"
\`\`\`

#### B. Clear Deployment Cache
\`\`\`bash
# For Vercel
vercel --prod --force

# For Netlify
netlify deploy --prod --clear-cache

# Manual cleanup
rm -rf .next
rm -rf node_modules/.cache
npm run build
\`\`\`

#### C. Check Build Logs
1. Go to your deployment platform dashboard
2. Check the build logs for errors
3. Look for warnings about static generation
4. Verify all environment variables are set

### 2. Environment Variables Issues

**Check List:**
- [ ] All required env vars are set in deployment platform
- [ ] No typos in variable names
- [ ] Values are properly escaped
- [ ] NEXT_PUBLIC_ prefix for client-side variables

### 3. Build Optimization

**Add to package.json:**
\`\`\`json
{
  "scripts": {
    "build:clean": "rm -rf .next && npm run build",
    "deploy:vercel": "npm run build:clean && vercel --prod",
    "deploy:netlify": "npm run build:clean && netlify deploy --prod"
  }
}
\`\`\`

### 4. Force Deployment

**Vercel:**
\`\`\`bash
# Force new deployment
git commit --allow-empty -m "Force deployment"
git push origin main
\`\`\`

**Netlify:**
\`\`\`bash
# Trigger new build
curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
\`\`\`

## Deployment Checklist

- [ ] Run `npm run build` locally without errors
- [ ] All environment variables configured
- [ ] No TypeScript errors
- [ ] All dependencies installed
- [ ] Build cache cleared
- [ ] Domain/DNS configured correctly
- [ ] SSL certificate active
- [ ] CDN cache purged (if applicable)

## Monitoring

Add this component to monitor deployment status:
- Real-time health checks
- Version tracking
- Error monitoring
- Performance metrics
\`\`\`

Now let's update the root layout to include deployment status:

```typescriptreact file="app/layout.tsx"
[v0-no-op-code-block-prefix]import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Chatbot } from "@/components/chatbot"
import { DeploymentStatus } from "@/components/deployment-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PropertyHub - Find Your Dream Property",
  description:
    "Discover, buy, sell, and rent properties with ease. Your trusted real estate platform with government-certified data.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Chatbot />
          {process.env.NODE_ENV === 'production' && <DeploymentStatus />}
        </ThemeProvider>
      </body>
    </html>
  )
}
