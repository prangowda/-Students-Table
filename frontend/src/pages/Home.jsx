/**
 * Home.jsx
 * Main page — orchestrates all state, filtering, sorting, pagination, and CRUD
 * actions via the backend REST API (Axios service layer).
 */

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import {
  getStudents,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/api';
import { exportToExcel } from '../utils/excelExport';

const PAGE_SIZE = 8;

const Home = () => {
  // ── Data state ─────────────────────────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true); // spinner on first load
  const [tableLoading, setTableLoading] = useState(false);    // subtle reload indicator

  // ── Search & filter ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  // ── Sorting ────────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch students from backend ────────────────────────────────────────────
  const fetchStudents = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setTableLoading(true);
      try {
        const result = await getStudents({
          search: searchQuery,
          page: currentPage,
          limit: PAGE_SIZE,
          sortBy: sortField,
          sortDir,
          ageMin: ageMin || undefined,
          ageMax: ageMax || undefined,
        });
        setStudents(result.data);
        setTotalItems(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        toast.error(err.userMessage || 'Failed to load students.');
      } finally {
        setInitialLoading(false);
        setTableLoading(false);
      }
    },
    [searchQuery, currentPage, sortField, sortDir, ageMin, ageMax]
  );

  // Initial load with simulated loading screen (2.5 s minimum)
  useEffect(() => {
    const start = Date.now();
    fetchStudents(false).then(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 2500 - elapsed);
      setTimeout(() => setInitialLoading(false), remaining);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch whenever filters / sort / page change (after initial load)
  useEffect(() => {
    if (!initialLoading) {
      fetchStudents(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage, sortField, sortDir, ageMin, ageMax]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ageMin, ageMax, sortField, sortDir]);

  // ── Sort ────────────────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // ── Add ─────────────────────────────────────────────────────────────────────
  const handleAddClick = () => {
    setEditStudent(null);
    setFormOpen(true);
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const handleEditClick = (student) => {
    setEditStudent(student);
    setFormOpen(true);
  };

  // ── Form submit (Add or Edit) ────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    try {
      if (editStudent) {
        await updateStudent(editStudent.id, data);
        toast.success(`${data.name} updated successfully!`, { icon: '✏️' });
      } else {
        await createStudent(data);
        toast.success(`${data.name} added successfully!`, { icon: '🎉' });
      }
      setFormOpen(false);
      setEditStudent(null);
      fetchStudents(true);
    } catch (err) {
      toast.error(err.userMessage || 'Operation failed. Please try again.');
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteClick = (student) => setDeleteTarget(student);

  const handleDeleteConfirm = async () => {
    try {
      await deleteStudent(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed.`, { icon: '🗑️' });
      setDeleteTarget(null);
      // If last item on page > 1, go back one page
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchStudents(true);
      }
    } catch (err) {
      toast.error(err.userMessage || 'Delete failed. Please try again.');
      setDeleteTarget(null);
    }
  };

  // ── Filters clear ────────────────────────────────────────────────────────────
  const handleClearFilters = () => {
    setSearchQuery('');
    setAgeMin('');
    setAgeMax('');
  };

  // ── Excel export (fetches ALL records matching current filters) ───────────────
  const handleExportAll = async () => {
    try {
      const result = await getAllStudents({});
      if (!result.data.length) { toast.error('No students to export.'); return; }
      exportToExcel(result.data, 'students_all.xlsx');
      toast.success(`Exported ${result.data.length} student(s).`, { icon: '📊' });
    } catch {
      toast.error('Export failed.');
    }
  };

  const handleExportFiltered = async () => {
    try {
      const result = await getAllStudents({
        search: searchQuery,
        sortBy: sortField,
        sortDir,
        ageMin: ageMin || undefined,
        ageMax: ageMax || undefined,
      });
      if (!result.data.length) { toast.error('No students match the current filters.'); return; }
      exportToExcel(result.data, 'students_filtered.xlsx');
      toast.success(`Exported ${result.data.length} filtered student(s).`, { icon: '📊' });
    } catch {
      toast.error('Export failed.');
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (initialLoading) return <LoadingSpinner />;

  const hasFilters = searchQuery || ageMin || ageMax;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Header ── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 leading-tight">Students Table Manager</h1>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Full-Stack • PostgreSQL</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tableLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                Syncing…
              </div>
            )}
            <span className="badge bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm px-3 py-1">
              {totalItems} student{totalItems !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Toolbar ── */}
        <div className="card p-4">
          <div className="flex flex-col gap-4">
            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  ageMin={ageMin}
                  ageMax={ageMax}
                  onAgeMinChange={setAgeMin}
                  onAgeMaxChange={setAgeMax}
                  onClear={handleClearFilters}
                  resultCount={totalItems}
                />
              </div>
              <button onClick={handleAddClick} className="btn-primary whitespace-nowrap sm:self-start">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Student
              </button>
            </div>

            {/* Excel export row */}
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-800">
              <span className="text-xs text-slate-500 mr-1">Export:</span>
              <button onClick={handleExportAll} className="btn-success btn-sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download All
              </button>
              <button
                onClick={handleExportFiltered}
                disabled={!hasFilters}
                className="btn btn-sm bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 hover:border-teal-400/40 focus:ring-teal-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Filtered
              </button>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card p-4 sm:p-5">
          <StudentTable
            students={students}
            allFilteredStudents={students}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
          />
        </div>
      </main>

      {/* ── Modals ── */}
      <StudentForm
        isOpen={formOpen}
        editStudent={editStudent}
        onSubmit={handleFormSubmit}
        onClose={() => { setFormOpen(false); setEditStudent(null); }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Student"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Home;
