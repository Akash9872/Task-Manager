# 🚀 Team Task Manager - Quick Start Guide

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or cloud)
- Git (for version control)

## 📦 Setup Steps

### 1. **Database Setup**

#### Option A: MongoDB Atlas (Cloud)
```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist IP address
5. Copy connection string
6. Update backend/.env: MONGODB_URI=<your_connection_string>
```

#### Option B: Local MongoDB
```bash
# Windows (with Chocolatey)
choco install mongodb-community

# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
mongod
```

### 2. **Backend Setup**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# Verify: PORT=5000, MONGODB_URI is set

# Start development server
npm run dev

# Should see: "Server running on port 5000"
```

### 3. **Frontend Setup**

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local (already provided)
# Verify: VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Should see: "Local: http://localhost:5173/"
```

### 4. **Access Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🧪 Test the Application

### Create Test Accounts

**Signup User 1:**
- Name: Alice Admin
- Email: alice@example.com
- Password: alice123

**Signup User 2:**
- Name: Bob Member
- Email: bob@example.com
- Password: bob123

### Test Features

1. **Login/Signup**: Create accounts and login
2. **Create Project**: 
   - Login as Alice
   - Click "Projects" → "New Project"
   - Name: "Website Redesign"
   - Description: "Redesign company website"
3. **Add Team Member**:
   - In project, click "Add Member"
   - Enter: bob@example.com
4. **Create Task**:
   - Click "New Task"
   - Title: "Design Mockups"
   - Priority: High
   - Assign to: Bob Member
   - Due Date: Set future date
5. **Update Task**:
   - Change status to "In Progress"
   - View on Dashboard
6. **View Dashboard**:
   - See statistics
   - Check overdue/upcoming tasks

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Ensure MongoDB is running (mongod)
2. Check MONGODB_URI in .env
3. For Atlas: whitelist your IP
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
# Kill process on port 5000
Windows: netstat -ano | findstr :5000
        taskkill /PID <PID> /F

Mac/Linux: lsof -i :5000
          kill -9 <PID>
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Verify backend is running
2. Check VITE_API_URL in frontend/.env.local
3. Ensure CORS middleware is enabled in server.js
```

### Blank Frontend Page
```
Solution:
1. Check browser console for errors (F12)
2. Verify backend is running
3. Clear localStorage: DevTools → Application → Storage
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## 📝 Project Structure Overview

```
Team Task Manager/
├── backend/                  # Node.js/Express API
│   ├── models/              # Database schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth middleware
│   └── server.js            # Main server file
│
├── frontend/                # React web app
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   ├── services/       # API client
│   │   └── styles/         # CSS files
│   └── vite.config.js      # Vite config
│
└── README.md                # Full documentation
```

## 🚀 Development Commands

### Backend
```bash
# Development (with hot reload)
npm run dev

# Production
npm start

# Check health
curl http://localhost:5000/api/health
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | User authentication |
| Signup | `/signup` | Create new account |
| Dashboard | `/dashboard` | Overview & statistics |
| Projects | `/projects` | List all projects |
| Project Detail | `/projects/:id` | Kanban board & tasks |

## 🔑 Default Test Credentials

After signup, use these for testing:

```
Admin User:
Email: admin@example.com
Password: admin123

Member User:
Email: member@example.com
Password: member123
```

## 📚 API Endpoints Quick Reference

```
Authentication:
POST   /api/auth/signup
POST   /api/auth/login

Projects:
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
POST   /api/projects/:id/members
DELETE /api/projects/:id

Tasks:
GET    /api/tasks/project/:projectId
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

Dashboard:
GET    /api/dashboard
```

## 🌐 Deploy to Railway

### Backend Deployment
1. Push code to GitHub
2. Connect repo to Railway
3. Set environment variables
4. Auto-deploy on push

### Frontend Deployment
1. Build project: `npm run build`
2. Deploy `dist/` folder to Railway/Vercel/Netlify
3. Set `VITE_API_URL` to production backend URL

## 💡 Tips & Best Practices

1. **Always run MongoDB first** before backend
2. **Use .env files** for sensitive data
3. **Check console errors** (F12) when debugging
4. **Clear cache** if seeing old data
5. **Use different browser tabs** to test multiple users
6. **Test CRUD operations**: Create, Read, Update, Delete

## 🆘 Need Help?

1. Check [Backend README](./backend/README.md)
2. Check [Frontend README](./frontend/README.md)
3. Check [Main README](./README.md)
4. Review console errors (F12)
5. Verify environment variables

---

**Happy developing! 🎉**
