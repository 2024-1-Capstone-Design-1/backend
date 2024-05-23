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

async function getBlog(subDomain, dbClient) {
  try {
    const existingSubDomain = await dbClient.query(
      `SELECT id, name, subdomain, template_id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingSubDomain.rows.length == 0) {
      logger.debug(`getBlog(blogService): SubDomain does not exists`);

      throw new AppError(404, `SubDomain does not exists`);
    }

    const templateId = existingSubDomain.rows[0].template_id;

    if (!templateId) {
      logger.debug(`getBlog(blogService): TemplateId does not exists`);

      throw new AppError(500, `Internal Server Error`);
    }

    const existingTemplate = await dbClient.query(
      `SELECT id, code FROM templates WHERE id = $1`,
      [templateId]
    );

    if (existingTemplate.rows.length == 0) {
      logger.debug(`getBlog(blogService): Template does not exists`);

      throw new AppError(500, `Internal Server Error`);
    }

    const result = {
      id: existingSubDomain.rows[0].id,
      name: existingSubDomain.rows[0].name,
      subDomain: existingSubDomain.rows[0].subdomain,
      template: existingTemplate.rows[0],
    };

    logger.debug(`getBlog(blogService): Blog data retrieved successfully`);

    return new AppResponse(200, `Blog data retrieved successfully`, result);
  } catch (err) {
    logger.error(`getBlog(blogService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

async function updateBlog(subDomain, blogUpdateData, userId, dbClient) {
  try {
    const existingSubDomain = await dbClient.query(
      `SELECT id, user_id FROM blogs WHERE subdomain = $1`,
      [subDomain]
    );

    if (existingSubDomain.rows.length == 0) {
      logger.debug(`updateBlog(blogService): SubDomain does not exists`);

      throw new AppError(404, `SubDomain does not exists`);
    }

    if (userId !== existingSubDomain.rows[0].user_id) {
      logger.debug(
        `updateBlog(blogService): Unauthorized update attempt by user(${userId}) for blog(${subDomain})`
      );

      throw new AppError(403, `Unauthorized`);
    }

    const blogId = existingSubDomain.rows[0].id;
    const { name, template_id } = blogUpdateData;

    if (!name && !template_id) {
      logger.debug(
        `updateBlog(blogService): Name and template_id are required`
      );

      throw new AppError(400, `Name and template_id are required`);
    }

    if (name && !template_id) {
      await dbClient.query(`UPDATE blogs SET name = $1 WHERE id = $2`, [
        name,
        blogId,
      ]);
    }
    if (!name && template_id) {
      const existingTemplate = await dbClient.query(
        `SELECT id FROM templates WHERE id = $1`,
        [template_id]
      );

      if (existingTemplate.rows.length == 0) {
        logger.debug(`updateBlog(blogService): Template does not exists`);

        throw new AppError(404, `Template does not exists`);
      }

      await dbClient.query(`UPDATE blogs SET template_id = $1 WHERE id = $2`, [
        template_id,
        blogId,
      ]);
    }
    if (name && template_id) {
      const existingTemplate = await dbClient.query(
        `SELECT id FROM templates WHERE id = $1`,
        [template_id]
      );

      if (existingTemplate.rows.length == 0) {
        logger.debug(`updateBlog(blogService): Template does not exists`);

        throw new AppError(404, `Template does not exists`);
      }

      await dbClient.query(
        `UPDATE blogs SET name = $1, template_id = $2 WHERE id = $3`,
        [name, template_id, blogId]
      );
    }

    logger.debug(
      `updateBlog(blogService): Blog with id(${blogId}) updated successfully`
    );

    return new AppResponse(200, `Blog updated successfully`);
  } catch (err) {
    logger.error(`updateBlog(blogService): ${err.message}`);

    if (err.status !== 500) {
      throw err;
    }

    throw new AppError(500, `Internal Server Error`);
  }
}

export { createBlog, getBlog, updateBlog };
