import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import roomRoutes from "../modules/room/room.routes.js"
import playerRoutes from "../modules/players/player.routes.js"
import roundRoutes from "../modules/round/round.routes.js"
const router = Router()

router.use('/auth', authRoutes)
router.use('/room', roomRoutes)
router.use('/player', playerRoutes)
router.use('/round', roundRoutes)
router.use('/answer',)


export default router