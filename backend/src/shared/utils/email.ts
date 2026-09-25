import { resend } from "../../config/resend.js";

export async function enviarEmail(email: string, subject: string, html: string) {
    return await resend.emails.send({
        from: process.env['EMAIL']!,
        to: email,
        subject,
        html
    })
}