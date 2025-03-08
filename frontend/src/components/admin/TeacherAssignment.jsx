import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAssignedSubjectList, assignSubject, unassignSubject } from "../../servies/operations/admin"
import toast from "react-hot-toast"

export default function TeacherAssignment({ subjects }) {
  const [teacherEmail, setTeacherEmail] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const { assignedSubjectList, loading } = useSelector((state) => ({
    assignedSubjectList: state.admin.assignedSubjectList || [], // Default to empty array if null/undefined
    loading: state.ui.loading, // Assuming UIslice has a loading state
  }));
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAssignedSubjectList())
  }, [dispatch])

  const handleAssignSubject = async() => {
    if (!teacherEmail || !selectedSubject) {
      toast.error("All fields are required");
      return;
    }
    try {
      const result = await dispatch(assignSubject({
        id: selectedSubject, 
        email: teacherEmail
      }));
      
      if (result === true) {
        setSelectedSubject("")
        setTeacherEmail("")
        toast.success("Subject assigned successfully");
      }
    } catch (error) {
      console.error("Failed to assign subject:", error);
      toast.error("Failed to assign subject");
    }
  }

  const handleRemoveAssignment = (id,email) => {    
    dispatch(unassignSubject({id,email}));    
  }

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s._id === subjectId)
    return subject ? `${subject.code} - ${subject.name}` : "Unknown Subject"
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Assign Subject to Teacher</h2>
        <p className="mb-4 text-sm text-gray-600">Enter teacher's email and select a subject to assign</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700">
              Teacher Email
            </label>
            <input
              id="teacher-email"
              type="email"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="teacher@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select a subject</option>
              {subjects && subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleAssignSubject}
          className="mt-4 rounded-md bg-blue-700 py-2 px-4 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={!teacherEmail || !selectedSubject}
        >
          Assign Subject
        </button>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Current Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Teacher Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Subject
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : assignedSubjectList?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No assignments yet
                  </td>
                </tr>
              ) : (
                assignedSubjectList?.map((assignment, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {assignment?.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getSubjectName(assignment?.subjectId)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveAssignment(assignment?.subjectId,assignment?.email)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}