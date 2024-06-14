import logger from "../utils/logger.js";
import { getUserById } from "../services/userService.js";
import { createBlog, getBlog, updateBlog } from "../services/blogService.js";

async function create(req, res) {
  try {
    const user = req.user;

    if (!user) {
      logger.debug("create(blogController): Unauthorized access attempt");

      return res.status(401).json({ message: `Unauthorized access attempt` });
    }

    const dbClient = req.dbClient;
    const existingUser = await getUserById(user.id, dbClient);

    if (!existingUser) {
      logger.debug(
        `create(blogController): User with id(${user.id}) does not exist`
      );

      return res.status(404).json({ message: "User does not exist" });
    }

    if (
      user.id !== existingUser.id &&
      user.email == existingUser.email &&
      user.role == existingUser.role
    ) {
      logger.debug(
        `create(blogController): User data mismatch - token user(${user.id}, ${user.email}, ${user.role}) and db user(${existingUser.id}, ${existingUser.email}, ${existingUser.role})`
      );

      return res.status(403).json({ message: "User data mismatch" });
    }

    const blogData = req.body;
    const missingFields = [];

    if (!blogData.name) missingFields.push("name");
    if (!blogData.subDomain) missingFields.push("subDomain");
    if (!blogData.templateId) missingFields.push("templateId");

    if (missingFields.length > 0) {
      logger.debug(
        `create(blogController): Missing required fields: ${missingFields.join(
          ", "
        )}`
      );

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await createBlog(blogData, user, dbClient);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    logger.error(`create(blogController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

async function get(req, res) {
  try {
    const { subDomain } = req.params;

    if (!subDomain) {
      logger.debug(`get(blogController): No subDomain found in request`);

      return res.status(400).json({ message: "SubDomain is required" });
    }

    const dbClient = req.dbClient;

    const result = await getBlog(subDomain, dbClient);

    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (err) {
    logger.error(`get(blogController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const user = req.user;

    if (!user) {
      logger.debug("update(blogController): Unauthorized access attempt");

      return res.status(401).json({ message: `Unauthorized access attempt` });
    }

    const dbClient = req.dbClient;
    const existingUser = await getUserById(user.id, dbClient);

    if (!existingUser) {
      logger.debug(
        `update(blogController): User with id(${user.id}) does not exist`
      );

      return res.status(404).json({ message: "User does not exist" });
    }

    if (
      user.id !== existingUser.id &&
      user.email == existingUser.email &&
      user.role == existingUser.role
    ) {
      logger.debug(
        `update(blogController): User data mismatch - token user(${user.id}, ${user.email}, ${user.role}) and db user(${existingUser.id}, ${existingUser.email}, ${existingUser.role})`
      );

      return res.status(403).json({ message: "User data mismatch" });
    }

    const userId = user.id;
    const { subDomain } = req.params;

    if (!subDomain) {
      logger.debug(`update(blogController): No subDomain found in request`);

      return res.status(400).json({ message: "SubDomain is required" });
    }

    const blogUpdateData = req.body;

    if (blogUpdateData.length == 0) {
      logger.debug(`update(blogController): Missing required fields`);

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await updateBlog(
      subDomain,
      blogUpdateData,
      userId,
      dbClient
    );

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    logger.error(`update(blogController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export { create, get, update };
