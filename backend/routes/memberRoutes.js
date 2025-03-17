const express = require("express");
const {
    createMember,
    getAllMembers,
    changePassword,
    deleteMember,
    deleteAllMembers,
    updateMember
} = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addMember", authMiddleware, createMember);
router.get("/fetchAllMembers", getAllMembers);
router.put("/changePassword", authMiddleware, changePassword);
router.delete('/deleteMember/:userId', authMiddleware, deleteMember);
router.delete('/deleteAllMembers', authMiddleware, deleteAllMembers);
router.put('/updateMember/:memberId', authMiddleware, updateMember);

module.exports = router;
