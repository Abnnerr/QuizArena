
import { Helmet } from "react-helmet-async";
import {
    FiShield,
    FiLock,
    FiKey,
    FiCheckCircle,
    FiAlertCircle,
    FiChevronRight,
} from "react-icons/fi";

import { useNavigate } from "react-router";
import { useTheme } from "../../../../../contexts/hooks/useTheme";


const Security = () => {
    const { colors } = useTheme();
    const navigate = useNavigate()

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    return (
        <>
            <Helmet>
                <title>QuizArena | Segurança</title>
                <meta
                    name="description"
                    content="Gerencie a segurança da sua conta QuizArena."
                />
            </Helmet>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <section
                    className="flex flex-col gap-4 rounded-2xl border-2 p-5 sm:flex-row sm:items-center sm:p-6"
                    style={cardStyle}
                >
                    <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{
                            backgroundColor: `${colors.primary}20`,
                            color: colors.primary,
                        }}
                    >
                        <FiShield size={28} />
                    </div>

                    <div className="flex-1">
                        <h1
                            className="text-xl font-black sm:text-2xl"
                            style={{ color: colors.text }}
                        >
                            Segurança
                        </h1>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Gerencie as configurações de segurança da sua conta.
                        </p>
                    </div>

                    <div
                        className="flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold"
                        style={{
                            backgroundColor: `${colors.success}15`,
                            color: colors.success,
                        }}
                    >
                        <FiCheckCircle size={15} />
                        Sua conta
                    </div>
                </section>

                <section className="flex flex-col gap-3">
                    <div>
                        <h2
                            className="text-lg font-black"
                            style={{ color: colors.text }}
                        >
                            Proteção da conta
                        </h2>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Mantenha seus dados de acesso protegidos.
                        </p>
                    </div>

                    <div
                        className="flex items-center gap-4 rounded-2xl border-2 p-5"
                        style={cardStyle}
                    >
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiLock size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3
                                className="text-sm font-black"
                                style={{ color: colors.text }}
                            >
                                Senha da conta
                            </h3>

                            <p
                                className="mt-1 text-xs leading-relaxed sm:text-sm"
                                style={{ color: colors.muted }}
                            >
                                Utilize uma senha forte e atualize-a
                                periodicamente para proteger seu acesso.
                            </p>
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-4 rounded-2xl border-2 p-5 sm:flex-row sm:items-center"
                        style={cardStyle}
                    >
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiKey size={21} />
                        </div>

                        <div className="flex-1">
                            <h3
                                className="text-sm font-black"
                                style={{ color: colors.text }}
                            >
                                Alterar senha
                            </h3>

                            <p
                                className="mt-1 text-xs sm:text-sm"
                                style={{ color: colors.muted }}
                            >
                                Atualize sua senha de acesso à plataforma.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                navigate('/dashboard/changepassword')
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-opacity hover:opacity-80"
                            style={{
                                backgroundColor: `${colors.primary}15`,
                                color: colors.primary,
                            }}
                        >
                            Alterar senha
                            <FiChevronRight size={17} />
                        </button>
                    </div>
                </section>
                <section
                    className="flex items-start gap-3 rounded-2xl border-2 p-5"
                    style={{
                        backgroundColor: `${colors.primary}08`,
                        borderColor: `${colors.primary}35`,
                    }}
                >
                    <FiAlertCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                        style={{ color: colors.primary }}
                    />

                    <div>
                        <h3
                            className="text-sm font-black"
                            style={{ color: colors.text }}
                        >
                            Dicas para proteger sua conta
                        </h3>

                        <ul
                            className="mt-2 flex list-disc flex-col gap-2 pl-4 text-xs leading-relaxed sm:text-sm"
                            style={{ color: colors.muted }}
                        >
                            <li>Evite utilizar senhas fáceis de adivinhar.</li>
                            <li>Não compartilhe seus dados de acesso.</li>
                            <li>Evite utilizar a mesma senha em vários serviços.</li>
                        </ul>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Security;
