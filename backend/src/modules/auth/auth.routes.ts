import { Router } from "express";
import authController from "../../containers/auth.container.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { registerSchema } from "./schema/register.schema.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";


const router = Router()

router.post('/register', AuthMiddleware.validate, ZodMiddleware.validate(registerSchema, 'body'), authController.register)

export default router