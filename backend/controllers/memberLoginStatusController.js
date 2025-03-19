const MemberLoginStatus = require('../models/MemberLoginStatus');

// update member is login/logout in mobile app
const updateLoginStatus = async (req, res) => {
  try {
    const { memberId, isLoggedIn } = req.body;

    // Find the member's login status document or create a new one if it doesn't exist
    const memberLoginStatus = await MemberLoginStatus.findOneAndUpdate(
      { memberId },
      {
        isLoggedIn,
        lastActivity: Date.now(), 
      },
      { upsert: true, new: true } 
    );

    res.status(200).json({
      success: true,
      message: `Member login status updated to ${isLoggedIn ? 'logged in' : 'logged out'}`,
      data: memberLoginStatus,
    });
  } catch (error) {
    console.error('Error updating login status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update login status',
      error: error.message,
    });
  }
};

module.exports = { updateLoginStatus };