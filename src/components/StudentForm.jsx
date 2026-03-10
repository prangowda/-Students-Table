/**
 * StudentForm.jsx
 * Modal form for adding or editing a student record.
 * Props:
 *  - isOpen: boolean
 *  - editStudent: object | null  (null = Add mode, object = Edit mode)
 *  - onSubmit: (studentData) => void
 *  - onClose: () => void
 */

import { useState, useEffect } from 'react';
import { validateStudent } from '../utils/validation';

const EMPTY_FORM = { name: '', email: '', age: '' };

const StudentForm = ({ isOpen, editStudent, onSubmit, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = Boolean(editStudent);

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (editStudent) {
        setForm({ name: editStudent.name, email: editStudent.email, age: String(editStudent.age) });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, editStudent]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validateStudent(form);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // Small delay for UX feedback
    await new Promise((r) => setTimeout(r, 200));
    onSubmit({ name: form.name.trim(), email: form.email.trim(), age: Number(form.age) });
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      {/* Panel */}
      <div
        className="card animate-scale-in w-full max-w-lg shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEditMode ? 'bg-amber-500/10' : 'bg-indigo-500/10'}`}>
              {isEditMode ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
            </div>
            <h2 id="form-title" className="text-base font-semibold text-slate-100">
              {isEditMode ? 'Edit Student' : 'Add New Student'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="label">Full Name <span className="text-rose-400">*</span></label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Alice Johnson"
              autoComplete="off"
              className={`input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">Email Address <span className="text-rose-400">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. alice@example.com"
              autoComplete="off"
              className={`input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="label">Age <span className="text-rose-400">*</span></label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 21"
              className={`input ${errors.age ? 'input-error' : ''}`}
            />
            {errors.age && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.age}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 justify-center ${isEditMode ? 'btn-warning' : 'btn-primary'}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </>
              ) : isEditMode ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
