import React from "react";
import { BiGroup } from "react-icons/bi";
import type {  Room, RoomStatusConfig } from "../types/types";
import RoomsEmptyState from "./RoomsEmptyState";
import RoomCard from "./RoomCard";
import type { Colors } from "../../../../../shared/types/types";

interface RoomsSectionProps {
    colors: Colors;
    rooms: Room[];
    profileLoading: boolean;
    statusConfig: RoomStatusConfig;
    copiedCode: string | null;
    handleCopyCode: (roomCode: string) => void;
}

const RoomsSection: React.FC<RoomsSectionProps> = ({
    colors,
    rooms,
    profileLoading,
    statusConfig,
    copiedCode,
    handleCopyCode,
}) => {
    return (
        <section className="w-full">
            <div
                className="
                    flex flex-col sm:flex-row
                    sm:items-center sm:justify-between
                    gap-3 mb-4
                "
            >
                <div>
                    <h2
                        className="font-black text-lg sm:text-xl uppercase tracking-wide"
                        style={{ color: colors.text }}
                    >
                        Minhas Salas
                    </h2>

                    <p
                        className="font-extrabold text-xs sm:text-sm mt-1"
                        style={{ color: colors.muted }}
                    >
                        Visualize as salas criadas pela sua conta.
                    </p>
                </div>

                <div
                    className="
                        inline-flex items-center gap-2
                        px-4 py-2 rounded-xl border-2 border-b-4
                        font-black text-xs uppercase tracking-wider
                        w-fit
                    "
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.muted,
                    }}
                >
                    <BiGroup className="w-5 h-5" />

                    {rooms.length} {rooms.length === 1 ? "Sala" : "Salas"}
                </div>
            </div>

            {profileLoading ? (
                <div
                    className="
                        w-full border-2 border-b-8
                        rounded-3xl shadow-lg p-8 text-center
                    "
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <p
                        className="font-black text-sm"
                        style={{ color: colors.muted }}
                    >
                        Carregando suas salas...
                    </p>
                </div>
            ) : rooms.length === 0 ? (
                <RoomsEmptyState colors={colors} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                        <RoomCard
                            key={room.room_id}
                            room={room}
                            colors={colors}
                            statusConfig={statusConfig}
                            copied={copiedCode === room.room_code}
                            handleCopyCode={handleCopyCode}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default RoomsSection;