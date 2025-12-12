import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">HB</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Hotel Billing
            </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/rooms"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Rooms
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/bookings"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                    My Bookings
                                </Link>
                                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user?.name || user?.email}
                  </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
