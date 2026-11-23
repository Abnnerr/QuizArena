
import { useNavigate } from "react-router";
import {
    FiMonitor,
    FiBookOpen,
    FiHelpCircle,
    FiArrowUpRight,
    FiPlus,
    FiLayers,
} from "react-icons/fi";
import { useTheme } from "../../../contexts/ThemeContext";
import Button from "../../../shared/ui/Button";



const BoardHomePage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();

    const sections = [
        {
            title: "Minhas salas",
            description: "Crie partidas, gerencie suas salas e acompanhe os jogadores.",
            icon: <FiMonitor size={24} />,
            path: "/dashboard/rooms",
        },
        {
            title: "Biblioteca de perguntas",
            description: "Explore categorias e encontre perguntas para suas partidas.",
            icon: <FiBookOpen size={24} />,
            path: "/dashboard/library",
        },
        {
            title: "Minhas perguntas",
            description: "Visualize e gerencie as perguntas que você cadastrou.",
            icon: <FiHelpCircle size={24} />,
            path: "/dashboard/my-questions",
        },
    ];

    return (
        <div className="space-y-8 pb-10">

            {/* Boas-vindas */}
            <div
                className="overflow-hidden rounded-2xl p-6 md:p-8"
                style={{
                    background: colors.card,
                    border: `2px solid ${colors.border}`,
                }}
            >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <span
                            className="mb-3 inline-flex items-center gap-2 text-sm font-bold"
                            style={{ color: colors.primary }}
                        >
                            <FiLayers />
                            QUIZ ARENA
                        </span>

                        <h1 className="text-3xl font-black md:text-4xl">
                            Bem-vindo ao seu painel!
                        </h1>

                        <p
                            className="mt-3 max-w-xl text-sm md:text-base"
                            style={{ color: colors.muted }}
                        >
                            Organize suas perguntas, crie partidas e transforme
                            seus conhecimentos em desafios.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        leftIcon={<FiPlus />}
                        rightIcon={<FiArrowUpRight />}
                        onClick={() => navigate("/dashboard/rooms")}
                    >
                        Criar uma sala
                    </Button>
                </div>
            </div>

            {/* Atalhos */}
            <div>
                <div className="mb-4">
                    <h2 className="text-xl font-black">
                        Acesso rápido
                    </h2>

                    <p
                        className="mt-1 text-sm"
                        style={{ color: colors.muted }}
                    >
                        Escolha o que deseja fazer.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sections.map(section => (
                        <button
                            key={section.title}
                            onClick={() => navigate(section.path)}
                            className="group rounded-2xl border-2 p-5 text-left transition hover:-translate-y-1"
                            style={{
                                background: colors.card,
                                borderColor: colors.border,
                            }}
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                    style={{
                                        background: `${colors.primary}18`,
                                        color: colors.primary,
                                    }}
                                >
                                    {section.icon}
                                </div>

                                <FiArrowUpRight
                                    size={20}
                                    style={{ color: colors.muted }}
                                    className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </div>

                            <h3 className="text-lg font-black">
                                {section.title}
                            </h3>

                            <p
                                className="mt-2 text-sm leading-relaxed"
                                style={{ color: colors.muted }}
                            >
                                {section.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dica */}
            <div
                className="flex items-start gap-4 rounded-2xl border-2 p-5"
                style={{
                    background: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                        background: "#1CB0F618",
                        color: "#1CB0F6",
                    }}
                >
                    <FiBookOpen size={22} />
                </div>

                <div>
                    <h3 className="font-bold">
                        Prepare suas perguntas!
                    </h3>

                    <p
                        className="mt-1 text-sm"
                        style={{ color: colors.muted }}
                    >
                        Organize suas perguntas por categoria e utilize sua
                        biblioteca para montar partidas ainda mais interessantes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BoardHomePage;
