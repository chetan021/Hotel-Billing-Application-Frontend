import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Guest from "./Components/Guest";
import RoomsUI from "./Components/RoomsUI";
import AssignRoom from "./Components/AssignRoom";
import Reservations from "./Components/Reservations";
import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import Register from "./Components/Register";

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.4 }}
    className="bg-white bg-opacity-20 p-6 rounded-lg shadow-xl backdrop-blur-lg text-black"
  >
    {children}
  </motion.div>
);

function AppRoutes({ isAuthenticated, setIsAuthenticated, handleLogout }) {
  const location = useLocation();

  return (
    <>
      <nav className="bg-black bg-opacity-30 backdrop-blur-md p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex space-x-6 text-lg font-semibold">
          <Link to="/guests" className="hover:text-yellow-300 transition duration-300">
            Guests
          </Link>
          <Link to="/rooms" className="hover:text-yellow-300 transition duration-300">
            Rooms
          </Link>
          <Link to="/reservations" className="hover:text-yellow-300 transition duration-300">
            Reservations
          </Link>
          <Link to="/register">Register</Link>
{/* <Link to="/login">Login</Link> */}

        </div>
        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/guests"
              element={
                <PageWrapper>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Guest />
                  </ProtectedRoute>
                </PageWrapper>
              }
            />
            <Route
              path="/rooms"
              element={
                <PageWrapper>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <RoomsUI />
                  </ProtectedRoute>
                </PageWrapper>
              }
            />
            <Route
              path="/assign-room/:guestId"
              element={
                <PageWrapper>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AssignRoom />
                  </ProtectedRoute>
                </PageWrapper>
              }
            />
            <Route
              path="/reservations"
              element={
                <PageWrapper>
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Reservations />
                  </ProtectedRoute>
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login onLogin={() => setIsAuthenticated(true)} />
                </PageWrapper>
              }
            />
            <Route path="/register" element={<Register />} />
{/* <Route path="/login" element={<Login />} /> */}

          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-sans transition-all duration-500">
        <AppRoutes
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          handleLogout={handleLogout}
        />
      </div>
    </Router>
  );
}
