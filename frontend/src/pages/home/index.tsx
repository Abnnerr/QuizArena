
import { Helmet } from "react-helmet-async";

import {
    FiArrowLeft,
    FiArrowRight,
    FiBookOpen,
    FiCheckCircle,
    FiHash,
    FiUser,
    FiUsers,
} from "react-icons/fi";

import { FaGamepad } from "react-icons/fa";

import { useTheme } from "../../contexts/ThemeContext";
import { useHome } from "./hooks/useHome";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";

const HomePage = () => {
    const { colors } = useTheme();

    const {
        step,
        roomCode,
        setRoomCode,
        playerName,
        setPlayerName,
        loading,
        handleJoinRoom,
        handlePlayerSubmit,
        handleBack,
    } = useHome();

    const isRoomStep = step === "room";

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

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const iconStyle = {
        backgroundColor: `${colors.primary}20`,
        color: colors.primary,
    };

    return (
        <>
            <Helmet>
                <title>QuizArena | Início</title>
            </Helmet>

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-5 px-4 py-6 sm:px-6 lg:px-8">
                <section
                    className="relative overflow-hidden rounded-2xl border-2 p-5 sm:p-6"
                    style={cardStyle}
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

                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    <div
                        className="min-h-[28rem] rounded-2xl border-2 border-b-4 p-5 sm:p-6 lg:col-span-2"
                        style={cardStyle}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={iconStyle}
                            >
                                {isRoomStep ? (
                                    <FaGamepad size={22} />
                                ) : (
                                    <FiUser size={22} />
                                )}
                            </div>

                            <div>
                                <h2
                                    className="font-black"
                                    style={{ color: colors.text }}
                                >
                                    {isRoomStep
                                        ? "Entrar em uma sala"
                                        : "Identificação do jogador"}
                                </h2>

                                <p
                                    className="text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    {isRoomStep
                                        ? "Digite o código para participar de uma partida."
                                        : "Escolha seu nome para aparecer na partida."}
                                </p>
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-2 gap-3">
                            {["Código da sala", "Jogador"].map((label, index) => {
                                const active = index === 0
                                    ? isRoomStep
                                    : !isRoomStep;

                                return (
                                    <div key={label} className="space-y-1">
                                        <div
                                            className="h-1.5 rounded-full"
                                            style={{
                                                backgroundColor: active
                                                    ? colors.primary
                                                    : colors.border,
                                            }}
                                        />

                                        <span
                                            className="text-[10px] font-bold uppercase"
                                            style={{
                                                color: active
                                                    ? colors.primary
                                                    : colors.muted,
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();

                                if (isRoomStep) {
                                    void handleJoinRoom();
                                } else {
                                    void handlePlayerSubmit();
                                }
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    {isRoomStep
                                        ? "Código da sala"
                                        : "Nome do jogador"}
                                </label>

                                <Input
                                    type="text"
                                    required
                                    value={isRoomStep ? roomCode : playerName}
                                    onChange={(event) =>
                                        isRoomStep
                                            ? setRoomCode(event.target.value.toUpperCase())
                                            : setPlayerName(event.target.value)
                                    }
                                    placeholder={
                                        isRoomStep
                                            ? "Ex: ARENA123"
                                            : "Como deseja ser chamado?"
                                    }
                                    maxLength={isRoomStep ? 12 : 20}
                                    color={colors.surface}
                                    border={colors.border}
                                    icon={
                                        isRoomStep
                                            ? <FiHash className="h-5 w-5" />
                                            : <FiUser className="h-5 w-5" />
                                    }
                                    className={`h-14 ${isRoomStep
                                            ? "text-center text-xl font-black tracking-[0.2em] uppercase"
                                            : "text-base font-bold"
                                        }`}
                                />

                                <div className="mt-2 flex justify-between">
                                    <span
                                        className="text-xs"
                                        style={{ color: colors.muted }}
                                    >
                                        {isRoomStep
                                            ? "Máximo de 12 caracteres"
                                            : "Escolha um nome para a partida"}
                                    </span>

                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: colors.muted }}
                                    >
                                        {isRoomStep
                                            ? `${roomCode.length}/12`
                                            : `${playerName.length}/20`}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={
                                    loading ||
                                    (isRoomStep
                                        ? !roomCode.trim()
                                        : playerName.trim().length < 2)
                                }
                                isLoading={loading}
                                leftIcon={
                                    isRoomStep
                                        ? <FaGamepad />
                                        : <FiUsers />
                                }
                                rightIcon={<FiArrowRight />}
                                className="h-13 rounded-xl"
                            >
                                {isRoomStep
                                    ? "Encontrar sala"
                                    : "Entrar na partida"}
                            </Button>

                            {!isRoomStep && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    size="lg"
                                    disabled={loading}
                                    leftIcon={<FiArrowLeft />}
                                    onClick={handleBack}
                                    className="h-12 rounded-xl"
                                >
                                    Voltar
                                </Button>
                            )}
                        </form>
                    </div>
                    <aside className="flex flex-col gap-5">
                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={cardStyle}
                        >
                            <h3
                                className="font-black"
                                style={{ color: colors.text }}
                            >
                                Como participar?
                            </h3>

                            <div className="mt-5 space-y-5">
                                {steps.map((item, index) => (
                                    <div
                                        key={item.title}
                                        className="flex gap-3"
                                    >
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                            style={iconStyle}
                                        >
                                            {item.icon}
                                        </div>

                                        <div>
                                            <p
                                                className="text-sm font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                {index + 1}. {item.title}
                                            </p>

                                            <p
                                                className="mt-1 text-xs leading-relaxed"
                                                style={{ color: colors.muted }}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="rounded-2xl border-2 p-4"
                            style={cardStyle}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={iconStyle}
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
                    </aside>
                </section>
            </main>
        </>
    );
};

export default HomePage;
