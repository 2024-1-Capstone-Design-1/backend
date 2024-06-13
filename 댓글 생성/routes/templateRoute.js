import { Router } from "express";

import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { create } from "../controllers/templateController.js";

const templateRouter = Router();

/**
 * @swagger
 * /template/create:
 *   post:
 *     summary: Create a new template
 *     description: Create a new template for the authenticated user.
 *     tags:
 *       - Templates
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
 *               - thumbnail
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 description: Template name
 *                 example: "My Template"
 *               thumbnail:
 *                 type: string
 *                 description: URL to the template thumbnail image
 *                 example: "http://example.com/image.jpg"
 *               code:
 *                 type: string
 *                 description: The template code
 *                 example: {html: "<html></html>", css: "css", js: "js"}
 *               share:
 *                 type: boolean
 *                 description: Whether the template is shared
 *                 example: true
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Template created successfully
 *       400:
 *         description: Missing required fields
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
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User does not exist
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
templateRouter.post(
  "/create",
  authenticateToken,
  attachDbClient,
  create,
  releaseDbClient
);

export default templateRouter;
