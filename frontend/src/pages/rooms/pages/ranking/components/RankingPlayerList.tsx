import React from "react";

import RankingPlayerCard from "./RankingPlayerCard";
import type { RankingPlayerListProps } from "../types/types";


const RankingPlayerList: React.FC<RankingPlayerListProps> = ({
    rankingList,
    animateTrigger,
}) => {
    return (
        <div className="
            space-y-4 max-h-[600px]
            overflow-y-auto pr-2
        ">
            {rankingList.map((player) => (
                <RankingPlayerCard
                    key={String(player.player_id)}
                    player={player}
                    animateTrigger={animateTrigger}
                />
            ))}
        </div>
    );
};

export default RankingPlayerList;