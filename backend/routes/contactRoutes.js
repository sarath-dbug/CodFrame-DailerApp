const express = require('express');
const upload = require('../utils/upload');
const { createContact, uploadContactsFromCSV } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addContact', authMiddleware, createContact);

router.post('/addContacts-csv', authMiddleware, upload.single('file'), uploadContactsFromCSV);

module.exports = router; 