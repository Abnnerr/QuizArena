
import React from "react";
import { Link } from "react-router";
import type { RegisterColors } from "../types/types";


interface LoginPromptProps {
    colors: RegisterColors;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ colors }) => {
    return (
        <div
            className="
                text-center text-xs sm:text-sm font-black
                mt-4
            "
            style={{ color: colors.muted }}
        >
            Já tem uma conta na arena?

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
    );
};

export default LoginPrompt;
