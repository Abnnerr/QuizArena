import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { createLibrarySchema } from "./schema/createLibrary.js";
import libraryController from "../../containers/library.container.js";

const router = Router()

router.post('/create',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("LIBRARY_CREATE", 'admin'),
    ZodMiddleware.validate(createLibrarySchema, 'body'),
    libraryController.libraryCreate
)

router.get('/:libraryId/findLibraryId',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("LIBRARY_READ", 'admin', "host"),
    libraryController.libraryFindId
)

router.get('/findLibraries',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("LIBRARY_READ", 'admin', "host"),
    libraryController.librariesFind
)


export default router