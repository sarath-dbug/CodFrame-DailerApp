const express = require('express');
const { createMember, getAllMembers } = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addMember', authMiddleware, createMember);
router.get('/fetchAllMembers', getAllMembers);

module.exports = router;