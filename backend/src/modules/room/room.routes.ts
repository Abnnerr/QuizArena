import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import { roomCreateSchema } from "./schema/roomCreate.schema.js";
import { joinSchema } from "./schema/roomJoin.schema.js";
import { roomController } from "../../containers/roomPlayer.container.js";

const router = Router();

router.post(
    "/create",
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_CREATE", "admin", "host"),
    ZodMiddleware.validate(roomCreateSchema, "body"),
    roomController.create
);

router.post(
    "/join/:name",
    RateLimit.limit(200, 1),
    ZodMiddleware.validate(joinSchema, "body"),
    roomController.join
);
router.get(
    "/:name",
    RateLimit.limit(200, 2),
    roomController.findRoom
);
router.get(
    "/:id/start",
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_START", "admin", "host"),
    roomController.start
);
router.delete(
    "/:roomCode/:roundId/limpar",
    RateLimit.limit(200, 5),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROOM_DELETE", "admin", "host"),
    roomController.limparRoom
);

export default router