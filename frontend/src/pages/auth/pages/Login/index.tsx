
import { Helmet } from "react-helmet-async";
import { BiLock, BiUser } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FiArrowRight, FiLogIn, FiUsers, FiZap } from "react-icons/fi";
import { Link } from "react-router";

import { useLogin } from "../../hooks/useLogin";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useToast } from "../../../../contexts/ToastContext";

import { Input } from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import RegisterPrompt from "./components/RegisterPrompt";

const LoginPage = () => {
    const {
        userName,
        password,
        showPassword,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit,
        loading,
    } = useLogin();

    const { colors } = useTheme();
    const { toast } = useToast();

    const isFormValid = userName.trim().length > 0 && password.length > 0;

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isFormValid || loading) return;

        try {
            await handleSubmit(event);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Não foi possível entrar. Tente novamente."
            );
        }
    };

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const infoItems = [
        {
            icon: <FiUsers size={18} />,
            title: "Gerencie suas salas",
            description: "Organize partidas e acompanhe seus jogadores.",
        },
        {
            icon: <FiZap size={18} />,
            title: "Crie novos desafios",
            description: "Prepare perguntas e proporcione experiências divertidas.",
        },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena | Entrar</title>
            </Helmet>

            <main
                className="
                    mx-auto flex w-full max-w-7xl flex-1
                    flex-col justify-center gap-5
                    px-4 py-6 sm:px-6 lg:px-8
                "
                data-cy="login-page"
            >
                {/* CABEÇALHO */}
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
                            className="
                                flex h-16 w-16 shrink-0 items-center
                                justify-center rounded-2xl
                                border-2 border-b-4 p-2
                            "
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
                                Bem-vindo de volta!
                            </h1>

                            <p
                                className="mt-1 text-sm"
                                style={{ color: colors.muted }}
                            >
                                Acesse sua conta e continue sua jornada como host.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CONTEÚDO */}
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* FORMULÁRIO */}
                    <div
                        className="
                            rounded-2xl border-2 border-b-4
                            p-5 sm:p-6 lg:col-span-2
                        "
                        style={cardStyle}
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: `${colors.primary}20`,
                                    color: colors.primary,
                                }}
                            >
                                <FiLogIn size={22} />
                            </div>

                            <div>
                                <h2
                                    className="text-lg font-black"
                                    style={{ color: colors.text }}
                                >
                                    Acessar minha conta
                                </h2>

                                <p
                                    className="text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    Entre com suas credenciais para continuar.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleLogin}
                            className="space-y-4"
                            data-cy="login-form"
                        >
                            {/* USUÁRIO */}
                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Nome de usuário
                                </label>

                                <Input
                                    type="text"
                                    required
                                    value={userName}
                                    onChange={(event) =>
                                        setUserName(event.target.value)
                                    }
                                    placeholder="Ex: Gilberto"
                                    color={colors.surface}
                                    border={colors.border}
                                    icon={<BiUser className="h-5 w-5" />}
                                    className="h-13"
                                />
                            </div>

                            {/* SENHA */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        className="text-sm font-bold"
                                        style={{ color: colors.text }}
                                    >
                                        Senha
                                    </label>

                                    <Link
                                        to="/auth/forgot-password"
                                        className="text-xs font-bold transition-opacity hover:opacity-75"
                                        style={{ color: colors.primary }}
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>

                                <div data-cy="password-field">
                                    <Input
                                        icon={<BiLock className="h-5 w-5" />}
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Digite sua senha"
                                        color={colors.surface}
                                        border={colors.border}
                                        className="h-13"
                                        rightElement={
                                            <button
                                                type="button"
                                                data-cy="password-toggle"
                                                onClick={() =>
                                                    setShowPassword((prev) => !prev)
                                                }
                                                className="cursor-pointer transition-colors"
                                                style={{ color: colors.muted }}
                                                aria-label={
                                                    showPassword
                                                        ? "Ocultar senha"
                                                        : "Mostrar senha"
                                                }
                                            >
                                                {showPassword ? (
                                                    <BsEyeSlash className="h-5 w-5" />
                                                ) : (
                                                    <BsEye className="h-5 w-5" />
                                                )}
                                            </button>
                                        }
                                    />
                                </div>
                            </div>

                            {/* BOTÃO */}
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={!isFormValid || loading}
                                isLoading={loading}
                                rightIcon={!loading ? <FiArrowRight /> : undefined}
                                className="h-13 rounded-xl"
                                data-cy="login-submit"
                            >
                                {loading ? "Entrando..." : "Entrar na conta"}
                            </Button>
                        </form>
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="flex flex-col gap-5">
                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={cardStyle}
                        >
                            <h3
                                className="text-base font-black"
                                style={{ color: colors.text }}
                            >
                                Sua experiência no QuizArena
                            </h3>

                            <div className="mt-5 space-y-5">
                                {infoItems.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="
                                                flex h-9 w-9 shrink-0
                                                items-center justify-center
                                                rounded-xl
                                            "
                                            style={{
                                                backgroundColor: `${colors.primary}20`,
                                                color: colors.primary,
                                            }}
                                        >
                                            {item.icon}
                                        </div>

                                        <div>
                                            <p
                                                className="text-sm font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                {item.title}
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

                        {/* CADASTRO */}
                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={cardStyle}
                        >
                            <RegisterPrompt colors={colors} />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default LoginPage;
