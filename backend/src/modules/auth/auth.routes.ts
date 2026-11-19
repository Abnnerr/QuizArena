import { Router } from "express";
import authController from "../../containers/auth.container.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { registerSchema } from "./schema/register.schema.js";
import { loginSchema } from "./schema/login.schema.js";
import { forgotSchema } from "./schema/forgot.schema.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { resetSchema } from "./schema/reset.schema.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.post(
    "/register",
    RateLimit.limit(5, 10),
    ZodMiddleware.validate(registerSchema, "body"),
    authController.register
);

router.post(
    "/login",
    RateLimit.limit(5, 5),
    ZodMiddleware.validate(loginSchema, "body"),
    authController.login
);

router.post(
    "/forgot-password",
    RateLimit.limit(3, 15),
    ZodMiddleware.validate(forgotSchema, "body"),
    authController.forgot
);

router.post(
    "/reset-password/:token",
    RateLimit.limit(5, 10),
    ZodMiddleware.validate(resetSchema, "body"),
    authController.reset
);

router.get(
    "/me",
    RateLimit.limit(60, 3),
    AuthMiddleware.validate,
    authController.me
);

router.get(
    "/profile",
    RateLimit.limit(60, 3),
    AuthMiddleware.validate,
    authController.profile
)
router.get(
    "/logout",
    RateLimit.limit(60, 3),
    AuthMiddleware.validate,
    authController.logOut
);
router.patch(
    '/updatePassword',
    RateLimit.limit(60, 3),
    AuthMiddleware.validate,
    authController.updatePassword
)

export default router