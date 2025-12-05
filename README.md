# Voice-Enabled Task Tracker

A full-stack task management application with intelligent voice input capabilities. Built with React, Node.js, Express, and MySQL.

## 🔗 Quick Links

**Live Demo**: https://voiceflow-task-tracker.vercel.app/  
**GitHub Repository**: https://github.com/FarhanUsmanShaikh/VoiceFlow

**Demo Videos**:
- [Full Features Showcase](https://drive.google.com/file/d/13TOtJILG4PPWw4f7STrwcmEmUi7qqdE1/view?usp=sharing)
- [Voice Input Showcase (3+ Examples)](https://drive.google.com/file/d/1pCOBM-crbK4aCtXoo1qo7kkGhVZggQKJ/view?usp=sharing)

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Setup](#-project-setup)
4. [Usage](#-usage)
5. [API Documentation](#-api-documentation)
6. [Design Decisions & Assumptions](#-design-decisions--assumptions)
7. [AI Tools Usage](#-ai-tools-usage)
8. [Known Limitations](#-known-limitations)
9. [Future Enhancements](#-future-enhancements)

---

## 🎯 Features

### Task Management
- **Create tasks manually** with title, description, priority, status, and due date
- **Create tasks using voice input** - speak naturally and let AI extract task details
- **View tasks** in Kanban board or list view
- **Drag-and-drop** tasks between status columns (To Do → In Progress → Done)
- **Edit tasks** - update any field at any time
- **Delete tasks** with confirmation dialog
- **Search and filter** tasks by status, priority, and due date

### Voice Input (Main Differentiator) 🎤
- **Speech-to-Text** using Web Speech API (browser-native, no API key required)
- **Intelligent parsing** extracts:
  - Title from main action/purpose
  - Due dates (relative: "tomorrow", "next Monday"; absolute: "Jan 20")
  - Priority ("urgent", "high priority", "low priority")
  - Status (defaults to "To Do")
- **Review before saving** - see raw transcript alongside parsed fields
- **Edit parsed fields** before creating the task
- **Graceful handling** - missing fields use sensible defaults

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Drag-and-Drop**: @dnd-kit 6.3.1
- **HTTP Client**: Axios 1.13.2
- **Build Tool**: Vite 7.2.5
- **Animations**: Framer Motion 11.x
- **Speech-to-Text**: Web Speech API (browser-native, no API key required)

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js 5.2.1
- **Database**: MySQL 8.0+
- **Validation**: Joi 18.0.2
- **NLP/Date Parsing**: Chrono-node 2.9.0
- **CORS**: CORS 2.8.5

### Key Libraries
- **Chrono-node**: Natural language date parsing (handles "tomorrow", "next Monday", "Jan 20")
- **@dnd-kit**: Modern drag-and-drop for Kanban board
- **Joi**: Schema validation for API endpoints
- **Web Speech API**: Browser-native speech recognition (Chrome, Edge, Safari)

## � Prroject Setup

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/))
- **Modern browser** with Web Speech API support (Chrome, Edge, or Safari)
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/FarhanUsmanShaikh/VoiceFlow.git
cd VoiceFlow
```

### 2. Backend Setup

**Note:** The database will be created automatically! No manual SQL commands needed.

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=task_tracker
# DB_PORT=3306
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000

# Start the server (database auto-creates!)
npm run dev
```

**The backend will automatically:**
- ✅ Create the `task_tracker` database if it doesn't exist
- ✅ Create the `tasks` table with proper schema
- ✅ Add 6 sample tasks if the table is empty

The backend server will run on `http://localhost:5000`

**You should see:**
```
📦 Initializing database...
✅ Database 'task_tracker' ready
✅ Tasks table ready
📝 Adding sample data...
✅ Sample data added
✅ Database initialization complete

✅ Database connected successfully
🚀 Server running on port 5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env if needed
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎮 Usage

### Manual Task Creation
1. Click "Add Task" button
2. Fill in the form fields
3. Click "Create Task"

### Voice Task Creation
1. Click "Voice Input" button
2. Click the microphone icon
3. Speak naturally, e.g., "Send project proposal to client by next Wednesday, high priority"
4. Review the parsed fields
5. Edit if needed
6. Click "Create Task"

### Task Management
- **View modes**: Toggle between Kanban board and list view
- **Drag-and-drop**: In Kanban view, drag tasks between columns to update status
- **Edit**: Click any task to open the edit form
- **Delete**: Click the delete icon and confirm
- **Search**: Use the search bar to filter by title or description
- **Filter**: Use dropdowns to filter by status or priority

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Endpoints

#### 1. Get All Tasks
**Method**: `GET /tasks`

**Query Parameters:**
- `status` (optional): Filter by status (`todo`, `in_progress`, `done`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`, `urgent`)
- `search` (optional): Search in title and description

**Example Request:**
```bash
GET /api/tasks?status=todo&priority=high
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Complete project proposal",
      "description": "Write and submit the Q1 project proposal",
      "priority": "high",
      "status": "todo",
      "due_date": "2025-12-05",
      "created_at": "2025-12-02T10:30:00.000Z",
      "updated_at": "2025-12-02T10:30:00.000Z"
    }
  ]
}
```

---

#### 2. Get Single Task
**Method**: `GET /tasks/:id`

**Path Parameters:**
- `id` (required): Task ID

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete project proposal",
    "priority": "high",
    "status": "todo",
    "due_date": "2025-12-05"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task with ID 999 not found"
}
```

---

#### 3. Create Task
**Method**: `POST /tasks`

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description (optional)",
  "priority": "medium",
  "status": "todo",
  "dueDate": "2025-12-10"
}
```

**Field Validation:**
- `title` (required): String, 1-255 characters
- `description` (optional): String
- `priority` (optional): Enum (`low`, `medium`, `high`, `urgent`), default: `medium`
- `status` (optional): Enum (`todo`, `in_progress`, `done`), default: `todo`
- `dueDate` (optional): ISO date string (YYYY-MM-DD)

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 7,
    "title": "Task title",
    "priority": "medium",
    "status": "todo"
  }
}
```

---

#### 4. Update Task
**Method**: `PUT /tasks/:id`

**Request Body** (at least one field required):
```json
{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "urgent"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {...}
}
```

---

#### 5. Delete Task
**Method**: `DELETE /tasks/:id`

**Example Response:** `204 No Content`

---

#### 6. Parse Voice Transcript (Voice Input Feature)
**Method**: `POST /tasks/voice`

**Request Body:**
```json
{
  "transcript": "Send project proposal to client by next Wednesday, high priority"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Transcript parsed successfully",
  "data": {
    "transcript": "Send project proposal to client by next Wednesday, high priority",
    "parsed": {
      "title": "Send project proposal to client",
      "description": null,
      "priority": "high",
      "status": "todo",
      "dueDate": "2025-12-10"
    }
  }
}
```

**Note:** This endpoint only parses the transcript. The frontend displays the parsed data for user review, then calls `POST /tasks` to create the task.

---

### HTTP Status Codes

- `200 OK`: Successful GET or PUT request
- `201 Created`: Successful POST request (resource created)
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error or malformed request
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## 🏗 Project Structure

```
voice-task-tracker/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   ├── services/
│   │   │   └── taskService.js
│   │   ├── utils/
│   │   │   └── nlpParser.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── DraggableTaskCard.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── VoiceTaskReview.jsx
│   │   │   └── SearchFilter.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── taskService.js
│   │   ├── types/
│   │   │   └── task.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🎨 Design Decisions & Assumptions

### Architecture Decisions

#### 1. Separation of Concerns
- **Frontend**: React SPA with component-based architecture
- **Backend**: Express.js with MVC pattern (Models, Controllers, Services)
- **Database**: MySQL with proper schema design and indexes
- **Rationale**: Clear separation makes the codebase maintainable, testable, and scalable

#### 2. RESTful API Design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent response format across all endpoints
- Proper status codes (200, 201, 204, 400, 404, 500)
- **Rationale**: Predictable, industry-standard API design

#### 3. Component-Based UI
- Modular React components (TaskBoard, TaskCard, TaskForm, etc.)
- Reusable components with props
- Single responsibility principle
- **Rationale**: Easier to maintain, test, and extend

### Voice Input Decisions

#### 1. Web Speech API
- **Choice**: Browser-native Web Speech API
- **Alternatives Considered**: Google Cloud Speech-to-Text, AWS Transcribe
- **Rationale**: 
  - No API keys or costs required
  - Low latency (real-time processing)
  - Good accuracy for English
  - Simpler setup for users

#### 2. Chrono-node for Date Parsing
- **Choice**: Chrono-node library
- **Rationale**:
  - Robust natural language date parsing
  - Handles relative dates ("tomorrow", "next Monday", "in 3 days")
  - Handles absolute dates ("Jan 20", "15th December")
  - Well-maintained with good documentation

#### 3. User Review Before Save
- **Decision**: Always show raw transcript alongside parsed fields
- **Rationale**:
  - Transparency: Users see exactly what was captured
  - Accuracy: Users can correct any parsing errors
  - Trust: Users understand how the system interpreted their input

#### 4. NLP Parser Design
- **Approach**: Regex-based extraction with Chrono-node for dates
- **Extraction Order**: 
  1. Due dates (using Chrono-node)
  2. Priority keywords (urgent, high, low, medium)
  3. Status keywords (in progress, done, todo)
  4. Title (remove dates, priorities, filler words)
- **Rationale**: Simple, fast, and effective for the scope of this project

### Database Decisions

#### 1. MySQL
- **Choice**: MySQL 8.0+
- **Alternatives Considered**: PostgreSQL, MongoDB
- **Rationale**:
  - Reliable and well-documented
  - Suitable for structured task data
  - ACID compliance for data integrity
  - Easy to set up and manage

#### 2. Schema Design
- Single `tasks` table with proper data types
- Indexes on frequently queried fields (status, priority, due_date)
- Timestamps for created_at and updated_at
- **Rationale**: Simple, efficient, and meets all requirements

#### 3. Automatic Database Setup
- **Decision**: Backend auto-creates database and tables on startup
- **Rationale**: Simplifies setup for users, reduces manual steps

### UI/UX Decisions

#### 1. Dual View Modes
- **Kanban Board**: Visual, drag-and-drop interface
- **List View**: Detailed table view with all fields
- **Rationale**: Different users prefer different views for different tasks

#### 2. Dark Mode
- **Decision**: Implement complete dark theme
- **Rationale**: 
  - Modern UX expectation
  - Reduces eye strain
  - Professional appearance

#### 3. Drag-and-Drop
- **Library**: @dnd-kit
- **Rationale**: Modern, accessible, better performance than alternatives

### Assumptions

1. **Single-user application**: No authentication or multi-user support needed
2. **English language**: Voice input and NLP parsing optimized for English
3. **Desktop-first**: Primary use case is desktop (mobile is responsive but not optimized)
4. **Modern browser**: Users have Chrome, Edge, or Safari with Web Speech API support
5. **Internet connection**: Required for Web Speech API
6. **Microphone access**: Users will grant microphone permissions
7. **Clear speech**: Users speak clearly with minimal background noise

## 🤖 AI Tools Usage

### Tools Used

**Claude (Anthropic)** - Primary AI Assistant
- Architecture guidance and design decisions
- Code generation and boilerplate
- Debugging and problem-solving
- Documentation writing
- UI/UX enhancements and animations

**GitHub Copilot** - Code Completion
- Autocomplete and code suggestions
- Boilerplate generation

### Key Learnings

**Technical Skills Acquired:**
- Full-stack development from database to UI
- React hooks (useState, useEffect, useRef)
- Web Speech API and browser-native features
- Natural language processing with Chrono-node
- Modern drag-and-drop with @dnd-kit
- RESTful API design and validation
- Tailwind CSS and dark mode implementation

**Best Practices Learned:**
- Separation of concerns and modular architecture
- Component reusability and single responsibility
- Comprehensive error handling
- Client and server-side validation
- Consistent API response formats
- Clear code organization and documentation

**How AI Tools Helped:**
- Accelerated development
- Quick access to architecture recommendations
- Rapid boilerplate generation
- Faster debugging with AI suggestions
- More focus on business logic and UX
- Exposure to best practices and patterns

**Important Note:** While AI tools accelerated development, I ensured to understand every piece of code and made deliberate design decisions. AI tools are powerful accelerators, not replacements for understanding.

## ⚠️ Known Limitations

### Voice Input Limitations
1. **Internet Required**: Web Speech API uses Google's servers, requires internet connection
2. **Accuracy Varies**: Recognition accuracy depends on:
   - Accent and pronunciation
   - Background noise
   - Microphone quality
   - Speaking speed and clarity
3. **Browser Support**: Limited to Chrome, Edge, and Safari (no Firefox support)
4. **Language**: Only English is supported

### Date Parsing Limitations
1. **Edge Cases**: May not handle complex relative dates (e.g., "the day after the day after tomorrow")
2. **Ambiguity**: "Next Friday" could mean this week or next week depending on context
3. **Time Zones**: All dates use server's local timezone
4. **Past Dates**: Automatically adjusts past dates to next year (may not always be desired)

### Application Limitations
1. **Single-User**: No authentication or multi-user support
2. **No Offline Mode**: Requires internet connection for all features
3. **No Real-time Sync**: No WebSocket or real-time collaboration
4. **Desktop-First**: Mobile experience is responsive but not optimized
5. **No Task Assignment**: Cannot assign tasks to team members
6. **No Attachments**: Cannot attach files to tasks
7. **No Notifications**: No email or push notifications for due dates

---

## 🔮 Future Enhancements

### High Priority
1. **User Authentication**
   - Login/signup with email and password
   - JWT-based authentication
   - User profiles

2. **Multi-User Support**
   - Task assignment to team members
   - Shared workspaces
   - Permissions and roles

3. **Notifications**
   - Email notifications for due dates
   - Browser push notifications
   - Reminder system

4. **Mobile App**
   - React Native mobile application
   - Native voice input
   - Offline mode with sync

### Medium Priority
5. **Task Categories/Projects**
   - Organize tasks into projects
   - Color-coded categories
   - Project-level views

6. **Recurring Tasks**
   - Daily, weekly, monthly recurrence
   - Custom recurrence patterns
   - Auto-generation of recurring tasks

7. **Task Attachments**
   - File uploads (images, documents)
   - Cloud storage integration
   - Preview attachments

8. **Advanced NLP**
   - Better context understanding
   - Multi-language support
   - More complex date parsing
   - Extract descriptions from voice input

### Low Priority
9. **Analytics Dashboard**
   - Task completion rates
   - Productivity metrics
   - Time tracking

10. **Integrations**
    - Calendar sync (Google Calendar, Outlook)
    - Slack notifications
    - Email integration

11. **Collaboration Features**
    - Comments on tasks
    - Task mentions
    - Activity feed

12. **Advanced Filters**
    - Custom filter combinations
    - Saved filter presets
    - Advanced search with operators

---

## 📝 License

This project is created for educational purposes as part of an SDE 1 assignment.

---

**Last Updated**: December 5, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅