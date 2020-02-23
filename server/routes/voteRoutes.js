const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  getAllVotes,
  createVote,
  getVote,
  deleteVote,
  setUserCommentId,
  hasPermission,
  checkIfCommentExist
} = require('./../controllers/voteController');

const { protect } = require('./../controllers/authController');

router.use(protect);
router
  .route('/')
  .get(getAllVotes)
  .post(setUserCommentId, checkIfCommentExist, createVote);

router
  .route('/:id')
  .get(getVote)
  .delete(hasPermission, deleteVote);

module.exports = router;
