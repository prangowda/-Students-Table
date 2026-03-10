/**
 * api.js
 * Axios service layer — all HTTP calls to the backend REST API.
 * Base URL is configured via VITE_API_URL environment variable.
 */

import axios from 'axios';

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Response / Error interceptors ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred';
    // Attach a user-friendly message to the error so callers can toast it
    error.userMessage = message;
    return Promise.reject(error);
  }
);

// ── Student API calls ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filtered, sorted list of students.
 * @param {object} params - Query parameters
 * @param {string}  [params.search]   - Search term (name or email)
 * @param {number}  [params.page=1]   - Page number (1-indexed)
 * @param {number}  [params.limit=8]  - Items per page
 * @param {string}  [params.sortBy]   - Field to sort by: name|email|age|createdAt
 * @param {string}  [params.sortDir]  - Sort direction: asc|desc
 * @param {number}  [params.ageMin]   - Minimum age filter
 * @param {number}  [params.ageMax]   - Maximum age filter
 * @returns {Promise<{ data: Student[], total: number, page: number, totalPages: number }>}
 */
export const getStudents = (params = {}) => {
  // Remove undefined/empty values so they don't pollute the query string
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  return api.get('/students', { params: clean }).then((r) => r.data);
};

/**
 * Fetch ALL students without pagination (used for Excel export).
 * @param {object} params - Same filter/search params as getStudents but no page/limit
 * @returns {Promise<{ data: Student[] }>}
 */
export const getAllStudents = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  return api.get('/students', { params: { ...clean, limit: 9999 } }).then((r) => r.data);
};

/**
 * Create a new student.
 * @param {{ name: string, email: string, age: number }} data
 * @returns {Promise<Student>}
 */
export const createStudent = (data) =>
  api.post('/students', data).then((r) => r.data);

/**
 * Update an existing student.
 * @param {number | string} id
 * @param {{ name?: string, email?: string, age?: number }} data
 * @returns {Promise<Student>}
 */
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data).then((r) => r.data);

/**
 * Delete a student by ID.
 * @param {number | string} id
 * @returns {Promise<{ message: string }>}
 */
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then((r) => r.data);

export default api;
