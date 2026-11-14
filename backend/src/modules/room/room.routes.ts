import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import { roomCreateSchema } from "./schema/roomCreate.schema.js";
import { joinSchema } from "./schema/roomJoin.schema.js";
import { roomController } from "../../containers/roomPlayer.container.js";

const router = Router();

// Criar a sala e as questões
router.post(
    "/create",
    RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_CREATE", "admin", "host"),
    ZodMiddleware.validate(roomCreateSchema, "body"),
    roomController.create
);

// Criar o player na RoomPlayer
router.post(
    "/join/:name",
    RateLimit.limit(6, 1),
    ZodMiddleware.validate(joinSchema, "body"),
    roomController.join
);

// Encontrar a sala e trazer todos os players
router.get(
    "/:name",
    RateLimit.limit(60, 2),
    roomController.findRoom
);

// Iniciar a sala
router.get(
    "/:id/start",
    RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_START", "admin", "host"),
    roomController.start
);

// Limpar sala, players, roomPlayers, answers e rounds
router.delete(
    "/:roomCode/:roundId/limpar",
    RateLimit.limit(2, 5),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_DELETE", "admin", "host"),
    roomController.limparRoom
);

export default router