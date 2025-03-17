const Member = require('../models/Member');

const createMember = async (req, res) => {
    const { name, email, userId, password, role, team, phone } = req.body;
  
    try {
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        return res.status(400).json({ msg: 'Member with this email already exists' });
      }
  
      const newMember = new Member({
        name,
        email,
        userId,
        password,
        role,
        team,
        phone,
      });
  
      await newMember.save();
  
      const memberResponse = newMember.toObject();
      delete memberResponse.password;
  
      res.status(201).json({ msg: 'Member created successfully', member: memberResponse });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };


  module.exports = {
    createMember,
  }