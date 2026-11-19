
import React from "react";

interface Props {
    loading: boolean;
    error: string | null;
    question: any;
    colors: any;
    skipColor: string;
}

const LiveQuestion: React.FC<Props> = ({
    loading,
    error,
    question,
    colors,
    skipColor,
}) => {
    return (
        <section
            className="
                flex min-h-[170px] w-full flex-1
                flex-col items-center justify-center
                rounded-2xl border-2 border-b-4
                px-4 py-7 text-center shadow-lg
                sm:min-h-[220px] sm:rounded-3xl
                sm:border-b-8 sm:px-10 sm:py-10
                lg:min-h-[250px]
            "
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="
                            h-8 w-8 animate-spin rounded-full
                            border-4 border-t-transparent
                            sm:h-10 sm:w-10
                        "
                        style={{
                            borderColor: skipColor,
                            borderTopColor: "transparent",
                        }}
                    />

                    <p
                        className="
                            text-xs font-black uppercase
                            tracking-wider sm:text-base
                        "
                        style={{ color: colors.muted }}
                    >
                        Carregando partida...
                    </p>
                </div>
            ) : error ? (
                <p
                    className="text-base font-black sm:text-xl"
                    style={{ color: colors.danger }}
                >
                    {error}
                </p>
            ) : question ? (
                <div className="w-full">
                    <span
                        className="
                            mb-4 inline-block rounded-full
                            px-4 py-1.5 text-[10px]
                            font-black uppercase tracking-widest
                            sm:text-xs
                        "
                        style={{
                            backgroundColor: colors.surface,
                            color: colors.primary,
                        }}
                    >
                        Pergunta
                    </span>

                    <h1
                        className="
                            break-words text-lg font-black
                            leading-snug tracking-tight
                            sm:text-2xl md:text-3xl lg:text-4xl
                        "
                        style={{ color: colors.text }}
                    >
                        {question.text}
                    </h1>
                </div>
            ) : (
                <p
                    className="
                        text-sm font-black uppercase
                        tracking-wider sm:text-xl
                    "
                    style={{ color: colors.muted }}
                >
                    Aguardando a próxima pergunta...
                </p>
            )}
        </section>
    );
};

export default LiveQuestion;
