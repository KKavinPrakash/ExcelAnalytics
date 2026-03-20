import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { FiArrowLeft, FiDatabase, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1', '#14B8A6'];

const AnalyticsPage = () => {
    const { id } = useParams();
    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDataset = async () => {
            try {
                const res = await api.get(`/data/${id}`);
                setDataset(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dataset');
            } finally {
                setLoading(false);
            }
        };
        fetchDataset();
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-slate-400">Analyzing dataset...</div>;
    }

    if (error || !dataset) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
                    <FiAlertCircle className="text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Error loading dataset</h2>
                <p className="text-slate-400 mb-8">{error}</p>
                <Link to="/history" className="btn-secondary">Back to History</Link>
            </div>
        );
    }

    const { analytics, columns } = dataset;

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-3 text-sm">
                    <p className="text-white font-medium mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderNumericMetrics = (colName, data) => {
        const chartData = [
            { name: 'Min', value: data.min },
            { name: 'Average', value: data.avg },
            { name: 'Max', value: data.max },
        ];

        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={colName} className="glass-panel p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary-500 rounded-sm"></div>
                    {colName} <span className="text-xs text-slate-500 font-normal border border-slate-700 px-2 py-0.5 rounded ml-2">Numeric</span>
                </h3>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">Sum</div>
                        <div className="text-xl font-semibold text-white truncate" title={data.sum}>{data.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">Average</div>
                        <div className="text-xl font-semibold text-primary-400 truncate" title={data.avg}>{data.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">Minimum</div>
                        <div className="text-xl font-semibold text-white truncate" title={data.min}>{data.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-slate-400 text-xs mb-1">Maximum</div>
                        <div className="text-xl font-semibold text-white truncate" title={data.max}>{data.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} tickFormatter={(val) => val.toLocaleString(undefined, { notation: "compact" })} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        );
    };

    const renderStringMetrics = (colName, data) => {
        // Convert frequency map to array and take top 10
        const freqData = Object.entries(data.frequency || {})
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={colName} className="glass-panel p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-accent-500 rounded-sm"></div>
                    {colName} <span className="text-xs text-slate-500 font-normal border border-slate-700 px-2 py-0.5 rounded ml-2">Categorical</span>
                </h3>

                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-white/5 rounded-xl p-4 flex-1">
                        <div className="text-slate-400 text-xs mb-1">Unique Values</div>
                        <div className="text-xl font-semibold text-white">{data.uniqueCount}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex-1">
                        <div className="text-slate-400 text-xs mb-1">Top Category</div>
                        <div className="text-xl font-semibold text-accent-400 truncate">{freqData.length > 0 ? freqData[0].name : 'N/A'}</div>
                    </div>
                </div>

                {freqData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-80">
                        <div className="h-full">
                            <h4 className="text-sm text-slate-400 mb-2 text-center">Top Values Distribution (Pie)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={freqData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        stroke="none"
                                    >
                                        {freqData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-full">
                            <h4 className="text-sm text-slate-400 mb-2 text-center">Frequency (Bar)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={freqData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="#94A3B8" hide />
                                    <YAxis dataKey="name" type="category" stroke="#94A3B8" tickLine={false} axisLine={false} width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                                        {freqData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-10">No frequency data available.</p>
                )}
            </motion.div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto py-4">
            <div className="mb-8">
                <Link to="/history" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
                    <FiArrowLeft /> Back to History
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 text-primary-400 flex items-center justify-center shrink-0">
                        <FiDatabase className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white leading-tight">{dataset.originalName}</h1>
                        <p className="text-slate-400">Processed on {new Date(dataset.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {columns.map(col => {
                    const colData = analytics[col];
                    if (!colData) return null;

                    if (colData.type === 'number') {
                        return renderNumericMetrics(col, colData);
                    } else if (colData.type === 'string') {
                        return renderStringMetrics(col, colData);
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default AnalyticsPage;
