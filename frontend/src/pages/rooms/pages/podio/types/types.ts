
export interface PodiumColors {
    background: string;
    card: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    primary: string;
    success: string;
    danger: string;
    pattern: string;
}

export interface PodiumComponentProps {
    colors: PodiumColors;
}

export interface PodiumPlayerData {
    player_id: string | number;
    player_name?: string;
    score: number;
    players?: {
        player_name: string;
    };
}

export interface OrderedPodiumPlayer {
    player: PodiumPlayerData;
    originalIndex: number;
}
