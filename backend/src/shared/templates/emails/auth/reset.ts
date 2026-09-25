export const passwordReset = (name: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 10px; text-align: center;">
<h1 style="color: #18181b;">
    Conta recuperada com sucesso!
</h1>
<p style="font-size: 16px; color: #52525b; line-height: 1.6;">
    Olá, <strong>${name}</strong>!
</p>
<p style="font-size: 16px; color: #52525b; line-height: 1.6;">
    Sua senha foi alterada com sucesso e sua conta foi recuperada.
</p>
<p style="font-size: 16px; color: #52525b; line-height: 1.6;">
    Agora você já pode acessar sua conta normalmente utilizando sua nova senha.
</p>

<p style="margin-top: 30px; font-size: 13px; color: #a1a1aa;">
    Se você não realizou essa alteração, entre em contato com o suporte imediatamente.
</p>
<p style="margin-top: 20px; font-size: 13px; color: #a1a1aa;">
    Obrigado por continuar com a QuizArena.
</p>
</div>
`
