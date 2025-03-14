const express = require('express');
const {
  createList,
  getAllLists,
  getListById,
  updateList,
  deleteList,
} = require('../controllers/listController');

const router = express.Router();

router.post('/addList', createList);
router.get('/fetchAllList', getAllLists);
router.get('/fetchSingleList/:id', getListById);
router.put('/updateList/:id', updateList);
router.delete('/deleteList/:id', deleteList);

module.exports = router;