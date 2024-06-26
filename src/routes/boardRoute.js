import { Router } from "express";

import {
  attachDbClient,
  releaseDbClient,
} from "../middlewares/dbMiddleware.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import {
  create,
  getAll,
  getOne,
  update,
  softDelete,
  hardDelete,
} from "../controllers/boardController.js";

const boardRouter = Router();

/**
 * @swagger
 * /blog/{subDomain}/board/create:
 *   post:
 *     summary: Create a new board
 *     description: Create a new board in the specified blog's subdomain.
 *     tags:
 *       - Boards
 *     parameters:
 *       - in: path
 *         name: subDomain
 *         schema:
 *           type: string
 *         required: true
 *         description: The subdomain of the blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the board
 *                 example: "New Board Title"
 *               detail:
 *                 type: string
 *                 description: The detail of the board
 *                 example: "Detailed description of the board"
 *               image_url:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
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
 *         description: Missing required fields or SubDomain is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
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

/**
 * @swagger
 * /blog/{subDomain}/board/update/{id}:
 *   patch:
 *     summary: Update a specific board by ID
 *     description: Update a specific board by its ID and the blog's subDomain.
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
 *         description: The ID of the board to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the board
 *                 example: "Updated Board Title"
 *               detail:
 *                 type: string
 *                 description: The detail of the board
 *                 example: "Updated Board Detail"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Board updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board updated successfully
 *       400:
 *         description: SubDomain or Board ID is required or Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SubDomain or Board ID is required or Missing required fields
 *       403:
 *         description: Unauthorized update attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized update attempt
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
boardRouter.patch(
  "/update/:id",
  authenticateToken,
  attachDbClient,
  update,
  releaseDbClient
);

/**
 * @swagger
 * /blog/{subDomain}/board/soft-delete/{id}:
 *   patch:
 *     summary: Soft delete a specific board by ID
 *     description: Soft delete a specific board by its ID and the blog's subDomain.
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
 *         description: The ID of the board to soft delete
 *     responses:
 *       200:
 *         description: Board soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board soft deleted successfully
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
 *       403:
 *         description: Unauthorized delete attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized delete attempt
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
boardRouter.patch(
  "/soft-delete/:id",
  authenticateToken,
  attachDbClient,
  softDelete,
  releaseDbClient
);

/**
 * @swagger
 * /blog/{subDomain}/board/hard-delete/{id}:
 *   delete:
 *     summary: Hard delete a specific board by ID
 *     description: Hard delete a specific board by its ID and the blog's subDomain. The board must be previously soft deleted.
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
 *         description: The ID of the board to hard delete
 *     responses:
 *       200:
 *         description: Board hard deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Board hard deleted successfully
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
 *       403:
 *         description: Unauthorized delete attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized delete attempt
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
boardRouter.delete(
  "/hard-delete/:id",
  authenticateToken,
  attachDbClient,
  hardDelete,
  releaseDbClient
);

export default boardRouter;
