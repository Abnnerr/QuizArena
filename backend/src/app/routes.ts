import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import roomRoutes from "../modules/room/room.routes.js"
import playerRoutes from "../modules/players/player.routes.js"
import roundRoutes from "../modules/round/round.routes.js"
import answerRoutes from "../modules/answers/answer.routes.js"
import questionRoutes from "../modules/question/question.routes.js"
import libraryRoutes from "../modules/library/library.routes.js"
import categoryRoutes from "../modules/category/category.routes.js"

const router = Router()

router.use('/auth', authRoutes)
router.use('/room', roomRoutes)
router.use('/player', playerRoutes)
router.use('/round', roundRoutes)
router.use('/answer', answerRoutes)
router.use('/question', questionRoutes)
router.use('/library', libraryRoutes)
router.use('/category', categoryRoutes)


export default router