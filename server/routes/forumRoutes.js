const express = require('express');

const router = express.Router();

const {
  getAllForums,
  createForum,
  getForum,
  updateForum,
  deleteForum
} = require('./../controllers/forumController');

const { protect } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllForums)
  .post(protect, createForum);

router
  .route('/:id')
  .get(protect, getForum)
  .patch(protect, updateForum)
  .delete(protect, deleteForum);

module.exports = router;
