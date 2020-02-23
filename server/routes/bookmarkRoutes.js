const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  getAllBookmarks,
  createBookmark,
  getBookmark,
  deleteBookmark,
  setUserQuestionId,
  hasPermission
} = require('./../controllers/bookmarkController');

const { protect } = require('./../controllers/authController');

router.use(protect);
router
  .route('/')
  .get(getAllBookmarks)
  .post(setUserQuestionId, createBookmark);

router
  .route('/:id')
  .get(getBookmark)
  .delete(hasPermission, deleteBookmark);

module.exports = router;
