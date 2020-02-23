const express = require('express');

const router = express.Router();

const {
  getAllQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  setUserId,
  checkIfUserMatch
} = require('./../controllers/questionController');

const { protect } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllQuestions)
  .post(protect, setUserId, createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .patch(protect, checkIfUserMatch, updateQuestion)
  .delete(protect, checkIfUserMatch, deleteQuestion);

module.exports = router;
