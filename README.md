# Next MDX Content Site

A hyper-minimal blog built with Next.js, MDX, and cache components. Content is fetched directly from your GitHub repository.

## Features

- 📝 Write posts in MDX with React components
- ⚡ Cache components for selective revalidation
- 🎨 Custom MDX components (Callout, ImageGrid, etc.)
- 🚀 Smart deployment (skip builds for content-only changes)
- 🪝 Webhook for triggering revalidation with HMAC verification
- 🔗 Content fetched directly from GitHub repository

## Getting Started

### 1. Environment Variables

Add these to your Vercel project:

\`\`\`bash
# GitHub repository details
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-repo-name
GITHUB_TOKEN=your-github-personal-access-token

# Webhook security
REVALIDATE_SECRET=your-secure-random-string
\`\`\`

**GitHub Token Setup:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope (read access to repository contents)
3. Copy the token and add it as `GITHUB_TOKEN` environment variable

### 2. Add Content

Create MDX files in the `content/` folder of your repository:

\`\`\`mdx
---
title: "My Post Title"
date: "2025-01-15"
description: "A brief description"
---

# Your content here

Use any markdown or custom components!

<Callout type="info">
Custom components work too!
</Callout>
\`\`\`

### 3. Deploy to Vercel

The project is configured to:
- Skip full deploys when only content changes
- Use cache components with selective revalidation
- Trigger revalidation via webhook with HMAC verification
- Fetch content directly from GitHub on each revalidation

### Webhook Setup (GitHub)

After deploying, configure a GitHub webhook:

1. Go to your repo → Settings → Webhooks → Add webhook
2. **Payload URL**: `https://your-domain.com/api/revalidate`
3. **Content type**: `application/json`
4. **Secret**: Use the same value as `REVALIDATE_SECRET`
5. **Events**: Select "Just the push event"
6. Save

The webhook will verify the HMAC signature (`X-Hub-Signature-256` header) before revalidating content.

## Custom Components

Add new components in `components/mdx-components.tsx`:

\`\`\`typescript
export function MyComponent({ children }: { children: React.ReactNode }) {
  return <div className="custom-style">{children}</div>
}
\`\`\`

Then use in MDX:

\`\`\`mdx
<MyComponent>Content here</MyComponent>
\`\`\`

## File Structure

\`\`\`
├── app/
│   ├── page.tsx              # Homepage (post list)
│   ├── post/[slug]/page.tsx  # Individual post pages
│   └── api/revalidate/       # Webhook endpoint
├── components/
│   └── mdx-components.tsx    # Custom MDX components
├── content/                  # Your MDX blog posts (in GitHub repo)
├── lib/
│   └── mdx.ts               # MDX utilities with Octokit integration
└── vercel.json              # Deployment config
\`\`\`

## How It Works

1. **Content Storage**: All blog posts are stored in your GitHub repository's `content/` folder
2. **Fetching**: The app uses Octokit to fetch MDX files directly from GitHub
3. **Cache Components**: Pages use "use cache" directive with cache tags for selective revalidation
4. **Webhook**: When you push content changes, GitHub triggers the webhook
5. **Revalidation**: The webhook verifies the HMAC signature and revalidates specific cache tags
6. **No Redeploy**: Content-only changes don't trigger full Vercel deploys
