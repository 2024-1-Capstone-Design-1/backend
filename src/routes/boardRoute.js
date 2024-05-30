import { Router } from "express";

import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { create, getAll, getOne } from "../controllers/boardController.js";

const boardRouter = Router();

/**
 * @swagger
 * /blog/{subDomain}/board/create:
 *   post:
 *     summary: Create a new board
 *     description: Create a new board for the authenticated user.
 *     tags:
 *       - Boards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - detail
 *             properties:
 *               title:
 *                 type: string
 *                 description: Board title
 *                 example: "My Board"
 *               detail:
 *                 type: string
 *                 description: Detailed description of the board
 *                 example: "This is a detailed description of the board."
 *               image_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *                 example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
 *     responses:
 *       201:
 *         description: Board created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board created successfully
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
boardRouter.post(
  "/create",
  authenticateToken,
  attachDbClient,
  create,
  releaseDbClient
);

/**
 * @swagger
 * /blog/{subDomain}/board/get-all:
 *   get:
 *     summary: Get all boards by subDomain
 *     description: Retrieve all boards for the specified blog subDomain.
 *     tags:
 *       - Boards
 *     parameters:
 *       - in: path
 *         name: subDomain
 *         schema:
 *           type: string
 *         required: true
 *         description: The subdomain of the blog to retrieve boards for
 *     responses:
 *       200:
 *         description: All board data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All board data retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Board Title
 *                       detail:
 *                         type: string
 *                         example: Board Detail
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2022-03-27T14:30:00Z"
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: http://example.com/image.jpg
 *       400:
 *         description: SubDomain is required or Blog does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SubDomain is required or Blog does not exist
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog not found
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
boardRouter.get(
  "/get-all",
  authenticateToken,
  attachDbClient,
  getAll,
  releaseDbClient
);

/**
 * @swagger
 * /blog/{subDomain}/board/get-one/{id}:
 *   get:
 *     summary: Get a specific board by ID
 *     description: Retrieve a specific board by its ID and the blog's subDomain.
 *     tags:
 *       - Boards
 *     parameters:
 *       - in: path
 *         name: subDomain
 *         schema:
 *           type: string
 *         required: true
 *         description: The subdomain of the blog
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the board to retrieve
 *     responses:
 *       200:
 *         description: Board data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Board Title
 *                     detail:
 *                       type: string
 *                       example: Board Detail
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2022-03-27T14:30:00Z"
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: http://example.com/image.jpg
 *       400:
 *         description: SubDomain or Board ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SubDomain or Board ID is required
 *       404:
 *         description: Blog or Board not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog or Board not found
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
boardRouter.get(
  "/get-one/:id",
  authenticateToken,
  attachDbClient,
  getOne,
  releaseDbClient
);

export default boardRouter;
