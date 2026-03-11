import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import JoinRoom from "./components/JoinRoom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#059669',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#DC2626',
                color: 'white',
              },
            },
            duration: 2000,
          }}
        />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<JoinRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
