import logger from "../utils/logger.js";
import AppResponse from "../utils/appResponse.js";
import AppError from "../utils/appError.js";

async function createBoard(boardData, user, subDomain, dbClient) {
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
      `SELECT id FROM blogs WHERE subdomain = $1 and user_id = $2`,
      [subDomain, userId]
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

async function getAllBoards(subDomain, dbClient) {
  try {
    const existingBlog = await dbClient.query(
      `SELECT id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingBlog.rows.length === 0) {
      logger.debug(
        `getAllBoards(boardService): Blog not found for subdomain(${subDomain})`
      );

      throw new AppError(404, "Blog not found");
    }

    const blogId = existingBlog.rows[0].id;

    const boardsResult = await dbClient.query(
      `
      SELECT b.id, b.title, b.detail, b.created_at,
      COALESCE(JSON_AGG(b_i.image) FILTER (WHERE b_i.image IS NOT NULL), '[]') AS images 
      FROM boards b 
      LEFT JOIN board_images b_i 
      ON b.id = b_i.board_id 
      WHERE b.blog_id = $1 
      GROUP BY b.id
      ORDER BY b.created_at DESC;
      `,
      [blogId]
    );

    const result = boardsResult.rows;

    logger.debug(
      `getAllBoards(boardService): All board data retrieved successfully`
    );

    return new AppResponse(
      200,
      `All board data retrieved successfully`,
      result
    );
  } catch (err) {
    logger.error(`getAllBoards(boardService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function getOneBoard(subDomain, boardId, dbClient) {
  try {
    const existingBlog = await dbClient.query(
      `SELECT id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingBlog.rows.length === 0) {
      logger.debug(
        `getOneBoard(boardService): Blog not found for subdomain(${subDomain})`
      );

      throw new AppError(404, "Blog not found");
    }

    const blogId = existingBlog.rows[0].id;

    const boardResult = await dbClient.query(
      `
      SELECT b.id, b.title, b.detail, b.created_at,
      COALESCE(JSON_AGG(b_i.image) FILTER (WHERE b_i.image IS NOT NULL), '[]') AS images 
      FROM boards b 
      LEFT JOIN board_images b_i 
      ON b.id = b_i.board_id 
      WHERE b.blog_id = $1 AND b.id = $2 
      GROUP BY b.id;
      `,
      [blogId, boardId]
    );

    if (boardResult.rows.length === 0) {
      logger.debug(
        `getOneBoard(boardService): Board not found for id(${boardId})`
      );

      throw new AppError(404, "Board not found");
    }

    const result = boardResult.rows[0];

    logger.debug(
      `getOneBoard(boardService): Board data retrieved successfully`
    );

    return new AppResponse(200, `Board data retrieved successfully`, result);
  } catch (err) {
    logger.error(`getOneBoard(boardService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function updateBoard(
  subDomain,
  boardUpdateData,
  boardId,
  userId,
  dbClient
) {
  try {
    const existingSubDomain = await dbClient.query(
      `SELECT id, user_id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingSubDomain.rows.length == 0) {
      logger.debug(`updateBoard(boardService): SubDomain does not exists`);

      throw new AppError(404, `SubDomain does not exists`);
    }

    if (userId !== existingSubDomain.rows[0].user_id) {
      logger.debug(
        `updateBoard(boardService): Unauthorized update attempt by user(${userId}) for blog(${subDomain})`
      );

      throw new AppError(403, `Unauthorized`);
    }

    const blogId = existingSubDomain.rows[0].id;
    const { title, detail, images } = boardUpdateData;

    if (!title && !detail && !images) {
      logger.debug(
        `updateBoard(boardService): No update fields provided for board update`
      );

      throw new AppError(400, "No update fields provided");
    }

    const updateFields = [];
    const updateValues = [];

    let query = "UPDATE boards SET ";

    if (title) {
      updateFields.push("title = $" + (updateValues.length + 1));
      updateValues.push(title);
    }

    if (detail) {
      updateFields.push("detail = $" + (updateValues.length + 1));
      updateValues.push(detail);
    }

    if (updateFields.length > 0) {
      query +=
        updateFields.join(", ") +
        ` WHERE id = $${updateValues.length + 1} AND blog_id = $${
          updateValues.length + 2
        }`;
      updateValues.push(boardId);
      updateValues.push(blogId);

      await dbClient.query(query, updateValues);
    }

    if (images.length > 0) {
      await dbClient.query("DELETE FROM board_images WHERE board_id = $1", [
        boardId,
      ]);

      for (let i = 0; i < images.length; i++) {
        await dbClient.query(
          "INSERT INTO board_images (image, board_id) VALUES ($1, $2)",
          [images[i], boardId]
        );
      }
    }

    logger.debug(
      `updateBoard(boardService): Board with id(${boardId}) updated successfully`
    );

    return new AppResponse(200, `Board updated successfully`);
  } catch (err) {
    logger.error(`updateBoard(boardService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function softDeleteBoard(subDomain, boardId, userId, dbClient) {
  try {
    const existingSubDomain = await dbClient.query(
      `SELECT id, user_id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingSubDomain.rows.length == 0) {
      logger.debug(`softDeleteBoard(boardService): SubDomain does not exists`);

      throw new AppError(404, `SubDomain does not exists`);
    }

    if (userId !== existingSubDomain.rows[0].user_id) {
      logger.debug(
        `softDeleteBoard(boardService): Unauthorized update attempt by user(${userId}) for blog(${subDomain})`
      );

      throw new AppError(403, `Unauthorized`);
    }

    const blogId = existingSubDomain.rows[0].id;

    const existingBoard = await dbClient.query(
      `SELECT id, deleted FROM boards WHERE id = $1 AND blog_id = $2`,
      [boardId, blogId]
    );

    if (existingBoard.rows.length === 0 || existingBoard.rows[0].deleted) {
      logger.debug(
        `softDeleteBoard(boardService): Board(${boardId}) does not exist for blog(${subDomain})`
      );
      throw new AppError(404, `Board not found`);
    }

    await dbClient.query(
      `UPDATE boards SET deleted = true, deleted_at = NOW() WHERE id = $1 AND blog_id = $2`,
      [boardId, blogId]
    );

    logger.debug(
      `softDeleteBoard(boardService): Board with id(${boardId}) soft deleted successfully`
    );

    return new AppResponse(200, `Board soft deleted successfully`);
  } catch (err) {
    logger.error(`softDeleteBoard(boardService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function hardDeleteBoard(subDomain, boardId, userId, dbClient) {
  try {
    const existingSubDomain = await dbClient.query(
      `SELECT id, user_id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingSubDomain.rows.length == 0) {
      logger.debug(`hardDeleteBoard(boardService): SubDomain does not exists`);

      throw new AppError(404, `SubDomain does not exists`);
    }

    if (userId !== existingSubDomain.rows[0].user_id) {
      logger.debug(
        `hardDeleteBoard(boardService): Unauthorized update attempt by user(${userId}) for blog(${subDomain})`
      );

      throw new AppError(403, `Unauthorized`);
    }

    const blogId = existingSubDomain.rows[0].id;

    const existingBoard = await dbClient.query(
      `SELECT id FROM boards WHERE id = $1 AND blog_id = $2`,
      [boardId, blogId]
    );

    if (existingBoard.rows.length === 0) {
      logger.debug(
        `hardDeleteBoard(boardService): Board(${boardId}) does not exist for blog(${subDomain})`
      );
      throw new AppError(404, `Board not found`);
    }

    await dbClient.query(
      `DELETE FROM boards WHERE deleted = true AND id = $1 AND blog_id = $2`,
      [boardId, blogId]
    );

    logger.debug(
      `hardDeleteBoard(boardService): Board with id(${boardId}) soft deleted successfully`
    );

    return new AppResponse(200, `Board soft deleted successfully`);
  } catch (err) {
    logger.error(`hardDeleteBoard(boardService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

export {
  createBoard,
  getAllBoards,
  getOneBoard,
  updateBoard,
  softDeleteBoard,
  hardDeleteBoard,
};
