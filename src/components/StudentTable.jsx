/**
 * StudentTable.jsx
 * Sortable, paginated data table for student records.
 *
 * Props:
 *  - students: Array (full filtered/sorted list for current page)
 *  - allFilteredStudents: Array (all filtered rows, used for page calculation + export)
 *  - currentPage: number
 *  - totalPages: number
 *  - pageSize: number
 *  - sortField: string
 *  - sortDir: 'asc' | 'desc'
 *  - onSort: (field) => void
 *  - onEdit: (student) => void
 *  - onDelete: (student) => void
 *  - onPageChange: (page) => void
 *  - totalItems: number
 */

import Pagination from './Pagination';

const COLUMNS = [
  { key: 'index', label: '#', sortable: false },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

const SortIcon = ({ field, sortField, sortDir }) => {
  const active = sortField === field;
  return (
    <span className="inline-flex flex-col ml-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
      <svg
        className={`w-2.5 h-2.5 -mb-0.5 transition-colors ${active && sortDir === 'asc' ? 'text-indigo-400' : 'text-slate-600'}`}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 4l4 6H4z" />
      </svg>
      <svg
        className={`w-2.5 h-2.5 -mt-0.5 transition-colors ${active && sortDir === 'desc' ? 'text-indigo-400' : 'text-slate-600'}`}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 12L4 6h8z" />
      </svg>
    </span>
  );
};

const StudentTable = ({
  students,
  allFilteredStudents,
  currentPage,
  totalPages,
  pageSize,
  sortField,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  onPageChange,
  totalItems,
}) => {
  if (allFilteredStudents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <p className="text-lg font-medium text-slate-400">No students found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Table wrapper */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/70">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap first:pl-5 last:pr-5 ${
                    col.sortable ? 'cursor-pointer select-none group hover:text-slate-200 transition-colors' : ''
                  } ${col.key === 'actions' ? 'text-center' : ''}`}
                  onClick={() => col.sortable && onSort(col.key)}
                  aria-sort={
                    col.sortable && sortField === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable && (
                      <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {students.map((student, idx) => {
              // Calculate the absolute row number (across pages)
              const absoluteIdx = (currentPage - 1) * pageSize + idx + 1;
              return (
                <tr
                  key={student.id}
                  className="table-row-hover hover:bg-slate-800/40 group animate-fade-in"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  {/* # */}
                  <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">{absoluteIdx}</td>

                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-indigo-900/30">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-100 truncate max-w-[160px]">{student.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5">
                    <a
                      href={`mailto:${student.email}`}
                      className="text-slate-400 hover:text-indigo-400 transition-colors truncate max-w-[220px] block"
                    >
                      {student.email}
                    </a>
                  </td>

                  {/* Age */}
                  <td className="px-4 py-3.5">
                    <span className="badge bg-slate-700/70 text-slate-300 font-mono">{student.age}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(student)}
                        className="btn btn-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-400/40 focus:ring-amber-500"
                        title="Edit student"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(student)}
                        className="btn btn-sm bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-400/40 focus:ring-rose-500"
                        title="Delete student"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        pageSize={pageSize}
      />
    </div>
  );
};

export default StudentTable;
