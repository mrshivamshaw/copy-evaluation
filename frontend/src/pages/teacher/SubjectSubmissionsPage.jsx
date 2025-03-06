import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../../components/Header"



// Mock data for subjects
const mockSubjects = [
  {
    id: "1",
    code: "PCC-CS404",
    name: "Design and Analysis of Algorithm",
    semester: "4",
    submissions: [
      {
        id: "s1",
        studentName: "John Doe",
        studentId: "CS2101",
        submittedAt: "2025-02-20T10:30:00Z",
        status: "pending",
      },
      {
        id: "s2",
        studentName: "Jane Smith",
        studentId: "CS2102",
        submittedAt: "2025-02-21T09:15:00Z",
        status: "evaluated",
        score: 85,
      },
      {
        id: "s3",
        studentName: "Michael Brown",
        studentId: "CS2105",
        submittedAt: "2025-02-22T14:20:00Z",
        status: "pending",
      },
      {
        id: "s4",
        studentName: "Emily Davis",
        studentId: "CS2107",
        submittedAt: "2025-02-23T11:45:00Z",
        status: "evaluated",
        score: 92,
      },
    ],
  },
  {
    id: "2",
    code: "PCC-CS405",
    name: "Operating Systems",
    semester: "4",
    submissions: [
      {
        id: "s5",
        studentName: "Alex Johnson",
        studentId: "CS2103",
        submittedAt: "2025-02-19T14:45:00Z",
        status: "pending",
      },
      {
        id: "s6",
        studentName: "Sarah Wilson",
        studentId: "CS2104",
        submittedAt: "2025-02-20T16:30:00Z",
        status: "evaluated",
        score: 78,
      },
    ],
  },
]

export default function SubjectSubmissionsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the subject data from an API
    const foundSubject = mockSubjects.find((s) => s.id === id)
    setSubject(foundSubject || null)
    setLoading(false)
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="teacher" />
        <main className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading submissions...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="teacher" />
        <main className="container mx-auto p-4">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Subject not found</p>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="teacher" />
      <main className="container mx-auto p-4">
        <div className="mb-6 flex items-center gap-2">
          <button
            className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
            onClick={() => navigate("/teacher/dashboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">{subject.name}</h1>
            <p className="text-gray-600">
              {subject.code} - Semester {subject.semester}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 border-b">
            <h2 className="text-lg font-semibold">All Submissions</h2>
            <p className="text-sm text-gray-600">Total: {subject.submissions.length} submissions</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Submitted At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Score
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
                {subject.submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.status === "evaluated"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.status === "evaluated" ? "Evaluated" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.score ? `${submission.score}/100` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/teacher/evaluate/${submission.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {submission.status === "evaluated" ? "Review" : "Evaluate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

