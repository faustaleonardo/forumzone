const express = require('express');

const router = express.Router();

const {
  getAllForums,
  createForum
} = require('./../controllers/forumController');

const { protect } = require('./../controllers/authController');

router
  .route('/')
  .get(getAllForums)
  .post(protect, createForum);

module.exports = router;
