import React from "react";
import { Helmet } from "react-helmet-async";
import RankingHeader from "./components/RankingHeader";
import RankingLoading from "./components/RankingLoading";
import RankingEmpty from "./components/RankingEmpty";
import RankingPlayerList from "./components/RankingPlayerList";
import RankingActions from "./components/RankingActions";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import { useRanking } from "../../hooks/useRanking";


const RankingPage: React.FC = () => {
    const {
        rankingList,
        loading,
        error,
        animateTrigger,
        cardStyle,
        createNewRound,
        colors
    } = useRanking()


    return (
        <>
            <Helmet>
                <title>QuizArena • Classificação da Rodada</title>
            </Helmet>

            <div
                className="
                    w-full flex-1 min-h-0
                    flex flex-col items-center
                    overflow-y-auto overflow-x-hidden
                    px-4 py-6 sm:px-6 sm:py-8
                    font-['Nunito',sans-serif]
                    select-none
                "
            >
                <div className="
                    w-full max-w-3xl relative z-10
                    space-y-8 my-auto shrink-0
                ">
                    <RankingHeader />

                    <section
                        className="
                            border-2 border-b-8
                            rounded-3xl p-6 sm:p-10 lg:p-12
                            shadow-sm space-y-8
                        "
                        style={cardStyle}
                    >
                        <FeedbackMessage feedBack={error} colors={colors} />

                        {loading ? (
                            <RankingLoading />
                        ) : rankingList.length === 0 ? (
                            <RankingEmpty />
                        ) : (
                            <RankingPlayerList
                                rankingList={rankingList}
                                animateTrigger={animateTrigger}
                            />
                        )}

                        <RankingActions
                            onNextRound={createNewRound}
                            disabled={
                                loading ||
                                !!error ||
                                rankingList.length === 0
                            }
                        />
                    </section>
                </div>
            </div>
        </>
    );
};

export default RankingPage;