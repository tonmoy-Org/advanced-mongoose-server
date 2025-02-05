const express = require('express');
const { loginUser, getUserProfile } = require('../controllers/authControllers');


const router = express.Router();

router.get('/profile', getUserProfile);
router.get('/verify/admin-users/:email')
router.post('/login', loginUser);

module.exports = router;
