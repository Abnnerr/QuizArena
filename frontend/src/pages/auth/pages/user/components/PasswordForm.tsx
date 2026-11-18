import React from "react";
import { BiLock } from "react-icons/bi";
import { BsKey, BsShieldLock, BsEye, BsEyeSlash } from "react-icons/bs";
import Input from "../../../../../shared/ui/Input";
import Button from "../../../../../shared/ui/Button";
import type { Colors } from "../../../../../shared/types/types";
import type { PasswordFormProps } from "../types/types";



interface PasswordFormComponentProps extends PasswordFormProps {
    colors: Colors;
}

const PasswordForm: React.FC<PasswordFormComponentProps> = ({
    colors,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    handlePasswordSubmit,
}) => {
    const isDisabled =
        !currentPassword ||
        !newPassword ||
        !confirmPassword ||
        loading;

    return (
        <section className="w-full mb-7">
            <div className="flex items-center gap-2 mb-3">
                <BiLock
                    className="w-6 h-6"
                    style={{ color: colors.primary }}
                />

                <h2
                    className="font-black text-lg sm:text-xl uppercase tracking-wide"
                    style={{ color: colors.text }}
                >
                    Segurança da Conta
                </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="w-full">
                <div
                    className="
                        border-2 border-b-8 rounded-3xl
                        shadow-lg p-5 sm:p-6 space-y-4
                    "
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <BsKey
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                        />

                        <p
                            className="font-black text-sm uppercase tracking-wider"
                            style={{ color: colors.text }}
                        >
                            Alterar senha
                        </p>
                    </div>

                    <Input
                        label="Senha Atual"
                        icon={<BiLock className="w-6 h-6" />}
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(event) =>
                            setCurrentPassword(event.target.value)
                        }
                        placeholder="••••••••"
                        rightElement={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword((value) => !value)
                                }
                                className="cursor-pointer"
                                style={{ color: colors.muted }}
                                aria-label={
                                    showCurrentPassword
                                        ? "Ocultar senha atual"
                                        : "Mostrar senha atual"
                                }
                            >
                                {showCurrentPassword
                                    ? <BsEyeSlash className="w-6 h-6" />
                                    : <BsEye className="w-6 h-6" />}
                            </button>
                        }
                    />

                    <Input
                        label="Nova Senha"
                        icon={<BiLock className="w-6 h-6" />}
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(event.target.value)
                        }
                        placeholder="••••••••"
                        rightElement={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword((value) => !value)
                                }
                                className="cursor-pointer"
                                style={{ color: colors.muted }}
                                aria-label={
                                    showNewPassword
                                        ? "Ocultar nova senha"
                                        : "Mostrar nova senha"
                                }
                            >
                                {showNewPassword
                                    ? <BsEyeSlash className="w-6 h-6" />
                                    : <BsEye className="w-6 h-6" />}
                            </button>
                        }
                    />

                    <Input
                        label="Confirmar Nova Senha"
                        icon={<BiLock className="w-6 h-6" />}
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder="••••••••"
                        rightElement={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((value) => !value)
                                }
                                className="cursor-pointer"
                                style={{ color: colors.muted }}
                                aria-label={
                                    showConfirmPassword
                                        ? "Ocultar confirmação"
                                        : "Mostrar confirmação"
                                }
                            >
                                {showConfirmPassword
                                    ? <BsEyeSlash className="w-6 h-6" />
                                    : <BsEye className="w-6 h-6" />}
                            </button>
                        }
                    />

                    <div className="min-h-[45px] flex items-center justify-center">
                        {/* O feedback geral da página permanece fora deste formulário. */}
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    fullWidth
                    disabled={isDisabled}
                    isLoading={loading}
                    leftIcon={<BsShieldLock className="w-5 h-5" />}
                    className="mt-3"
                >
                    Alterar Senha
                </Button>
            </form>
        </section>
    );
};

export default PasswordForm;