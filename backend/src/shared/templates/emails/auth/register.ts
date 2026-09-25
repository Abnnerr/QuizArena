export const welcome = (name: string, link: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 10px; text-align: center;">

    <h1 style="color: #18181b;">
        Seja bem-vindo à QuizArena! 
    </h1>

    <p style="font-size: 16px; color: #52525b; line-height: 1.6;">
        Olá, <strong>${name}</strong>!
    </p>

    <p style="font-size: 16px; color: #52525b; line-height: 1.6;">
        Sua conta foi criada com sucesso.
        Estamos muito felizes em ter você com a gente!
    </p>

    <p style="font-size: 16px; color: #52525b; line-height: 1.6;">
        Agora você já pode acessar sua conta e aproveitar
        tudo o que a QuizArena tem para oferecer.
    </p>

    <a href='${link}'
       style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Acessar minha conta
    </a>

    <p style="margin-top: 30px; font-size: 13px; color: #a1a1aa;">
        Obrigado por fazer parte do QuizArena.
    </p>

</div>
`