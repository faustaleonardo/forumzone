const express = require('express');

const router = express.Router();

const {
  getAllSolves,
  getSolve,
  createSolve,
  setUserQuestionId,
  checkIfQuestionExist
} = require('./../controllers/solveController');

const { protect } = require('./../controllers/authController');

router.use(protect);
router
  .route('/')
  .get(getAllSolves)
  .post(checkIfQuestionExist, setUserQuestionId, createSolve);

router.get('/:id').get(getSolve);

module.exports = router;
