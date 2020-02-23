const express = require('express');

const router = express.Router({ mergeParams: true });
const voteRouter = require('./voteRoutes');

const {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  setUserQuestionId,
  hasPermission,
  checkIfQuestionExist
} = require('./../controllers/commentController');

const { protect } = require('./../controllers/authController');

router.use('/:commentId/votes', voteRouter);

router.use(protect);

router
  .route('/')
  .get(getAllComments)
  .post(setUserQuestionId, checkIfQuestionExist, createComment);

router
  .route('/:id')
  .get(getComment)
  .patch(hasPermission, updateComment)
  .delete(hasPermission, deleteComment);

module.exports = router;
