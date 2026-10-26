import { Router } from "express";
import answerController from "../../containers/answer.contrainer.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { createAnswerSchema } from "./schema/createAnswer.schema.js";

const router = Router()

router.post('/:roomCode/createAnswer',
    ZodMiddleware.validate(createAnswerSchema, 'body'),
    answerController.createAnswer
)

export default router