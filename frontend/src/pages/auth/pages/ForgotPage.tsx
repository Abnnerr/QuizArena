
import { Helmet } from "react-helmet-async";
import { useTheme } from "../../../contexts/ThemeContext";
import { useForgot } from "../hooks/useForgot";
import { Link } from "react-router";
import { BiArrowBack, BiMailSend } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

const ForgotPage: React.FC = () => {
    const {
        email,
        loading,
        feedback,
        setEmail,
        handleSubmit
    } = useForgot();

    const { colors } = useTheme();

    const feedbackColors = {
        Success: {
            background: `${colors.success}20`,
            border: colors.success,
            text: colors.success,
        },
        Warning: {
            background: `${colors.primary}20`,
            border: colors.primary,
            text: colors.primary,
        },
        Error: {
            background: `${colors.danger}20`,
            border: colors.danger,
            text: colors.danger,
        },
    };

    const currentFeedback = feedback
        ? feedbackColors[feedback.type as keyof typeof feedbackColors] ??
        feedbackColors.Error
        : null;

    return (
        <>
            <Helmet>
                <title>Recuperar Senha | QuizArena</title>
            </Helmet>

            <div
                className="
                    w-full max-w-xl mx-auto
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    px-4 py-5 sm:py-6
                "
            >
                {/* TOPBAR */}
                <div className="w-full flex items-center justify-between mb-5">
                    <Link
                        to="/auth/login"
                        className="
                            inline-flex items-center gap-2
                            h-10 px-4
                            border-2 border-b-4
                            active:border-b-2 active:translate-y-0.5
                            rounded-2xl font-black uppercase tracking-wider
                            text-xs sm:text-sm
                            transition-all cursor-pointer
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.muted,
                        }}
                    >
                        <BiArrowBack className="w-5 h-5" />
                        <span>Voltar</span>
                    </Link>

                    <div
                        className="
                            inline-flex items-center gap-2
                            px-4 py-2 text-xs
                            font-black rounded-2xl
                            border-b-4 uppercase tracking-wider
                        "
                        style={{
                            backgroundColor: colors.primary,
                            color: "#493817",
                            borderColor: colors.border,
                        }}
                    >
                        <span>Recuperação</span>
                    </div>
                </div>

                {/* FEEDBACK */}
                {feedback && currentFeedback && (
                    <div
                        className="
                            w-full mb-5 p-4 rounded-2xl
                            text-sm font-black text-center
                            border-2 border-b-4
                            flex items-center justify-center gap-2
                            animate-bounce-short
                        "
                        style={{
                            backgroundColor: currentFeedback.background,
                            borderColor: currentFeedback.border,
                            color: currentFeedback.text,
                        }}
                    >
                        <span>{feedback.message}</span>
                    </div>
                )}

                {/* HEADER */}
                <div
                    className="
                        w-full flex flex-col sm:flex-row
                        items-center justify-center
                        gap-4 mb-6
                    "
                >
                    <div
                        className="
                            rounded-3xl border-2 border-b-8
                            p-3 shadow-sm flex-shrink-0
                            flex items-center justify-center
                            transform hover:scale-105 transition-transform
                            w-24 h-24 sm:w-28 sm:h-28
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <img
                            src="/favicon-quiz.png"
                            alt="QuizArena"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div
                        className="
                            relative border-2 border-b-4
                            rounded-2xl shadow-sm w-full
                            text-center sm:text-left
                            p-4 sm:p-5
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="
                                hidden sm:block absolute -left-3
                                top-1/2 -translate-y-1/2
                                w-0 h-0 border-y-8 border-y-transparent
                            "
                            style={{
                                borderRight: `8px solid ${colors.border}`,
                            }}
                        />

                        <div
                            className="
                                hidden sm:block absolute -left-2
                                top-1/2 -translate-y-1/2
                                w-0 h-0 border-y-6 border-y-transparent
                            "
                            style={{
                                borderRight: `6px solid ${colors.card}`,
                            }}
                        />

                        <h2
                            className="
                                font-black tracking-tight
                                text-xl sm:text-2xl
                            "
                            style={{ color: colors.text }}
                        >
                            Esqueceu sua senha?
                        </h2>

                        <p
                            className="
                                font-extrabold mt-1
                                text-xs sm:text-sm
                            "
                            style={{ color: colors.muted }}
                        >
                            Sem problemas! Digite seu e-mail para enviarmos as instruções.
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div
                        className="
                            border-2 border-b-8 rounded-3xl
                            shadow-sm space-y-4
                            p-5 sm:p-8
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <label
                            className="
                                block font-black uppercase tracking-widest
                                mb-3 text-center sm:text-left
                                text-xs
                            "
                            style={{ color: colors.muted }}
                        >
                            E-mail da Conta
                        </label>

                        <div className="relative">
                            <div
                                className="
                                    absolute inset-y-0 left-0 pl-4
                                    flex items-center pointer-events-none z-10
                                "
                                style={{ color: colors.primary }}
                            >
                                <BiMailSend className="w-7 h-7" />
                            </div>

                            <input
                                type="email"
                                required
                                disabled={loading}
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="seu@email.com"
                                className="
                                    w-full border-2 border-b-4 rounded-2xl
                                    pl-12 pr-4 py-4
                                    font-black text-center text-lg sm:text-xl
                                    placeholder:opacity-60
                                    focus:outline-none
                                    transition-all
                                    disabled:opacity-50
                                "
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text,
                                    caretColor: colors.primary,
                                }}
                            />
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="
                            w-full h-14 text-lg
                            border-b-4 active:border-b-0
                            active:translate-y-1
                            font-black rounded-2xl shadow-sm
                            transition-all duration-75
                            flex items-center justify-center gap-3
                            uppercase tracking-wider cursor-pointer
                            disabled:cursor-not-allowed
                            disabled:translate-y-0
                            disabled:border-b-4
                        "
                        style={{
                            backgroundColor:
                                loading || !email.trim()
                                    ? colors.surface
                                    : colors.success,
                            borderColor:
                                loading || !email.trim()
                                    ? colors.border
                                    : colors.success,
                            color:
                                loading || !email.trim()
                                    ? colors.muted
                                    : "#FFFFFF",
                        }}
                    >
                        <span>
                            {loading ? "Enviando..." : "Enviar Instruções"}
                        </span>

                        {!loading && <BsArrowRight className="w-6 h-6" />}
                    </button>
                </form>

                {/* LOGIN LINK */}
                <div
                    className="
                        mt-5 text-center font-black
                        text-xs sm:text-sm
                    "
                    style={{ color: colors.muted }}
                >
                    Lembrou a senha?{" "}
                    <Link
                        to="/auth/login"
                        className="
                            font-black uppercase tracking-wider
                            ml-1 underline underline-offset-4
                            transition-colors
                        "
                        style={{ color: "#1CB0F6" }}
                    >
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ForgotPage;
