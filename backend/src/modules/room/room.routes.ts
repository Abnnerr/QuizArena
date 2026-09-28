import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { PermissionMiddleware } from "../../middlewares/permission.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import roomController from "../../containers/room.container.js";
import { roomCreateSchema } from "./schema/roomCreate.schema.js";
import { joinSchema } from "./schema/roomJoin.schema.js";

const router = Router()

router.post('/',
    RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    PermissionMiddleware.ensureRolePermission('ROOM_CREATE', 'admin', 'host'),
    ZodMiddleware.validate(roomCreateSchema, 'body'),
    roomController.create
)
router.post('/join',
    RateLimit.limit(6, 1),
    AuthMiddleware.validate,
    ZodMiddleware.validate(joinSchema, 'body'),
    roomController.join,
)
router.get('/:id/start', 
    RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    roomController.start
)
export default router