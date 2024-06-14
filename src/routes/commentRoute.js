// src/routes/commentRoute.js
import express from 'express';
import { createComment } from '../controllers/commentController.js';

const router = express.Router();

// POST 요청을 처리하여 새로운 댓글을 생성
router.post('/', createComment);

export default router;