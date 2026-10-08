export const passwordReset = (name: string) => `
    <div style="margin: 0; padding: 30px 10px; background-color: #13092E; font-family: 'Nunito', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto;">
            
            <tr>
                <td align="center" style="padding-bottom: 20px;">
                    <div style="display: inline-block; background-color: #26890C; color: #ffffff; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; box-shadow: 0 4px 0 #1a5c08;">
                        Senha Alterada
                    </div>
                    
                    <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: #ffffff;">
                        <span style="background-color: #E21B3C; padding: 2px 12px; border-radius: 12px; display: inline-block; transform: rotate(-2deg); box-shadow: 0 4px 0 #A0132B;">Quiz</span>
                        <span style="background-color: #1368CE; padding: 2px 12px; border-radius: 12px; display: inline-block; transform: rotate(2deg); box-shadow: 0 4px 0 #0E4B94;">Arena</span>
                    </h1>
                </td>
            </tr>

            <tr>
                <td style="background-color: #180D38; border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 32px 24px; text-align: center; box-shadow: 0 15px 30px rgba(0,0,0,0.4);">
                    
                    <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">
                        Conta Recuperada com Sucesso! 
                    </h2>

                    <p style="font-size: 15px; color: #d4d4d8; line-height: 1.5; margin-top: 0; margin-bottom: 12px;">
                        Olá, <strong style="color: #38bdf8;">${name}</strong>!
                    </p>

                    <p style="font-size: 14px; color: #a1a1aa; line-height: 1.5; margin-bottom: 24px;">
                        Sua senha foi alterada e sua conta no <strong style="color: #ffffff;">QuizArena</strong> foi recuperada com sucesso. Você já pode fazer login normalmente utilizando sua nova credencial.
                    </p>

                    <p style="font-size: 12px; color: #71717a; line-height: 1.4; margin-bottom: 8px;">
                        Obrigado por continuar com a QuizArena!
                    </p>

                    <p style="font-size: 11px; color: #E21B3C; font-weight: 700; margin: 0;">
                        ⚠ Se você não realizou essa alteração, entre em contato com o suporte imediatamente.
                    </p>

                </td>
            </tr>

            <tr>
                <td align="center" style="padding-top: 20px; font-size: 11px; color: #52525b; font-weight: 700;">
                    QuizArena © ${new Date().getFullYear()} • Que vença o melhor!
                </td>
            </tr>

        </table>
    </div>
`;