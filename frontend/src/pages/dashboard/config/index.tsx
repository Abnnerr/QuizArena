
import { useNavigate } from "react-router";
import {
    FiArrowLeft,
    FiShield,
    FiMonitor,

    FiChevronRight,
    FiInfo,
} from "react-icons/fi";
import { useTheme } from "../../../contexts/ThemeContext";


const BoardConfigPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();

    const sections = [
        // {
        //     title: "Minha conta",
        //     description: "Gerencie suas informações pessoais e seu perfil.",
        //     icon: <FiUser size={21} />,
        //     path: "/dashboard/profile",
        // },
        {
            title: "Segurança",
            description: "Gerencie sua senha e as opções de segurança.",
            icon: <FiShield size={21} />,
            path: "/dashboard/security",
        },
        // {
        //     title: "Notificações",
        //     description: "Configure como deseja receber notificações.",
        //     icon: <FiBell size={21} />,
        //     path: "/dashboard/notifications",
        // },
    ];

    return (
        <div className="space-y-6 pb-10">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: colors.muted }}
                >
                    <FiArrowLeft />
                    Voltar
                </button>

                <div className="mb-2 flex items-center gap-2">
                    <FiMonitor
                        size={20}
                        style={{ color: colors.primary }}
                    />

                    <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primary }}
                    >
                        Painel
                    </span>
                </div>

                <h1 className="text-2xl font-extrabold md:text-3xl">
                    Configurações
                </h1>

                <p
                    className="mt-1 text-sm"
                    style={{ color: colors.muted }}
                >
                    Gerencie suas preferências e configurações da conta.
                </p>
            </div>
            <section className="space-y-3">
                <h2 className="text-lg font-bold">
                    Conta e preferências
                </h2>

                <div
                    className="overflow-hidden rounded-2xl border-2"
                    style={{
                        background: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    {sections.map((section, index) => (
                        <button
                            key={section.title}
                            onClick={() => navigate(section.path)}
                            className="flex w-full items-center gap-4 p-4 text-left transition hover:opacity-80 md:p-5"
                            style={{
                                borderBottom:
                                    index !== sections.length - 1
                                        ? `1px solid ${colors.border}`
                                        : "none",
                            }}
                        >
                            <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                style={{
                                    background: `${colors.primary}18`,
                                    color: colors.primary,
                                }}
                            >
                                {section.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold">
                                    {section.title}
                                </h3>

                                <p
                                    className="mt-1 text-xs md:text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    {section.description}
                                </p>
                            </div>

                            <FiChevronRight
                                size={20}
                                style={{ color: colors.muted }}
                            />
                        </button>
                    ))}
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-bold">
                    Sobre a plataforma
                </h2>

                <div
                    className="flex items-center gap-4 rounded-2xl border-2 p-5"
                    style={{
                        background: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                            background: `${colors.primary}18`,
                            color: colors.primary,
                        }}
                    >
                        <FiInfo size={22} />
                    </div>

                    <div>
                        <h3 className="font-bold">
                            Quiz Arena
                        </h3>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Plataforma de aprendizado e competição por meio de quizzes.
                        </p>

                        <p
                            className="mt-2 text-xs font-semibold"
                            style={{ color: colors.muted }}
                        >
                            Versão 1.0.0
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BoardConfigPage;
