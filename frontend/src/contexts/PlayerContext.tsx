import React, { createContext, useEffect, useState } from "react";
import type { Player, PlayerContextType } from "./types/playerTypes";



export const PlayerContext = createContext<PlayerContextType | undefined>(
    undefined
);

const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [player, setPlayerState] = useState<Player>();

    useEffect(() => {
        const storedPlayer = sessionStorage.getItem("player");

        if (!storedPlayer) return;

        try {
            setPlayerState(JSON.parse(storedPlayer) as Player);
        } catch {
            sessionStorage.removeItem("player");
        }
    }, []);

    const setPlayer = (player: Player) => {
        sessionStorage.setItem("player", JSON.stringify(player));
        setPlayerState(player);
    };

    const clearPlayer = () => {
        sessionStorage.removeItem("player");
        setPlayerState(undefined);
    };

    return (
        <PlayerContext.Provider value={{ player, setPlayer, clearPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerProvider;
