import { createContext } from "react";
import type { PlayerContextType } from "./types/playerTypes";


export const PlayerContext = createContext<PlayerContextType | undefined>(
    undefined
);
