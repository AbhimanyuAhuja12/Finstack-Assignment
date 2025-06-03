"use client"

import { useState, useEffect } from "react"
import TaskList from "./components/TaskList"
import NewTaskModal from "./components/NewTaskModal"
import { Plus, Search } from "lucide-react"

const API_BASE_URL = "http://localhost:5000/api"

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
      const taskList = Array.isArray(data) ? data : data.tasks
      setTasks(taskList || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setTasks([]) // fallback to avoid `.filter` crash
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
      {/* Header */}
      <header className="bg-teal-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-bold text-sm">PC</span>
            </div>
            <span className="text-lg font-semibold">PRIVATE CIRCLE</span>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a href="#" className="hover:text-teal-200">
                DASHBOARD
              </a>
              <a href="#" className="hover:text-teal-200">
                COMPANIES
              </a>
              <a href="#" className="hover:text-teal-200">
                FUNDS
              </a>
              <a href="#" className="hover:text-teal-200">
                HNI
              </a>
              <a href="#" className="hover:text-teal-200">
                MESSAGING
              </a>
              <a href="#" className="hover:text-teal-200">
                MEETINGS
              </a>
              <a href="#" className="hover:text-teal-200">
                NOTES
              </a>
              <a href="#" className="hover:text-teal-200">
                DOCUMENTS
              </a>
            </nav>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Firstname Lastname</span>
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Sales Log Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">SALES LOG</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Use the "T" icon next to the table titles to apply filters</p>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredAndSortedTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
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
