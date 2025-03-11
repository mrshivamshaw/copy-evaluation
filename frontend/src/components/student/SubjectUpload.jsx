import React, { useEffect } from "react"

import { useState } from "react"
import { studentEndpoints } from "../../servies/api"
import { apiConneector } from "../../servies/apiConnector"


export default function SubjectUpload({ subject }) {
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(subject?.submission?._id ? true : false)
  // console.log(subject?.submission);
  
  const [selectedFile, setSelectedFile] = useState(null)
  useEffect(() => {
    setIsSubmitted(subject?.submission?._id ? true : false);
  }, [subject]);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async() => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("pdf", selectedFile); // The key should match multer's "pdf"

      // You can replace this with your own API endpoint for file upload
      const res = await apiConneector("post", studentEndpoints?.addSubmission + subject?.subject?._id, formData);

      if (res?.data?.success) {
        setIsUploading(false)
        setSelectedFile(null)
        setIsSubmitted(true)
        console.log(res);
        
      }
    } catch (error) {
      setIsUploading(false)
      console.error("Error uploading file:", error);
    }
    
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="bg-blue-50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full border border-blue-200 px-2 py-1 text-xs text-blue-700">
              Semester {subject?.subject?.semester}
            </span>
            <h3 className="text-lg font-semibold">{subject?.subject?.name}</h3>
            <p className="text-sm text-gray-600">{subject?.subject?.code}</p>
          </div>
          {isSubmitted && (
            <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 inline h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submitted
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        {isSubmitted ? (
          <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-2 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">Your submission has been received</p>
            <p className="text-xs">You can resubmit until the deadline</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-blue-50 p-4 text-sm">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-blue-700">
                  <p className="font-medium">Submission Guidelines</p>
                  <ul className="ml-4 mt-1 list-disc text-xs">
                    <li>Upload your answer script as a PDF file</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Make sure all pages are clearly visible</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <label className="flex w-full cursor-pointer flex-col items-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2 h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to upload PDF"}
                </span>
                <span className="mt-1 text-xs text-gray-500">PDF up to 10MB</span>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 p-4">
        <button
          className={`w-full rounded-md py-2 px-4 text-sm font-medium ${
            isUploading || (!selectedFile && !isSubmitted)
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
          disabled={isUploading || (!selectedFile && !isSubmitted)}
          onClick={handleUpload}
        >
          {isUploading ? "Uploading..." : isSubmitted ? "Submitted ✅" : "Upload Submission"}
        </button>
      </div>
    </div>
  )
}

