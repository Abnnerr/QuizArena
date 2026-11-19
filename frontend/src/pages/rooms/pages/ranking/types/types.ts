export interface PlayerData {
    player_id: string | number;
    player_name: string;
    score: number;
    oldScore: number;
}

export interface RankingWithDiff extends PlayerData {
    currentPos: number;
    prevPos: number;
    diff: number;
}


export interface RankingPlayerCardProps {
    player: RankingWithDiff;
    animateTrigger: boolean;
}

export type RankingColors = {
    card: string;
    border: string;
    surface: string;
    text: string;
    muted: string;
    primary: string;
    success: string;
    danger: string;
};

export interface RankingPlayerListProps {
    rankingList: RankingWithDiff[];
    animateTrigger: boolean;
}