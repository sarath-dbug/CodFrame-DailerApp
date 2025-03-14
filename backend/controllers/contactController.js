const Contact = require('../models/Contact');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const path = require('path');

// Upload contacts
const createContact = async (req, res) => {
  const {
    number,
    secondaryNumber,
    name,
    companyName,
    email,
    dealValue,
    leadScore,
    disposition,
    address,
    extra,
    remarks,
    note,
  } = req.body;

  try {
    // Check if the contact already exists
    const existingContact = await Contact.findOne({ number });
    if (existingContact) {
      return res.status(400).json({ msg: 'Contact with this number already exists' });
    }

    // Create a new contact
    const newContact = new Contact({
      number,
      secondaryNumber,
      name,
      companyName,
      email: email || '', 
      dealValue: dealValue || 0, 
      leadScore: leadScore || 0, 
      disposition: disposition || 'NEW',
      address,
      extra,
      remarks,
      note,
    });

    await newContact.save();

    res.status(201).json({ msg: 'Contact created successfully', contact: newContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Upload contacts from CSV
const uploadContactsFromCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const { listId } = req.body; 
  if (!listId) {
    return res.status(400).json({ msg: 'List ID is required' });
  }

  const contacts = [];
  const filePath = req.file.path;
  const fileExtension = path.extname(filePath).toLowerCase();

  try {
    if (fileExtension === '.csv') {
      // Handle CSV files
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const contact = {
            number: row.number,
            secondaryNumber: row.secondaryNumber || '',
            name: row.name,
            companyName: row.companyName || '',
            email: row.email || '',
            dealValue: row.dealValue ? parseFloat(row.dealValue) : 0,
            leadScore: row.leadScore ? parseInt(row.leadScore) : 0, 
            disposition: row.disposition || 'NEW',
            address: row.address || '',
            extra: row.extra || '',
            remarks: row.remarks || '',
            note: row.note || '',
            list: listId, 
          };
          contacts.push(contact);
        })
        .on('end', async () => {
          await Contact.insertMany(contacts);
          res.status(201).json({ msg: 'Contacts uploaded successfully', contacts });
        });
    } else if (fileExtension === '.xlsx') {
      // Handle Excel files
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet);

      rows.forEach((row) => {
        const contact = {
          number: row.number,
          secondaryNumber: row.secondaryNumber || '',
          name: row.name,
          companyName: row.companyName || '',
          email: row.email || '', 
          dealValue: row.dealValue ? parseFloat(row.dealValue) : 0, 
          leadScore: row.leadScore ? parseInt(row.leadScore) : 0, 
          disposition: row.disposition || 'NEW',
          address: row.address || '',
          extra: row.extra || '',
          remarks: row.remarks || '',
          note: row.note || '',
          list: listId, 
        };
        contacts.push(contact);
      });

      await Contact.insertMany(contacts);
      res.status(201).json({ msg: 'Contacts uploaded successfully', contacts });
    } else {
      return res.status(400).json({ msg: 'Invalid file type. Only CSV and Excel files are allowed.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  } finally {
    // Delete the uploaded file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};


// Fetch all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('list', 'name'); // Populate the list field with the list name
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Fetch all list contacts
const getAllListContacts = async (req, res) => {
  const { listId } = req.query; 

  try {
    let query = {};
    if (listId) {
      query.list = listId; // Filter by listId if provided
    }

    const contacts = await Contact.find(query).populate('list', 'name');
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



module.exports = {
  createContact,
  uploadContactsFromCSV,
  getAllContacts,
  getAllListContacts
}