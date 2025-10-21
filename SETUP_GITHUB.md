# GitHub Repository Setup

## Step 1: Create Repository on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" button in top right → "New repository"
3. Fill in:
   - **Repository name**: `perftrack-mvp` (or your preferred name)
   - **Description**: `Employee Performance Gamification MVP - Next.js, TypeScript, Tailwind CSS`
   - **Visibility**: Public (recommended)
   - **DO NOT** check any boxes (README, .gitignore, license)
4. Click "Create repository"

## Step 2: Connect Local Repository

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /tmp/performance-gamification-mvp

# Add the GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

Visit your new repository URL to see all your files uploaded!

## Alternative: Use GitHub CLI

If you want to install GitHub CLI for easier management:

```bash
# Install GitHub CLI (macOS)
brew install gh

# Authenticate
gh auth login

# Create repository directly from command line
cd /tmp/performance-gamification-mvp
gh repo create perftrack-mvp --public --source=. --remote=origin --push
```

## What You'll Have

After setup, your repository will contain:
- ✅ Complete Next.js application
- ✅ All source code (48 files)
- ✅ Comprehensive documentation
- ✅ Ready for deployment to Vercel
- ✅ Professional README with screenshots potential

## Next Steps

1. **Deploy to Vercel**: Connect your GitHub repo to Vercel for instant deployment
2. **Share**: Send the GitHub URL to stakeholders for code review
3. **Collaborate**: Add collaborators if needed
4. **Iterate**: Make changes locally and push updates

Your PerfTrack MVP is ready to go live! 🚀
