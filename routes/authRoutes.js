const express = require('express');
const { loginUser, getUserProfile } = require('../Controllers/authControllers');
const { verifyJWTToken, verifyTokenAndAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', verifyJWTToken, getUserProfile);
router.get('/verify/admin-users/:email', verifyTokenAndAdmin)
router.post('/login', loginUser);

module.exports = router;
