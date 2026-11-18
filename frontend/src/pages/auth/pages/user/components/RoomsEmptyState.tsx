import React from "react";
import { BiGroup } from "react-icons/bi";
import type { Colors } from "../../../../../shared/types/types";


interface RoomsEmptyStateProps {
    colors: Colors;
}

const RoomsEmptyState: React.FC<RoomsEmptyStateProps> = ({ colors }) => {
    return (
        <div
            className="
                w-full border-2 border-b-8
                rounded-3xl shadow-lg p-8
                text-center
            "
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            <BiGroup
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: colors.muted }}
            />

            <h3
                className="font-black text-lg"
                style={{ color: colors.text }}
            >
                Nenhuma sala encontrada
            </h3>

            <p
                className="font-extrabold text-sm mt-1"
                style={{ color: colors.muted }}
            >
                As salas criadas por você aparecerão aqui.
            </p>
        </div>
    );
};

export default RoomsEmptyState;