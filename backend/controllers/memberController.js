const Member = require('../models/Member');
const List = require('../models/List');
const Team = require('../models/Team');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv'); 


// Create a member
const createMember = async (req, res) => {
    let { name, email, userId, password, role, team, phone } = req.body;

    try {
        // Check if the member already exists
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ msg: 'Member with this email already exists' });
        }

        // Ensure team is an array
        if (typeof team === 'string') {
            team = [team]; // Convert single string to an array
        }

        if (!Array.isArray(team)) {
            return res.status(400).json({ msg: 'Team must be an array or string' });
        }

        // Find team IDs based on team names
        const teamIds = [];
        for (const teamName of team) {
            const teamDoc = await Team.findOne({ name: teamName.trim() });
            if (!teamDoc) {
                return res.status(400).json({ msg: `Team '${teamName}' not found` });
            }
            teamIds.push(teamDoc._id);
        }

        // Create a new member
        const newMember = new Member({
            name,
            email,
            userId,
            password,
            role,
            team: teamIds, // Store team IDs instead of team names
            phone,
        });

        await newMember.save();

        // Update assignedTo in Team model
        for (const teamId of teamIds) {
            await Team.findByIdAndUpdate(
                teamId,
                { 
                    $addToSet: { assignedTo: newMember._id }, // Add member ID if not already present
                    updatedAt: new Date() // Update timestamp
                },
                { new: true } // Return the updated document
            );
        }

        res.status(201).json({ msg: 'Member created successfully', member: newMember });
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


// Change password
const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const member = await Member.findOne({ userId });
        if (!member) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, member.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        member.password = hashedPassword;
        await member.save();

        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Delete a member
const deleteMember = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedMember = await Member.findOneAndDelete({ userId });

        if (!deletedMember) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        res.status(200).json({ msg: 'Member deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Delete all mebers
const deleteAllMembers = async (req, res) => {
    try {
        const result = await Member.deleteMany({});

        res.status(200).json({
            msg: 'All members deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};



// Update member details
const updateMember = async (req, res) => {
    try {
        const { name, email, role, team, phone } = req.body;
        const { memberId } = req.params;

        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ msg: 'Member not found' });
        }

        if (name) member.name = name;
        if (email) member.email = email;
        if (role) member.role = role;
        if (team) member.team = Array.isArray(team) ? team.map(t => t.trim()) : team;
        if (phone) member.phone = phone;

        member.updatedAt = Date.now();

        await member.save();

        res.status(200).json({ msg: 'Member updated successfully', member });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};



const exportMembers = async (req, res) => {
    try {
      const members = await Member.find()
  
      if (members.length === 0) {
        return res.status(404).json({ msg: 'No members found' });
      }
  
      const fields = [
        'name',
        'email',
        'userId',
        'role',
        'team',
        'phone',
        'createdAt',
        'updatedAt',
      ];
  
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(members);
  
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
  
      res.status(200).send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


const getListsByMember = async (req, res) => {
    const { memberId } = req.params;
  
    try {
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ msg: 'Member not found' });
      }
  
      const lists = await List.find({ assignedTo: memberId });
  
      res.status(200).json(lists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


module.exports = {
    createMember,
    getAllMembers,
    changePassword,
    deleteMember,
    deleteAllMembers,
    updateMember,
    exportMembers,
    getListsByMember
}