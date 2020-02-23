const express = require('express');

const router = express.Router();

const {
  getAllQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  setUserId,
  hasPermission
} = require('./../controllers/questionController');

const { protect } = require('./../controllers/authController');

const commentRouter = require('./../routes/commentRoutes');
const solveRouter = require('./../routes/solveRoutes');

router.use('/:questionId/comments', protect, commentRouter);
router.use('/:questionId/solves', protect, solveRouter);

router
  .route('/')
  .get(getAllQuestions)
  .post(protect, setUserId, createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .patch(protect, hasPermission, updateQuestion)
  .delete(protect, hasPermission, deleteQuestion);

module.exports = router;
