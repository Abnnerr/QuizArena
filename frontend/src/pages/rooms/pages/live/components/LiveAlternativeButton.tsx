
import React from "react";

interface Props {
    alternative: any;
    index: number;
    selectedAnswer: any;
    hiddenAlternativeIds: any[];
    correctAlternative: any;
    roundFinished: boolean;
    answered: boolean;
    isHost: boolean;
    loading: boolean;
    skip: boolean;
    timeLeft: number;
    statistics: any;
    onAnswer: (id: any) => void;
}

const ALTERNATIVE_STYLES = [
    {
        color: "bg-[#E21B3C] hover:bg-[#c41532] text-white border-[#9E1328]",
        icon: "triangle",
    },
    {
        color: "bg-[#1368CE] hover:bg-[#0f53a8] text-white border-[#0B3E7A]",
        icon: "diamond",
    },
    {
        color: "bg-[#D89E00] hover:bg-[#b08100] text-white border-[#805E00]",
        icon: "circle",
    },
    {
        color: "bg-[#26890C] hover:bg-[#1f6e0a] text-white border-[#174F07]",
        icon: "square",
    },
];

import {
    BsTriangleFill,
    BsDiamondFill,
    BsCircleFill,
    BsSquareFill,
} from "react-icons/bs";

const ICONS: Record<string, React.ElementType> = {
    triangle: BsTriangleFill,
    diamond: BsDiamondFill,
    circle: BsCircleFill,
    square: BsSquareFill,
};

const LiveAlternativeButton: React.FC<Props> = ({
    alternative,
    index,
    selectedAnswer,
    hiddenAlternativeIds,
    correctAlternative,
    roundFinished,
    answered,
    isHost,
    loading,
    skip,
    timeLeft,
    statistics,
    onAnswer,
}) => {
    const style = ALTERNATIVE_STYLES[index % ALTERNATIVE_STYLES.length];
    const IconComponent = ICONS[style.icon];

    const isSelected = selectedAnswer === alternative.id;
    const isEliminated = hiddenAlternativeIds?.includes(alternative.id);

    const isCorrect =
        correctAlternative !== null &&
        Number(correctAlternative) === Number(alternative.id);

    return (
        <button
            type="button"
            disabled={
                isHost ||
                loading ||
                skip ||
                answered ||
                timeLeft <= 0 ||
                isEliminated ||
                roundFinished
            }
            onClick={() => onAnswer(alternative.id)}
            className={`
                group relative flex min-h-[76px] w-full
                items-center rounded-2xl border-2
                border-b-4 p-3 text-left
                transition-all duration-200
                sm:min-h-[100px] sm:p-4
                lg:min-h-[110px] lg:p-5
                ${style.color}
                ${
                    isCorrect
                        ? "z-10 scale-[1.00] ring-1 ring-white/90 shadow-xl"
                        : ""
                }
                ${
                    !roundFinished && (isSelected || skip)
                        ? "translate-y-1 border-b-2 ring-4 ring-[#1CB0F6]/50"
                        : ""
                }
                ${
                    isHost
                        ? "cursor-default"
                        : "cursor-pointer active:translate-y-1 active:border-b-2"
                }
                ${
                    isEliminated && !roundFinished
                        ? "cursor-not-allowed opacity-30 grayscale"
                        : ""
                }
                ${
                    answered && !isSelected && !isCorrect
                        ? "opacity-40 grayscale-[50%]"
                        : ""
                }
                ${
                    roundFinished && !isCorrect
                        ? "opacity-35 grayscale"
                        : ""
                }
                disabled:cursor-not-allowed
            `}
        >
            <div
                className={`
                    flex w-full min-w-0 items-center gap-3 sm:gap-4
                    ${isHost ? "justify-start" : "justify-center"}
                `}
            >
                <div
                    className="
                        flex h-10 w-10 shrink-0 items-center
                        justify-center rounded-xl border-b-2
                        border-black/30 bg-black/20
                        sm:h-14 sm:w-14 sm:rounded-2xl
                    "
                >
                    {isCorrect ? (
                        <span className="text-xl font-black text-white sm:text-3xl">
                            ✓
                        </span>
                    ) : (
                        <IconComponent className="h-5 w-5 text-white sm:h-7 sm:w-7" />
                    )}
                </div>

                <span
                    className="
                        min-w-0 flex-1 break-words
                        text-sm font-black leading-snug
                        tracking-wide text-white
                        sm:text-base lg:text-lg
                    "
                >
                    {alternative.text}
                </span>

                {roundFinished && (
                    <span
                        className="
                            shrink-0 rounded-lg bg-black/20
                            px-2.5 py-1.5 text-xs
                            font-black text-white sm:text-base
                        "
                    >
                        {statistics?.count ?? 0}
                    </span>
                )}
            </div>
        </button>
    );
};

export default LiveAlternativeButton;
