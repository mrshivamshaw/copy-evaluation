"use client"

import { useState } from "react"
import Header from "../../components/Header"
import SubjectList from "../../components/admin/SubjectList"
import TeacherAssignment from "../../components/admin/TeacherAssignment"

// Mock data
const initialSubjects = [
  { id: "1", code: "PCC-CS404", name: "Design and Analysis of Algorithm", semester: "4" },
  { id: "2", code: "PCC-CS405", name: "Operating Systems", semester: "4" },
  { id: "3", code: "PCC-CS406", name: "Database Management Systems", semester: "4" },
]

export default function AdminDashboard() {
  const [subjects, setSubjects] = useState(initialSubjects)
  const [newSubject, setNewSubject] = useState({ code: "", name: "", semester: "" })
  const [activeTab, setActiveTab] = useState("subjects")

  const addSubject = () => {
    if (newSubject.code && newSubject.name && newSubject.semester) {
      setSubjects([
        ...subjects,
        {
          id: (subjects.length + 1).toString(),
          code: newSubject.code,
          name: newSubject.name,
          semester: newSubject.semester,
        },
      ])
      setNewSubject({ code: "", name: "", semester: "" })
    }
  }

  const removeSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="admin" />
      <main className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold text-blue-800">Super Admin Dashboard</h1>

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
                Manage Subjects
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`py-4 px-1 text-sm font-medium ${
                  activeTab === "assignments"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Assign Subjects
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "subjects" ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">Add New Subject</h2>
              <p className="mb-4 text-sm text-gray-600">Enter the details of the new subject</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="subject-code" className="block text-sm font-medium text-gray-700">
                    Subject Code
                  </label>
                  <input
                    id="subject-code"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="e.g. PCC-CS407"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700">
                    Subject Name
                  </label>
                  <input
                    id="subject-name"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="e.g. Computer Networks"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                    Semester
                  </label>
                  <input
                    id="semester"
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newSubject.semester}
                    onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
              <button
                onClick={addSubject}
                className="mt-4 rounded-md bg-blue-700 py-2 px-4 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Subject
              </button>
            </div>

            <SubjectList subjects={subjects} onRemove={removeSubject} />
          </div>
        ) : (
          <TeacherAssignment subjects={subjects} />
        )}
      </main>
    </div>
  )
}

