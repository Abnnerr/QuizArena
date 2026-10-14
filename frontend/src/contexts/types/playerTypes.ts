export type Player = {
    player_id: string;
    player_name: string;
};

export type PlayerContextType = {
    player: { player_id: string, player_name: string } | undefined
    setPlayer: (player: Player) => void;
    clearPlayer: () => void;
}
