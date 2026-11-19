
import React from "react";
import { BsChevronDown } from "react-icons/bs";

interface Props {
    skip: boolean;
    playerNameUsed: string | null;
    colors: any;
    skipColor: string;
}

const LiveSkipOverlay: React.FC<Props> = ({
    skip,
    playerNameUsed,
    colors,
    skipColor,
}) => {
    if (!skip) return null;

    return (
        <div
            className="
                fixed inset-0 z-[60] flex items-center
                justify-center bg-black/75 p-4
                backdrop-blur-sm animate-in fade-in duration-200
            "
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="skip-title"
        >
            <div
                className="
                    w-full max-w-sm space-y-5 rounded-3xl
                    border-2 border-b-8 p-6 text-center
                    shadow-2xl animate-in zoom-in-95 duration-300
                    sm:p-8
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: skipColor,
                }}
            >
                <div
                    className="
                        mx-auto flex h-16 w-16 items-center
                        justify-center rounded-2xl border-2 border-b-4
                    "
                    style={{
                        backgroundColor: `${skipColor}18`,
                        borderColor: skipColor,
                        color: skipColor,
                    }}
                >
                    <BsChevronDown className="h-8 w-8 animate-bounce" />
                </div>

                <div className="space-y-2">
                    <h3
                        id="skip-title"
                        className="text-xl font-black uppercase tracking-wide"
                        style={{ color: colors.text }}
                    >
                        Vez pulada!
                    </h3>

                    <p
                        className="text-sm font-extrabold leading-relaxed"
                        style={{ color: colors.muted }}
                    >
                        {playerNameUsed ? (
                            <>
                                <span style={{ color: colors.primary }}>
                                    {playerNameUsed}
                                </span>{" "}
                                usou um poder e pulou a sua vez nesta rodada.
                            </>
                        ) : (
                            "Você teve sua rodada pulada por um efeito especial."
                        )}
                    </p>
                </div>

                <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: colors.surface }}
                >
                    <div
                        className="h-full w-full animate-pulse"
                        style={{ backgroundColor: skipColor }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LiveSkipOverlay;
