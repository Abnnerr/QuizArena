interface JoinRoomHeaderProps {
    colors: {
        card: string;
        border: string;
        text: string;
        muted: string;
    };
}

const JoinRoomHeader: React.FC<JoinRoomHeaderProps> = ({ colors }) => {
    return (
        <div
            className="
                w-full flex flex-col items-center justify-center
                sm:flex-row gap-3 sm:gap-5
                mb-4 sm:mb-5 flex-shrink-0
            "
        >
            <div
                className="
                    w-16 h-16 sm:w-24 sm:h-24
                    rounded-3xl
                    border-2 border-b-4 sm:border-b-8
                    flex-shrink-0
                    flex items-center justify-center
                    p-2 sm:p-3
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <img
                    src="/favicon-quiz.png"
                    alt="QuizArena"
                    className="h-full w-full object-contain filter drop-shadow"
                />
            </div>
            <div
                className="
                    relative w-full
                    border-2 border-b-4
                    rounded-3xl p-6
                    text-center sm:text-left
                    shadow-lg
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div
                    className="
                        hidden sm:block absolute
                        -left-3 top-1/2 -translate-y-1/2
                        w-0 h-0
                        border-y-8 border-y-transparent
                    "
                    style={{
                        borderRight: `8px solid ${colors.border}`,
                    }}
                />

                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#58CC02]">
                        QuizArena
                    </span>
                </div>

                <h2
                    className="text-lg sm:text-2xl font-black tracking-tight"
                    style={{ color: colors.text }}
                >
                    Pronto para a disputa?
                </h2>

                <p
                    className="text-[11px] sm:text-sm font-extrabold mt-1 leading-relaxed"
                    style={{ color: colors.muted }}
                >
                    Digite o código da sala para entrar na partida agora!
                </p>
            </div>
        </div>
    );
};

export default JoinRoomHeader;