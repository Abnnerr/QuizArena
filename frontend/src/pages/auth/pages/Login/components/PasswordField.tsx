
import React from "react";
import { Link } from "react-router";
import { BiLock } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import type { LoginColors } from "../types/types";
import Input from "../../../../../shared/ui/Input";

interface PasswordFieldProps {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    colors: LoginColors;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    password,
    setPassword,
    showPassword,
    setShowPassword,
    colors,
}) => {
    return (
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

            <div data-cy="password-field">
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
                            data-cy="password-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
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
            </div>
        </div>
    );
};

export default PasswordField;
