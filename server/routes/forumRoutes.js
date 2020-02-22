const express = require('express');

const router = express.Router();

const {
  getAllForums,
  createForum,
  getForum,
  updateForum,
  deleteForum,
  setUserId
} = require('./../controllers/forumController');

const { protect } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllForums)
  .post(protect, setUserId, createForum);

router
  .route('/:id')
  .get(getForum)
  .patch(protect, updateForum)
  .delete(protect, deleteForum);

module.exports = router;
