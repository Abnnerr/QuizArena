
import { useState } from "react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import {
    FiArrowRight,
    FiBookOpen,
    FiCheckCircle,
    FiHash,
    FiUsers,
} from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";

import { useAuth } from "../../contexts/hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";

import { AXIOS } from "../../service";

import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import { useToast } from "../../contexts/ToastContext";

const HomePage = () => {
    const { user } = useAuth();
    const { colors } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinRoom = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const code = roomCode.trim();

        if (!code || loading) return;

        try {
            setLoading(true);

            const { data } = await AXIOS.get(`/room/${code}`);

            if (data.type !== "Success") {
                toast.warning(
                    data.message || "Não foi possível encontrar a sala."
                );
                return;
            }

            toast.success("Sala encontrada! Entrando...");

            setTimeout(() => {
                if (user?.role_name === "host") {
                    navigate(`/room/${code}/lobby`);
                } else {
                    navigate(`/room/player/username/${code}`);
                }
            }, 1000);
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Erro ao encontrar a sala ou ela não existe."
            );
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            icon: <FiHash size={18} />,
            title: "Informe o código",
            description: "Digite o código recebido do anfitrião.",
        },
        {
            icon: <FiUsers size={18} />,
            title: "Entre na partida",
            description: "Informe seu nome e aguarde o início.",
        },
        {
            icon: <FiCheckCircle size={18} />,
            title: "Participe do desafio",
            description: "Responda às perguntas e dispute o ranking.",
        },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena | Início</title>
            </Helmet>

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-5 px-4 py-6 sm:px-6 lg:px-8">

                {/* CABEÇALHO */}
                <section
                    className="relative overflow-hidden rounded-2xl border-2 p-5 sm:p-6"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div
                        className="absolute -right-10 -top-16 h-40 w-40 rounded-full opacity-10 blur-3xl"
                        style={{ backgroundColor: colors.primary }}
                    />

                    <div className="relative flex flex-col items-center gap-4 sm:flex-row">
                        <div
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 p-2"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }}
                        >
                            <img
                                src="/favicon-quiz.png"
                                alt="QuizArena"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="text-center sm:text-left">
                            <span
                                className="text-xs font-black uppercase tracking-widest"
                                style={{ color: colors.primary }}
                            >
                                QuizArena
                            </span>

                            <h1
                                className="mt-1 text-2xl font-black sm:text-3xl"
                                style={{ color: colors.text }}
                            >
                                Pronto para o desafio?
                            </h1>

                            <p
                                className="mt-1 text-sm"
                                style={{ color: colors.muted }}
                            >
                                Entre em uma sala e mostre o que você sabe!
                            </p>
                        </div>
                    </div>
                </section>

                {/* CONTEÚDO */}
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* ENTRAR NA SALA */}
                    <div
                        className="rounded-2xl border-2 border-b-4 p-5 sm:p-6 lg:col-span-2"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: `${colors.primary}20`,
                                    color: colors.primary,
                                }}
                            >
                                <FaGamepad size={22} />
                            </div>

                            <div>
                                <h2
                                    className="text-lg font-black"
                                    style={{ color: colors.text }}
                                >
                                    Entrar em uma sala
                                </h2>

                                <p
                                    className="text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    Digite o código para participar de uma partida.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Código da sala
                                </label>

                                <Input
                                    type="text"
                                    required
                                    value={roomCode}
                                    onChange={(event: any) =>
                                        setRoomCode(event.target.value.toUpperCase())
                                    }
                                    placeholder="Ex: ARENA123"
                                    maxLength={12}
                                    color={colors.surface}
                                    border={colors.border}
                                    icon={<FiHash className="h-5 w-5" />}
                                    className="h-14 text-center text-xl font-black tracking-[0.2em] uppercase"
                                />

                                <div className="mt-2 flex justify-between">
                                    <span
                                        className="text-xs font-medium"
                                        style={{ color: colors.muted }}
                                    >
                                        Máximo de 12 caracteres
                                    </span>

                                    <span
                                        className="text-xs font-bold"
                                        style={{
                                            color: roomCode.length === 12
                                                ? colors.primary
                                                : colors.muted,
                                        }}
                                    >
                                        {roomCode.length}/12
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={!roomCode.trim() || loading}
                                isLoading={loading}
                                leftIcon={<FaGamepad />}
                                rightIcon={<FiArrowRight />}
                                className="h-13 rounded-xl"
                            >
                                Entrar na sala
                            </Button>
                        </form>
                    </div>

                    {/* COMO PARTICIPAR */}
                    <div className="flex flex-col gap-5">
                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            }}
                        >
                            <h3
                                className="text-base font-black"
                                style={{ color: colors.text }}
                            >
                                Como participar?
                            </h3>

                            <div className="mt-5 space-y-5">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: `${colors.primary}20`,
                                                color: colors.primary,
                                            }}
                                        >
                                            {step.icon}
                                        </div>

                                        <div>
                                            <p
                                                className="text-sm font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                {index + 1}. {step.title}
                                            </p>

                                            <p
                                                className="mt-1 text-xs leading-relaxed"
                                                style={{ color: colors.muted }}
                                            >
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DICA */}
                        <div
                            className="rounded-2xl border-2 p-4"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{
                                        backgroundColor: `${colors.primary}20`,
                                        color: colors.primary,
                                    }}
                                >
                                    <FiBookOpen size={20} />
                                </div>

                                <div>
                                    <p
                                        className="text-sm font-black"
                                        style={{ color: colors.text }}
                                    >
                                        Aprender é competir!
                                    </p>

                                    <p
                                        className="mt-1 text-xs"
                                        style={{ color: colors.muted }}
                                    >
                                        Evolua a cada nova partida.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomePage;
