import { Router } from "express";

import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { create, get } from "../controllers/blogController.js";

const blogRouter = Router();

/**
 * @swagger
 * /blog/create:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog for the authenticated user.
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subDomain
 *               - templateId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Blog name
 *                 example: "My Blog"
 *               subDomain:
 *                 type: string
 *                 description: Subdomain for the blog
 *                 example: "myblog"
 *               templateId:
 *                 type: integer
 *                 description: ID of the template to use
 *                 example: 1
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog created successfully
 *       400:
 *         description: Missing required fields or subdomain already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       401:
 *         description: Unauthorized access attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access attempt
 *       403:
 *         description: User data mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data mismatch
 *       404:
 *         description: User or template does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User or template does not exist
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
blogRouter.post(
  "/create",
  authenticateToken,
  attachDbClient,
  create,
  releaseDbClient
);

/**
 * @swagger
 * /blog/{subDomain}:
 *   get:
 *     summary: Get blog by subDomain
 *     description: Retrieve blog details using the subDomain.
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: subDomain
 *         schema:
 *           type: string
 *         required: true
 *         description: The subdomain of the blog to retrieve
 *     responses:
 *       200:
 *         description: Blog data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: My Blog
 *                     subDomain:
 *                       type: string
 *                       example: myblog
 *                     template:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         code:
 *                           type: string
 *                           example: "TEMPLATE123"
 *       400:
 *         description: SubDomain is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SubDomain is required
 *       404:
 *         description: SubDomain does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SubDomain does not exist
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
blogRouter.get(
  "/:subDomain",
  authenticateToken,
  attachDbClient,
  get,
  releaseDbClient
);

export default blogRouter;
