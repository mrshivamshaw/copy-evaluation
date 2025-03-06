import React from "react"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../../components/Header"

export default function EvaluatePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  // Replace the marks state with these states for dynamic sections and questions
  const [sections, setSections] = useState([
    {
      id: "1",
      name: "Section 1",
      questions: [
        { id: "1.1", number: "I", marks: "", maxMarks: "1", notAttempted: false },
        { id: "1.2", number: "II", marks: "", maxMarks: "1", notAttempted: false },
        { id: "1.3", number: "III", marks: "", maxMarks: "1", notAttempted: false },
      ],
    },
  ])
  const [showSectionControls, setShowSectionControls] = useState(false)
  const [newSectionName, setNewSectionName] = useState("")
  const [editingSectionId, setEditingSectionId] = useState(null)
  const [newQuestionCount, setNewQuestionCount] = useState(1)

  const [totalMarks, setTotalMarks] = useState("0")
  const [maxMarks, setMaxMarks] = useState("0")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(22)
  const [zoom, setZoom] = useState(100)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState("#FF0000") // Red pen by default
  const [penSize, setPenSize] = useState(3)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const pdfCanvasRef = useRef(null)

  // Initialize canvas for PDF and annotations
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 1100

    // Get context and set default styles
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = penColor
    ctx.lineWidth = penSize
    contextRef.current = ctx

    // Draw sample PDF content
    drawSamplePdf()
  }, [penColor, penSize])

  // Update pen style when color or size changes
  useEffect(() => {
    if (!contextRef.current) return
    contextRef.current.strokeStyle = penColor
    contextRef.current.lineWidth = penSize
  }, [penColor, penSize])

  // Draw a sample PDF for demonstration
  const drawSamplePdf = () => {
    const pdfCanvas = pdfCanvasRef.current
    if (!pdfCanvas) return

    const ctx = pdfCanvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    pdfCanvas.width = 800
    pdfCanvas.height = 1100

    // Fill with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height)

    // Draw header
    ctx.fillStyle = "#000000"
    ctx.font = "24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Design and Analysis of Algorithm", pdfCanvas.width / 2, 50)

    ctx.font = "18px Arial"
    ctx.fillText("End Semester Examination - 2025", pdfCanvas.width / 2, 80)

    // Draw student info
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Student ID: CS2101", 50, 120)
    ctx.fillText("Name: John Doe", 50, 140)

    // Draw question sections
    ctx.font = "16px Arial"
    ctx.fillText("Question 1:", 50, 180)

    ctx.font = "14px Arial"
    ctx.fillText("Explain the time complexity of the following algorithms:", 70, 210)

    // Draw some sample content
    const sampleText = [
      "I. The time complexity of bubble sort is O(n²) because in the worst case,",
      "   we need to make n iterations, and in each iteration, we perform n-i comparisons.",
      "",
      "II. Quick sort has an average time complexity of O(n log n), but in the worst case,",
      "    it can degrade to O(n²) if the pivot selection is poor.",
      "",
      "III. Binary search has a time complexity of O(log n) because in each step,",
      "     we eliminate half of the remaining elements from consideration.",
    ]

    let y = 240
    for (const line of sampleText) {
      ctx.fillText(line, 70, y)
      y += 20
    }

    // Draw page number
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`Page ${currentPage} of ${totalPages}`, pdfCanvas.width / 2, pdfCanvas.height - 20)

    // Copy the PDF content to the main canvas
    const mainCanvas = canvasRef.current
    if (!mainCanvas) return

    const mainCtx = mainCanvas.getContext("2d")
    if (!mainCtx) return

    mainCtx.drawImage(pdfCanvas, 0, 0)
  }

  // Drawing functions
  const startDrawing = (e) => {
    if (!contextRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing || !contextRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (!contextRef.current) return
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      // In a real app, you would load the previous page of the PDF
      drawSamplePdf()
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
      // In a real app, you would load the next page of the PDF
      drawSamplePdf()
    }
  }

  // Replace the handleMarkChange function
  const handleMarkChange = (sectionId, questionId, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? { ...question, marks: value } : question,
              ),
            }
          : section,
      ),
    )
  }

  // Add these new functions for managing sections and questions
  const handleNotAttemptedChange = (sectionId, questionId, checked) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId
                  ? { ...question, notAttempted: checked, marks: checked ? "0" : question.marks }
                  : question,
              ),
            }
          : section,
      ),
    )
  }

  const handleMaxMarksChange = (sectionId, questionId, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? { ...question, maxMarks: value } : question,
              ),
            }
          : section,
      ),
    )
  }

  const addSection = () => {
    if (!newSectionName.trim()) return

    const newSectionId = (sections.length + 1).toString()
    const newQuestions = Array.from({ length: newQuestionCount }, (_, i) => ({
      id: `${newSectionId}.${i + 1}`,
      number: (i + 1).toString(),
      marks: "",
      maxMarks: "1",
      notAttempted: false,
    }))

    setSections([
      ...sections,
      {
        id: newSectionId,
        name: newSectionName,
        questions: newQuestions,
      },
    ])

    setNewSectionName("")
    setNewQuestionCount(1)
    setShowSectionControls(false)
  }

  const removeSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId))
  }

  const addQuestionToSection = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const newQuestionId = `${sectionId}.${section.questions.length + 1}`
          return {
            ...section,
            questions: [
              ...section.questions,
              {
                id: newQuestionId,
                number: (section.questions.length + 1).toString(),
                marks: "",
                maxMarks: "1",
                notAttempted: false,
              },
            ],
          }
        }
        return section
      }),
    )
  }

  const removeQuestionFromSection = (sectionId, questionId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter((q) => q.id !== questionId),
          }
        }
        return section
      }),
    )
  }

  const updateSectionName = (sectionId, newName) => {
    setSections((prevSections) =>
      prevSections.map((section) => (section.id === sectionId ? { ...section, name: newName } : section)),
    )
    setEditingSectionId(null)
  }

  // Replace the totalMarks state calculation
  const calculateTotalMarks = () => {
    let total = 0
    let max = 0

    sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.marks && !question.notAttempted) {
          total += Number.parseInt(question.marks, 10)
        }
        max += Number.parseInt(question.maxMarks, 10)
      })
    })

    return { total, max }
  }

  const { total: totalMarksCalculated, max: maxMarksCalculated } = calculateTotalMarks()
  useEffect(() => {
    setTotalMarks(totalMarksCalculated.toString())
    setMaxMarks(maxMarksCalculated.toString())
  }, [sections])

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
            {/* Replace the marks display section in the return statement with this */}
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total Questions: {sections.reduce((acc, section) => acc + section.questions.length, 0)}
                </span>
                <span className="text-sm font-medium">
                  Marks: {totalMarksCalculated}/{maxMarksCalculated}
                </span>
              </div>

              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-md font-medium">Question Sections</h3>
                <button
                  onClick={() => setShowSectionControls(!showSectionControls)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  {showSectionControls ? "Cancel" : "Add Section"}
                </button>
              </div>

              {showSectionControls && (
                <div className="mb-4 p-3 border rounded-md bg-gray-50">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                    <input
                      type="text"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      placeholder="e.g. Section A"
                      className="w-full p-1 text-sm border rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                    <input
                      type="number"
                      min="1"
                      value={newQuestionCount}
                      onChange={(e) => setNewQuestionCount(Number.parseInt(e.target.value) || 1)}
                      className="w-full p-1 text-sm border rounded"
                    />
                  </div>
                  <button
                    onClick={addSection}
                    disabled={!newSectionName.trim()}
                    className={`w-full py-1 text-sm rounded ${
                      newSectionName.trim()
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Add Section
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-100 p-2 flex justify-between items-center">
                      {editingSectionId === section.id ? (
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => updateSectionName(section.id, e.target.value)}
                          onBlur={() => setEditingSectionId(null)}
                          autoFocus
                          className="text-sm font-medium p-1 border rounded"
                        />
                      ) : (
                        <h4
                          className="text-sm font-medium cursor-pointer hover:text-blue-600"
                          onClick={() => setEditingSectionId(section.id)}
                        >
                          {section.name}
                        </h4>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addQuestionToSection(section.id)}
                          className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded hover:bg-blue-700"
                        >
                          Add Q
                        </button>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="divide-y">
                      <div className="grid grid-cols-5 bg-gray-200 p-2 text-xs font-medium">
                        <div>Question</div>
                        <div>Marks</div>
                        <div>Not Attempted</div>
                        <div>Max Marks</div>
                        <div></div>
                      </div>

                      {section.questions.map((question) => (
                        <div key={question.id} className="grid grid-cols-5 p-2 text-sm items-center">
                          <div>{question.number}</div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              value={question.marks}
                              onChange={(e) => handleMarkChange(section.id, question.id, e.target.value)}
                              disabled={question.notAttempted}
                              className={`h-8 w-16 rounded border ${
                                question.notAttempted ? "bg-gray-100 text-gray-500" : "border-gray-300"
                              } px-2`}
                            />
                          </div>
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={question.notAttempted}
                              onChange={(e) => handleNotAttemptedChange(section.id, question.id, e.target.checked)}
                              className="h-4 w-4"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              min="1"
                              value={question.maxMarks}
                              onChange={(e) => handleMaxMarksChange(section.id, question.id, e.target.value)}
                              className="h-8 w-16 rounded border border-gray-300 px-2"
                            />
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => removeQuestionFromSection(section.id, question.id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm lg:col-span-3">
            <div className="p-0">
              <div className="relative">
                {/* Hidden canvas for PDF rendering */}
                <canvas ref={pdfCanvasRef} className="hidden" />

                {/* Main canvas for annotations */}
                <div className="flex items-center justify-center bg-gray-100 p-2">
                  <div
                    style={{
                      width: `${(800 * zoom) / 100}px`,
                      height: `${(1100 * zoom) / 100}px`,
                      overflow: "auto",
                    }}
                    className="border border-gray-300 bg-white"
                  >
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{
                        width: "100%",
                        height: "100%",
                        cursor: "crosshair",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t bg-blue-50 p-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md border border-gray-300 p-2 hover:bg-gray-100"
                      onClick={goToPreviousPage}
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
                    <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100" onClick={goToNextPage}>
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
                    <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100" onClick={handleZoomOut}>
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
                    <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-100" onClick={handleZoomIn}>
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
                    <div className="flex items-center gap-1">
                      <button
                        className={`rounded-md border p-2 hover:bg-gray-100 ${penColor === "#FF0000" ? "bg-gray-200" : ""}`}
                        onClick={() => setPenColor("#FF0000")}
                      >
                        <div className="h-3 w-3 rounded-full bg-red-600"></div>
                      </button>
                      <button
                        className={`rounded-md border p-2 hover:bg-gray-100 ${penColor === "#0000FF" ? "bg-gray-200" : ""}`}
                        onClick={() => setPenColor("#0000FF")}
                      >
                        <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                      </button>
                      <button
                        className={`rounded-md border p-2 hover:bg-gray-100 ${penColor === "#000000" ? "bg-gray-200" : ""}`}
                        onClick={() => setPenColor("#000000")}
                      >
                        <div className="h-3 w-3 rounded-full bg-black"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

