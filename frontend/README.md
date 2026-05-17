# Frontend - Team Task Manager

Modern React application for team task and project management.

## 🎨 Features

- Beautiful and responsive UI
- Real-time task updates
- Kanban board for task visualization
- Dashboard with statistics
- Project management
- Team collaboration

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **vite** - Build tool

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## ⚙️ Environment Configuration

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

For production:
```
VITE_API_URL=https://your-backend-url/api
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx        # Login page
│   │   ├── SignupPage.jsx       # Signup page
│   │   ├── DashboardPage.jsx    # Dashboard
│   │   ├── ProjectsPage.jsx     # Projects list
│   │   └── ProjectDetailPage.jsx # Project details
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── PrivateRoute.jsx     # Protected routes
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state management
│   ├── services/
│   │   └── api.js               # API client
│   ├── styles/
│   │   ├── index.css            # Global styles
│   │   ├── auth.css             # Auth pages styles
│   │   ├── navbar.css           # Navbar styles
│   │   ├── dashboard.css        # Dashboard styles
│   │   ├── projects.css         # Projects page styles
│   │   ├── project-detail.css   # Project detail styles
│   │   └── layout.css           # Layout styles
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── .env.local                   # Environment variables
├── vite.config.js              # Vite configuration
└── package.json
```

## 🎯 Pages

### Login Page
- Email and password login
- Redirect to signup
- JWT token handling

### Signup Page
- User registration
- Name, email, password fields
- Automatic login after signup

### Dashboard
- Project statistics
- Task breakdown by status
- Overdue tasks alert
- Upcoming tasks list
- Personal task assignments

### Projects
- List all projects
- Create new projects
- Click to view details
- Shows member count

### Project Details
- Task management in Kanban view
- Create new tasks
- Update task status
- Assign tasks to members
- Set priorities and due dates
- Add team members (admin only)

## 🔐 Authentication

### Auth Context
- Manages user state
- Stores JWT token in localStorage
- Login/Logout functions
- Auto-load user on app start

### Protected Routes
- PrivateRoute component
- Redirects unauthorized users to login
- Persists auth across page refresh

### API Interceptor
- Automatically adds JWT token to requests
- Handles authentication errors

## 🎨 Styling

### Design System
- Color variables (primary, secondary, success, danger, etc.)
- Consistent spacing and shadows
- Responsive grid system
- Beautiful animations

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Flexible layouts

## 🌐 API Integration

### Service Layer (`services/api.js`)
```javascript
// Authentication
authService.signup(data)
authService.login(data)

// Projects
projectService.createProject(data)
projectService.getProjects()
projectService.getProjectById(id)
projectService.updateProject(id, data)
projectService.addMember(id, data)
projectService.deleteProject(id)

// Tasks
taskService.createTask(data)
taskService.getProjectTasks(projectId)
taskService.updateTask(id, data)
taskService.deleteTask(id)

// Dashboard
dashboardService.getDashboard()
```

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
# Push to GitHub
# Connect to Vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag drop `dist` folder
# Or connect GitHub repo
```

### Deploy to Railway
```bash
# Push to GitHub
# Connect to Railway
# Set environment variables
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚡ Performance Optimizations

- Code splitting with React Router
- Lazy loading components
- Optimized API calls
- CSS minification
- Image optimization

## 🛠️ Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Thunder Client - REST client

### Browser DevTools
- React Developer Tools
- Redux DevTools

## 📝 Best Practices

- Functional components with hooks
- Context API for state management
- Component reusability
- Proper error handling
- Loading states
- User feedback (alerts, notifications)

## 🐛 Common Issues

### Blank Page on Load
- Check console for errors
- Verify backend is running
- Check VITE_API_URL in .env

### 404 on API Calls
- Ensure backend running on port 5000
- Check environment variables
- Verify CORS is enabled

### Auth Token Errors
- Clear localStorage
- Log out and login again
- Check backend JWT_SECRET

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Guide](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

**Frontend for Team Task Manager**

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
