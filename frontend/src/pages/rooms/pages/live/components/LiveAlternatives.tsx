
import React from "react";
import LiveAlternativeButton from "./LiveAlternativeButton";

interface Props {
    question: any;
    selectedAnswer: any;
    hiddenAlternativeIds: any[];
    correctAlternative: any;
    answered: boolean;
    isHost: boolean;
    loading: boolean;
    skip: boolean;
    timeLeft: number;
    alternativeStatistics: any[];
    onAnswer: (id: any) => void;
}

const LiveAlternatives: React.FC<Props> = ({
    question,
    selectedAnswer,
    hiddenAlternativeIds,
    correctAlternative,
    answered,
    isHost,
    loading,
    skip,
    timeLeft,
    alternativeStatistics,
    onAnswer,
}) => {
    if (!question?.alternatives) return null;

    const roundFinished = correctAlternative !== null;

    return (
        <section
            className="
                grid w-full grid-cols-1 gap-3
                sm:grid-cols-2 sm:gap-4 lg:gap-5
            "
        >
            {question.alternatives.map((alternative: any, index: number) => {
                const statistics = alternativeStatistics.find(
                    (item) =>
                        Number(item.alternativeId) === Number(alternative.id)
                );

                return (
                    <LiveAlternativeButton
                        key={alternative.id}
                        alternative={alternative}
                        index={index}
                        selectedAnswer={selectedAnswer}
                        hiddenAlternativeIds={hiddenAlternativeIds}
                        correctAlternative={correctAlternative}
                        roundFinished={roundFinished}
                        answered={answered}
                        isHost={isHost}
                        loading={loading}
                        skip={skip}
                        timeLeft={timeLeft}
                        statistics={statistics}
                        onAnswer={onAnswer}
                    />
                );
            })}
        </section>
    );
};

export default LiveAlternatives;
