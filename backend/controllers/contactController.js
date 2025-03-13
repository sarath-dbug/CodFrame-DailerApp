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
    disposition,
    address,
    extra,
    remarks,
    note,
  } = req.body;

  try {
    const existingContact = await Contact.findOne({ number });
    if (existingContact) {
      return res.status(400).json({ msg: 'Contact with this number already exists' });
    }

    const newContact = new Contact({
      number,
      secondaryNumber,
      name,
      companyName,
      disposition: disposition || 'NEW', // Default to 'NEW' if not provided
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
            disposition: row.disposition || 'NEW',
            address: row.address || '',
            extra: row.extra || '',
            remarks: row.remarks || '',
            note: row.note || '',
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
          disposition: row.disposition || 'NEW',
          address: row.address || '',
          extra: row.extra || '',
          remarks: row.remarks || '',
          note: row.note || '',
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



module.exports = {
    createContact,
    uploadContactsFromCSV
}