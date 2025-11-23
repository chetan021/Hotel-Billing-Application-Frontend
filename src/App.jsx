// src/App.jsx (FIXED)
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Guest from "./Components/Guest";
import RoomsUI from "./Components/RoomsUI";
import AssignRoom from "./Components/AssignRoom";
import Reservations from "./Components/Reservations";
import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import Register from "./Components/Register";
import Invoice from "./Components/Invoice";

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
            {/* Only show nav if authenticated */}
            {isAuthenticated && (
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
                        <Link to="/invoices" className="hover:text-yellow-300 transition duration-300">
                            Invoices
                        </Link>
                    </div>
                    <div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            )}

            <div className="p-6">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Public Routes */}
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/guests" replace />
                                ) : (
                                    <PageWrapper>
                                        <Login onLogin={() => setIsAuthenticated(true)} />
                                    </PageWrapper>
                                )
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                <PageWrapper>
                                    <Register />
                                </PageWrapper>
                            }
                        />

                        {/* Protected Routes */}
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
                            path="/invoices"
                            element={
                                <PageWrapper>
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Invoice />
                                    </ProtectedRoute>
                                </PageWrapper>
                            }
                        />

                        {/* Default Route */}
                        <Route
                            path="/"
                            element={<Navigate to={isAuthenticated ? "/guests" : "/login"} replace />}
                        />

                        {/* 404 Route */}
                        <Route
                            path="*"
                            element={<Navigate to={isAuthenticated ? "/guests" : "/login"} replace />}
                        />
                    </Routes>
                </AnimatePresence>
            </div>
        </>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists on mount
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            </div>
        );
    }

    return (
        <Router>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
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