"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import SubjectList from "../../components/admin/SubjectList";
import TeacherAssignment from "../../components/admin/TeacherAssignment";
import { addSubject, deleteSubject, getSubjectList } from "../../servies/operations/admin";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [newSubject, setNewSubject] = useState({ code: "", name: "", semester: "" });
  const [activeTab, setActiveTab] = useState("subjects");

  const dispatch = useDispatch();
  const { subjectList, loading } = useSelector((state) => ({
    subjectList: state.admin.subjectList || [], // Default to empty array if null/undefined
    loading: state.ui.loading, // Assuming UIslice has a loading state
  }));

  // Fetch subjects on mount
  useEffect(() => {
    dispatch(getSubjectList());
  }, [dispatch]);

  const addSubjectHandler = async () => {
    if (!newSubject.code || !newSubject.name || !newSubject.semester) {
      toast.error("All fields are required");
      return;
    }

    try {
      const result = await dispatch(addSubject(newSubject));
      if (result === true) {
        setNewSubject({ code: "", name: "", semester: "" }); // Reset form on success
        toast.success("Subject added successfully");
      }
    } catch (error) {
      console.error("Failed to add subject:", error);
      toast.error("Failed to add subject");
    }
  };

  const removeSubject = (id) => {
    dispatch(deleteSubject(id));
  };

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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                onClick={addSubjectHandler}
                className="mt-4 rounded-md bg-blue-700 py-2 px-4 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Subject"}
              </button>
            </div>

            {loading ? (
              <p>Loading subjects...</p>
            ) : subjectList.length === 0 ? (
              <p>No subjects available.</p>
            ) : (
              <SubjectList subjects={subjectList} onRemove={removeSubject} />
            )}
          </div>
        ) : (
          <TeacherAssignment subjects={subjectList} />
        )}
      </main>
    </div>
  );
}