import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiLogOut, FiPieChart, FiUploadCloud, FiClock, FiGrid } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 rounded-none px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center">
                    <FiPieChart className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
                    Excel Analytics Dashboard
                </span>
            </Link>

            <div className="flex items-center gap-6">
                {user && (
                    <>
                        <div className="hidden md:flex items-center gap-6 mr-4 text-sm font-medium text-slate-300">
                            <Link to="/" className="hover:text-white transition-colors flex items-center gap-2"><FiGrid /> Dashboard</Link>
                            <Link to="/upload" className="hover:text-white transition-colors flex items-center gap-2"><FiUploadCloud /> Upload</Link>
                            <Link to="/history" className="hover:text-white transition-colors flex items-center gap-2"><FiClock /> History</Link>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                            <span className="text-sm text-slate-400 hidden sm:inline-block">Hi, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                title="Logout"
                            >
                                <FiLogOut />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
