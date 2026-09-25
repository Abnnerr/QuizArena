export const forgot = (name: string, link: string) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 10px; text-align: center;">
            <h1 style="color: #18181b;">Redefinição de senha </h1>

            <p style="font-size: 16px; color: #52525b; line-height: 1.6;">
                Olá, <strong>${name}</strong>!
            </p>

            <p style="font-size: 16px; color: #52525b; line-height: 1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta na QuizArena.
            </p>

            <p style="font-size: 16px; color: #52525b; line-height: 1.6;">
                Clique no botão abaixo para criar uma nova senha:
            </p>

            <a
                href="${link}"
                style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;"
            >
                Redefinir minha senha
            </a>

            <p style="margin-top: 30px; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
                Se você não solicitou a redefinição da sua senha, ignore este e-mail.
            </p>

            <p style="font-size: 13px; color: #a1a1aa;">
                Por segurança, este link deve expirar após um determinado período.
            </p>
        </div>
    `;
};