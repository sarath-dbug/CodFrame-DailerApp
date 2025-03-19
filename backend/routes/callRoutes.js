const express = require('express');
const { storeCallResponse } = require('../controllers/callController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/callResponses', authMiddleware, storeCallResponse);

module.exports = router;