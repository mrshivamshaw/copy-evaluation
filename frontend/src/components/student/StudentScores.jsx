import React, { useEffect } from "react"

import { useState } from "react"
import { apiConneector } from "../../servies/apiConnector"
import toast from "react-hot-toast"
import { studentEndpoints } from "../../servies/api"

// Mock data for student scores
// const mockScores = [
//   {
//     id: "1",
//     code: "PCC-CS404",
//     name: "Design and Analysis of Algorithm",
//     semester: "4",
//     score: 85,
//     maxScore: 100,
//     evaluatedAt: "2025-03-01T14:30:00Z",
//     feedback: "Good understanding of algorithms. Work on time complexity analysis.",
//   },
//   {
//     id: "2",
//     code: "PCC-CS405",
//     name: "Operating Systems",
//     semester: "4",
//     score: 78,
//     maxScore: 100,
//     evaluatedAt: "2025-03-02T10:15:00Z",
//     feedback: "Decent work on process management concepts. Need improvement in memory management.",
//   },
//   {
//     id: "3",
//     code: "PCC-CS406",
//     name: "Database Management Systems",
//     semester: "4",
//     score: 92,
//     maxScore: 100,
//     evaluatedAt: "2025-03-03T16:45:00Z",
//     feedback: "Excellent work on SQL queries and normalization concepts.",
//   },
// ]

export default function StudentScores() {
  const [scores,setScores] = useState([])
  const [expandedFeedback, setExpandedFeedback] = useState(null)


  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await apiConneector("get", studentEndpoints?.getScores)
        // console.log(res?.data?.scores)
        setScores(res?.data?.scores)
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    }
    fetchScores()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const toggleFeedback = (id) => {
    if (expandedFeedback === id) {
      setExpandedFeedback(null)
    } else {
      setExpandedFeedback(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">My Scores</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Subject
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Evaluated On
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Feedback
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {scores.map((score) => (
                <React.Fragment key={score._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{score?.submissionId?.subjectId?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{score?.submissionId?.subjectId?.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${getScoreColor(score?.totalMarks)}`}>
                        {score?.totalMarks}/{score?.maxMarks}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(score?.metadata?.submissionTime)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button onClick={() => toggleFeedback(score.id)} className="text-blue-600 hover:text-blue-800">
                        {expandedFeedback === score.id ? "Hide Feedback" : "View Feedback"}
                      </button>
                    </td> */}
                  </tr>
                  {/* {expandedFeedback === score.id && (
                    <tr className="bg-blue-50">
                      <td colSpan={5} className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-medium mb-1">Teacher's Feedback:</div>
                        <p>{score.feedback}</p>
                      </td>
                    </tr>
                  )} */}
                </React.Fragment>
              ))}
            </tbody>
            {
              scores.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-sm text-gray-700">
                      No scores found
                    </td>
                  </tr>
                </tbody>
              )
            }
          </table>
        </div>
      </div>

      {
        scores.length > 0 && (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Performance Summary</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4 bg-blue-50">
                <div className="text-sm text-gray-500 mb-1">Average Score</div>
                <div className="text-2xl font-bold text-blue-700">
                  {(scores.reduce((sum, score) => sum + score?.totalMarks, 0) / scores.length).toFixed(1)}
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-green-50">
                <div className="text-sm text-gray-500 mb-1">Highest Score</div>
                <div className="text-2xl font-bold text-green-700">{Math.max(...scores.map((score) => score?.totalMarks))}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {scores.find((score) => score?.totalMarks === Math.max(...scores.map((s) => s?.totalMarks)))?.submissionId?.subjectId?.name}
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-purple-50">
                <div className="text-sm text-gray-500 mb-1">Total Subjects Evaluated</div>
                <div className="text-2xl font-bold text-purple-700">{scores.length}</div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

