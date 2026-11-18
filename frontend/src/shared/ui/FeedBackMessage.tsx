interface FeedbackMessageProps {
    feedBack: {
        type: "Success" | "Warning" | "Error";
        message: string;
    } | null;
    colors: {
        success: string;
        primary: string;
        danger: string;
    };
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ feedBack, colors }) => {
    const feedbackStyles = {
        Success: {
            backgroundColor: "#15320F",
            borderColor: colors.success,
            color: "#8BEA44",
        },
        Warning: {
            backgroundColor: "#3A320A",
            borderColor: colors.primary,
            color: "#FFD966",
        },
        Error: {
            backgroundColor: "#3B1515",
            borderColor: colors.danger,
            color: "#FF6B6B",
        },
    };

    return (
        <div className="w-full min-h-18 flex-shrink-0">
            {feedBack && (
                <div
                    className="
                        w-full mb-3 p-3 sm:p-4
                        rounded-3xl
                        text-xs sm:text-sm
                        font-black text-center
                        border-2 border-b-4
                        flex items-center justify-center gap-2
                        animate-bounce-short
                    "
                    style={feedbackStyles[feedBack.type]}
                >
                    <span>{feedBack.message}</span>
                </div>
            )}
        </div>
    );
};

export default FeedbackMessage;