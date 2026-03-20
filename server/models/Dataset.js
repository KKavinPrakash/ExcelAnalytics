const mongoose = require('mongoose');

const datasetSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        columns: [{
            type: String
        }],
        analytics: {
            type: mongoose.Schema.Types.Mixed, // Will store sum, avg, min, max, frequency per column
        },
        rawData: {
            type: Array, // Could be large, realistically we might only store samples or processed stats, but for typical excel files this might be fine.
        }
    },
    {
        timestamps: true,
    }
);

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
