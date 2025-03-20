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


const getLoggedInMembersByTeam = async (req, res) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ success: false, message: "Team ID is required" });
    }

    // Find all logged-in members
    const loggedInMembers = await MemberLoginStatus.find({ isLoggedIn: true })
      .populate({
        path: "memberId",
        select: "name email team", // Fetch only necessary fields
      });

    // Filter members belonging to the specified team
    const filteredMembers = loggedInMembers.filter(member => 
      member.memberId && member.memberId.team.includes(teamId)
    );

    res.status(200).json({
      success: true,
      message: "Logged-in members fetched successfully for the team",
      data: filteredMembers,
    });
  } catch (error) {
    console.error("Error fetching logged-in members by team:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch logged-in members",
      error: error.message,
    });
  }
};

module.exports = {
  updateLoginStatus,
  getLoggedInMembersByTeam
};