import { AuthController } from "../modules/auth/auth.controller.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { AuthService } from "../modules/auth/auth.service.js";
import { AuthDomain } from "../modules/auth/domain/auth.domain.js";
import { BcryptService } from "../shared/services/bcrypt.service.js";
import { JwtService } from "../shared/services/jwt.service.js";

const authRepo = new AuthRepository()
const jwt = new JwtService()
const bcrypt = new BcryptService
export const authDomain = new AuthDomain()
export const authService = new AuthService(authRepo, jwt, bcrypt, authDomain)
const authController = new AuthController(authService)


export default authController

