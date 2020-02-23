const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  getAllBookmarks,
  createBookmark,
  getBookmark,
  deleteBookmark,
  setUserQuestionId,
  hasPermission,
  checkIfQuestionExist
} = require('./../controllers/bookmarkController');

const { protect } = require('./../controllers/authController');

router.use(protect);
router
  .route('/')
  .get(getAllBookmarks)
  .post(setUserQuestionId, checkIfQuestionExist, createBookmark);

router
  .route('/:id')
  .get(getBookmark)
  .delete(hasPermission, deleteBookmark);

module.exports = router;
