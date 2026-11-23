import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import categoryController from "../../containers/category.container.js";
import { PolicyMiddleware } from "../../middlewares/policy.middleware.js";
import { ZodMiddleware } from "../../middlewares/zod.middleware.js";
import { createCategorySchema } from "./schema/createCategory.js";

const router = Router()


router.post('/:categoryId/create',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("CATEGORY_CREATE", "admin"),
    ZodMiddleware.validate(createCategorySchema, 'body'),
    categoryController.categoryCreate
)
router.get('/:categoryId/findCategoryId',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("CATEGORY_READ", "admin", "host"),
    categoryController.findCategoryId
)

router.get('/findCategories',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("CATEGORY_READ", "admin", "host"),
    categoryController.findCategories
)

router.get('/categories',
    AuthMiddleware.validate,
    PolicyMiddleware.ensureRolePermission("CATEGORY_READ", "admin", "host"),
    categoryController.categories
)

export default router