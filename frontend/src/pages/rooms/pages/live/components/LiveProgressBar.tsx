
import React from "react";

interface Props {
    progress: number;
    isCriticalTime: boolean;
    colors: {
        border: string;
        primary: string;
        danger: string;
    };
}

const LiveProgressBar: React.FC<Props> = ({
    progress,
    isCriticalTime,
    colors,
}) => {
    return (
        <div
            className="relative z-20 h-2 w-full shrink-0 overflow-hidden sm:h-3"
            style={{ backgroundColor: colors.border }}
        >
            <div
                className={`h-full transition-all duration-1000 ease-linear ${
                    isCriticalTime ? "animate-pulse" : ""
                }`}
                style={{
                    width: `${Math.max(0, progress)}%`,
                    backgroundColor: isCriticalTime
                        ? colors.danger
                        : colors.primary,
                }}
            />
        </div>
    );
};

export default LiveProgressBar;
