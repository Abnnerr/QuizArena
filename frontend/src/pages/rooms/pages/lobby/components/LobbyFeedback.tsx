
import type { ResponseDTO } from "../../../../../contexts/types/authTypes";
import type { LobbyComponentProps } from "../types/types";

interface LobbyFeedbackProps extends LobbyComponentProps {
    loading: boolean;
    roomExists: boolean;
    error: ResponseDTO | null;
    onBack: () => void;
}

export function LobbyFeedback({
    colors,
    loading,
    roomExists,
    error,
    onBack,
}: LobbyFeedbackProps) {
    if (loading) {
        return (
            <section
                className="
                    border-2 border-b-8 rounded-3xl
                    p-8 sm:p-12 shadow-lg text-center space-y-3
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div
                    className="
                        inline-block w-10 h-10 border-4
                        border-t-transparent rounded-full animate-spin
                    "
                    style={{
                        borderColor: "#1CB0F6",
                        borderTopColor: "transparent",
                    }}
                />

                <p
                    className="font-black text-xs uppercase tracking-wider"
                    style={{ color: colors.muted }}
                >
                    Conectando à sala...
                </p>
            </section>
        );
    }

    if (error || !roomExists) {
        return (
            <section
                className="
                    border-2 border-b-8 rounded-3xl
                    p-8 text-center space-y-4
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div
                    className="text-4xl font-black"
                    style={{ color: colors.danger }}
                >
                    !
                </div>

                <h2
                    className="text-lg font-black"
                    style={{ color: colors.text }}
                >
                    {error ? "Não foi possível acessar a sala" : "Sala não encontrada"}
                </h2>

                <p
                    className="font-bold text-sm"
                    style={{ color: colors.muted }}
                >
                    {error?.message ??
                        "Não foi possível carregar os dados desta sala. Verifique sua conexão ou tente novamente."}
                </p>

                <button
                    type="button"
                    onClick={onBack}
                    className="
                        border-b-4 px-6 py-3 rounded-2xl
                        font-black text-sm uppercase
                        tracking-wider active:translate-y-1
                        active:border-b-0 transition-all shadow-md
                    "
                    style={{
                        backgroundColor: "#1CB0F6",
                        borderColor: "#0092D6",
                        color: "#FFFFFF",
                    }}
                >
                    Voltar ao início
                </button>
            </section>
        );
    }

    return null;
}
