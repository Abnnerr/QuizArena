import React from "react";
import { BiGroup, BiCopy, BiCheck } from "react-icons/bi";
import type {  Room, RoomStatusConfig } from "../types/types";
import type { Colors } from "../../../../../shared/types/types";



interface RoomCardProps {
    room: Room;
    colors: Colors;
    statusConfig: RoomStatusConfig;
    copied: boolean;
    handleCopyCode: (roomCode: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
    room,
    colors,
    statusConfig,
    copied,
    handleCopyCode,
}) => {
    const status = statusConfig[room.room_status];

    return (
        <article
            className="
                border-2 border-b-8 rounded-3xl
                shadow-lg p-5 transition-transform
                hover:-translate-y-1
            "
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0">
                    <h3
                        className="font-black text-base sm:text-lg break-words"
                        style={{ color: colors.text }}
                    >
                        {room.room_name}
                    </h3>

                    <p
                        className="font-extrabold text-xs mt-1"
                        style={{ color: colors.muted }}
                    >
                        Sala #{room.room_id}
                    </p>
                </div>

                <span
                    className="
                        flex-shrink-0 px-3 py-1.5
                        rounded-xl border-2 border-b-4
                        text-[10px] sm:text-xs
                        font-black uppercase tracking-wider
                    "
                    style={{
                        backgroundColor: `${status.color}20`,
                        borderColor: status.color,
                        color: status.color,
                    }}
                >
                    {status.label}
                </span>
            </div>

            <div
                className="
                    flex items-center gap-3
                    p-3 rounded-2xl border-2 mb-3
                "
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                }}
            >
                <BiGroup
                    className="w-7 h-7"
                    style={{ color: colors.primary }}
                />

                <div>
                    <p
                        className="font-black text-[10px] uppercase tracking-wider"
                        style={{ color: colors.muted }}
                    >
                        Capacidade máxima
                    </p>

                    <p
                        className="font-black text-sm"
                        style={{ color: colors.text }}
                    >
                        {room.max_players} jogadores
                    </p>
                </div>
            </div>

            <div
                className="
                    flex items-center justify-between
                    gap-3 p-3 rounded-2xl
                    border-2 mb-4
                "
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                }}
            >
                <p
                    className="font-black text-[10px] uppercase tracking-wider"
                    style={{ color: colors.muted }}
                >
                    Modo de jogo
                </p>

                <span
                    className="font-black text-xs uppercase tracking-wider"
                    style={{
                        color:
                            room.room_mode === "HARDCORE"
                                ? colors.danger
                                : colors.success,
                    }}
                >
                    {room.room_mode === "HARDCORE" ? "Hardcore" : "Normal"}
                </span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p
                        className="font-black text-[10px] uppercase tracking-wider mb-1"
                        style={{ color: colors.muted }}
                    >
                        Código da sala
                    </p>

                    <p
                        className="font-black text-lg tracking-widest"
                        style={{ color: colors.text }}
                    >
                        {room.room_code}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => handleCopyCode(room.room_code)}
                    className="
                        flex-shrink-0 inline-flex
                        items-center gap-2
                        border-2 border-b-4
                        px-3 py-2 rounded-xl
                        text-[10px] sm:text-xs
                        font-black uppercase tracking-wider
                        active:border-b-2
                        active:translate-y-0.5
                        transition-all cursor-pointer
                    "
                    style={{
                        backgroundColor: copied
                            ? `${colors.success}20`
                            : colors.primary,
                        borderColor: copied
                            ? colors.success
                            : colors.border,
                        color: copied
                            ? colors.success
                            : "#7A5B00",
                    }}
                >
                    {copied
                        ? <BiCheck className="w-4 h-4" />
                        : <BiCopy className="w-4 h-4" />}

                    {copied ? "Copiado" : "Copiar"}
                </button>
            </div>
        </article>
    );
};

export default RoomCard;