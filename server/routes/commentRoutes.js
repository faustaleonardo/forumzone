const express = require('express');

const router = express.Router();

const {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  setUserQuestionId
} = require('./../controllers/questionController');

const { protect } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllComments)
  .post(protect, setUserQuestionId, createComment);

router
  .route('/:id')
  .get(getComment)
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
