import React from "react";
import { Link } from "react-router";

interface LoginPromptProps {
    muted: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ muted }) => {
    return (
        <div
            className="
                mt-5 text-center font-black
                text-xs sm:text-sm
            "
            style={{ color: muted }}
        >
            Lembrou a senha?{" "}

            <Link
                to="/auth/login"
                className="
                    font-black uppercase tracking-wider
                    ml-1 underline underline-offset-4
                    transition-colors
                "
                style={{ color: "#1CB0F6" }}
            >
                Voltar para o Login
            </Link>
        </div>
    );
};

export default LoginPrompt;