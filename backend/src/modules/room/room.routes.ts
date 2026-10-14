import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { RateLimit } from "../../middlewares/rateLimit.middleware.js";
import roomController from "../../containers/room.container.js";
import { roomCreateSchema } from "./schema/roomCreate.schema.js";
import { joinSchema } from "./schema/roomJoin.schema.js";
import { readySchema } from "./schema/roomReady.schema.js";

const router = Router()

router.post('/create',
    // RateLimit.limit(4, 3),
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission('ROOM_CREATE', 'admin', 'host'),
    ZodMiddleware.validate(roomCreateSchema, 'body'),
    roomController.create
)
router.post('/join/:name',
    RateLimit.limit(6, 1),
    ZodMiddleware.validate(joinSchema, 'body'),
    roomController.join,
)

router.get('/:name',
    // RateLimit.limit(4, 3),
    roomController.findRoom
)
router.patch('/:id/:roomId/ready',
    // RateLimit.limit(4, 3),
    ZodMiddleware.validate(readySchema, 'body'),
    roomController.ready
)

router.get('/:id/start',
    RateLimit.limit(4, 3),
    // PolicyMiddleware.ensureRolePermission('ROOM_START', 'admin', 'host'),
    AuthMiddleware.validate,
    roomController.start
)
export default router