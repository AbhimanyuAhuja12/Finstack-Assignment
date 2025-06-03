"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import EditTaskModal from "./EditTaskModal"

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, filters, setFilters, sortConfig, setSortConfig }) => {
  const [showFilters, setShowFilters] = useState({})
  const [editingTask, setEditingTask] = useState(null)

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const toggleFilter = (column) => {
    setShowFilters((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  const getUniqueValues = (key) => {
    return [...new Set(tasks.map((task) => task[key]).filter(Boolean))]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTaskTypeIcon = (taskType) => {
    switch (taskType) {
      case "Meeting":
        return "📍"
      case "Call":
        return "📞"
      case "Video Call":
        return "📹"
      default:
        return "📋"
    }
  }

  const SortableHeader = ({ column, children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="flex items-center space-x-2">
        <button onClick={() => handleSort(column)} className="flex items-center space-x-1 hover:text-gray-700">
          <span>{children}</span>
          {sortConfig.key === column &&
            (sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
        </button>
        <button onClick={() => toggleFilter(column)} className="text-gray-400 hover:text-gray-600">
          <Filter className="w-3 h-3" />
        </button>
      </div>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader column="date">Date</SortableHeader>
            <SortableHeader column="entity_name">Entity Name</SortableHeader>
            <SortableHeader column="task_type">Task Type</SortableHeader>
            <SortableHeader column="time">Time</SortableHeader>
            <SortableHeader column="contact_person">Contact Person</SortableHeader>
            <SortableHeader column="note">Notes</SortableHeader>
            <SortableHeader column="status">Status</SortableHeader>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          {/* Filter Row */}
          <tr className="bg-gray-25">
            <td className="px-4 py-2">
              {showFilters.date && (
                <input
                  type="date"
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
                />
              )}
            </td>
            <td className="px-4 py-2">
              {showFilters.entity_name && (
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  onChange={(e) => setFilters((prev) => ({ ...prev, entityName: e.target.value }))}
                >
                  <option value="">All</option>
                  {getUniqueValues("entity_name").map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            </td>
            <td className="px-4 py-2">
              {showFilters.task_type && (
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  value={filters.taskType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, taskType: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Call">Call</option>
                  <option value="Video Call">Video Call</option>
                </select>
              )}
            </td>
            <td className="px-4 py-2">
              {showFilters.time && (
                <input
                  type="time"
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  onChange={(e) => setFilters((prev) => ({ ...prev, time: e.target.value }))}
                />
              )}
            </td>
            <td className="px-4 py-2">
              {showFilters.contact_person && (
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  onChange={(e) => setFilters((prev) => ({ ...prev, contactPerson: e.target.value }))}
                >
                  <option value="">All</option>
                  {getUniqueValues("contact_person").map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            </td>
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2">
              {showFilters.status && (
                <select
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              )}
            </td>
            <td className="px-4 py-2"></td>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(task.date)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{task.entity_name}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center space-x-2">
                  <span>{getTaskTypeIcon(task.task_type)}</span>
                  <span>{task.task_type}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatTime(task.time)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{task.contact_person}</td>
              <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                {task.note || <button className="text-teal-600 hover:text-teal-800 text-xs">+ Add Note</button>}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    task.status === "Open" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <button onClick={() => setEditingTask(task)} className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(updates) => {
            onUpdateTask(editingTask.id, updates)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default TaskList
