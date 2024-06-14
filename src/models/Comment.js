// src/models/comment.js
async function createCommentTable(client) {
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        postId INTEGER NOT NULL,
        author VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  
  export default createCommentTable;