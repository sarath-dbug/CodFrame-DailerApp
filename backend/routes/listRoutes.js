const express = require('express');
const {
    createList,
    getAllLists,
    getListById,
    updateList,
    deleteList,
} = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addList', authMiddleware, createList);

router.get('/fetchAllList', getAllLists);

router.get('/fetchSingleList/:id', getListById);

router.put('/updateList/:id', authMiddleware, updateList);

router.delete('/deleteList/:id', authMiddleware, deleteList);

module.exports = router;