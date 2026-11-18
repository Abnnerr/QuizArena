import React from "react";
import { BsShieldLock } from "react-icons/bs";
import type { UserProfile } from "../types/types";
import type { Colors } from "../../../../../shared/types/types";

interface AccountBannerProps {
    colors: Colors;
    userProfile: UserProfile | null;
}

const AccountBanner: React.FC<AccountBannerProps> = ({
    colors,
    userProfile,
}) => {
    return (
        <div className="w-full flex flex-col sm:flex-row items-center gap-3 mb-6">
            <div
                className="
                    rounded-3xl border-2 border-b-8
                    shadow-lg flex-shrink-0
                    flex items-center justify-center
                    w-20 h-20 sm:w-24 sm:h-24 p-3
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <BsShieldLock
                    className="w-12 h-12"
                    style={{ color: colors.primary }}
                />
            </div>

            <div
                className="
                    relative w-full border-2 border-b-4
                    rounded-2xl text-center sm:text-left
                    shadow-lg p-4 sm:p-5
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <h2
                    className="font-black tracking-tight text-xl sm:text-2xl"
                    style={{ color: colors.text }}
                >
                    Olá, {userProfile?.user_username ?? "Administrador"}!
                </h2>

                <p
                    className="font-extrabold mt-1 text-xs sm:text-sm break-all"
                    style={{ color: colors.muted }}
                >
                    {userProfile?.user_email ?? "Carregando e-mail..."}
                </p>

                <p
                    className="font-extrabold mt-2 text-xs sm:text-sm"
                    style={{ color: colors.muted }}
                >
                    Gerencie a segurança da sua conta e visualize suas salas.
                </p>
            </div>
        </div>
    );
};

export default AccountBanner;