"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"

const EditTaskModal = ({ task, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    entity_name: task.entity_name || "",
    task_type: task.task_type || "Call",
    time: task.time || "",
    contact_person: task.contact_person || "",
    note: task.note || "",
    status: task.status || "Open",
  })
  const [showTaskTypeDropdown, setShowTaskTypeDropdown] = useState(false)

  const taskTypes = ["Meeting", "Call", "Video Call"]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">EDIT TASK</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleChange("status", "Open")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              formData.status === "Open" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => handleChange("status", "Closed")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              formData.status === "Closed" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Closed
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Entity Name */}
          <div>
            <input
              type="text"
              placeholder="Entity name"
              value={formData.entity_name}
              onChange={(e) => handleChange("entity_name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="flex space-x-2">
            <input
              type="date"
              value={task.date}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              readOnly
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Task Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTaskTypeDropdown(!showTaskTypeDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span>{formData.task_type === "Call" ? "📞" : formData.task_type === "Meeting" ? "📍" : "📹"}</span>
                <span>{formData.task_type}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showTaskTypeDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {taskTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      handleChange("task_type", type)
                      setShowTaskTypeDropdown(false)
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>{type === "Call" ? "📞" : type === "Meeting" ? "📍" : "📹"}</span>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <input
              type="text"
              placeholder="Contact person"
              value={formData.contact_person}
              onChange={(e) => handleChange("contact_person", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Note */}
          <div>
            <textarea
              placeholder="Note (optional)"
              value={formData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              CANCEL
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTaskModal
