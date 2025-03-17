const Member = require('../models/Member');


// create a member
const createMember = async (req, res) => {
    const { name, email, userId, password, role, team, phone } = req.body;
  
    try {
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        return res.status(400).json({ msg: 'Member with this email already exists' });
      }
  
      if (!Array.isArray(team)) {
        return res.status(400).json({ msg: 'Team must be an array' });
      }
  
      const formattedTeam = team.map((teamName) => teamName.trim())
      if (formattedTeam.length === 0) {
        return res.status(400).json({ msg: 'At least one team is required' });
      }
  
      const newMember = new Member({
        name,
        email,
        userId,
        password,
        role,
        team: formattedTeam, 
        phone,
      });
  
      await newMember.save();
  
      res.status(201).json({ msg: 'Member created successfully', member: newMember.toJSON()});
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };



// Fetch all members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().select('-password'); // Exclude the password field

        if (members.length === 0) {
            return res.status(404).json({ msg: 'No members found' });
        }

        res.status(200).json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


module.exports = {
    createMember,
    getAllMembers
}