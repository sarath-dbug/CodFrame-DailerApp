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


const deleteTeam = async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        await Team.findByIdAndDelete(teamId);

        res.status(200).json({ msg: 'Team deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


const editTeam = async (req, res) => {
    const { teamId } = req.params;
    const { name } = req.body;
  
    try {

      if (!name || !name.trim()) {
        return res.status(400).json({ msg: 'Team name is required' });
      }
  
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
  
      const existingTeam = await Team.findOne({ name });
      if (existingTeam && existingTeam._id.toString() !== teamId) {
        return res.status(400).json({ msg: 'Team name already exists' });
      }
  
      team.name = name.trim();
      await team.save();
  
      res.status(200).json({ msg: 'Team updated successfully', team });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };

module.exports = {
    createTeam,
    deleteTeam,
    editTeam
};
