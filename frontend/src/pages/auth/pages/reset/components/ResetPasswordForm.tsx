
import React from "react";
import { BiLock } from "react-icons/bi";
import { BsEye, BsEyeSlash, BsArrowRight } from "react-icons/bs";

import Input from "../../../../../shared/ui/Input";
import Button from "../../../../../shared/ui/Button";
import type { Colors } from "../../../../../shared/types/types";

interface ResetPasswordFormProps {
    colors: Colors;

    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;

    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;

    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;

    showConfirmPassword: boolean;
    setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;

    loading: boolean;
    handleSubmit: (
        event: React.FormEvent<HTMLFormElement>
    ) => void | Promise<void>;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
    colors,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    handleSubmit,
}) => {
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5"
        >
            <div className="flex flex-col gap-4">
                <Input
                    label="Nova Senha"
                    icon={<BiLock className="w-6 h-6" />}
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    color={colors.surface}
                    border={colors.border}
                    rightElement={
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((value) => !value)
                            }
                            className="transition-colors cursor-pointer"
                            style={{ color: colors.muted }}
                            aria-label={
                                showPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"
                            }
                        >
                            {showPassword ? (
                                <BsEyeSlash className="w-6 h-6" />
                            ) : (
                                <BsEye className="w-6 h-6" />
                            )}
                        </button>
                    }
                />

                <Input
                    label="Confirmar Nova Senha"
                    icon={<BiLock className="w-6 h-6" />}
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                    placeholder="••••••••"
                    color={colors.surface}
                    border={colors.border}
                    rightElement={
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword((value) => !value)
                            }
                            className="transition-colors cursor-pointer"
                            style={{ color: colors.muted }}
                            aria-label={
                                showConfirmPassword
                                    ? "Ocultar confirmação de senha"
                                    : "Mostrar confirmação de senha"
                            }
                        >
                            {showConfirmPassword ? (
                                <BsEyeSlash className="w-6 h-6" />
                            ) : (
                                <BsEye className="w-6 h-6" />
                            )}
                        </button>
                    }
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading || !password || !confirmPassword}
                isLoading={loading}
                rightIcon={
                    !loading ? (
                        <BsArrowRight className="w-5 h-5" />
                    ) : undefined
                }
                className="h-14 rounded-xl text-sm tracking-wide shadow-md"
            >
                {loading ? "Redefinindo..." : "Salvar Nova Senha"}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;
