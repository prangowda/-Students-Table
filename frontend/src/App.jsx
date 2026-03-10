/**
 * App.jsx
 * Root application component. Wraps Home with the react-hot-toast Toaster.
 */

import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';

const App = () => {
  return (
    <>
      <Home />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#0f172a' },
          },
        }}
      />
    </>
  );
};

export default App;
