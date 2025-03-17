const Team = require('../models/Team');

const createTeam = async (req, res) => {
    const { name } = req.body;

    try {
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(400).json({ msg: 'Team name already exists' });
        }
        
        const newTeam = new Team({ name });
        await newTeam.save();

        res.status(201).json({ msg: 'Team created successfully', team: newTeam });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { createTeam };
