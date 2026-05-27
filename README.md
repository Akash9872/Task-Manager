# Team Task Manager - Full Stack Application

A professional team collaboration application for managing projects and tasks with role-based access control. Built with React, Node.js/Express, and MongoDB.

## 🌟 Features

### Core Features
- **User Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create, manage, and organize team projects
- **Task Tracking**: Create, assign, and track tasks with status updates
- **Dashboard**: Real-time overview of projects, tasks, and progress
- **Team Collaboration**: Add team members and assign tasks
- **Role-Based Access**: Admin and Member roles with specific permissions

### User Dashboard
- Project count and statistics
- Task status breakdown (Pending, In Progress, Completed)
- Overdue tasks alerts
- Upcoming tasks list
- Personal task assignments

### Project Management
- Create and manage projects
- Add team members
- View project members and task count
- Kanban-style task board

### Task Management
- Create tasks with title, description, and priority
- Assign tasks to team members
- Set due dates and priority levels
- Update task status in real-time
- Delete completed tasks
- Upload task attachments and share files

### Collaboration & Productivity
- Project-level chat for team discussion
- User notifications for deadlines and assignments
- Calendar view for task deadlines and planning
- Analytics metrics for completion rates and priorities

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with custom variables

### Backend
- **Node.js & Express** - REST API server
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key_change_in_production
NODE_ENV=development
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

Ensure MongoDB is running:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### 4. Running the Application

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📁 Project Structure

```
Team Task Manager/
├── backend/
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── dashboardController.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── dashboard.js
│   ├── middleware/          # Auth middleware
│   │   └── auth.js
│   ├── server.js            # Express app setup
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── ProjectDetailPage.jsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/         # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── services/        # API client
│   │   │   └── api.js
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env.local           # Local environment
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/members` - Add team member
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/attachments` - Upload task attachments
- `GET /api/tasks/:id/attachments` - List task attachments

### Collaboration
- `GET /api/chat/:projectId/messages` - Get project chat messages
- `POST /api/chat/:projectId/messages` - Send chat message
- `GET /api/notifications` - Get user notifications

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/calendar` - Get calendar tasks and schedule data

### Frontend Routes
- `/dashboard` - Main dashboard
- `/notifications` - Dedicated notifications panel
- `/projects` - Project list
- `/projects/:id` - Project detail and chat
- `/calendar` - Task calendar view

## 🔑 Key Features Explained

### Authentication Flow
1. User signs up with name, email, password
2. Password hashed with bcryptjs
3. JWT token generated on login
4. Token stored in localStorage
5. Included in Authorization header for protected routes

### Role-Based Access
- **Admin**: Can create projects, manage members, delete projects
- **Member**: Can view projects, create/update tasks, view dashboard

### Task Management
- Tasks belong to projects
- Can be assigned to project members
- Support multiple priorities and due dates
- Real-time status updates

## 💾 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin/Member),
  createdAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  admin: ObjectId (User),
  members: [ObjectId (User)],
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  status: String (Pending/In Progress/Completed),
  priority: String (Low/Medium/High),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Deploy to Railway

1. **Backend Deployment**
   - Push backend code to GitHub
   - Connect to Railway
   - Set environment variables
   - Deploy

2. **Frontend Deployment**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or Railway
   - Update VITE_API_URL to production backend URL

## 🧪 Testing

### Test User Accounts
```
Admin User:
Email: admin@example.com
Password: admin123

Member User:
Email: member@example.com
Password: member123
```

## 📝 Usage

1. **Sign Up**: Create new account
2. **Create Project**: Click "New Project" in sidebar
3. **Add Members**: Click "Add Member" in project (Admin only)
4. **Create Tasks**: Click "New Task" in project
5. **Manage Tasks**: Drag cards or use dropdown to change status
6. **View Dashboard**: See overview of all projects and tasks

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify connection string format

### API Connection Error
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check CORS settings in backend

### Token Error
- Clear localStorage and login again
- Ensure JWT_SECRET is set in backend .env

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Guide](https://mongoosejs.com)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Built with ❤️ for team collaboration**
