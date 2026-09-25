import { AuthController } from "../modules/auth/auth.controller.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { AuthService } from "../modules/auth/auth.service.js";

const repo = new AuthRepository()
const service = new AuthService(repo)
const authController = new AuthController(service)


export default authController

