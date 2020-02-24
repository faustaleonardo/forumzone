const express = require('express');

const router = express.Router();

const {
  getAllQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  // deleteQuestion,
  setUserId,
  hasPermission,
  selectUser
} = require('./../controllers/questionController');

const { protect } = require('./../controllers/authController');

const commentRouter = require('./../routes/commentRoutes');
const bookmarkRouter = require('./../routes/bookmarkRoutes');

router.patch(
  '/:id/comments/:commentId/solve',
  protect,
  hasPermission,
  selectUser,
  updateQuestion
);

router.use('/:questionId/comments', protect, commentRouter);
router.use('/:questionId/bookmarks', protect, bookmarkRouter);

router
  .route('/')
  .get(getAllQuestions)
  .post(protect, setUserId, createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .patch(protect, hasPermission, updateQuestion);
// .delete(protect, hasPermission, deleteQuestion);

module.exports = router;
