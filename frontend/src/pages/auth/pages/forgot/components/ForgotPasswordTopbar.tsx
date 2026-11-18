import React from "react";
import { Link } from "react-router";
import { BiArrowBack } from "react-icons/bi";
import type { RegisterColors } from "../../register/types/types";


interface ForgotPasswordTopbarProps {
    colors: RegisterColors;
}

const ForgotPasswordTopbar: React.FC<ForgotPasswordTopbarProps> = ({
    colors,
}) => {
    return (
        <div className="w-full flex items-center justify-between mb-5">
            <Link
                to="/auth/login"
                className="
                    inline-flex items-center gap-2
                    h-10 px-4
                    border-2 border-b-4
                    active:border-b-2 active:translate-y-0.5
                    rounded-2xl font-black uppercase tracking-wider
                    text-xs sm:text-sm
                    transition-all cursor-pointer
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.muted,
                }}
            >
                <BiArrowBack className="w-5 h-5" />
                <span>Voltar</span>
            </Link>

            <div
                className="
                    inline-flex items-center gap-2
                    px-4 py-2 text-xs
                    font-black rounded-2xl
                    border-b-4 uppercase tracking-wider
                "
                style={{
                    backgroundColor: colors.primary,
                    color: "#493817",
                    borderColor: colors.border,
                }}
            >
                <span>Recuperação</span>
            </div>
        </div>
    );
};

export default ForgotPasswordTopbar;