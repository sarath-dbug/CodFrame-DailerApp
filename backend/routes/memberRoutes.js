const express = require('express');
const { createMember } = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addMember', authMiddleware, createMember);

module.exports = router;