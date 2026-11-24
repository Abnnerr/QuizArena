
import { FiZap } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

interface LoadingProps {
    message?: string;
}

const Loading = ({ message = "Preparando a arena..." }: LoadingProps) => {
    const { colors } = useTheme();

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center gap-5 px-4"
            style={{ backgroundColor: colors.background }}
        >
            <div
                className="
                    flex h-20 w-20 items-center justify-center
                    rounded-2xl border-2 border-b-4
                    animate-pulse
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <img
                    src="/favicon-quiz.png"
                    alt="QuizArena"
                    className="h-12 w-12 animate-pulse object-contain"
                />
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                    <FiZap
                        size={16}
                        style={{ color: colors.primary }}
                    />

                    <span
                        className="text-sm font-black"
                        style={{ color: colors.text }}
                    >
                        {message}
                    </span>
                </div>

                <div
                    className="h-1.5 w-36 overflow-hidden rounded-full"
                    style={{ backgroundColor: colors.border }}
                >
                    <div
                        className="h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full"
                        style={{ backgroundColor: colors.primary }}
                    />
                </div>

                <span
                    className="text-xs font-medium"
                    style={{ color: colors.muted }}
                >
                    Aguarde um instante...
                </span>
            </div>
        </div>
    );
};

export default Loading;
