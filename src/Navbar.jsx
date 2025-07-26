import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Menu, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
    const isLoggedIn = !!localStorage.getItem("admin");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        window.location.href = "/contact-us";
    };

    const handleAdminClick = () => {
        if (!isLoggedIn) {
            toast.warn("Please Login First To Access Admin Dashboard");
        }
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <ToastContainer />
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-xl font-bold">MyApp</div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/contact-us" className="hover:text-gray-200">
                        Contact Us
                    </Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="hover:text-gray-200">
                                Admin Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="hover:text-gray-200">
                                Admin Dashboard
                            </Link>
                            <Link to="/enquiries" className="hover:text-gray-200">
                                Enquiries
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-3">
                    <Link to="/contact-us" className="block hover:text-gray-200">
                        Contact Us
                    </Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="block hover:text-gray-200">
                                Admin Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="block hover:text-gray-200">
                                Admin Dashboard
                            </Link>
                            <Link to="/enquiries" className="block hover:text-gray-200">
                                Enquiries
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
