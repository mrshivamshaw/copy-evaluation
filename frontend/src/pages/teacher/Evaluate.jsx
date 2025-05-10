import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
import { apiConneector } from "../../servies/apiConnector";
import { teacherEndpoints } from "../../servies/api";
import { PDFDocument, rgb } from 'pdf-lib';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`


export default function EvaluatePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // submission ID
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [sections, setSections] = useState([]);
  const [showSectionControls, setShowSectionControls] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [newQuestionCount, setNewQuestionCount] = useState(1);

  const [totalMarks, setTotalMarks] = useState("0");
  const [maxMarks, setMaxMarks] = useState("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#FF0000"); // Red pen by default
  const [penSize, setPenSize] = useState(3);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDrawingStroke, setIsDrawingStroke] = useState(false); // Active drawing state


  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const annotationLayerRef = useRef({});
  const pdfContainerRef = useRef(null);

  // Fetch evaluation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiConneector("get",teacherEndpoints?.getEvaluationData + id);
        const { submission, evaluation, isNewEvaluation } = response.data;
        
        // Set PDF URL
        setPdfUrl(submission.pdfLink);
        
        // Set sections based on evaluation data
        setSections(evaluation.sections || []);
        
        // Set metadata
        setTotalMarks(evaluation.totalMarks.toString());
        setMaxMarks(evaluation.maxMarks.toString());
        
        if (evaluation.metadata) {
          setCurrentPage(evaluation.metadata.currentPage || 1);
          setTotalPages(evaluation.metadata.totalPages || 1);
        }
        
        // Store the full evaluation data for later use
        setEvaluationData({
          submission,
          evaluation,
          isNewEvaluation
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching evaluation data:", error);
        toast.error("Failed to load evaluation data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);



  // Calculate total marks whenever sections change
  useEffect(() => {
    const { total, max } = calculateTotalMarks();
    setTotalMarks(total.toString());
    setMaxMarks(max.toString());
  }, [sections]);

  
  // Handle mark change
  const handleMarkChange = (sectionId, questionId, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? { ...question, marks: value } : question
              ),
            }
          : section
      )
    );
  };

  // Handle not attempted change
  const handleNotAttemptedChange = (sectionId, questionId, checked) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId
                  ? { ...question, notAttempted: checked, marks: checked ? "0" : question.marks }
                  : question
              ),
            }
          : section
      )
    );
  };

  // Handle max marks change
  const handleMaxMarksChange = (sectionId, questionId, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? { ...question, maxMarks: value } : question
              ),
            }
          : section
      )
    );
  };

  // Section management functions
  const addSection = () => {
    if (!newSectionName.trim()) return;

    const newSectionId = (sections.length + 1).toString();
    const newQuestions = Array.from({ length: newQuestionCount }, (_, i) => ({
      id: `${newSectionId}.${i + 1}`,
      number: (i + 1).toString(),
      marks: "",
      maxMarks: "1",
      notAttempted: false,
    }));

    setSections([
      ...sections,
      {
        id: newSectionId,
        name: newSectionName,
        questions: newQuestions,
      },
    ]);

    setNewSectionName("");
    setNewQuestionCount(1);
    setShowSectionControls(false);
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const addQuestionToSection = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const newQuestionId = `${sectionId}.${section.questions.length + 1}`;
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
          };
        }
        return section;
      })
    );
  };

  const removeQuestionFromSection = (sectionId, questionId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter((q) => q.id !== questionId),
          };
        }
        return section;
      })
    );
  };

  const updateSectionName = (sectionId, newName) => {
    setSections((prevSections) =>
      prevSections.map((section) => 
        (section.id === sectionId ? { ...section, name: newName } : section)
      )
    );
    setEditingSectionId(null);
  };

  // Calculate total marks
  const calculateTotalMarks = () => {
    let total = 0;
    let max = 0;

    sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.marks && !question.notAttempted) {
          total += parseFloat(question.marks) || 0;
        }
        max += parseFloat(question.maxMarks) || 0;
      });
    });

    return { total, max };
  };

  // Handle save
  // const handleSave = async () => {
  //   try {
  //     setSaving(true);
      
  //     const payload = {
  //       sections,
  //       totalMarks: parseFloat(totalMarks),
  //       maxMarks: parseFloat(maxMarks),
  //       currentPage
  //     };
      
  //     const response = await apiConneector("post", teacherEndpoints?.saveEvaluation + id, payload);
      
  //     toast.success("Evaluation saved successfully");
  //     setSaving(false);
  //   } catch (error) {
  //     console.error("Error saving evaluation:", error);
  //     toast.error("Failed to save evaluation");
  //     setSaving(false);
  //   }
  // };

  // Handle submit
  // const handleSubmit = async () => {
  //   try {
  //     setSubmitting(true);
      
  //     const payload = {
  //       sections,
  //       totalMarks: parseFloat(totalMarks),
  //       maxMarks: parseFloat(maxMarks),
  //     };
      
  //     const response = await apiConneector("post", teacherEndpoints?.submitEvaluation + id, payload);
      
  //     toast.success("Evaluation submitted successfully");
  //     setSubmitting(false);
  //     navigate("/teacher/dashboard");
  //   } catch (error) {
  //     console.error("Error submitting evaluation:", error);
  //     toast.error("Failed to submit evaluation");
  //     setSubmitting(false);
  //   }
  // };

  
// Add these functions to your component

// Function to handle PDF load success
function onDocumentLoadSuccess({ numPages: nextNumPages }) {
  setNumPages(nextNumPages);
  setTotalPages(nextNumPages);
  
  // Initialize the annotation layers for each page if not already done
  if (Object.keys(annotationLayerRef.current).length === 0) {
    const layers = {};
    for (let i = 1; i <= nextNumPages; i++) {
      layers[i] = [];
    }
    annotationLayerRef.current = layers;
  }
}

// Initialize the canvas for drawing
useEffect(() => {
  if (!canvasRef.current) return;
  
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");
  
  // Set canvas to be responsive to page dimensions
  if (pdfContainerRef.current) {
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
  }
  
  context.lineCap = "round";
  context.strokeStyle = penColor;
  context.lineWidth = penSize;
  contextRef.current = context;
  
  // Draw any saved annotations for this page
  drawSavedAnnotations();
}, [canvasRef, currentPage, penColor, penSize, zoom]);

// Initialize the canvas for drawing
useEffect(() => {
  if (!canvasRef.current) return;
  
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");
  
  // Set canvas to be responsive to page dimensions
  if (pdfContainerRef.current) {
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
  }
  
  context.lineCap = "round";
  context.strokeStyle = penColor;
  context.lineWidth = penSize;
  contextRef.current = context;
  
  // Initialize annotationLayerRef if it doesn't exist
  if (!annotationLayerRef.current) {
    annotationLayerRef.current = {};
  }
  
  // Initialize the current page annotations if they don't exist
  if (!annotationLayerRef.current[currentPage]) {
    annotationLayerRef.current[currentPage] = [];
  }
  
  // Draw any saved annotations for this page
  drawSavedAnnotations();
}, [canvasRef, currentPage, penColor, penSize, zoom]);

// Function to draw saved annotations for the current page
const drawSavedAnnotations = () => {
  if (!contextRef.current || !canvasRef.current) return;
  
  const annotations = annotationLayerRef.current && annotationLayerRef.current[currentPage] ? 
                       annotationLayerRef.current[currentPage] : [];
  const ctx = contextRef.current;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
  // Draw each saved path
  annotations.forEach(path => {
    if (!path || !path.points || path.points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.size;
    ctx.stroke();
  });
};

// Start drawing when mouse is pressed (only if in drawing mode)
const startDrawing = ({ nativeEvent }) => {
  if (!isDrawing || !contextRef.current) return; // Add check for contextRef.current
  
  // Only start drawing on mouse down (left click)
  if (nativeEvent.button === 0) {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    
    // Start a new path
    const newPath = {
      color: penColor,
      size: penSize,
      points: [{ x: offsetX, y: offsetY }]
    };
    
    // Store the current path being drawn
    if (!annotationLayerRef.current) {
      annotationLayerRef.current = {};
    }
    annotationLayerRef.current.currentPath = newPath;
    
    // Set active drawing state to true
    setIsDrawingStroke(true);
  }
};

// Draw as mouse moves (only if actively drawing)
const draw = ({ nativeEvent }) => {
  if (!isDrawing || !isDrawingStroke || !contextRef.current) return; // Add check for contextRef.current
  
  const { offsetX, offsetY } = nativeEvent;
  contextRef.current.lineTo(offsetX, offsetY);
  contextRef.current.stroke();
  
  // Add point to current path
  if (annotationLayerRef.current && annotationLayerRef.current.currentPath) {
    annotationLayerRef.current.currentPath.points.push({ x: offsetX, y: offsetY });
  }
};

// Stop drawing when mouse is released
const stopDrawing = () => {
  if (!isDrawingStroke || !contextRef.current) return; // Add check for contextRef.current
  
  contextRef.current.closePath();
  
  // Save the completed path to the current page's annotations
  if (annotationLayerRef.current && annotationLayerRef.current.currentPath) {
    if (!annotationLayerRef.current[currentPage]) {
      annotationLayerRef.current[currentPage] = [];
    }
    
    annotationLayerRef.current[currentPage].push(annotationLayerRef.current.currentPath);
    delete annotationLayerRef.current.currentPath;
  }
  
  // Set active drawing state to false
  setIsDrawingStroke(false);
};




// Toggle drawing mode
const toggleDrawingMode = () => {
  setIsDrawing(!isDrawing);
  // When exiting drawing mode, make sure to redraw all annotations
  if (isDrawing) {
    // We're currently in drawing mode and about to exit
    // Make sure any active stroke is finished
    if (isDrawingStroke) {
      stopDrawing();
    }
  }
};

// Make sure to add this effect to ensure annotations remain visible when toggling drawing mode
useEffect(() => {
  // This ensures annotations stay visible regardless of drawing mode
  drawSavedAnnotations();
}, [isDrawing]);

// Change page - make sure to save annotations when changing pages
const changePage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= numPages) {
    // Finish any active drawing before changing page
    if (isDrawingStroke) {
      stopDrawing();
    }
    
    setCurrentPage(pageNumber);
  }
};

// Change zoom level
const changeZoom = (newZoom) => {
  setZoom(newZoom);
};

// Modify the handleSubmit function to include annotations
const handleSubmit = async () => {
  try {
    setSubmitting(true);
    toast.loading("Processing PDF annotations...");

    const pdfResponse = await axios.get(pdfUrl, { responseType: "arraybuffer" });
    const pdfBytes = pdfResponse.data; // Correct way to access arraybuffer data

    // Load the PDF using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Iterate over annotation layers
    for (const pageNum of Object.keys(annotationLayerRef.current)) {
      if (!Array.isArray(annotationLayerRef.current[pageNum]) || 
          annotationLayerRef.current[pageNum].length === 0) {
        continue; // Skip pages without annotations
      }

      const pageIndex = parseInt(pageNum) - 1;
      const page = pages[pageIndex];
      if (!page) continue;

      // Get page dimensions
      const { width, height } = page.getSize();

      // Loop through each annotation path
      annotationLayerRef.current[pageNum].forEach(path => {
        if (path.points.length < 2) return;

        // Convert color hex to RGB
        const { r, g, b } = hexToRgb(path.color); // Destructure the RGB values properly

        // Draw annotation lines
        for (let i = 0; i < path.points.length - 1; i++) {
          const start = path.points[i];
          const end = path.points[i + 1];

          page.drawLine({
            start: { x: start.x, y: height - start.y },
            end: { x: end.x, y: height - end.y },
            thickness: path.size,
            color: rgb(r / 255, g / 255, b / 255), // Corrected variable usage
          });
        }
      });
    }

    // Serialize the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Convert to Blob/File for upload
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const modifiedPdfFile = new File([modifiedPdfBlob], 'annotated_submission.pdf', { type: 'application/pdf' });

    // console.log(formData);
    // const url = URL.createObjectURL(modifiedPdfFile);
    // window.open(url, "_blank");

    const formData = new FormData();
    formData.append("pdf", modifiedPdfFile);
    formData.append("sections", JSON.stringify(sections)); // Convert array/object to JSON string
    formData.append("totalMarks", parseFloat(totalMarks));
    formData.append("maxMarks", parseFloat(maxMarks));

    const response = await apiConneector("post", teacherEndpoints?.submitEvaluation + id, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.dismiss();
    toast.success("Evaluation submitted successfully");
    setSubmitting(false);
    navigate("/teacher/dashboard");

  } catch (error) {
    console.error("Error submitting evaluation:", error);
    toast.dismiss();
    toast.error("Failed to submit evaluation");
    setSubmitting(false);
  }
};




// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Also modify the handleSave function to save annotations
const handleSave = async () => {
  try {
    setSaving(true);
    
    // Convert annotations to a format that can be saved
    const annotationsToSave = {};
    Object.keys(annotationLayerRef.current).forEach(page => {
      if (Array.isArray(annotationLayerRef.current[page]) && annotationLayerRef.current[page].length > 0) {
        annotationsToSave[page] = annotationLayerRef.current[page];
      }
    });
    
    const payload = {
      sections,
      totalMarks: parseFloat(totalMarks),
      maxMarks: parseFloat(maxMarks),
      currentPage,
      annotations: annotationsToSave
    };
    
    const response = await apiConneector("post", teacherEndpoints?.saveEvaluation + id, payload);
    
    toast.success("Evaluation saved successfully");
    setSaving(false);
  } catch (error) {
    console.error("Error saving evaluation:", error);
    toast.error("Failed to save evaluation");
    setSaving(false);
  }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading evaluation data...</div>
      </div>
    );
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
            Subject: <span className="text-blue-600">
              {evaluationData?.submission?.subjectId?.code} - {evaluationData?.submission?.subjectId?.name}
            </span>
          </h1>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-800 p-4 text-white">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm font-medium">Student: {evaluationData?.submission?.studentId?.firstName + " " + evaluationData?.submission?.studentId?.lastName || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm font-medium">ID: {evaluationData?.submission?.studentId?._id || "N/A"}</span>
            </div>
            <div>
              <span className="text-sm font-medium">
                Start at: {new Date(evaluationData?.evaluation?.metadata?.startTime).toLocaleTimeString() || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* <button className="rounded-md bg-gray-200 py-1 px-3 text-sm font-medium text-gray-800 hover:bg-gray-300">
              HE Instruction
            </button> */}
            <a 
              href={`${pdfUrl}?fl_attachment=true`} 
              download="AnswerScript.pdf"  // Forces file download
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded-md bg-green-600 py-1 px-3 text-sm font-medium text-white hover:bg-green-700"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Answer Script
            </a>
            {/* <button className="rounded-md bg-orange-500 py-1 px-3 text-sm font-medium text-white hover:bg-orange-600">
              Problem Script
            </button> */}
            {/* <button
              className={`rounded-md bg-green-600 py-1 px-3 text-sm font-medium text-white hover:bg-green-700 ${saving ? 'opacity-75' : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
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
                </>
              )}
            </button> */}
            <button
              className={`rounded-md bg-red-600 py-1 px-3 text-sm font-medium text-white hover:bg-red-700 ${submitting ? 'opacity-75' : ''}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
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
                </>
              )}
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
                <span className="text-sm font-medium">
                  Total Questions: {sections.reduce((acc, section) => acc + section.questions.length, 0)}
                </span>
                <span className="text-sm font-medium">
                  Marks: {totalMarks}/{maxMarks}
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
                      onChange={(e) => setNewQuestionCount(parseInt(e.target.value) || 1)}
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

              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
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
                              step="0.5"
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
                              min="0.5"
                              step="0.5"
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

          {/* render pdf and annotation */}
          <div className="lg:col-span-3">
  <div className="rounded-lg border bg-white shadow-sm">
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`rounded bg-gray-200 p-1 ${
              currentPage <= 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm">
            Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{numPages || 1}</span>
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= numPages}
            className={`rounded bg-gray-200 p-1 ${
              currentPage >= numPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Zoom:</span>
            <select
              value={zoom}
              onChange={(e) => changeZoom(parseInt(e.target.value))}
              className="rounded border border-gray-300 p-1 text-sm"
            >
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="200">200%</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDrawingMode}
              className={`rounded p-1 ${
                isDrawing ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
              title={isDrawing ? "Exit drawing mode" : "Enter drawing mode"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            
            {isDrawing && (
              <>
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  title="Select pen color"
                  className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                />
                <select
                  value={penSize}
                  onChange={(e) => setPenSize(parseInt(e.target.value))}
                  className="rounded border border-gray-300 p-1 text-sm"
                  title="Select pen size"
                >
                  <option value="1">Thin</option>
                  <option value="3">Medium</option>
                  <option value="5">Thick</option>
                  <option value="8">Extra Thick</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer with Canvas Overlay */}
      <div
        ref={pdfContainerRef}
        className="relative mt-4 flex justify-center overflow-auto"
        style={{ height: "calc(100vh - 300px)" }}
      >
        {pdfUrl ? (
          <>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="flex h-full w-full items-center justify-center">Loading PDF...</div>}
              error={<div className="text-red-500">Failed to load PDF</div>}
            >
              <Page
                pageNumber={currentPage}
                scale={zoom / 100}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={<div className="flex h-full w-full items-center justify-center">Loading page...</div>}
              />
            </Document>
            
            {/* Canvas overlay for annotations */}
            <canvas
              ref={canvasRef}
              className={`absolute top-0 left-0 h-full w-full ${isDrawing ? 'cursor-crosshair' : ''}`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">No PDF available</div>
        )}
      </div>

      {isDrawing && (
        <div className="mt-2 rounded-md bg-yellow-100 p-2 text-sm text-yellow-800">
          <p>
            <strong>Drawing Mode Active:</strong> You can draw directly on the PDF. Click the pen button again to exit
            drawing mode.
          </p>
        </div>
      )}
    </div>
  </div>
</div>
        </div>
      </main>
    </div>
  )
}