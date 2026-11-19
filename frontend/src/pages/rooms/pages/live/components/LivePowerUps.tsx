
import React from "react";
import { BsLightningFill } from "react-icons/bs";



interface Props {
    powerUp: any[];
    onSelect: (item: any) => void;
    colors: any;
    time: number;
}

const LivePowerUps: React.FC<Props> = ({
    powerUp,
    onSelect,
    colors,
    time,
}) => {
    if (!powerUp || powerUp.length === 0) return null;

    return (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {powerUp.slice(0, 3).map((item, idx) => {
                const powerType = item.powerup_type?.toUpperCase();

                const isSkipTurn = powerType === "SKIP_TURN" || powerType === "FIFTY_FIFTY";

                const isDisabled =
                    item.used === true ||
                    (time <= 0 && isSkipTurn);

                return (
                    <button
                        key={item.powerup_id ?? idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => onSelect(item)}
                        className={`
                            flex min-h-[35px] min-w-0 items-center
                            justify-center gap-2 rounded-xl
                            border-2 border-b-4 px-2 py-2
                            text-[10px] font-black transition-all
                            sm:min-h-[45px] sm:rounded-2xl
                            sm:px-4 sm:text-sm
                            ${
                                isDisabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer hover:brightness-110 active:translate-y-0.5 active:border-b-2"
                            }
                        `}
                        style={{
                            backgroundColor: colors.card,
                            borderColor: isDisabled
                                ? colors.border
                                : colors.primary,
                            color: isDisabled
                                ? colors.muted
                                : colors.primary,
                        }}
                    >
                        <BsLightningFill className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

                        <span className="truncate capitalize">
                            {item.powerup_type}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default LivePowerUps;
