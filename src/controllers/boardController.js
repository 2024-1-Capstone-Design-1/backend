import logger from "../utils/logger.js";
import { getUserById } from "../services/userService.js";
import {
  createBoard,
  getAllBoards,
  getOneBoard,
} from "../services/boardService.js";

async function create(req, res) {
  try {
    const user = req.user;

    if (!user) {
      logger.debug("create(boardController): Unauthorized access attempt");

      return res.status(401).json({ message: `Unauthorized access attempt` });
    }

    const dbClient = req.dbClient;
    const existingUser = await getUserById(user.id, dbClient);

    if (!existingUser) {
      logger.debug(
        `create(boardController): User with id(${user.id}) does not exist`
      );

      return res.status(404).json({ message: "User does not exist" });
    }

    if (
      user.id !== existingUser.id &&
      user.email == existingUser.email &&
      user.role == existingUser.role
    ) {
      logger.debug(
        `create(boardController): User data mismatch - token user(${user.id}, ${user.email}, ${user.role}) and db user(${existingUser.id}, ${existingUser.email}, ${existingUser.role})`
      );

      return res.status(403).json({ message: "User data mismatch" });
    }

    const { subDomain } = req.params;

    if (!subDomain) {
      logger.debug(`create(boardController): No subDomain found in request`);

      return res.status(400).json({ message: "SubDomain is required" });
    }

    const boardData = req.body;
    const missingFields = [];

    if (!boardData.title) missingFields.push("title");
    if (!boardData.detail) missingFields.push("detail");

    if (missingFields.length > 0) {
      logger.debug(
        `create(boardController): Missing required fields: ${missingFields.join(
          ", "
        )}`
      );

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await createBoard(boardData, user, dbClient);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    logger.error(`create(boardController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

async function getAll(req, res) {
  try {
    const dbClient = req.dbClient;
    const subDomain = req.subDomain;

    if (!subDomain) {
      logger.debug(`getAll(boardController): No subDomain found in request`);

      return res.status(400).json({ message: "SubDomain is required" });
    }

    const result = await getAllBoards(subDomain, dbClient);

    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (err) {
    logger.error(`getAll(boardController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

async function getOne(req, res) {
  try {
    const dbClient = req.dbClient;
    const subDomain = req.subDomain;
    const boardId = req.params.id;

    if (!subDomain) {
      logger.debug(`getOne(boardController): No subDomain found in request`);

      return res.status(400).json({ message: "SubDomain is required" });
    }

    if (!boardId) {
      logger.debug(`getOne(boardController): No boardId found in request`);

      return res.status(400).json({ message: "Board ID is required" });
    }

    const result = await getOneBoard(subDomain, boardId, dbClient);

    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (err) {
    logger.error(`getOne(boardController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export { create, getAll, getOne };
