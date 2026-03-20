const express = require('express');
const router = express.Router();
const { uploadDataset, getHistory, getDataset } = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').post(protect, upload.single('file'), uploadDataset).get(protect, getHistory);
router.route('/:id').get(protect, getDataset);

module.exports = router;
