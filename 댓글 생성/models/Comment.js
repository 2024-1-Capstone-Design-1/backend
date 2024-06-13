// src/models/Comment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 댓글 스키마 정의
const commentSchema = new Schema({
    // 댓글이 달린 게시글의 ID (Post 모델과의 참조 관계)
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    // 댓글 작성자
    author: { type: String, required: true },
    // 댓글 내용
    content: { type: String, required: true },
    // 댓글 생성 시간
    createdAt: { type: Date, default: Date.now }
});

// Comment 모델을 내보내기
module.exports = mongoose.model('Comment', commentSchema);