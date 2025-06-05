"use client"

import { useState, useEffect } from "react"
import TaskList from "./components/TaskList"
import NewTaskModal from "./components/NewTaskModal"
import Navbar from "./components/Navbar"
import { Plus, Search } from "lucide-react"

// const API_BASE_URL = "http://localhost:5000/api"
const API_BASE_URL = "https://finstack-assignment-1.onrender.com/api"

function App() {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    taskType: "",
    status: "",
    contactPerson: "",
    entityName: "",
  })
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`)
      const data = await response.json()
      // Handle both direct array and paginated response
      setTasks(data.tasks || data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        fetchTasks()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const duplicateTask = async (task) => {
    try {
      const duplicatedTask = {
        entity_name: `${task.entity_name} (Copy)`,
        task_type: task.task_type,
        time: task.time,
        contact_person: task.contact_person,
        note: task.note || "",
        status: "Open",
        priority: task.priority || "Medium",
        date: new Date().toISOString().split("T")[0],
        due_date: task.due_date || null,
      }

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicatedTask),
      })

      if (response.ok) {
        fetchTasks()
      } else {
        console.error("Failed to duplicate task")
      }
    } catch (error) {
      console.error("Error duplicating task:", error)
    }
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.note?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilters =
        (!filters.taskType || task.task_type === filters.taskType) &&
        (!filters.status || task.status === filters.status) &&
        (!filters.contactPerson || task.contact_person.toLowerCase().includes(filters.contactPerson.toLowerCase())) &&
        (!filters.entityName || task.entity_name.toLowerCase().includes(filters.entityName.toLowerCase()))

      return matchesSearch && matchesFilters
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="p-3 md:p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Sales Log Header */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">SALES LOG</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-3 md:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm md:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-auto text-sm md:text-base"
                />
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Use the "T" icon next to the table titles to apply filters
            </p>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredAndSortedTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onDuplicateTask={duplicateTask}
            filters={filters}
            setFilters={setFilters}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        </div>
      </div>

      {/* New Task Modal */}
      {isModalOpen && <NewTaskModal onClose={() => setIsModalOpen(false)} onSubmit={createTask} />}
    </div>
  )
}

export default App
