const express = require('express');
const {
    createTeam,
    deleteTeam,
    editTeam
} = require('../controllers/teamController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/addTeam', authMiddleware, createTeam);

router.delete('/deleteTeam/:teamId', authMiddleware, deleteTeam);

router.put('/editTeam/:teamId', authMiddleware, editTeam);

module.exports = router;
