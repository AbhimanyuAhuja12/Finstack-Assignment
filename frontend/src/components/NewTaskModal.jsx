"use client"

import { useState, useEffect, useRef } from "react"
import { X, ChevronDown } from "lucide-react"

const NewTaskModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    entity_name: "",
    task_type: "Call",
    time: "",
    contact_person: "",
    note: "",
    status: "Open",
  })
  const [showTaskTypeDropdown, setShowTaskTypeDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const taskTypes = ["Meeting", "Call", "Video Call"]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTaskTypeDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">NEW TASK</h2>
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

    
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Entity name"
              value={formData.entity_name}
              onChange={(e) => handleChange("entity_name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
              readOnly
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
              required
            />
          </div>

          {/* Task Type Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowTaskTypeDropdown(!showTaskTypeDropdown)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between text-sm md:text-base"
            >
              <div className="flex items-center space-x-2">
                <span>{formData.task_type === "Call" ? "📞" : formData.task_type === "Meeting" ? "📍" : "📹"}</span>
                <span>{formData.task_type}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showTaskTypeDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                {taskTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleChange("task_type", type)
                      setShowTaskTypeDropdown(false)
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm md:text-base"
                  >
                    <span>{type === "Call" ? "📞" : type === "Meeting" ? "📍" : "📹"}</span>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number (conditional) */}
          {(formData.task_type === "Call" || formData.task_type === "Video Call") && (
            <div>
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
              />
            </div>
          )}

          {/* Contact Person */}
          <div>
            <input
              type="text"
              placeholder="Contact person"
              value={formData.contact_person}
              onChange={(e) => handleChange("contact_person", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm md:text-base"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm md:text-base"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewTaskModal
