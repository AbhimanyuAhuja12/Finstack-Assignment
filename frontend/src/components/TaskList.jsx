"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp, Filter, MoreHorizontal, Edit, Trash2, Copy, CheckCircle } from "lucide-react"
import EditTaskModal from "./EditTaskModal"

const TaskList = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  filters,
  setFilters,
  sortConfig,
  setSortConfig,
}) => {
  const [showFilters, setShowFilters] = useState({})
  const [editingTask, setEditingTask] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [noteValue, setNoteValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(null)
  const dropdownRef = useRef(null)
  const filterRefs = useRef({})

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close action dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null)
      }

      Object.keys(showFilters).forEach((filterKey) => {
        if (
          showFilters[filterKey] &&
          filterRefs.current[filterKey] &&
          !filterRefs.current[filterKey].contains(event.target)
        ) {
          setShowFilters((prev) => ({ ...prev, [filterKey]: false }))
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showFilters])

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

  const handleNoteEdit = (task) => {
    setEditingNote(task.id)
    setNoteValue(task.note || "")
  }

  const handleNoteSave = async (taskId) => {
    await onUpdateTask(taskId, { note: noteValue })
    setEditingNote(null)
    setNoteValue("")
  }

  const handleNoteCancel = () => {
    setEditingNote(null)
    setNoteValue("")
  }

  const handleStatusChange = async (taskId) => {
    await onUpdateTask(taskId, { status: "Closed" })
    setShowDropdown(null)
  }

  const handleDuplicate = (task) => {
    onDuplicateTask(task)
    setShowDropdown(null)
  }

  const SortableHeader = ({ column, children }) => (
    <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="flex items-center space-x-1 md:space-x-2">
        <button onClick={() => handleSort(column)} className="flex items-center space-x-1 hover:text-gray-700">
          <span className="truncate">{children}</span>
          {sortConfig.key === column &&
            (sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
        </button>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFilter(column)
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <Filter className="w-3 h-3" />
          </button>
        </div>
      </div>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
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
              <th className="px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            {/* Filter Row */}
            <tr className="bg-gray-25">
              <td className="px-2 md:px-4 py-2 relative" ref={(el) => (filterRefs.current.date = el)}>
                {showFilters.date && (
                  <input
                    type="date"
                    className="w-full text-xs border border-gray-300 rounded px-1 md:px-2 py-1"
                    onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
                  />
                )}
              </td>
              <td className="px-2 md:px-4 py-2 relative" ref={(el) => (filterRefs.current.entity_name = el)}>
                {showFilters.entity_name && (
                  <select
                    className="w-full text-xs border border-gray-300 rounded px-1 md:px-2 py-1"
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
              <td className="px-2 md:px-4 py-2 relative" ref={(el) => (filterRefs.current.task_type = el)}>
                {showFilters.task_type && (
                  <select
                    className="w-full text-xs border border-gray-300 rounded px-1 md:px-2 py-1"
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
              <td className="px-2 md:px-4 py-2 relative" ref={(el) => (filterRefs.current.time = el)}>
                {showFilters.time && (
                  <input
                    type="time"
                    className="w-full text-xs border border-gray-300 rounded px-1 md:px-2 py-1"
                    onChange={(e) => setFilters((prev) => ({ ...prev, time: e.target.value }))}
                  />
                )}
              </td>
              <td className="px-2 md:px-4 py-2 relative" ref={(el) => (filterRefs.current.contact_person = el)}>
                {showFilters.contact_person && (
                  <select
                    className="w-full text-xs border border-gray-300 rounded px-1 md:px-2 py-1"
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
              <td className="px-2 md:px-4 py-2"></td>
              <td className="px-2 md:px-4 py-2 relative" ref={(el) => (filterRefs.current.status = el)}>
                {showFilters.status && (
                  <select
                    className="w-full text-xs border border-gray-300 rounded px-1 md:px-2 py-1"
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                )}
              </td>
              <td className="px-2 md:px-4 py-2"></td>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                  {formatDate(task.date)}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-900">
                  <div className="max-w-xs truncate">{task.entity_name}</div>
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span>{getTaskTypeIcon(task.task_type)}</span>
                    <span className="hidden md:inline">{task.task_type}</span>
                  </div>
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                  {formatTime(task.time)}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-900">
                  <div className="max-w-xs truncate">{task.contact_person}</div>
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 text-xs md:text-sm text-gray-900 max-w-xs">
                  {editingNote === task.id ? (
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <input
                        type="text"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        className="flex-1 px-1 md:px-2 py-1 border border-gray-300 rounded text-xs"
                        placeholder="Add note..."
                        autoFocus
                      />
                      <button onClick={() => handleNoteSave(task.id)} className="text-green-600 hover:text-green-800">
                        ✓
                      </button>
                      <button onClick={handleNoteCancel} className="text-red-600 hover:text-red-800">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="truncate">
                      {task.note ? (
                        <span
                          onClick={() => handleNoteEdit(task)}
                          className="cursor-pointer hover:bg-gray-100 px-1 rounded"
                        >
                          {task.note}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleNoteEdit(task)}
                          className="text-teal-600 hover:text-teal-800 text-xs flex items-center space-x-1"
                        >
                          <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs">
                            +
                          </span>
                          <span className="hidden md:inline">Add Note</span>
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-1 md:px-2 py-1 text-xs font-semibold rounded-full ${
                      task.status === "Open" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <button onClick={() => setEditingTask(task)} className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <div className="relative" ref={showDropdown === task.id ? dropdownRef : null}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDropdown(showDropdown === task.id ? null : task.id)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      {showDropdown === task.id && (
                        <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {task.status !== "Closed" && (
                              <button
                                onClick={() => handleStatusChange(task.id)}
                                className="flex items-center space-x-2 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                                <span>Change Status to Closed</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDuplicate(task)}
                              className="flex items-center space-x-2 px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Copy className="w-3 h-3 md:w-4 md:h-4" />
                              <span>Duplicate</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
