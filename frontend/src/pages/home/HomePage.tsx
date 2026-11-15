
import { useState } from "react";
import { useAuth } from "../../contexts/hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
import type { ResponseDTO } from "../../contexts/types/authTypes";
import { useNavigate } from "react-router";
import { AXIOS } from "../../service";
import { Helmet } from "react-helmet-async";
import { BiHash } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { FaGamepad } from "react-icons/fa";

const HomePage = () => {
    const { user } = useAuth();
    const { colors } = useTheme();

    const [roomCode, setRoomCode] = useState<string>("");
    const [feedBack, setFeedBack] = useState<ResponseDTO | null>(null);

    const navigate = useNavigate();

    async function handleJoinRoom(e: React.FormEvent) {
        e.preventDefault();

        try {
            const { data } = await AXIOS.get(`/room/${roomCode}`);

            setFeedBack({
                type: "Success",
                message: "Sala Encontrada!"
            });

            if (data.type === "Success" && user?.role_name === "host") {
                setTimeout(() => {
                    navigate(`/room/${roomCode}/lobby`);
                }, 1500);
                return;
            }

            setTimeout(() => {
                navigate(`/room/player/username/${roomCode}`);
            }, 1500);

        } catch (error: any) {
            setFeedBack({
                type: "Warning",
                message:
                    error.response?.data?.message ||
                    "Erro ao encontrar a sala ou não existe."
            });

            setTimeout(() => {
                setFeedBack(null);
            }, 2000);
        }
    }

    return (
        <>
            <Helmet>
                <title>Entrar na Sala | QuizArena</title>
            </Helmet>

            <main
                className="
                    w-full h-full min-h-0
                    flex flex-col items-center justify-center
                    mx-auto relative z-10
                    overflow-y-auto overflow-x-hidden
                    max-w-2xl
                    p-3 sm:p-4 lg:p-5
                "
            >
                {/* FEEDBACK */}
                <div className="w-full min-h-18 flex-shrink-0">
                    {feedBack && (
                        <div
                            className="
                                w-full mb-3
                                p-3 sm:p-4
                                rounded-3xl
                                text-xs sm:text-sm
                                font-black text-center
                                border-2 border-b-4
                                flex items-center justify-center gap-2
                                animate-bounce-short
                            "
                            style={{
                                backgroundColor:
                                    feedBack.type === "Success"
                                        ? "#15320F"
                                        : feedBack.type === "Warning"
                                            ? "#3A320A"
                                            : "#3B1515",
                                borderColor:
                                    feedBack.type === "Success"
                                        ? colors.success
                                        : feedBack.type === "Warning"
                                            ? colors.primary
                                            : colors.danger,
                                color:
                                    feedBack.type === "Success"
                                        ? "#8BEA44"
                                        : feedBack.type === "Warning"
                                            ? "#FFD966"
                                            : "#FF6B6B",
                            }}
                        >
                            <span>{feedBack.message}</span>
                        </div>
                    )}
                </div>

                {/* HEADER */}
                <div
                    className="
                        w-full flex flex-col items-center justify-center
                        sm:flex-row gap-3 sm:gap-5
                        mb-4 sm:mb-5 flex-shrink-0
                    "
                >
                    {/* LOGO */}
                    <div
                        className="
                            w-16 h-16 sm:w-24 sm:h-24
                            rounded-3xl
                            border-2 border-b-4 sm:border-b-8
                            flex-shrink-0
                            flex items-center justify-center
                            p-2 sm:p-3
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <img
                            src="/favicon-quiz.png"
                            alt="QuizArena"
                            className="h-full w-full object-contain filter drop-shadow"
                        />
                    </div>

                    {/* MENSAGEM */}
                    <div
                        className="
                            relative w-full
                            border-2 border-b-4
                            rounded-3xl
                            p-6
                            text-center sm:text-left
                            shadow-lg
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="
                                hidden sm:block absolute
                                -left-3 top-1/2 -translate-y-1/2
                                w-0 h-0
                                border-y-8 border-y-transparent
                            "
                            style={{
                                borderRight: `8px solid ${colors.border}`,
                            }}
                        />

                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#58CC02]">
                                QuizArena
                            </span>
                        </div>

                        <h2
                            className="text-lg sm:text-2xl font-black tracking-tight"
                            style={{ color: colors.text }}
                        >
                            Pronto para a disputa?
                        </h2>

                        <p
                            className="text-[11px] sm:text-sm font-extrabold mt-1 leading-relaxed"
                            style={{ color: colors.muted }}
                        >
                            Digite o código da sala para entrar na partida agora!
                        </p>
                    </div>
                </div>

                {/* JOIN FORM */}
                <form
                    onSubmit={handleJoinRoom}
                    className="w-full flex flex-col gap-6"
                >
                    {/* CARD DO FORMULÁRIO */}
                    <div
                        className="
                            w-full border-2 border-b-8
                            rounded-3xl
                            p-6
                            shadow-lg
                            duration-600
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor:
                                feedBack?.type === "Warning"
                                    ? colors.danger
                                    : colors.border,
                        }}
                    >
                        {/* ÍCONE E DESCRIÇÃO */}
                        <div className="flex flex-col items-center mb-4">
                            <div
                                className="
                                    w-10 h-10 sm:w-12 sm:h-12
                                    rounded-xl sm:rounded-2xl
                                    border-2 mb-2
                                    flex items-center justify-center
                                "
                                style={{
                                    backgroundColor: `${colors.primary}18`,
                                    borderColor: `${colors.primary}50`,
                                }}
                            >
                                <BiHash
                                    className="w-6 h-6 sm:w-7 sm:h-7"
                                    style={{ color: colors.primary }}
                                />
                            </div>

                            <label
                                className="
                                    text-[11px] sm:text-xs
                                    font-black uppercase
                                    tracking-widest text-center
                                "
                                style={{ color: colors.muted }}
                            >
                                Código da Sala
                            </label>

                            <p
                                className="
                                    text-[10px] sm:text-[11px]
                                    font-bold mt-1 text-center
                                "
                                style={{ color: colors.muted }}
                            >
                                Insira o código disponibilizado pelo anfitrião
                            </p>
                        </div>

                        {/* INPUT */}
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={roomCode}
                                onChange={(e) =>
                                    setRoomCode(e.target.value.toUpperCase())
                                }
                                placeholder="ARENA123"
                                maxLength={12}
                                className="
                                    w-full h-14
                                    border-2 border-b-4
                                    rounded-2xl
                                    px-4
                                    font-black
                                    tracking-[0.2em]
                                    text-center
                                    text-xl sm:text-3xl
                                    placeholder:tracking-widest
                                    focus:outline-none
                                    focus:border-[#1CB0F6]
                                    transition-all uppercase
                                "
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text,
                                }}
                            />
                        </div>

                        {/* CONTADOR */}
                        <div className="flex items-center justify-between mt-2">
                            <span
                                className="
                                    text-[9px] sm:text-[10px]
                                    font-black uppercase tracking-wider
                                "
                                style={{ color: colors.muted }}
                            >
                                Máximo de 12 caracteres
                            </span>

                            <span
                                className="text-xs font-black"
                                style={{
                                    color:
                                        roomCode.length === 12
                                            ? colors.success
                                            : colors.muted,
                                }}
                            >
                                {roomCode.length}/12
                            </span>
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <button
                        type="submit"
                        disabled={!roomCode.trim()}
                        className="
                            w-full h-14
                            rounded-3xl
                            font-black px-4
                            text-xs sm:text-sm
                            uppercase tracking-wider
                            border-b-4
                            active:border-b-0 active:translate-y-1
                            transition-all shadow-md
                            flex items-center justify-center gap-3
                            cursor-pointer
                            disabled:cursor-not-allowed
                            disabled:translate-y-0
                            disabled:border-b-4
                        "
                        style={{
                            backgroundColor: !roomCode.trim()
                                ? colors.surface
                                : colors.success,
                            borderColor: !roomCode.trim()
                                ? colors.border
                                : "#46A302",
                            color: !roomCode.trim()
                                ? colors.muted
                                : "#FFFFFF",
                        }}
                    >
                        <FaGamepad className="w-5 h-5" />
                        <span>Entrar na Sala</span>
                        <BsArrowRight className="w-5 h-5" />
                    </button>

                    {/* TEXTO FINAL */}
                    <p
                        className="text-center text-[9px] sm:text-xs font-bold"
                        style={{ color: colors.muted }}
                    >
                        Prepare-se para testar seus conhecimentos!
                    </p>
                </form>
            </main>
        </>
    );
};

export default HomePage;
