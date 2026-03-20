const xlsx = require('xlsx');
const Dataset = require('../models/Dataset');
const fs = require('fs');

const uploadDataset = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'File is empty' });
        }

        const columns = Object.keys(data[0]);
        const analytics = {};

        columns.forEach(col => {
            let isNumeric = true;
            let sum = 0;
            let min = Number.MAX_VALUE;
            let max = Number.MIN_VALUE;
            let count = 0;
            let freqMap = {};

            data.forEach(row => {
                const val = row[col];
                if (val !== undefined && val !== null && val !== '') {
                    count++;
                    if (typeof val === 'number') {
                        sum += val;
                        if (val < min) min = val;
                        if (val > max) max = val;
                    } else {
                        // Also attempt to parse string to number if possible to be robust
                        if (!isNaN(val) && val.toString().trim() !== '') {
                            const numVal = parseFloat(val);
                            sum += numVal;
                            if (numVal < min) min = numVal;
                            if (numVal > max) max = numVal;
                        } else {
                            isNumeric = false;
                        }
                    }
                    freqMap[val] = (freqMap[val] || 0) + 1;
                }
            });

            if (isNumeric && count > 0) {
                analytics[col] = {
                    type: 'number',
                    sum,
                    avg: sum / count,
                    min,
                    max,
                };
            } else if (count > 0) {
                const sortedFreq = Object.entries(freqMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 50)
                    .reduce((obj, [k, v]) => {
                        obj[k] = v;
                        return obj;
                    }, {});

                analytics[col] = {
                    type: 'string',
                    frequency: sortedFreq,
                    uniqueCount: Object.keys(freqMap).length
                };
            }
        });

        const dataset = await Dataset.create({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            columns,
            analytics,
        });

        fs.unlinkSync(req.file.path);

        res.status(201).json(dataset);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        const datasets = await Dataset.find({ user: req.user._id }).sort({ createdAt: -1 }).select('-rawData -analytics');
        res.json(datasets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDataset = async (req, res) => {
    try {
        const dataset = await Dataset.findById(req.params.id);
        if (!dataset || dataset.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        res.json(dataset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { uploadDataset, getHistory, getDataset };
