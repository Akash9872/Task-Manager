# 🚀 Deployment Guide - Team Task Manager

Complete guide to deploy the Team Task Manager application to Railway.

## Prerequisites
- GitHub account with repo
- Railway account (https://railway.app)
- MongoDB Atlas account (for cloud database)

## 📝 Step-by-Step Deployment

### Step 1: Prepare Database (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier
   - Create new project

2. **Create Cluster**
   - Click "Create Cluster"
   - Select "Shared" (Free tier)
   - Choose region closest to you
   - Wait for cluster to deploy

3. **Create Database User**
   - Go to Database Access
   - Click "Add New Database User"
   - Username: `taskmanager`
   - Password: (Generate strong password)
   - Role: "Read and write to any database"
   - Click "Add User"

4. **Get Connection String**
   - Go to "Databases" → "Connect"
   - Click "Drivers" → "Node.js"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://taskmanager:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority`

5. **Whitelist IP**
   - In MongoDB Atlas → Security → Network Access
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - For production, use specific IP ranges

### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Team Task Manager full stack app"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Railway

1. **Connect GitHub to Railway**
   - Go to https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway access to your GitHub account
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Find `team-task-manager` repo
   - Click "Deploy"

2. **Configure Environment Variables**
   - Go to project settings
   - Click "Variables"
   - Add the following:
     ```
     PORT=5000
     MONGODB_URI=mongodb+srv://taskmanager:PASSWORD@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
     JWT_SECRET=generate_a_strong_random_secret_key_here
     NODE_ENV=production
     ```
   - Click "Deploy"

3. **Set Custom Domain (Optional)**
   - Go to "Settings" → "Domains"
   - Add custom domain or use Railway domain
   - Note the domain: `https://your-backend-url.railway.app`

### Step 4: Deploy Frontend to Railway

#### Option A: Deploy Static Files (Recommended)

1. **Build Frontend Locally**
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `dist` folder with production-ready files.

2. **Create Dockerfile for Frontend**
   Already provided in `frontend/Dockerfile`

3. **Deploy to Railway**
   - Go to your Railway project
   - Click "New Service"
   - Select "GitHub repo"
   - Choose `team-task-manager` repo
   - Set environment:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy

#### Option B: Deploy to Vercel (Alternative)

1. **Push code to GitHub**
   - Ensure all code is committed

2. **Go to Vercel**
   - https://vercel.com
   - Click "New Project"
   - Import `team-task-manager` repo
   - Select `frontend` as root directory
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy

### Step 5: Update Frontend Configuration

Update frontend environment for production:

**File: `frontend/.env.production`**
```
VITE_API_URL=https://your-backend-railway-url/api
```

Or use Railway's environment variables directly.

### Step 6: Test Live Application

1. **Get URLs**
   - Backend: From Railway dashboard
   - Frontend: From Railway/Vercel dashboard

2. **Test Features**
   ```bash
   # Health check
   curl https://your-backend-url/api/health
   
   # Frontend
   Open https://your-frontend-url in browser
   ```

3. **Test Authentication**
   - Sign up new user
   - Create project
   - Create task
   - Verify data persists

## 🔧 Environment Variables Summary

### Backend (Railway)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=strong_random_secret_here
NODE_ENV=production
```

### Frontend (Railway/Vercel)
```
VITE_API_URL=https://backend-url.railway.app/api
```

## 🚨 Production Checklist

- [ ] MongoDB Atlas cluster created and secured
- [ ] Database user created with strong password
- [ ] IP whitelist configured (or set to 0.0.0.0/0)
- [ ] GitHub repo contains all code
- [ ] Backend deployed to Railway with env vars
- [ ] Frontend built with production API URL
- [ ] Frontend deployed to Railway/Vercel
- [ ] Health check endpoint responding
- [ ] API endpoints returning data
- [ ] Frontend loads without errors
- [ ] Login/signup working
- [ ] Create project/task working
- [ ] Data persists in MongoDB

## 📊 Monitoring & Troubleshooting

### Check Backend Logs
- Railway → Project → Backend service → Logs
- Look for errors or warnings

### Check Frontend Build
- Vercel: Check deployment logs
- Railway: Check build output

### Common Issues

**CORS Errors**
```
Solution: Verify VITE_API_URL points to correct backend
Check that backend CORS is enabled
```

**MongoDB Connection Timeout**
```
Solution: 
1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas IP whitelist
3. Ensure connection string has correct credentials
```

**JWT Errors**
```
Solution:
1. Verify JWT_SECRET is set
2. Ensure frontend passes token correctly
3. Check token expiration (default 7 days)
```

## 🆙 Updating Production

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys from main branch
```

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
npm run build
git push origin main
# Vercel/Railway auto-deploys from main branch
```

## 📈 Performance Tips

1. **Enable Caching**
   - Railway: Cache layer available
   - Vercel: Automatic caching

2. **Monitor Database**
   - MongoDB Atlas has performance tools
   - Watch query efficiency
   - Monitor storage usage

3. **Error Tracking**
   - Add error logging service (Sentry)
   - Monitor application performance (New Relic)

4. **Optimize Assets**
   - Frontend: Already optimized with Vite
   - Images: Use WebP format
   - Code: Minified in production build

## 🔐 Security Best Practices

1. **Secrets Management**
   - Never commit .env files
   - Use Railway secrets
   - Rotate JWT_SECRET regularly

2. **HTTPS**
   - Railway provides HTTPS automatically
   - Vercel provides HTTPS automatically

3. **CORS**
   - Backend allows frontend domain
   - Update when changing domains

4. **Database**
   - IP whitelist configured
   - Strong passwords used
   - Regular backups enabled

5. **Dependencies**
   - Keep packages updated
   - Monitor security advisories
   - Run `npm audit` regularly

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Node.js Best Practices: https://nodejs.org/en/docs/guides/

## 🎉 Deployment Complete!

Once deployed, your application will be:
- ✅ Live on the internet
- ✅ Using cloud database
- ✅ Automatically scaled
- ✅ With custom domains (optional)
- ✅ Fully functional team collaboration tool

### Live URLs
- Frontend: `https://your-frontend-domain.com`
- Backend API: `https://your-backend-domain.railway.app/api`
- Health Check: `https://your-backend-domain.railway.app/api/health`

---

**Your Team Task Manager is now live! 🚀**
