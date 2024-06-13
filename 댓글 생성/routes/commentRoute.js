// src/routes/commentRoute.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// POST 요청을 처리하여 새로운 댓글을 생성
router.post('/', commentController.createComment);

module.exports = router;