import { forgot } from "../../../shared/templates/emails/auth/forgot.js";
import { welcome } from "../../../shared/templates/emails/auth/register.js";
import { passwordReset } from "../../../shared/templates/emails/auth/reset.js";

export const html = {
    register: (username: string, link: string) => welcome(username, link),
    forgot: (name: string, link: string) => forgot(name, link),
    reset: (name: string) => passwordReset(name)
}