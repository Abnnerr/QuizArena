import React, { createContext } from "react";
import type { RoomContextType } from "./types/roomTypes";

export const RoomContext = createContext<RoomContextType | null>(null)

const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    
    return (
        <RoomContext.Provider value={{}}>
            {children}
        </RoomContext.Provider>
    );
}

export default RoomProvider;