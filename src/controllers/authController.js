import logger from "../utils/logger.js";
import { createUser, loginService } from "../services/authService.js";

async function signup(req, res) {
  try {
    const dbClient = req.dbClient;
    const userData = req.body;
    const missingFields = [];

    if (!userData.email) missingFields.push("email");
    if (!userData.password) missingFields.push("password");
    if (!userData.username) missingFields.push("username");
    if (!userData.nickname) missingFields.push("nickname");

    if (missingFields.length > 0) {
      logger.debug(
        `signup(authController): Missing required fields: ${missingFields.join(
          ", "
        )}`
      );

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await createUser(userData, dbClient);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    logger.error(`signup(authController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const loginData = req.body;
    const dbClient = req.dbClient;
    const missingFields = [];

    if (!loginData.email) missingFields.push("email");
    if (!loginData.password) missingFields.push("password");

    if (missingFields.length > 0) {
      logger.debug(
        `login(authController): Missing required fields: ${missingFields.join(
          ", "
        )}`
      );

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await loginService(loginData, dbClient);

    return res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  } catch (err) {
    logger.error(`login(authController): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export { signup, login };
