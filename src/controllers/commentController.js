// src/controllers/commentController.js
import { pool } from '../configs/db.js';

// 댓글 생성 함수
export const createComment = async (req, res) => {
  const { postId, author, content } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO comments (postId, author, content) VALUES ($1, $2, $3) RETURNING *`,
      [postId, author, content]
    );
    client.release();

    const newComment = result.rows[0];
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send('Error creating comment: ' + error.message);
  }
};