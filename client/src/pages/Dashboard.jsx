import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUploadCloud, FiClock, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [recentUploads, setRecentUploads] = useState([]);
    const [stats, setStats] = useState({ totalDocs: 0 });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/data');
                setRecentUploads(res.data.slice(0, 3));
                setStats({ totalDocs: res.data.length });
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };
        fetchHistory();
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="space-y-8">
            <header className="mb-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold text-white mb-2"
                >
                    Welcome, {user?.name.split(' ')[0]}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg"
                >
                    Here's what's happening with your datasets today.
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={cardVariants} initial="hidden" animate="show" className="glass-panel p-6 flex flex-col justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-4">
                        <FiUploadCloud className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">New Upload</h3>
                    <p className="text-slate-400 mb-6 text-sm">Upload a new Excel file to generate instant analytics.</p>
                    <Link to="/upload" className="btn-primary w-full flex items-center justify-center gap-2">
                        Upload File <FiArrowRight />
                    </Link>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="glass-panel p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center mb-4">
                        <FiBarChart2 className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">Total Datasets</h3>
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 my-4">
                        {stats.totalDocs}
                    </div>
                    <Link to="/history" className="text-sm text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1">
                        View All <FiArrowRight />
                    </Link>
                </motion.div>

                <motion.div variants={cardVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="glass-panel p-6 md:col-span-1 lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
                        <Link to="/history" className="text-sm text-slate-400 hover:text-white transition-colors">See all</Link>
                    </div>
                    <div className="space-y-4 shadow-inner">
                        {recentUploads.length === 0 ? (
                            <p className="text-slate-500 text-sm">No datasets uploaded yet.</p>
                        ) : (
                            recentUploads.map((item, i) => (
                                <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => window.location.href = `/analytics/${item._id}`}>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                        <FiClock />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-white text-sm font-medium truncate">{item.originalName}</div>
                                        <div className="text-slate-500 text-xs mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
