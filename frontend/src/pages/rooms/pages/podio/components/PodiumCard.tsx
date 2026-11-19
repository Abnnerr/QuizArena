
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
                w-full min-w-0
                border-2 border-b-4
                rounded-xl sm:rounded-2xl
                p-2.5 sm:p-3 lg:p-4
                shadow-sm
                space-y-2 sm:space-y-3
                text-center
            "
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            {/* TÍTULO */}
            <div>
                <h1
                    className="
                        text-base sm:text-lg lg:text-xl
                        font-black tracking-tight
                    "
                    style={{ color: colors.text }}
                >
                    Partida Finalizada!
                </h1>

                <p
                    className="
                        font-extrabold
                        text-[10px] sm:text-xs
                        mt-0.5
                    "
                    style={{ color: colors.muted }}
                >
                    Revelando os grandes campeões da arena...
                </p>
            </div>

            {/* CONTEÚDO */}
            {children}
        </section>
    );
}