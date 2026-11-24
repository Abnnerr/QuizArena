
import React from "react";
import { Helmet } from "react-helmet-async";
import { BsShieldLock } from "react-icons/bs";

import { useTheme } from "../../../../contexts/ThemeContext";
import { useReset } from "../../hooks/useReset";

import { PasswordRequirements } from "../../components/PasswordRequeriments";

import ResetPasswordTopbar from "./components/ResetPasswordTopbar";
import ResetPasswordHeader from "./components/ResetPasswordHeader";
import ResetPasswordForm from "./components/ResetPasswordForm";
import LoginPrompt from "./components/LoginPrompt";

const ResetPage: React.FC = () => {
    const {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        loading,
        handleSubmit,
    } = useReset();

    const { colors } = useTheme();

    const passwordRequirements = [
        { label: "8+ caracteres", met: hasMinLength },
        { label: "Letra maiúscula", met: hasUpper },
        { label: "Letra minúscula", met: hasLower },
        { label: "Número (0-9)", met: hasNumber },
        { label: "Caractere especial", met: hasSpecial },
    ];

    return (
        <>
            <Helmet>
                <title>Redefinir Senha | QuizArena</title>
            </Helmet>

            <main
                data-cy="reset-page"
                className="
                    w-full max-w-7xl mx-auto
                    flex flex-col gap-5
                    px-4 py-6
                "
                style={{ color: colors.text }}
            >
                <ResetPasswordTopbar colors={colors} />

                <ResetPasswordHeader colors={colors} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <section
                        className="
                            rounded-2xl border-2 border-b-4
                            p-5 sm:p-6
                            flex flex-col gap-4
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="
                                w-12 h-12 rounded-xl
                                flex items-center justify-center
                            "
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                            }}
                        >
                            <BsShieldLock className="w-6 h-6" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-lg font-bold">
                                Segurança da conta
                            </h2>

                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: colors.muted }}
                            >
                                Sua nova senha precisa atender aos
                                requisitos abaixo para manter sua
                                conta protegida.
                            </p>
                        </div>

                        <div
                            data-cy="reset-password-requirements"
                            className="mt-2"
                        >
                            <PasswordRequirements
                                requirements={passwordRequirements}
                            />
                        </div>
                    </section>
                    <section
                        className="
                            lg:col-span-2
                            rounded-2xl border-2 border-b-4
                            p-5 sm:p-8
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="space-y-2 mb-6">
                            <h2 className="text-xl font-bold">
                                Redefinir senha
                            </h2>

                            <p
                                className="text-sm"
                                style={{ color: colors.muted }}
                            >
                                Informe sua nova senha e confirme
                                para concluir a alteração.
                            </p>
                        </div>

                        <div data-cy="reset-form">
                            <ResetPasswordForm
                                colors={colors}
                                password={password}
                                setPassword={setPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                showConfirmPassword={showConfirmPassword}
                                setShowConfirmPassword={setShowConfirmPassword}
                                loading={loading}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    </section>
                </div>

                <div
                    data-cy="reset-login-prompt"
                    className="text-center"
                >
                    <LoginPrompt muted={colors.muted} />
                </div>
            </main>
        </>
    );
};

export default ResetPage;
