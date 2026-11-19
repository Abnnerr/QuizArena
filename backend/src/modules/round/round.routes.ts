import { Router } from "express";
import roundController from "../../containers/round.container.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { finishedSchema } from "./schema/finished.schema.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";

const router = Router()

// Buscar a rodada em aberto
router.get(
    "/:roomCode/:playerId/findRound",
    RateLimit.limit(200, 2),
    roundController.findRound
);
router.get(
    "/:roomCode/findRound",
    RateLimit.limit(200, 2),
    roundController.findRound
);

// Termina a rodada, atualiza e cria uma nova
router.post(
    "/:roomCode/roundFinished",
    RateLimit.limit(200, 1),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("ROUND_FINISH", "admin", "host"),
    ZodMiddleware.validate(finishedSchema, "body"),
    roundController.roundFinished
);

export default router