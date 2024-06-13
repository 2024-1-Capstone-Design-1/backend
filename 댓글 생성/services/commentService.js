// src/services/commentService.js
const Comment = require('../models/Comment');

// 댓글 생성 함수
exports.createComment = async (data) => {
    const { postId, author, content } = data;

    // 새로운 댓글 인스턴스 생성
    const newComment = new Comment({
        postId,
        author,
        content
    });

    // 데이터베이스에 댓글 저장
    await newComment.save();
    
    // 저장된 댓글 반환
    return newComment;
};