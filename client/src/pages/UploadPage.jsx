import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile) => {
        setError('');
        // Check file type
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

        if (validTypes.includes(selectedFile.type) || validExtensions.includes(extension)) {
            setFile(selectedFile);
        } else {
            setError('Please upload a valid Excel (.xlsx, .xls) or CSV file.');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/data', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Navigate to the newly processed dataset analytics
            navigate(`/analytics/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Upload Dataset</h1>
                <p className="text-slate-400">Upload your Excel or CSV files to generate intelligent insights and charts instantly.</p>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3"
                >
                    <FiX className="shrink-0" />
                    <p className="text-sm">{error}</p>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`relative overflow-hidden glass-panel border-2 border-dashed transition-all duration-300 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]
            ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'}
            ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
          `}
                >
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center pointer-events-none"
                            >
                                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                                    <FiUploadCloud className="text-5xl text-primary-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Drag & Drop your file here</h3>
                                <p className="text-slate-400 mb-8 max-w-sm">Supports .xlsx, .xls, and .csv files. We will automatically process all columns and rows.</p>
                                <div className="pointer-events-auto">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file-upload" className="btn-secondary cursor-pointer inline-flex">
                                        Browse Files
                                    </label>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full max-w-md pointer-events-auto"
                            >
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                        <FiFile className="text-3xl" />
                                    </div>
                                    <div className="text-left overflow-hidden flex-1">
                                        <h4 className="text-white font-medium truncate" title={file.name}>{file.name}</h4>
                                        <p className="text-slate-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <FiX />
                                    </button>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className={`btn-primary w-full ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isUploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <FiCheckCircle /> Generate Analytics
                                        </span>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadPage;
