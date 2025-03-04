"use client"

import { useState } from "react"
import Header from "../../components/Header"
import StudentProfile from "../../components/student/StudentProfile"
import SubjectUpload from "../../components/student/SubjectUpload"

// Mock data
const studentSubjects = [
  { id: "1", code: "PCC-CS404", name: "Design and Analysis of Algorithm", semester: "4", submitted: false },
  { id: "2", code: "PCC-CS405", name: "Operating Systems", semester: "4", submitted: true },
  { id: "3", code: "PCC-CS406", name: "Database Management Systems", semester: "4", submitted: false },
]

export default function StudentDashboard() {
  const [subjects] = useState(studentSubjects)
  const [activeTab, setActiveTab] = useState("subjects")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="student" />
      <main className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold text-blue-800">Student Dashboard</h1>

        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("subjects")}
                className={`py-4 px-1 text-sm font-medium ${
                  activeTab === "subjects"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                My Subjects
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                My Profile
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "subjects" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectUpload key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <StudentProfile />
        )}
      </main>
    </div>
  )
}

