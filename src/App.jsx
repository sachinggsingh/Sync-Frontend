import { Route, Routes, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import "./App.css";
import HomePage from "./components/HomePage";
import JoinRoom from "./components/JoinRoom";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
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
        {/* Public routes */}
        <Route
          path="/sign-in/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                <SignInPage />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            </>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <HomePage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/room"
          element={
            <>
              <SignedIn>
                <JoinRoom />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
