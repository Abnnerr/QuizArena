import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import roomRoutes from "../modules/room/room.routes.js"
const router = Router()

router.use('/auth', authRoutes)
router.use('/room', roomRoutes)


export default router