/**
 * LoadingSpinner.jsx
 * Full-page loading overlay with animated spinner.
 */

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
      {/* Animated gradient rings */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-violet-500 animate-spin [animation-direction:reverse] [animation-duration:0.8s]" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-slate-100 mb-2">Students Table Manager</h2>
      <p className="text-sm text-slate-400 animate-pulse">Loading student records…</p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
