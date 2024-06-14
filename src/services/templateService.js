import logger from "../utils/logger.js";
import AppResponse from "../utils/appResponse.js";
import AppError from "../utils/appError.js";

async function createTemplate(templateData, user, dbClient) {
  try {
    const { name, thumbnail, code, share } = templateData;
    const userId = user.id;
    const shareValue = !share ? false : true;

    const result = await dbClient.query(
      `INSERT INTO templates (user_id, name, thumbnail, code, share) VALUES ($1, $2, $3, $4, $5) returning id`,
      [userId, name, thumbnail, code, shareValue]
    );

    const templateId = result.rows[0].id;

    if (!templateId) {
      throw new AppError(500, `Internal Server Error`);
    }

    logger.debug(
      `createTemplate(templateService): New template created with templateId(${templateId})`
    );

    return new AppResponse(201, `Template created successfully`);
  } catch (err) {
    logger.error(`createTemplate(templateService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

export { createTemplate };
