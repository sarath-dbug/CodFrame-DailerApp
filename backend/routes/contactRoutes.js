const express = require('express');
const upload = require('../utils/upload');
const { createContact, uploadContactsFromCSV } = require('../controllers/contactController');

const router = express.Router();

router.post('/addContact', createContact);
router.post('/addContacts-csv', upload.single('file'), uploadContactsFromCSV);

module.exports = router; 