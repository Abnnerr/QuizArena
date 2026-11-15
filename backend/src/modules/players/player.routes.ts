import { Router } from "express";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { readySchema } from "./schema/playerReady.schema.js";
import { playerController } from "../../containers/roomPlayer.container.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";

const router = Router()
// Buscar o pódio
router.get(
    "/:roomCode/podium",
    RateLimit.limit(30, 1),
    playerController.findPodium
);

// Player ready
router.patch(
    "/:playerId/:roomCode/ready",
    RateLimit.limit(4, 1),
    ZodMiddleware.validate(readySchema, "body"),
    playerController.ready
);

// Utilizar power-up
router.post(
    "/:roomCode/:playerId/:powerId/:userName/powerup",
    RateLimit.limit(5, 1),
    playerController.powerUp
);
export default router