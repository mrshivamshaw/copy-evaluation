

export default function SubjectList({ subjects, onRemove }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Subject List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Subject Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Subject Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Semester
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
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{subject.code}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{subject.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{subject.semester}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => onRemove(subject.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

