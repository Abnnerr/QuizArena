import type { PodiumComponentProps } from "../types/types";


export function PodiumLoading({ colors }: PodiumComponentProps) {
    return (
        <div className="text-center py-16 space-y-4">
            <div
                className="
                    inline-block w-14 h-14
                    border-4 border-t-transparent
                    rounded-full animate-spin
                "
                style={{
                    borderColor: colors.primary,
                    borderTopColor: "transparent",
                }}
            />

            <p
                className="
                    font-black text-sm
                    uppercase tracking-wider
                "
                style={{ color: colors.muted }}
            >
                Calculando pódio final...
            </p>
        </div>
    );
}
