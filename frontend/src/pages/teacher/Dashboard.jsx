import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedSubjectList } from "../../servies/operations/teacher";

// // Mock data
// const assignedSubjects = [
//   {
//     id: "1",
//     code: "PCC-CS404",
//     name: "Design and Analysis of Algorithm",
//     semester: "4",
//     submissions: [
//       { id: "s1", studentName: "John Doe", studentId: "CS2101", submittedAt: "2025-02-20T10:30:00Z" },
//       { id: "s2", studentName: "Jane Smith", studentId: "CS2102", submittedAt: "2025-02-21T09:15:00Z" },
//     ],
//   },
//   {
//     id: "2",
//     code: "PCC-CS405",
//     name: "Operating Systems",
//     semester: "4",
//     submissions: [{ id: "s3", studentName: "Alex Johnson", studentId: "CS2103", submittedAt: "2025-02-19T14:45:00Z" }],
//   },
// ]

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [evaluatedList, setEvaluatedList] = useState([]);
  const [activeTab, setActiveTab] = useState("subjects");
  const dispatch = useDispatch();
  const { assignedSubjectList } = useSelector((state) => state.teacher);

  useEffect(() => {
    assignedSubjectList?.length == 0
      ? dispatch(getAssignedSubjectList())
      : null;
    setEvaluatedList(evaluatedSubmissionList())
    // console.log(evaluatedList.length);
    
    
  }, [assignedSubjectList]);

  const evaluatedSubmissionList = () => {
    const lists = assignedSubjectList
      ?.map((sub) => {
        // Filter submissions where evaluated status is not "pending"
        const filteredSubmissions = sub.submission.filter(
          (submission) => submission.evaluated !== "pending"
        );

        // Return only subjects that have at least one evaluated submission
        if (filteredSubmissions.length > 0) {
          return { ...sub, submission: filteredSubmissions };
        }

        return null; // Exclude subjects with no evaluated submissions
      })
      .filter(Boolean); // Remove null values

    return lists;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="teacher" />
      <main className="container mx-auto p-4">
        <h1 className="mb-6 text-2xl font-bold text-blue-800">
          Teacher Dashboard
        </h1>

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
                Assigned Subjects
              </button>
              <button
                onClick={() => setActiveTab("evaluated")}
                className={`py-4 px-1 text-sm font-medium ${
                  activeTab === "evaluated"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Evaluated Submissions
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "subjects" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignedSubjectList?.map((subject, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <div className="bg-blue-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="mb-2 inline-block rounded-full border border-blue-200 px-2 py-1 text-xs text-blue-700">
                        Semester {subject?.semester}
                      </span>
                      <h3 className="text-lg font-semibold">{subject?.name}</h3>
                      <p className="text-sm text-gray-600">{subject?.code}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Submissions</span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        {subject?.submission?.length}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {subject.submission.map((sub, ind) => (
                        <li key={ind} className="rounded-md border p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {sub?.studentId?.firstName +
                                  " " +
                                  sub?.studentId?.lastName}
                              </p>
                              <p className="text-xs text-gray-600">
                                ID: {sub?.studentId?._id}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">
                                {formatDate(sub?.submissiondate)}
                              </p>
                              {sub?.evaluated == "pending" ? (
                                <button
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                  onClick={() =>
                                    navigate(`/teacher/evaluate/${sub?._id}`)
                                  }
                                >
                                  Evaluate
                                </button>
                              ) : (
                                <button
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                  onClick={() =>
                                    navigate(`/teacher/evaluate/${sub?._id}`)
                                  }
                                >
                                  Revaluate
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 p-4">
                  <button
                    className="w-full rounded-md border border-gray-300 py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate(`/teacher/subject/${subject?._id}`)}
                  >
                    View All Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : evaluatedList?.length == 0 ? (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Evaluated Submissions</h2>
            <p className="mt-2 text-gray-600">
              You haven't evaluated any submissions yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

          {
            evaluatedList?.map((subject, i) => (
            
              <div
                key={i}
                className="overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <div className="bg-blue-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="mb-2 inline-block rounded-full border border-blue-200 px-2 py-1 text-xs text-blue-700">
                        Semester {subject?.semester}
                      </span>
                      <h3 className="text-lg font-semibold">{subject?.name}</h3>
                      <p className="text-sm text-gray-600">{subject?.code}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Evaluated Submissions
                      </span>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        {subject?.submission?.length} Evaluated
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {subject.submission.map((sub, ind) => (
                        <li key={ind} className="rounded-md border p-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {sub?.studentId?.firstName +
                                  " " +
                                  sub?.studentId?.lastName}
                              </p>
                              <p className="text-xs text-gray-600">
                                ID: {sub?.studentId?._id}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">
                                {formatDate(sub?.submissiondate)}
                              </p>
                              <button
                                className="rounded text-sm text-blue-500"
                                onClick={() =>
                                  navigate(`/teacher/evaluate/${sub?._id}`)
                                }
                              >
                                Revaluate
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 p-4">
                  <button
                    className="w-full rounded-md border border-gray-300 py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate(`/teacher/subject/${subject?._id}`)}
                  >
                    View All Submissions
                  </button>
                </div>
              </div>
            ))
          
          }
          </div>
          )
        }
      </main>
    </div>
  );
}
