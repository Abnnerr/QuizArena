import type { PodiumComponentProps } from "../types/types";


export function PodiumEmpty({ colors }: PodiumComponentProps) {
    return (
        <div className="text-center py-12">
            <p
                className="font-black text-base"
                style={{ color: colors.muted }}
            >
                Nenhum jogador pontuou na partida.
            </p>
        </div>
    );
}
