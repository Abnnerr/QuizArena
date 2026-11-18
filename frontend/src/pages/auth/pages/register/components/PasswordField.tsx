
import React from "react";
import { BiLock } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import type { RegisterColors } from "../types/types";
import Input from "../../../../../shared/ui/Input";


interface PasswordFieldProps {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    colors: RegisterColors;
    children?: React.ReactNode;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    password,
    setPassword,
    showPassword,
    setShowPassword,
    colors,
    children,
}) => {
    return (
        <div>
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

            {children}
        </div>
    );
};

export default PasswordField;
