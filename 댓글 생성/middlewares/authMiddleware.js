import logger from "../utils/logger.js";
import { verifyToken } from "../utils/jwt.js";

async function authenticateToken(req, res, next) {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return next();
    }

    const token = authorization && authorization.split(" ")[1];
    const user = await verifyToken(token);

    req.user = user;

    return next();
  } catch (err) {
    logger.error(`authenticateToken(authMiddleware): ${err.message}`);

    if (err.status !== 500) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status).json({ message: err.message });
  }
}

export default authenticateToken;
