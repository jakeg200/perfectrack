# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy this Next.js application.

### Prerequisites
- GitHub account
- Vercel account (free tier works)

### Steps

1. **Push to GitHub**
   ```bash
   cd /tmp/performance-gamification-mvp
   git init
   git add .
   git commit -m "Initial commit: PerfTrack MVP"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"
   - Done! Your app will be live in ~2 minutes

3. **Access Your App**
   - Vercel provides a URL like: `https://performance-gamification-mvp.vercel.app`
   - Share this URL to demo your MVP

## Deploy to Other Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t perftrack-mvp .
docker run -p 3000:3000 perftrack-mvp
```

### AWS Amplify

1. Push code to GitHub/GitLab/Bitbucket
2. Go to AWS Amplify Console
3. Connect repository
4. Amplify auto-detects Next.js
5. Deploy

### Google Cloud Run

```bash
# Build for production
npm run build

# Deploy to Cloud Run
gcloud run deploy perftrack-mvp \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Production Considerations

### Before Going Live

⚠️ **Important**: This MVP uses localStorage and has no backend. Before production:

1. **Backend Required**
   - Set up REST API or GraphQL server
   - Implement proper database (PostgreSQL, MongoDB)
   - Add authentication (JWT, OAuth, Auth0)

2. **Environment Variables**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_API_URL=https://api.yourcompany.com
   NEXT_PUBLIC_APP_URL=https://perftrack.yourcompany.com
   ```

3. **Security**
   - Enable HTTPS (automatic on Vercel)
   - Implement CORS policies
   - Add rate limiting
   - Sanitize user inputs
   - Set up CSP headers

4. **Performance**
   - Enable Next.js Image Optimization
   - Add CDN for static assets
   - Implement caching strategies
   - Monitor with analytics

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Add performance monitoring
   - Implement logging
   - Set up uptime monitoring

## Build Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production Build
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Check for errors
```

## Environment Setup

### Development
```env
NODE_ENV=development
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=your-api-url
```

## Custom Domain

### Vercel
1. Go to project settings
2. Add domain under "Domains"
3. Update DNS records as instructed
4. SSL is automatic

### Other Platforms
Similar process - add domain in platform settings and update DNS.

## Continuous Deployment

Most platforms (Vercel, Netlify, Amplify) automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Automatic deployment triggered!
```

## Performance Optimization

Before production, consider:

1. **Image Optimization**
   - Use Next.js Image component
   - Compress images
   - Use modern formats (WebP)

2. **Code Splitting**
   - Already handled by Next.js
   - Consider dynamic imports for large components

3. **Caching**
   - Configure cache headers
   - Use service workers (PWA)

4. **Analytics**
   - Add Google Analytics
   - Or use Vercel Analytics
   - Track user behavior

## Monitoring Setup

### Vercel Analytics (Built-in)
```bash
# Already enabled in Vercel deployments
# View in Vercel dashboard
```

### Sentry Error Tracking
```bash
npm install @sentry/nextjs

# Configure in next.config.js
```

### Google Analytics
```tsx
// Add to app/layout.tsx
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

## Scaling Considerations

When ready to scale:

1. **Database**: PostgreSQL with read replicas
2. **Caching**: Redis for sessions and data
3. **Storage**: S3 for avatars and files
4. **CDN**: CloudFront or Cloudflare
5. **Load Balancing**: Multiple app instances
6. **Queue System**: Bull/RabbitMQ for async tasks

## Support & Maintenance

After deployment:

- **Monitor** error rates and performance
- **Update** dependencies regularly
- **Backup** data frequently
- **Test** in staging before production
- **Document** changes and updates

---

**Recommended for MVP Demo**: Deploy to Vercel (free, fast, easy)

**For Production**: Implement backend, add auth, then deploy with proper infrastructure

