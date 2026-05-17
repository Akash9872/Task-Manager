# Backend - Team Task Manager API

Express.js REST API for team task management with MongoDB and JWT authentication.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key_change_in_production
NODE_ENV=development
```

### Run Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## 📋 API Documentation

### Authentication

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as signup
```

### Projects

#### Get All Projects
```
GET /api/projects
Headers: Authorization: Bearer {token}

Response: [project_objects]
```

#### Create Project
```
POST /api/projects
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project description"
}

Response: { message, project }
```

#### Get Project Details
```
GET /api/projects/:id
Headers: Authorization: Bearer {token}
```

#### Update Project
```
PUT /api/projects/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Add Team Member
```
POST /api/projects/:id/members
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "memberEmail": "member@example.com"
}
```

#### Delete Project
```
DELETE /api/projects/:id
Headers: Authorization: Bearer {token}
```

### Tasks

#### Create Task
```
POST /api/tasks
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "projectId": "project_id",
  "priority": "High",
  "dueDate": "2024-12-31",
  "assignedToEmail": "member@example.com"
}
```

#### Get Project Tasks
```
GET /api/tasks/project/:projectId
Headers: Authorization: Bearer {token}
```

#### Update Task
```
PUT /api/tasks/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Medium",
  "dueDate": "2024-12-31"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Headers: Authorization: Bearer {token}
```

### Dashboard

#### Get Dashboard Stats
```
GET /api/dashboard
Headers: Authorization: Bearer {token}

Response:
{
  "projectCount": 5,
  "myTasks": [...],
  "taskStats": {
    "pending": 10,
    "inProgress": 8,
    "completed": 15,
    "total": 33
  },
  "overdueTasks": [...],
  "upcomingTasks": [...]
}
```

## 🗂️ Project Structure

```
backend/
├── models/
│   ├── User.js          # User schema
│   ├── Project.js       # Project schema
│   └── Task.js          # Task schema
├── controllers/
│   ├── authController.js        # Auth logic
│   ├── projectController.js     # Project logic
│   ├── taskController.js        # Task logic
│   └── dashboardController.js   # Dashboard logic
├── routes/
│   ├── auth.js          # Auth endpoints
│   ├── projects.js      # Project endpoints
│   ├── tasks.js         # Task endpoints
│   └── dashboard.js     # Dashboard endpoints
├── middleware/
│   └── auth.js          # JWT verification
├── server.js            # Express app
├── .env                 # Environment variables
└── package.json
```

## 🔐 Middleware

### Authentication Middleware
- Verifies JWT token in `Authorization` header
- Extracts user information
- Passes to next middleware

### Authorization
- Admin-only routes check user role
- Project membership verification
- Task ownership verification

## 🛡️ Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- CORS enabled for frontend
- Protected routes with middleware
- Input validation
- Role-based access control

## 📝 Error Handling

Common error responses:
- `400` - Bad request (validation errors)
- `401` - Unauthorized (no token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error

## 🚀 Deployment

### Railway Deployment
1. Push code to GitHub
2. Connect repo to Railway
3. Set environment variables
4. Deploy

### Environment Variables for Production
```
PORT=5000 (or Railway assigned)
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=strong_secret_key
NODE_ENV=production
```

## 📊 Database Relationships

```
User
├── Creates: Projects (admin)
├── Belongs to: Projects (members)
└── Creates: Tasks

Project
├── Has: One Admin (User)
├── Has: Many Members (Users)
└── Contains: Many Tasks

Task
├── Belongs to: Project
├── Assigned to: User (optional)
└── Created by: User
```

## 🧪 Testing Endpoints

Use tools like Postman, Thunder Client, or curl:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get projects (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/projects
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [JWT Introduction](https://jwt.io)
- [MongoDB Documentation](https://docs.mongodb.com)

---

**Backend API for Team Task Manager**
