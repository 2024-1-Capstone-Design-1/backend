import { pool } from "../configs/db.js";
import logger from "../utils/logger.js";

async function attachDbClient(req, res, next) {
  try {
    req.dbClient = await pool.connect();

    return next();
  } catch (err) {
    logger.debug(`attachDbClient(middleware): ${err.message}`);

    return res.status(500).send("Internal Server Error");
  }
}

async function releaseDbClient(req, res, next) {
  if (req.dbClient) {
    req.dbClient.release();
  }

  return next();
}

export { attachDbClient, releaseDbClient };
