import { Router } from "express";
import answerController from "../../containers/answer.contrainer.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { createAnswerSchema } from "./schema/createAnswer.schema.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";

const router = Router()

router.post(
    '/:roomCode/createAnswer',
    RateLimit.limit(200, 1),
    ZodMiddleware.validate(createAnswerSchema, 'body'),
    answerController.createAnswer
);

export default router