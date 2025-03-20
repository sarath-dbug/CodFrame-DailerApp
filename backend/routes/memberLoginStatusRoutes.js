const express = require('express');
const {
    updateLoginStatus,
    getLoggedInMembersByTeam
} = require('../controllers/memberLoginStatusController');

const router = express.Router();

router.post('/update-login-status', updateLoginStatus);

router.get('/fetchAllLoggedInMembers', getLoggedInMembersByTeam);

module.exports = router;