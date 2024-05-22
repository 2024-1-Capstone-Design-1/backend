import logger from "../utils/logger.js";
import AppError from "../utils/appError.js";
import AppResponse from "../utils/appResponse.js";

async function createBlog(blogData, user, dbClient) {
  try {
    const { name, subDomain, templateId } = blogData;

    const existingSubDomain = await dbClient.query(
      `SELECT id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingSubDomain.rows.length > 0) {
      logger.debug(
        `createBlog(blogService): Subdomain(${subDomain}) already in use`
      );

      throw new AppError(400, `Subdomain already in use`);
    }

    const existingTemplateId = await dbClient.query(
      `SELECT id FROM templates WHERE id = $1`,
      [templateId]
    );

    if (existingTemplateId.rows.length == 0) {
      logger.debug(
        `createBlog(blogService): Template(${templateId}) does not exists`
      );

      throw new AppError(404, `Template does not exists`);
    }

    const userId = user.id;

    const result = await dbClient.query(
      `INSERT INTO blogs (name, subdomain, template_id, user_id) VALUES ($1, $2, $3, $4) returning id`,
      [name, subDomain, templateId, userId]
    );

    const blogId = result.rows[0].id;

    if (!blogId) {
      throw new AppError(500, `Internal Server Error`);
    }

    logger.debug(
      `createBlog(blogService): New blog created with blogId(${blogId})`
    );

    return new AppResponse(201, `Blog created successfully`);
  } catch (err) {
    logger.error(`createBlog(blogService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

export { createBlog };
