const express = require('express');
const { createTeam } = require('../controllers/teamController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/addTeam',authMiddleware, createTeam);

module.exports = router;
