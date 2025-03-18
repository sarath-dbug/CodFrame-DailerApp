const Contact = require('../models/Contact');
const List = require('../models/List');
const Member = require('../models/Member');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const path = require('path');
const json2csv = require('json2csv').parse;
const { parsePhoneNumberFromString } = require('libphonenumber-js');

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

  const { listId, countryCode = 'IN' } = req.body; // Default country code is 'IN' (India)
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
            number: formatPhoneNumber(row.number, countryCode), // Add country code
            secondaryNumber: formatPhoneNumber(row.secondaryNumber || '', countryCode), // Add country code
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
          number: formatPhoneNumber(row.number, countryCode),
          secondaryNumber: formatPhoneNumber(row.secondaryNumber || '', countryCode), 
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

// Helper function to format phone numbers with country code
const formatPhoneNumber = (phoneNumber, countryCode) => {
  if (!phoneNumber) return ''; 

  // Parse the phone number
  const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);

  // If the phone number is valid, format it with the country code
  if (parsedNumber && parsedNumber.isValid()) {
    return parsedNumber.formatInternational(); // Format as international number
  }

  return phoneNumber;
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


// Export Contacts ByList
const exportContactsByList = async (req, res) => {
  try {
    const listId = req.params.id;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    const contacts = await Contact.find({ list: listId });

    if (contacts.length === 0) {
      return res.status(404).json({ msg: 'No contacts found for this list' });
    }

    // Create CSV JSON data
    const csvData = contacts.map((contact) => ({
      number: contact.number,
      secondaryNumber: contact.secondaryNumber,
      name: contact.name,
      companyName: contact.companyName,
      email: contact.email,
      dealValue: contact.dealValue,
      leadScore: contact.leadScore,
      disposition: contact.disposition,
      address: contact.address,
      extra: contact.extra,
      remarks: contact.remarks,
      note: contact.note,
      createdOn: contact.createdOn.toISOString(),
      status: contact.status,
    }));

    // Convert JSON data to CSV
    const csv = json2csv(csvData, {
      fields: [
        'number',
        'secondaryNumber',
        'name',
        'companyName',
        'email',
        'dealValue',
        'leadScore',
        'disposition',
        'address',
        'extra',
        'remarks',
        'note',
        'createdOn',
        'status',
      ],
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${list.name}_contacts.csv`);

    // Send the CSV file as a response
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Export All Contacts
const exportAllContacts = async (req, res) => {
  try {
    // Step 1: Fetch all contacts
    const contacts = await Contact.find();

    if (contacts.length === 0) {
      return res.status(404).json({ msg: 'No contacts found' });
    }

    // Step 2: Create CSV data
    const csvData = contacts.map((contact) => ({
      number: contact.number,
      secondaryNumber: contact.secondaryNumber,
      name: contact.name,
      companyName: contact.companyName,
      email: contact.email,
      dealValue: contact.dealValue,
      leadScore: contact.leadScore,
      disposition: contact.disposition,
      address: contact.address,
      extra: contact.extra,
      remarks: contact.remarks,
      note: contact.note,
      createdOn: contact.createdOn.toISOString(),
      status: contact.status,
      list: contact.list ? contact.list.toString() : '', // Convert ObjectId to string
    }));

    // Step 3: Convert JSON to CSV
    const json2csv = require('json2csv').parse;
    const csv = json2csv(csvData, {
      fields: [
        'number',
        'secondaryNumber',
        'name',
        'companyName',
        'email',
        'dealValue',
        'leadScore',
        'disposition',
        'address',
        'extra',
        'remarks',
        'note',
        'createdOn',
        'status',
        'list',
      ],
    });

    // Step 4: Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=all_contacts.csv');

    // Step 5: Send the CSV file as a response
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Assign Contacts from a List to a Member
const assignContactsFromListToMember = async (req, res) => {
  try {
    const { memberId, listId } = req.body;

    if (!memberId || !listId) {
      return res.status(400).json({ msg: 'Member ID and List ID are required' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    const contacts = await Contact.find({ list: listId });
    if (contacts.length === 0) {
      return res.status(400).json({ msg: 'No contacts found in the list' });
    }

    // Update the assignedTo field in the List document
    list.assignedTo = memberId;
    await list.save();

    // Update the assignedTo field for all contacts in the list
    await Contact.updateMany(
      { list: listId },
      { assignedTo: memberId }
    );

    res.status(200).json({
      msg: 'Contacts assigned successfully',
      assignedContacts: contacts.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


module.exports = {
  createContact,
  uploadContactsFromCSV,
  getAllContacts,
  getAllListContacts,
  exportContactsByList,
  exportAllContacts,
  assignContactsFromListToMember
}