
import React from "react";
import { BsLightningFill, BsX } from "react-icons/bs";

interface Props {
    selectedPowerUp: any;
    players: any[];
    colors: any;
    onClose: () => void;
    onConfirm: (powerupId: any, targetPlayerId?: any) => void;
    onConfirmWithSound: (powerupId: any) => void;
}

const LivePowerUpModal: React.FC<Props> = ({
    selectedPowerUp,
    players,
    colors,
    onClose,
    onConfirm,
    onConfirmWithSound,
}) => {
    if (!selectedPowerUp) return null;

    const isSkipTurn =
        selectedPowerUp.powerup_type === "SKIP_TURN";

    return (
        <div
            className="
                fixed inset-0 z-50 flex items-end
                justify-center bg-black/75 p-0
                backdrop-blur-sm animate-in fade-in duration-200
                sm:items-center sm:p-4
            "
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="powerup-title"
                onClick={(event) => event.stopPropagation()}
                className="
                    relative max-h-[85dvh] w-full max-w-md
                    space-y-5 overflow-y-auto rounded-t-3xl
                    border-t-4 p-5 shadow-2xl
                    animate-in slide-in-from-bottom duration-300
                    sm:rounded-3xl sm:border-2 sm:border-b-8
                    sm:p-8 sm:animate-in sm:zoom-in-95
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.primary,
                }}
            >
                <div
                    className="
                        mx-auto h-1.5 w-12 rounded-full sm:hidden
                    "
                    style={{ backgroundColor: colors.border }}
                />

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="
                        absolute right-4 top-4 rounded-lg p-2
                        transition-colors
                    "
                    style={{ color: colors.muted }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.backgroundColor =
                            colors.surface;
                        event.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={(event) => {
                        event.currentTarget.style.backgroundColor =
                            "transparent";
                        event.currentTarget.style.color = colors.muted;
                    }}
                >
                    <BsX className="h-6 w-6" />
                </button>

                <div
                    className="
                        mx-auto flex h-14 w-14 items-center
                        justify-center rounded-2xl border-2
                        border-b-4 sm:h-16 sm:w-16
                    "
                    style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.primary,
                        color: colors.primary,
                    }}
                >
                    <BsLightningFill className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>

                <div className="space-y-2 text-center">
                    <h3
                        id="powerup-title"
                        className="
                            pr-6 text-lg font-black uppercase
                            tracking-wide sm:pr-0 sm:text-xl
                        "
                        style={{ color: colors.text }}
                    >
                        {selectedPowerUp.powerup_type}
                    </h3>

                    <p
                        className="
                            text-xs font-extrabold leading-relaxed
                            sm:text-sm
                        "
                        style={{ color: colors.muted }}
                    >
                        {selectedPowerUp.descricao ??
                            selectedPowerUp.description ??
                            "Use este poder especial para obter vantagens estratégicas nesta rodada!"}
                    </p>
                </div>

                {isSkipTurn && players && (
                    <div className="space-y-3">
                        <p
                            className="
                                text-center text-xs font-black
                                uppercase tracking-wider
                            "
                            style={{ color: colors.primary }}
                        >
                            Escolha um jogador
                        </p>

                        <div
                            className="
                                flex max-h-52 flex-col gap-2
                                overflow-y-auto pr-1
                            "
                        >
                            {players.map((player) => (
                                <button
                                    key={player?.player_id}
                                    type="button"
                                    onClick={() =>
                                        onConfirm(
                                            selectedPowerUp.powerup_id,
                                            player.player_id
                                        )
                                    }
                                    className="
                                        w-full rounded-xl border-2
                                        border-b-4 p-3 text-left
                                        text-sm font-black transition-all
                                        hover:brightness-110
                                        active:translate-y-0.5
                                        active:border-b-2
                                    "
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    }}
                                >
                                    {player.player_name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!isSkipTurn && (
                    <button
                        type="button"
                        onClick={() =>
                            onConfirmWithSound(selectedPowerUp.powerup_id)
                        }
                        className="
                            flex w-full items-center justify-center
                            gap-2 rounded-2xl border-b-4 py-3.5
                            text-sm font-black uppercase tracking-wider
                            text-white shadow-sm transition-all
                            hover:brightness-110
                            active:translate-y-1 active:border-b-0
                            sm:text-base
                        "
                        style={{
                            backgroundColor: colors.success,
                            borderColor: colors.success,
                        }}
                    >
                        <BsLightningFill className="h-5 w-5" />
                        Usar Power-up
                    </button>
                )}
            </div>
        </div>
    );
};

export default LivePowerUpModal;
