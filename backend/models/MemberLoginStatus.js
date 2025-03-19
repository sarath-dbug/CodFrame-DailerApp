const mongoose = require('mongoose');

const memberLoginStatusSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, // Ensure each member has only one document
    ref: 'Member',
  },
  isLoggedIn: {
    type: Boolean,
    required: true,
    default: false, 
  },
  lastActivity: {
    type: Date,
    default: Date.now, 
  },
});

const MemberLoginStatus = mongoose.model('MemberLoginStatus', memberLoginStatusSchema);

module.exports = MemberLoginStatus;