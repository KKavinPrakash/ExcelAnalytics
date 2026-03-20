import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiFileText, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HistoryPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/data');
                setDatasets(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-400">Loading history...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Upload History</h1>
                    <p className="text-slate-400">View and access your previously analyzed datasets.</p>
                </div>
                <Link to="/upload" className="btn-primary flex items-center gap-2 max-w-max self-start sm:self-auto">
                    Upload New file
                </Link>
            </div>

            {datasets.length === 0 ? (
                <div className="glass-panel p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 text-slate-500 flex items-center justify-center mb-6">
                        <FiFileText className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No datasets yet</h3>
                    <p className="text-slate-400 mb-6 max-w-md">You haven't uploaded any files for analysis yet. Your history will appear here.</p>
                    <Link to="/upload" className="btn-secondary">Get Started</Link>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4"
                >
                    {datasets.map((dataset) => (
                        <motion.variants key={dataset._id} variants={item}>
                            <Link
                                to={`/analytics/${dataset._id}`}
                                className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 hover:border-primary-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 text-primary-400 flex items-center justify-center shrink-0">
                                        <FiFileText className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">{dataset.originalName}</h4>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><FiCalendar /> {new Date(dataset.createdAt).toLocaleString()}</span>
                                            <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                                            <span>{dataset.columns?.length || 0} columns</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                    <span className="text-sm font-medium mr-2">View Analytics</span>
                                    <FiArrowRight />
                                </div>
                            </Link>
                        </motion.variants>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default HistoryPage;
