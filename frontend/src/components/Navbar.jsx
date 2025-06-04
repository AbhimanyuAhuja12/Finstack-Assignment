"use client"

import { useState } from "react"
import { Search, ChevronDown, Bell, MessageSquare, Calendar } from 'lucide-react'

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <header className="bg-teal-700 text-white">
      {/* Top section with logo and user info */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-bold text-sm">PC</span>
            </div>
            <span className="text-lg font-semibold">PRIVATE CIRCLE</span>
          </div>
        </div>

        {/* Center search bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Companies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Right side user info and icons */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button className="relative p-2 hover:bg-teal-600 rounded-md">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-teal-600 rounded-md">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="relative p-2 hover:bg-teal-600 rounded-md">
              <Bell className="w-5 h-5" />
             
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium">Firstname Lastname</div>
              <div className="text-xs text-teal-200">Company Name Private Limi...</div>
            </div>
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bottom navigation menu */}
      <div className="px-6 py-2 border-t border-teal-600">
        <nav className="flex space-x-8">
          <a href="#" className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            <span>DASHBOARD</span>
            <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#" className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            <span>COMPANIES</span>
            <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#" className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            <span>FUNDS</span>
            <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#" className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            <span>HNIs</span>
            <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#" className="py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            MESSAGING
          </a>
          <a href="#" className="py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            MEETINGS
          </a>
          <a href="#" className="py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            NOTES
          </a>
          <a href="#" className="py-2 text-sm font-medium hover:text-teal-200 border-b-2 border-transparent hover:border-teal-200">
            DOCUMENTS
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar