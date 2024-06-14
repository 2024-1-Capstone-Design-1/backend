import { Router } from "express";

import boardRouter from "./boardRoute.js";
import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { create, get, update } from "../controllers/blogController.js";

const blogRouter = Router();

blogRouter.use(
  "/:subDomain/board",
  (req, res, next) => {
    req.subDomain = req.params.subDomain;
    next();
  },
  boardRouter
);

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

/**
 * @swagger
 * /blog/{subDomain}/update:
 *   patch:
 *     summary: Update a blog
 *     description: Update blog details for the authenticated user.
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subDomain
 *         schema:
 *           type: string
 *         required: true
 *         description: The subdomain of the blog to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the blog
 *                 example: "Updated Blog Name"
 *               template_id:
 *                 type: integer
 *                 description: The ID of the template to use
 *                 example: 2
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog updated successfully
 *       400:
 *         description: Missing required fields or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields or invalid input
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
 *         description: User data mismatch or unauthorized update attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data mismatch or unauthorized update attempt
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
blogRouter.patch(
  "/:subDomain/update",
  authenticateToken,
  attachDbClient,
  update,
  releaseDbClient
);

export default blogRouter;
