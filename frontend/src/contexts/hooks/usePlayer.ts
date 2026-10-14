import { useContext } from "react";
import { PlayerContext } from "../PlayerContext";

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error("usePçayer deve ser usado dentro de um PlayerProvider");
    }
    return context
}