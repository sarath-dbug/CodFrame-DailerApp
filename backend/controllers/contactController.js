const Contact = require('../models/Contact');


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

module.exports = {createContact}