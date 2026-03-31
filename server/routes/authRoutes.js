const express = require('express');
const router = express.Router();
const {registerUser, authUser, deleteUser, getAllUser } = require('../controllers/authController');

router.get("/user", getAllUser)
router.post('/register', registerUser);
router.post('/login', authUser);
router.delete("/delete/:id", deleteUser)

module.exports = router;
