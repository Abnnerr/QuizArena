import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import questionController from "../../containers/question.container.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { createQuestionSchema } from "./schema/createQuestion.js";
import { updateQuestionSchema } from "./schema/updateQuestion.js";

const router = Router()


router.post(
    '/create',
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("QUESTION_CREATE", 'admin', 'host'),
    ZodMiddleware.validate(createQuestionSchema, 'body'),
    questionController.createQuestion
)


router.post(
    '/:roomId/:questionId/addToRoom',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("QUESTION_CREATE", 'admin', 'host'),
    questionController.addtoRoom
)

router.get('/findQuestions',
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("QUESTION_READ", 'admin', 'host'),
    questionController.findQuestions
)

router.patch(
    '/:questionId/update',
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("QUESTION_UPDATE", 'admin', 'host'),
    ZodMiddleware.validate(updateQuestionSchema, 'body'),
    questionController.updateQuestion
)


router.delete(
    '/:roomId/:questionId/delete',
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("QUESTION_DELETE", 'admin', 'host'),
    questionController.deleteQuestion
)

router.delete(
    '/:questionId/delete',
    RateLimit.limit(200, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("QUESTION_DELETE", 'admin', 'host'),
    questionController.deleteQuestion
)


export default router