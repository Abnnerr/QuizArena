
import React from "react";
import { Link } from "react-router";
import { BiArrowBack } from "react-icons/bi";
import type { RegisterColors } from "../types/types";


interface RegisterTopbarProps {
    colors: RegisterColors;
}

const RegisterTopbar: React.FC<RegisterTopbarProps> = ({ colors }) => {
    return (
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
    );
};

export default RegisterTopbar;
