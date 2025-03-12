import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import { getAssignedSubjectList } from "../../servies/operations/teacher"
import { useDispatch, useSelector } from "react-redux"




export default function SubjectSubmissionsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [subject, setSubject] = useState(null)
  // const [loading, setLoading] = useState(true)
  const {assignedSubjectList} = useSelector(state => state.teacher)

  useEffect(() => {    
    // First, check if we need to fetch subjects
    if (assignedSubjectList?.length === 0) {
      dispatch(getAssignedSubjectList());
    } else {
      // Only set the subject if we have data and haven't set it yet
      const currentSubject = assignedSubjectList.find(sub => sub?._id === id);
      if (currentSubject) {
        setSubject(currentSubject);
      }
    }
    // Remove 'subject' from dependency array to prevent infinite loop
  }, [assignedSubjectList, id, dispatch]);

  useEffect(() => {
    // console.log("Current subject:", subject);
  }, [subject]);

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
            <h1 className="text-2xl font-bold text-blue-800">{subject?.name}</h1>
            <p className="text-gray-600">
              {subject?.code} - Semester {subject?.semester}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 border-b">
            <h2 className="text-lg font-semibold">All Submissions</h2>
            <p className="text-sm text-gray-600">Total: {subject?.submission?.length} submissions</p>
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
                {subject?.submission?.map((sub,i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sub?.studentId?.firstName + " " + sub?.studentId?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub?.studentId?._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(sub?.submissiondate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sub?.evaluated !== "pending"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {sub?.evaluated !== "pending" ? "Evaluated" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub?.evaluated !== "pending" ? `${sub?.evaluated?.totalMarks}/100` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/teacher/evaluate/${sub._id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {sub?.evaluated !== "pending" ? "Review" : "Evaluate"}
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

