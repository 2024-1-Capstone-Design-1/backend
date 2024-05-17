import logger from "../utils/logger.js";
import { createUser } from "../services/authService.js";

async function signup(req, res) {
  try {
    const userData = req.body;
    const dbClient = req.dbClient;
    const missingFields = [];

    if (!userData.email) missingFields.push("email");
    if (!userData.password) missingFields.push("password");
    if (!userData.username) missingFields.push("username");
    if (!userData.nickname) missingFields.push("nickname");
    if (!userData.subDomain) missingFields.push("subDomain");

    if (missingFields.length > 0) {
      logger.debug(
        `signup(controller): Missing required fields: ${missingFields.join(
          ", "
        )}`
      );

      return res.status(400).json({ message: `Missing required fields` });
    }

    const result = await createUser(userData, dbClient);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    logger.error(`signup(controller): ${err.message}`);

    if (err.status == 500) {
      return res.status(err.status).json({ message: `Internal Server Error` });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export { signup };
