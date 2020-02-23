const express = require('express');

const router = express.Router();

const {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  setUserQuestionId,
  checkIfUserMatch
} = require('./../controllers/commentController');

const { protect } = require('./../controllers/authController');

router.use(protect);
router.get('/', getAllComments);
router.post('/:questionId', setUserQuestionId, createComment);

router
  .route('/:id')
  .get(getComment)
  .patch(protect, checkIfUserMatch, updateComment)
  .delete(protect, checkIfUserMatch, deleteComment);

module.exports = router;
