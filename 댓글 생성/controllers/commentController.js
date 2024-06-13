const Comment = require('../models/Comment');

// 댓글 생성 함수
exports.createComment = async (req, res) => {
    try {
        // 요청 본문에서 댓글 데이터 추출
        const { postId, author, content } = req.body;
        
        // 새로운 댓글 인스턴스 생성
        const newComment = new Comment({
            postId,
            author,
            content
        });

        // 데이터베이스에 댓글 저장
        await newComment.save();
        
        // 댓글이 달린 게시글 페이지로 리디렉션
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        // 오류 발생 시 500 상태 코드와 에러 메시지 전송
        res.status(500).send('Error creating comment: ' + error.message);
    }
};