
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useRegister } from '../hooks/useRegister';
import { BiArrowBack, BiLock, BiMailSend, BiUser } from 'react-icons/bi';
import { BsArrowRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import { PasswordRequirements } from '../components/PasswordRequeriments';
import { Input } from '../../../shared/ui/Input';
import { useTheme } from '../../../contexts/ThemeContext';

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
        feedback
    } = useRegister();

    const { colors } = useTheme();

    const passwordRequirements = [
        { label: '8+ caracteres', met: hasMinLength },
        { label: 'Letra maiúscula', met: hasUpper },
        { label: 'Letra minúscula', met: hasLower },
        { label: 'Número (0-9)', met: hasNumber },
        { label: 'Caractere especial', met: hasSpecial },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena • Registrar</title>
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
                            active:border-b-2 active:translate-y-0.5
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
                            color: "#493817",
                            borderColor: colors.border,
                        }}
                    >
                        <span>Criar Conta</span>
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
                            Crie sua conta de Host!
                        </h2>

                        <p
                            className="
                                font-extrabold mt-1
                                text-xs sm:text-sm
                            "
                            style={{ color: colors.muted }}
                        >
                            Monte seus próprios quizes e jogue com seus amigos na arena.
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
                        <div className="min-h-[40px] flex items-center justify-center">
                            {feedback && (
                                <div
                                    className="
                                        w-full p-2 transition-all duration-700
                                        rounded-2xl text-xs sm:text-sm font-black
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setUserName(e.target.value)
                            }
                            placeholder="Ex: Gilberto"
                        />

                        {/* E-MAIL */}
                        <Input
                            label="E-mail"
                            icon={<BiMailSend className="w-6 h-6" />}
                            type="email"
                            required
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            }
                            placeholder="seu@email.com"
                        />

                        {/* SENHA */}
                        <div>
                            <Input
                                label="Senha"
                                icon={<BiLock className="w-6 h-6" />}
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
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

                            <PasswordRequirements
                                requirements={passwordRequirements}
                            />
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full h-14 font-black px-4 rounded-2xl
                            border-b-4 active:border-b-0 active:translate-y-1
                            transition-all duration-75 shadow-md
                            flex items-center justify-center gap-3
                            text-sm sm:text-base uppercase tracking-wider
                            cursor-pointer disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        style={{
                            backgroundColor: colors.success,
                            borderColor: "#478E54",
                            color: "#FFFFFF",
                        }}
                    >
                        <span>
                            {loading ? "Criando conta..." : "Criar Conta"}
                        </span>

                        {!loading && <BsArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                {/* LOGIN */}
                <div
                    className="
                        text-center text-xs sm:text-sm font-black
                        mt-4
                    "
                    style={{ color: colors.muted }}
                >
                    Já tem uma conta na arena?{" "}

                    <Link
                        to="/auth/login"
                        className="
                            font-black uppercase tracking-wider
                            ml-1 underline underline-offset-4
                            transition-colors
                        "
                        style={{ color: "#1CB0F6" }}
                    >
                        Fazer Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
