
import type { ReactNode } from "react";
import type { PodiumComponentProps } from "../types/types";

interface PodiumCardProps extends PodiumComponentProps {
    children: ReactNode;
}

export function PodiumCard({
    colors,
    children,
}: PodiumCardProps) {
    return (
        <section
            className="
                w-full
                border-2 border-b-6
                rounded-2xl sm:rounded-3xl
                p-3 sm:p-5 lg:p-6
                shadow-sm
                space-y-3 sm:space-y-4
                text-center
            "
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            <div>
                <h1
                    className="
                        text-xl sm:text-2xl lg:text-3xl
                        font-black tracking-tight
                    "
                    style={{ color: colors.text }}
                >
                    Partida Finalizada!
                </h1>

                <p
                    className="
                        font-extrabold
                        text-xs sm:text-sm
                        mt-1
                    "
                    style={{ color: colors.muted }}
                >
                    Revelando os grandes campeões da arena...
                </p>
            </div>

            {children}
        </section>
    );
}
