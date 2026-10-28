import { forgot } from "../../../shared/templates/emails/auth/forgot.js";
import { welcome } from "../../../shared/templates/emails/auth/register.js";
import { passwordReset } from "../../../shared/templates/emails/auth/reset.js";
export const html = {
    register: (username, link) => welcome(username, link),
    forgot: (name, link) => forgot(name, link),
    reset: (name) => passwordReset(name)
};
//# sourceMappingURL=auth.templates.js.map