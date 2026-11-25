import { createContext } from "react";
import type { RoomContextType } from "./types/roomTypes";

export const RoomContext = createContext<RoomContextType | null>(null)
