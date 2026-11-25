
import React from "react";
import { Helmet } from "react-helmet-async";
import { useRegister } from "../../hooks/useRegister";
import { BiMailSend, BiUser } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { FiUserPlus, FiUsers, FiZap } from "react-icons/fi";

import { PasswordRequirements } from "../../components/PasswordRequeriments";
import { Input } from "../../../../shared/ui/Input";


import LoginPrompt from "./components/LoginPrompt";
import Button from "../../../../shared/ui/Button";
import PasswordField from "./components/PasswordField";
import RegisterTopbar from "./components/RegisterTopBar";
import { useToast } from "../../../../contexts/hooks/useToast";
import { useTheme } from "../../../../contexts/hooks/useTheme";

const RegisterPage: React.FC = () => {
    const {
        userName,
        setUserName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        handleSubmit,
        loading,
        feedback,
    } = useRegister();

    const { colors } = useTheme();
    const { toast } = useToast();

    const passwordRequirements = [
        { label: "8+ caracteres", met: hasMinLength },
        { label: "Letra maiúscula", met: hasUpper },
        { label: "Letra minúscula", met: hasLower },
        { label: "Número (0-9)", met: hasNumber },
        { label: "Caractere especial", met: hasSpecial },
    ];

    const isFormValid =
        userName.trim().length > 0 &&
        email.trim().length > 0 &&
        password.length > 0 &&
        hasMinLength &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSpecial;

    const handleRegister = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!isFormValid || loading) return;

        try {
            await handleSubmit(event);
            toast.success(feedback?.message ?? "Conta criada com sucesso!");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Não foi possível criar sua conta."
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
            title: "Crie suas próprias salas",
            description:
                "Organize partidas e convide amigos para participar dos desafios.",
        },
        {
            icon: <FiZap size={18} />,
            title: "Seja o host da partida",
            description:
                "Tenha controle sobre suas salas e conduza cada rodada do jogo.",
        },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena | Criar conta de host</title>
            </Helmet>

            <main
                className="
                    mx-auto flex min-h-full w-full max-w-7xl
                    flex-col justify-center gap-5
                    px-4 py-6 sm:px-6 lg:px-8
                "
                data-cy="register-page"
            >
                <RegisterTopbar colors={colors} />

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
                                justify-center rounded-2xl border-2
                                border-b-4 p-2
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
                                Torne-se um host!
                            </h1>

                            <p
                                className="mt-1 text-sm"
                                style={{ color: colors.muted }}
                            >
                                Crie sua conta, organize salas e desafie seus amigos.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

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
                                <FiUserPlus size={22} />
                            </div>

                            <div>
                                <h2
                                    className="text-lg font-black"
                                    style={{ color: colors.text }}
                                >
                                    Criar conta de host
                                </h2>

                                <p
                                    className="text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    Informe seus dados para começar a criar salas.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleRegister}
                            className="space-y-4"
                            data-cy="register-form"
                        >
                            <div data-cy="register-username">
                                <Input
                                    label="Nome de usuário"
                                    icon={<BiUser className="h-5 w-5" />}
                                    type="text"
                                    required
                                    value={userName}
                                    onChange={(event) =>
                                        setUserName(event.target.value)
                                    }
                                    placeholder="Ex: Gilberto"
                                    color={colors.surface}
                                    border={colors.border}
                                />
                            </div>

                            <div data-cy="register-email">
                                <Input
                                    label="E-mail"
                                    icon={<BiMailSend className="h-5 w-5" />}
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="seu@email.com"
                                    color={colors.surface}
                                    border={colors.border}
                                />
                            </div>

                            <div data-cy="register-password">
                                <PasswordField
                                    password={password}
                                    setPassword={setPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    colors={colors}
                                >
                                    <div
                                        className="mt-3 rounded-xl border p-3"
                                        style={{
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                        data-cy="register-password-requirements"
                                    >
                                        <PasswordRequirements
                                            requirements={passwordRequirements}
                                        />
                                    </div>
                                </PasswordField>
                            </div>

                            <div
                                className="pt-1"
                                data-cy="register-submit-container"
                            >
                                <Button
                                    type="submit"
                                    variant={isFormValid ? "primary" : "secondary"}
                                    size="lg"
                                    fullWidth
                                    disabled={!isFormValid || loading}
                                    isLoading={loading}
                                    rightIcon={
                                        !loading ? (
                                            <BsArrowRight className="h-5 w-5" />
                                        ) : undefined
                                    }
                                    className="h-13 rounded-xl"
                                    data-cy="register-submit"
                                >
                                    {loading ? "Criando conta..." : "Criar conta de host"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={cardStyle}
                        >
                            <h3
                                className="text-base font-black"
                                style={{ color: colors.text }}
                            >
                                O que você pode fazer?
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

                        <div
                            className="rounded-2xl border-2 border-b-4 p-5"
                            style={cardStyle}
                            data-cy="register-login-prompt"
                        >
                            <LoginPrompt colors={colors} />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default RegisterPage;
