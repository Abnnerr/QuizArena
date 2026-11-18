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

    passwordRequirements: React.ReactNode;

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
    passwordRequirements,
    loading,
    handleSubmit,
}) => {
    return (
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
                <div>
                    <Input
                        label="Nova Senha"
                        icon={<BiLock className="w-6 h-6" />}
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="••••••••"
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

                    <div className="mt-2">
                        {passwordRequirements}
                    </div>
                </div>

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
                variant="success"
                size="lg"
                fullWidth
                disabled={loading}
                isLoading={loading}
                rightIcon={
                    !loading
                        ? <BsArrowRight className="w-6 h-6" />
                        : undefined
                }
            >
                {loading ? "Redefinindo..." : "Salvar Nova Senha"}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;