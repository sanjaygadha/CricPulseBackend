const express = require('express');
const router = express.Router();
const { register, login , userDetails , updateProfile,getAllUsers} = require('../controllers/authController');
const authMiddleware=require("../middleware/auth")

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

router.get('/getuser', authMiddleware, userDetails);

router.get('/getAllUsers', getAllUsers);

router.put('/updateprofile', authMiddleware, updateProfile);

module.exports = router;