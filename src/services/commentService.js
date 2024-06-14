// src/services/commentService.js
import Comment from '../models/Comment.js';

// 댓글 생성 함수
export const createComment = async (data) => {
  const { postId, author, content } = data;

  // 새로운 댓글 인스턴스 생성 및 데이터베이스에 저장
  const newComment = await Comment.create({
    postId,
    author,
    content,
  });

  // 저장된 댓글 반환
  return newComment;
};