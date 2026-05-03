const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  uploadItemImage,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getItems);
router.get('/:id', getItemById);

router.post('/', protect, adminOnly, createItem);
router.put('/:id', protect, adminOnly, updateItem);
router.delete('/:id', protect, adminOnly, deleteItem);
router.post('/:id/upload', protect, adminOnly, upload.single('image'), uploadItemImage);

module.exports = router;
