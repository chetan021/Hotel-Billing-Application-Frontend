import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Hotel Billing</h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted partner for seamless hotel room bookings and billing management.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/rooms" className="text-gray-400 hover:text-white transition-colors">
                                    Rooms
                                </Link>
                            </li>
                            <li>
                                <Link to="/bookings" className="text-gray-400 hover:text-white transition-colors">
                                    Bookings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Email: info@hotelbilling.com</li>
                            <li>Phone: +91 1234567890</li>
                            <li>Address: Mumbai, India</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Facebook
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Twitter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Hotel Billing Application. All rights reserved.</p>
                    <p className="mt-2">Built with React + Vite + Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
