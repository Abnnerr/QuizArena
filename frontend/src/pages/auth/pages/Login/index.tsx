
import { Helmet } from "react-helmet-async";
import { BiUser } from "react-icons/bi";
import {
    FiArrowRight,
    FiLock,
    FiLogIn,
    FiShield,
} from "react-icons/fi";

import { useLogin } from "../../hooks/useLogin";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useToast } from "../../../../contexts/ToastContext";

import { Input } from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";

import RegisterPrompt from "./components/RegisterPrompt";
import PasswordField from "./components/PasswordField";

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

            toast.success("Usuario encontrado")
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Não foi possível entrar. Tente novamente."
            );
        }
    };

    return (
        <>
            <Helmet>
                <title>QuizArena | Login</title>
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
                                Entre na sua conta e continue sua jornada.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CONTEÚDO */}
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* LOGIN */}
                    <div
                        className="
                            rounded-2xl border-2 border-b-4
                            p-5 sm:p-6 lg:col-span-2
                        "
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
                                    Informe seus dados para continuar.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleLogin}
                            className="space-y-4"
                            data-cy="login-form"
                        >
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

                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Senha
                                </label>

                                <PasswordField
                                    password={password}
                                    setPassword={setPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    colors={colors}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={!isFormValid || loading}
                                isLoading={loading}
                                leftIcon={<FiLogIn />}
                                rightIcon={<FiArrowRight />}
                                className="h-13 rounded-xl"
                                data-cy="login-submit"
                            >
                                Entrar na conta
                            </Button>
                        </form>
                    </div>

                    {/* INFORMAÇÕES */}
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
                                Por que entrar?
                            </h3>

                            <div className="mt-5 space-y-5">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `${colors.primary}20`,
                                            color: colors.primary,
                                        }}
                                    >
                                        <FiShield size={18} />
                                    </div>

                                    <div>
                                        <p
                                            className="text-sm font-bold"
                                            style={{ color: colors.text }}
                                        >
                                            Sua conta
                                        </p>

                                        <p
                                            className="mt-1 text-xs leading-relaxed"
                                            style={{ color: colors.muted }}
                                        >
                                            Acesse sua experiência e seus recursos no QuizArena.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `${colors.primary}20`,
                                            color: colors.primary,
                                        }}
                                    >
                                        <FiLock size={18} />
                                    </div>

                                    <div>
                                        <p
                                            className="text-sm font-bold"
                                            style={{ color: colors.text }}
                                        >
                                            Acesso seguro
                                        </p>

                                        <p
                                            className="mt-1 text-xs leading-relaxed"
                                            style={{ color: colors.muted }}
                                        >
                                            Entre com suas credenciais para continuar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CADASTRO */}
                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            }}
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
