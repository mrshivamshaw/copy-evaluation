import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../../components/Header"

export default function EvaluatePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [marks, setMarks] = useState({
    "1.I": "",
    "1.II": "",
    "1.III": "",
    "1.IV": "",
    "1.V": "",
    "1.VI": "",
    "1.VII": "",
    "1.VIII": "",
    "1.IX": "",
    "1.X": "",
  })
  const [totalMarks, setTotalMarks] = useState("0")
  const [maxMarks] = useState("70")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(22)
  const [zoom, setZoom] = useState(50)


  const handleMarkChange = (question, value) => {
    const newMarks = { ...marks, [question]: value }
    setMarks(newMarks)

    // Calculate total marks
    const total = Object.values(newMarks)
      .filter(Boolean)
      .reduce((sum, mark) => sum + Number.parseInt(mark || "0", 10), 0)

    setTotalMarks(total.toString())
  }

  const handleSave = () => {
    // In a real app, you would save the evaluation to the backend
    alert("Evaluation saved successfully!")
  }

  const handleSubmit = () => {
    // In a real app, you would submit the evaluation to the backend
    alert("Evaluation submitted successfully!")
    navigate("/teacher/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="teacher" />
      <main className="container mx-auto p-4">
        <div className="mb-4 flex items-center gap-2">
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
          <h1 className="text-2xl font-bold text-blue-800">
            Subject: <span className="text-blue-600">4416 - Design and Analysis of Algorithm(PCC-CS404)</span>
          </h1>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-800 p-4 text-white">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm font-medium">Guidelines</span>
            </div>
            <div>
              <span className="text-sm font-medium">9U5uqcmn</span>
            </div>
            <div>
              <span className="text-sm font-medium">Start at: 14:08:37</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md bg-gray-200 py-1 px-3 text-sm font-medium text-gray-800 hover:bg-gray-300">
              HE Instruction
            </button>
            <button className="rounded-md bg-green-600 py-1 px-3 text-sm font-medium text-white hover:bg-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 inline h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Question Paper
            </button>
            <button className="rounded-md bg-orange-500 py-1 px-3 text-sm font-medium text-white hover:bg-orange-600">
              Problem Script
            </button>
            <button
              className="rounded-md bg-green-600 py-1 px-3 text-sm font-medium text-white hover:bg-green-700"
              onClick={handleSave}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 inline h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save
            </button>
            <button
              className="rounded-md bg-red-600 py-1 px-3 text-sm font-medium text-white hover:bg-red-700"
              onClick={handleSubmit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 inline h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Lock & Submit
            </button>
          </div>
        </div>

        <p className="mb-4 rounded-lg bg-blue-700 p-2 text-center text-white">
          Please click on the Save button for partial saving of the evaluation of the current script
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="rounded-lg border bg-white shadow-sm lg:col-span-1">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Total Qns: 33</span>
                <span className="text-sm font-medium">
                  Marks: {totalMarks}/{maxMarks}
                </span>
              </div>

              <div className="overflow-hidden rounded-md border">
                <div className="grid grid-cols-4 bg-gray-200 p-2 text-sm font-medium">
                  <div>Question</div>
                  <div>Marks</div>
                  <div>Not Attempted</div>
                  <div>Max Marks</div>
                </div>

                <div className="divide-y">
                  {Object.keys(marks).map((question, index) => (
                    <div key={index} className={`grid grid-cols-4 p-2 text-sm ${index % 2 === 0 ? "bg-gray-100" : ""}`}>
                      <div>{question}</div>
                      <div>
                        <input
                          type="number"
                          value={marks[question]}
                          onChange={(e) => handleMarkChange(question, e.target.value)}
                          className="h-8 w-16 rounded border border-gray-300 px-2"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <input type="checkbox" className="h-4 w-4" />
                      </div>
                      <div>/1</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm lg:col-span-3">
            <div className="p-0">
              <div className="flex h-[600px] items-center justify-center bg-white">
                <canvas
                  width={800}
                  height={600}
                  className="max-h-full max-w-full"
                  style={{ border: "1px solid #ddd" }}
                />
              </div>

              <div className="flex items-center justify-between border-t bg-blue-50 p-2">
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                  <span className="text-sm">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                      />
                    </svg>
                  </button>
                  <span className="text-sm">{zoom}%</span>
                  <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

