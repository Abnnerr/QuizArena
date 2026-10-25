import { Router } from "express";
import roundController from "../../containers/round.container.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { finishedSchema } from "./schema/finished.schema.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";

const router = Router()


//Buscar primeiro round
router.get('/:roomCode/findRound',
    roundController.findRound
)
// termina a round, atualiza e cria um novo
router.post('/:roomCode/roundFinished',
    RateLimit.limit(4, 2),
    ZodMiddleware.validate(finishedSchema, 'body'),
    roundController.roundFinished
)

export default router