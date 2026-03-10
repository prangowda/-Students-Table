/**
 * localStorage.js
 * Helpers to persist and retrieve student data from browser localStorage.
 */

import seedStudents from '../data/students.json';

const STORAGE_KEY = 'students_table_manager_data';

/**
 * Load students from localStorage. Falls back to seed data on first visit.
 * @returns {Array}
 */
export function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // First-time visit: persist seed data and return it
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStudents));
    return seedStudents;
  } catch {
    return seedStudents;
  }
}

/**
 * Save the current student list to localStorage.
 * @param {Array} students
 */
export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    console.warn('localStorage is unavailable; changes will not persist.');
  }
}

/**
 * Generate a simple unique id string.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
