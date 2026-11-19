import type { LobbyPlayer, LobbyRoom } from "../../../hooks/useLobby";

export interface LobbyThemeColors {
    background: string;
    card: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    primary: string;
    success: string;
    danger: string;
}

export interface LobbyComponentProps {
    colors: LobbyThemeColors;
}

export interface LobbyIdentityProps extends LobbyComponentProps {
    isHost: boolean;
    roomCode?: string;
    playerName?: string;
    copied: boolean;
    onCopyCode: () => void;
}

export interface LobbyActionsProps extends LobbyComponentProps {
    isHost: boolean;
    starting: boolean;
    ready: boolean;
    room: LobbyRoom;
    onStart: () => void;
    onToggleReady: () => void;
    onLeave: () => void;
}

export interface LobbyPlayersProps extends LobbyComponentProps {
    players: LobbyPlayer[];
    maxPlayers: number;
}
