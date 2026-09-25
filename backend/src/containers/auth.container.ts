import { AuthController } from "../modules/auth/auth.controller.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { AuthService } from "../modules/auth/auth.service.js";
import { AuthDomain } from "../modules/auth/domain/auth.domain.js";
import { BcryptService } from "../shared/services/bcrypt.service.js";
import { JwtService } from "../shared/services/jwt.service.js";

const repo = new AuthRepository()
const jwt = new JwtService()
const bcrypt = new BcryptService
const domain = new AuthDomain()
const service = new AuthService(repo, jwt, bcrypt, domain)
const authController = new AuthController(service)


export default authController

