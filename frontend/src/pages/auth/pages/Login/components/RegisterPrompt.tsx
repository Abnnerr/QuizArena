
import React from "react";
import { Link } from "react-router";
import type { LoginColors } from "../types/types";



interface RegisterPromptProps {
    colors: LoginColors;
}

const RegisterPrompt: React.FC<RegisterPromptProps> = ({ colors }) => {
    return (
        <div
            className="
                text-center text-xs sm:text-sm font-black
                mt-4
            "
            style={{ color: colors.muted }}
        >
            Ainda não tem uma conta?

            <Link
                to="/auth/register"
                className="
                    font-black uppercase tracking-wider
                    ml-1 underline underline-offset-4
                    transition-colors
                "
                style={{ color: "#1CB0F6" }}
            >
                Criar Conta
            </Link>
        </div>
    );
};

export default RegisterPrompt;
