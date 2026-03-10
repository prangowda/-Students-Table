/**
 * excelExport.js
 * Utility to export an array of student objects to an Excel (.xlsx) file.
 * Uses SheetJS (xlsx) library.
 */

import * as XLSX from 'xlsx';

/**
 * Exports student data to an Excel file and triggers a browser download.
 * @param {Array<{ id: string, name: string, email: string, age: number }>} students
 * @param {string} [filename='students.xlsx']
 */
export function exportToExcel(students, filename = 'students.xlsx') {
  // Map to plain display rows (omit internal id)
  const rows = students.map((s, index) => ({
    '#': index + 1,
    'Name': s.name,
    'Email': s.email,
    'Age': s.age,
  }));

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  // Auto-fit column widths
  const colWidths = [
    { wch: 5 },   // #
    { wch: 25 },  // Name
    { wch: 35 },  // Email
    { wch: 8 },   // Age
  ];
  worksheet['!cols'] = colWidths;

  // Trigger download
  XLSX.writeFile(workbook, filename);
}
