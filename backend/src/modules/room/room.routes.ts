import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import { roomCreateSchema } from "./schema/roomCreate.schema.js";
import { joinSchema } from "./schema/roomJoin.schema.js";
import { roomController } from "../../containers/roomPlayer.container.js";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     RoomCreate:
 *       type: object
 *       required:
 *         - name
 *         - maxPlayers
 *         - timeLimit
 *         - mode
 *         - questions
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: Sala de programação
 *         maxPlayers:
 *           type: integer
 *           minimum: 2
 *           maximum: 20
 *           example: 10
 *         timeLimit:
 *           type: integer
 *           minimum: 1
 *           maximum: 15
 *           example: 30
 *         mode:
 *           type: string
 *           enum: [NORMAL, HARDCORE]
 *           example: NORMAL
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - text
 *               - alternatives
 *             properties:
 *               text:
 *                 type: string
 *                 example: O que é TypeScript?
 *               alternatives:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - text
 *                     - isCorrect
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: Um superset do JavaScript
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *
 *     JoinRoom:
 *       type: object
 *       required:
 *         - userName
 *       properties:
 *         userName:
 *           type: string
 *           minLength: 2
 *           example: Jogador123
 */

/**
 * @swagger
 * /room/create:
 *   post:
 *     summary: Criar uma sala
 *     description: Cria uma sala e suas respectivas questões. Requer autenticação e permissão ROOM_CREATE.
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomCreate'
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para criar sala
 *       429:
 *         description: Limite de requisições excedido
 *       500:
 *         description: Erro interno
 */
router.post(
    "/create",
    RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_CREATE", "admin", "host"),
    ZodMiddleware.validate(roomCreateSchema, "body"),
    roomController.create
);

/**
 * @swagger
 * /room/join/{name}:
 *   post:
 *     summary: Entrar em uma sala
 *     description: Cria um jogador e o associa à sala informada.
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome ou identificador usado pela rota para localizar a sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinRoom'
 *     responses:
 *       200:
 *         description: Jogador entrou na sala
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Sala não encontrada
 *       429:
 *         description: Limite de requisições excedido
 *       500:
 *         description: Erro interno
 */
router.post(
    "/join/:name",
    RateLimit.limit(6, 1),
    ZodMiddleware.validate(joinSchema, "body"),
    roomController.join
);

/**
 * @swagger
 * /room/{name}:
 *   get:
 *     summary: Buscar uma sala
 *     description: Busca uma sala e retorna seus jogadores.
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome ou identificador da sala
 *     responses:
 *       200:
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 *       429:
 *         description: Limite de requisições excedido
 *       500:
 *         description: Erro interno
 */
router.get(
    "/:name",
    RateLimit.limit(60, 2),
    roomController.findRoom
);

/**
 * @swagger
 * /room/{id}/start:
 *   get:
 *     summary: Iniciar uma sala
 *     description: Inicia a partida. Requer autenticação e permissão ROOM_START.
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da sala
 *     responses:
 *       200:
 *         description: Sala iniciada com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para iniciar a sala
 *       404:
 *         description: Sala não encontrada
 *       429:
 *         description: Limite de requisições excedido
 *       500:
 *         description: Erro interno
 */
router.get(
    "/:id/start",
    RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_START", "admin", "host"),
    roomController.start
);

/**
 * @swagger
 * /room/{roomCode}/{roundId}/limpar:
 *   delete:
 *     summary: Limpar uma sala
 *     description: Limpa os dados relacionados à sala, incluindo jogadores, respostas e rodadas. Requer autenticação e permissão ROOM_DELETE.
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da sala
 *       - in: path
 *         name: roundId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador da rodada
 *     responses:
 *       200:
 *         description: Sala limpa com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão para limpar a sala
 *       404:
 *         description: Sala ou rodada não encontrada
 *       429:
 *         description: Limite de requisições excedido
 *       500:
 *         description: Erro interno
 */
router.delete(
    "/:roomCode/:roundId/limpar",
    RateLimit.limit(5, 5),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_DELETE", "admin", "host"),
    roomController.limparRoom
);

export default router