/**
 * ConfirmDialog.jsx
 * Accessible modal confirmation dialog for destructive actions.
 * Props:
 *  - isOpen: boolean
 *  - title: string
 *  - message: string
 *  - onConfirm: () => void
 *  - onCancel: () => void
 */

import { useEffect } from 'react';

const ConfirmDialog = ({ isOpen, title = 'Are you sure?', message, onConfirm, onCancel }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Panel */}
      <div
        className="card animate-scale-in w-full max-w-md p-6 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 mx-auto mb-4">
          <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* Text */}
        <h3 id="dialog-title" className="text-lg font-semibold text-center text-slate-100 mb-2">
          {title}
        </h3>
        {message && (
          <p className="text-sm text-slate-400 text-center mb-6">{message}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="btn-secondary flex-1 justify-center"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button
            className="btn-danger flex-1 justify-center"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
