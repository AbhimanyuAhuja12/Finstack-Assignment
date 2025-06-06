# 📋 Task Management System

A comprehensive task management web application built with React frontend and Flask backend, featuring a modern UI with full CRUD operations, filtering, sorting, and responsive design.

![Task Management System](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.0-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-blue)

## 🌟 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- 📊 **Advanced Filtering** - Filter by date, type, status, contact, and entity
- 🔄 **Smart Sorting** - Multi-column sorting with visual indicators
- 🔍 **Global Search** - Search across all task fields
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Instant UI updates without page refresh
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Python** (v3.8+) - [Download](https://python.org/)
- **MySQL** (v8.0+) - [Download](https://mysql.com/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AbhimanyuAhuja12/Finstack-Assignment.git
```

2. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure Database**
```sql
CREATE DATABASE task_management;
```

4. **Create environment file**
```env
# backend/.env
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=task_management
FLASK_ENV=development
```

5. **Start Backend Server**
```bash
python app.py
# Runs on http://localhost:5000
```

6. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 4.4.5** - Build tool
- **Tailwind CSS 3.3.3** - Styling
- **Lucide React** - Icons

### Backend
- **Flask 2.3.0** - Web framework
- **MySQL 8.0** - Database
- **mysql-connector-python** - Database connector
- **Flask-CORS** - CORS support

## 📁 Project Structure

```
task-management-system/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── NewTaskModal.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/                     # Flask Backend
│   ├── models/
│   │   └── task.py
│   ├── routes/
│   │   └── task_routes.py
│   ├── database/
│   │   └── connection.py
│   ├── app.py
│   └── requirements.txt
└── scripts/                     # Database Scripts
    ├── create_tables.sql
    └── seed_data.sql
```

## 🎯 Key Features

### Task Management
- **Create Tasks** - Add tasks with entity name, type, date/time, contact person, and notes
- **Edit Tasks** - Modify any task details through modal interface
- **Delete Tasks** - Remove tasks with confirmation
- **Duplicate Tasks** - Clone existing tasks with "(Copy)" suffix
- **Status Toggle** - Switch between "Open" and "Closed" status

### Task Types
- 📍 **Meeting** - In-person meetings
- 📞 **Call** - Phone calls
- 📹 **Video Call** - Video conferences

### Advanced Filtering
- **Column Filters** - Filter by any column using dropdown menus
- **Date Range** - Filter tasks by specific dates
- **Multi-criteria** - Combine multiple filters simultaneously
- **Real-time Updates** - Instant filter results

### Sorting & Search
- **Multi-column Sorting** - Sort by any column with visual indicators
- **Global Search** - Search across entity names, contacts, and notes
- **Case-insensitive** - Search works regardless of case

### User Interface
- **Responsive Design** - Mobile-first approach
- **Interactive Elements** - Hover effects and smooth transitions
- **Modal System** - Clean popup interfaces for forms
- **Inline Editing** - Edit notes directly in the table

## 🔧 API Reference

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get all tasks |
| `POST` | `/tasks` | Create new task |
| `GET` | `/tasks/{id}` | Get specific task |
| `PUT` | `/tasks/{id}` | Update task |
| `DELETE` | `/tasks/{id}` | Delete task |

### Example Request

```json
POST /api/tasks
{
  "entity_name": "Acme Corporation",
  "task_type": "Meeting",
  "date": "2024-01-15",
  "time": "14:30",
  "contact_person": "John Doe",
  "note": "Quarterly review meeting",
  "status": "Open"
}
```

## 🗄️ Database Schema

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    task_type ENUM('Meeting', 'Call', 'Video Call') NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    note TEXT,
    status ENUM('Open', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 📱 Usage

1. **Creating Tasks** - Click "New Task" button and fill in the details
2. **Editing** - Click the pencil icon next to any task
3. **Filtering** - Use the filter icons in column headers
4. **Sorting** - Click column headers to sort data
5. **Searching** - Use the global search bar
6. **Managing Notes** - Click on notes to edit inline or use "+" to add



