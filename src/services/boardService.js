import logger from "../utils/logger.js";
import AppResponse from "../utils/appResponse.js";
import AppError from "../utils/appError.js";

async function createBoard(boardData, user, dbClient) {
  try {
    const { title, detail, image_url } = boardData;

    if (!Array.isArray(image_url)) {
      logger.debug(
        `createBoard(boardService): Expected image_url to be an array, but got ${typeof image_url}`
      );
      throw new AppError(400, `Expected image_url to be an array`);
    }

    const userId = user.id;

    const existingBlog = await dbClient.query(
      `SELECT id FROM blogs WHERE user_id = $1`,
      [userId]
    );

    if (existingBlog.rows.length < 1) {
      logger.debug(
        `createBoard(boardService): Blog does not exists with userId(${userId})`
      );

      throw new AppError(400, `Blog does not exists`);
    }

    const blogId = existingBlog.rows[0].id;

    await dbClient.query("BEGIN");

    const boardCreateResult = await dbClient.query(
      `INSERT INTO boards (title, detail, user_id, blog_id) VALUES ($1, $2, $3, $4) returning id`,
      [title, detail, userId, blogId]
    );

    const boardId = boardCreateResult.rows[0].id;

    if (!boardId) {
      throw new AppError(500, `Internal Server Error`);
    }

    let image_cnt = 0;

    for (let i = 0; i < image_url.length; i++) {
      const image = image_url[i];

      const boardImageCreateResult = await dbClient.query(
        `INSERT INTO board_images (image, board_id) VALUES ($1, $2) returning id`,
        [image, boardId]
      );

      if (boardImageCreateResult.rows[0].id) {
        image_cnt += 1;
      } else {
        throw new AppError(500, `Internal Server Error`);
      }
    }

    if (image_cnt !== image_url.length) {
      throw new AppError(500, `Internal Server Error`);
    }

    await dbClient.query("COMMIT");

    logger.debug(
      `createBoard(boardService): New blog created with blogId(${blogId})`
    );

    return new AppResponse(201, `Board created successfully`);
  } catch (err) {
    logger.error(`createBoard(boardService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

export { createBoard };
