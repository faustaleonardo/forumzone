const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  getAllQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  // deleteQuestion,
  setUserId,
  hasPermission,
  selectUser,
  setSolved,
  setUnsolved,
  getAllQuestionsWithStatus,
  incrementView,
  getUnrepliedQuestions,
  getPopularThisWeekQuestions
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

router.get('/me', protect, setUserId, getAllQuestions);

router.get('/solved', protect, setSolved, getAllQuestionsWithStatus);
router.get('/unsolved', protect, setUnsolved, getAllQuestionsWithStatus);
router.get('/unreplied', protect, getUnrepliedQuestions);
router.get('/popular-this-week', protect, getPopularThisWeekQuestions);

router
  .route('/')
  .get(getAllQuestions)
  .post(protect, setUserId, createQuestion);

router
  .route('/:id')
  .get(incrementView, getQuestion)
  .patch(protect, hasPermission, updateQuestion);
// .delete(protect, hasPermission, deleteQuestion);

module.exports = router;
