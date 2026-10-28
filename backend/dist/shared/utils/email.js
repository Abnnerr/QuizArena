import { resend } from "../../config/resend.js";
export async function enviarEmail(email, subject, html) {
    return await resend.emails.send({
        from: process.env['EMAIL'],
        to: email,
        subject,
        html
    });
}
//# sourceMappingURL=email.js.map