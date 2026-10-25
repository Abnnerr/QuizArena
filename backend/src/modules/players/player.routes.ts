import { Router } from "express";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { readySchema } from "./schema/playerReady.schema.js";
import { playerController } from "../../containers/roomPlayer.container.js";

const router = Router()


//player ready
router.patch('/:playerId/:roomCode/ready',
    // RateLimit.limit(4, 3),
    ZodMiddleware.validate(readySchema, 'body'),
    playerController.ready
)

export default router