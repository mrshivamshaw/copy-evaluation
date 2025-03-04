"use client"

import { useState } from "react"

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "CS2101",
    semester: "4",
    department: "Computer Science",
    phone: "+1234567890",
  })

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = () => {
    // In a real app, you would save the profile to the backend
    alert("Profile updated successfully!")
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">My Profile</h2>
      <p className="mb-4 text-sm text-gray-600">Update your personal information</p>

      <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-4 md:space-y-0">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
            <img src="/placeholder.svg?height=96&width=96" alt={profile.name} className="h-full w-full object-cover" />
          </div>
          <button className="rounded-md border border-gray-300 py-1 px-3 text-sm text-gray-700 hover:bg-gray-100">
            Change Photo
          </button>
        </div>

        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                id="studentId"
                className="w-full rounded-md border border-gray-300 bg-gray-100 p-2"
                value={profile.studentId}
                onChange={(e) => handleChange("studentId", e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <select
                id="semester"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={profile.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem.toString()}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                id="department"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={profile.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-700 py-2 px-4 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

