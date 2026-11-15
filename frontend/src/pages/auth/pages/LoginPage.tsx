
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { BiArrowBack, BiLock, BiUser } from "react-icons/bi";
import { BsArrowRight, BsEye, BsEyeSlash } from "react-icons/bs";
import { useLogin } from "../hooks/useLogin";
import { useTheme } from "../../../contexts/ThemeContext";
import { Input } from "../../../shared/ui/Input";

const LoginPage = () => {
    const {
        userName,
        password,
        showPassword,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit,
        feedback,
        loading
    } = useLogin();

    const { colors } = useTheme();

    return (
        <>
            <Helmet>
                <title>QuizArena • Login</title>
            </Helmet>

            <div
                className="
                    w-full max-w-xl mx-auto px-4
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    py-3 sm:py-4
                "
            >
                {/* TOPBAR */}
                <div className="w-full flex items-center justify-between mb-4">
                    <Link
                        to="/"
                        className="
                            inline-flex h-10 items-center gap-2
                            border-2 border-b-4 px-4 py-2
                            rounded-2xl text-xs sm:text-sm
                            font-black uppercase tracking-wider
                            transition-all cursor-pointer shadow-sm
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.muted,
                        }}
                    >
                        <BiArrowBack className="w-5 h-5" />
                        <span>Início</span>
                    </Link>

                    <div
                        className="
                            inline-flex items-center gap-2
                            font-black px-4 py-2 rounded-2xl
                            text-xs uppercase tracking-wider
                            border-b-4 shadow-sm
                        "
                        style={{
                            backgroundColor: colors.primary,
                            color: "#7A5B00",
                            borderColor: colors.border,
                        }}
                    >
                        <span>Acessar Conta</span>
                    </div>
                </div>

                {/* BANNER DE BOAS-VINDAS */}
                <div
                    className="
                        w-full flex flex-col sm:flex-row
                        items-center justify-center
                        gap-3 mb-4
                    "
                >
                    <div
                        className="
                            rounded-3xl border-2 border-b-8
                            shadow-lg flex-shrink-0
                            flex items-center justify-center
                            transform hover:scale-105 transition-transform
                            w-20 h-20 sm:w-24 sm:h-24 p-3
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

                    <div
                        className="
                            relative w-full sm:w-auto
                            border-2 border-b-4 rounded-2xl
                            text-center sm:text-left shadow-lg
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
                                borderRight: `8px solid ${colors.border}`
                            }}
                        />

                        <div
                            className="
                                hidden sm:block absolute -left-2
                                top-1/2 -translate-y-1/2
                                w-0 h-0 border-y-6 border-y-transparent
                            "
                            style={{
                                borderRight: `6px solid ${colors.card}`
                            }}
                        />

                        <h2
                            className="
                                font-black tracking-tight
                                text-xl sm:text-2xl
                            "
                            style={{ color: colors.text }}
                        >
                            Bem-vindo de volta!
                        </h2>

                        <p
                            className="
                                font-extrabold mt-1
                                text-xs sm:text-sm
                            "
                            style={{ color: colors.muted }}
                        >
                            Entre com sua conta para gerenciar suas partidas na arena.
                        </p>
                    </div>
                </div>

                {/* FORMULÁRIO */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-3"
                >
                    <div
                        className="
                            border-2 border-b-8 rounded-3xl shadow-lg
                            p-5 sm:p-6 space-y-3
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        {/* FEEDBACK */}
                        <div className="min-h-[55px] flex items-center justify-center">
                            {feedback && (
                                <div
                                    className="
                                        w-full p-3.5 rounded-2xl
                                        text-xs sm:text-sm font-black
                                        text-center border-2 border-b-4
                                        flex items-center justify-center gap-2
                                    "
                                    style={{
                                        backgroundColor:
                                            feedback.type === "Success"
                                                ? `${colors.success}20`
                                                : feedback.type === "Warning"
                                                    ? `${colors.primary}20`
                                                    : `${colors.danger}20`,

                                        borderColor:
                                            feedback.type === "Success"
                                                ? colors.success
                                                : feedback.type === "Warning"
                                                    ? colors.primary
                                                    : colors.danger,

                                        color:
                                            feedback.type === "Success"
                                                ? colors.success
                                                : feedback.type === "Warning"
                                                    ? colors.primary
                                                    : colors.danger,
                                    }}
                                >
                                    <span>{feedback.message}</span>
                                </div>
                            )}
                        </div>

                        {/* NOME DE USUÁRIO */}
                        <Input
                            label="Nome de Usuário"
                            icon={<BiUser className="w-6 h-6" />}
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Ex: Gilberto"
                        />

                        {/* SENHA */}
                        <div>
                            <div className="flex items-center justify-end mb-1">
                                <Link
                                    to="/auth/forgot-password"
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider transition-colors
                                    "
                                    style={{ color: "#1CB0F6" }}
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <Input
                                label="Senha"
                                icon={<BiLock className="w-6 h-6" />}
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="transition-colors cursor-pointer"
                                        style={{ color: colors.muted }}
                                        aria-label={
                                            showPassword
                                                ? "Ocultar senha"
                                                : "Mostrar senha"
                                        }
                                    >
                                        {showPassword
                                            ? <BsEyeSlash className="w-6 h-6" />
                                            : <BsEye className="w-6 h-6" />
                                        }
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <button
                        type="submit"
                        disabled={Boolean(!userName || !password || loading)}
                        className="
                            w-full h-14 font-black px-4 rounded-2xl
                            text-xs sm:text-sm uppercase tracking-wider
                            border-b-4 active:border-b-0 active:translate-y-1
                            transition-all shadow-md flex items-center
                            justify-center gap-2 cursor-pointer
                            disabled:cursor-not-allowed disabled:translate-y-0
                            disabled:border-b-4
                        "
                        style={{
                            backgroundColor: !userName || !password || loading
                                ? colors.surface
                                : colors.success,

                            borderColor: !userName || !password || loading
                                ? colors.border
                                : "#46A302",

                            color: !userName || !password || loading
                                ? colors.muted
                                : "#FFFFFF",
                        }}
                    >
                        <span>{loading ? "Entrando..." : "Entrar na Sala"}</span>

                        {!loading && (
                            <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                </form>

                {/* REGISTRO */}
                <div
                    className="
                        text-center text-xs sm:text-sm font-black
                        mt-4
                    "
                    style={{ color: colors.muted }}
                >
                    Ainda não tem uma conta?{" "}

                    <Link
                        to="/auth/register"
                        className="
                            font-black uppercase tracking-wider
                            ml-1 underline underline-offset-4
                            transition-colors
                        "
                        style={{ color: "#1CB0F6" }}
                    >
                        Criar Conta
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
