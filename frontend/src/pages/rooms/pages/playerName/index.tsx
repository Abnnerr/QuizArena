import React from "react";
import { Helmet } from "react-helmet-async";

import { usePlayerName } from "../../hooks/userPlayerName";
import { useTheme } from "../../../../contexts/ThemeContext";
import PlayerNameTopbar from "./components/PlayerNameTopbar";
import PlayerNameHeader from "./components/PlayerNameHeader";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import PlayerNameForm from "./components/PlayerNameForm";


const PlayerNamePage: React.FC = () => {
    const { colors } = useTheme();

    const {
        playerName,
        setPlayerName,
        loading,
        error,
        handleSubmit,
    } = usePlayerName();

    return (
        <>
            <Helmet>
                <title>Nome de Jogador | QuizArena</title>
            </Helmet>

            <div
                className="
                    w-full max-w-xl mx-auto
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    px-4 py-5 sm:py-6
                "
            >
                <PlayerNameTopbar />

                <section
                    className="
                        w-full border-2 border-b-8
                        rounded-3xl shadow-sm
                        p-5 sm:p-8
                        flex flex-col gap-6
                    "
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <PlayerNameHeader />

                    <div
                        className="w-full h-px"
                        style={{ backgroundColor: colors.border }}
                    />

                    <FeedbackMessage feedBack={error} colors={colors} />

                    <PlayerNameForm
                        playerName={playerName}
                        setPlayerName={setPlayerName}
                        loading={loading}
                        handleSubmit={handleSubmit}
                    />
                </section>
            </div>
        </>
    );
};

export default PlayerNamePage;