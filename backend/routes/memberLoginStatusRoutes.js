const express = require('express');
const { updateLoginStatus } = require('../controllers/memberLoginStatusController');

const router = express.Router();

router.post('/update-login-status', updateLoginStatus);

module.exports = router;