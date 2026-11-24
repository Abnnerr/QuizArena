
import { Helmet } from "react-helmet-async";
import {
    FiArrowLeft,
    FiArrowDown,
    FiArrowUp,
    FiAward,
    FiRefreshCw,
    FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router";

import { useTheme } from "../../../../contexts/ThemeContext";
import Button from "../../../../shared/ui/Button";
import { useRanking } from "../../hooks/useRanking";
import { AiFillTrophy } from "react-icons/ai";

const RankingPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();

    const {
        rankingList,
        loading,
        advancing,
        error,
        animateTrigger,
        createNewRound,
    } = useRanking();

    const getPositionStyle = (position: number) => {
        switch (position) {
            case 1:
                return {
                    backgroundColor: "#F59E0B20",
                    color: "#F59E0B",
                    borderColor: "#F59E0B50",
                };
            case 2:
                return {
                    backgroundColor: "#94A3B820",
                    color: "#94A3B8",
                    borderColor: "#94A3B850",
                };
            case 3:
                return {
                    backgroundColor: "#CD7F3220",
                    color: "#CD7F32",
                    borderColor: "#CD7F3250",
                };
            default:
                return {
                    backgroundColor: colors.surface,
                    color: colors.muted,
                    borderColor: colors.border,
                };
        }
    };

    const getPositionLabel = (position: number) => {
        if (position === 1) return "1º";
        if (position === 2) return "2º";
        if (position === 3) return "3º";

        return `${position}º`;
    };

    const renderDifference = (diff: number) => {
        if (diff > 0) {
            return (
                <div
                    className="flex items-center gap-1 text-xs font-black"
                    style={{ color: colors.success }}
                >
                    <FiArrowUp size={14} />
                    <span>{diff}</span>
                </div>
            );
        }

        if (diff < 0) {
            return (
                <div
                    className="flex items-center gap-1 text-xs font-black"
                    style={{ color: colors.danger }}
                >
                    <FiArrowDown size={14} />
                    <span>{Math.abs(diff)}</span>
                </div>
            );
        }

        return (
            <span
                className="text-xs font-bold"
                style={{ color: colors.muted }}
            >
                —
            </span>
        );
    };

    return (
        <>
            <Helmet>
                <title>QuizArena • Classificação</title>
            </Helmet>

            <main
                className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-10"
                style={{ backgroundColor: colors.background }}
            >
                <div className="mx-auto w-full max-w-3xl space-y-6">

                    {/* Cabeçalho */}
                    <header className="space-y-5">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
                            style={{ color: colors.muted }}
                        >
                            <FiArrowLeft size={17} />
                            Voltar
                        </button>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div
                                    className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wider"
                                    style={{ color: colors.primary }}
                                >
                                    <AiFillTrophy size={18} />
                                    Resultado da rodada
                                </div>

                                <h1
                                    className="text-3xl font-black tracking-tight sm:text-4xl"
                                    style={{ color: colors.text }}
                                >
                                    Classificação
                                </h1>

                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Veja quem está liderando a partida.
                                </p>
                            </div>

                            <div
                                className="flex w-fit items-center gap-2 rounded-xl border-2 px-4 py-3"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    color: colors.muted,
                                }}
                            >
                                <FiUsers size={18} />

                                <span className="text-sm font-bold">
                                    {rankingList.length} jogadores
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Conteúdo */}
                    <section
                        className="overflow-hidden rounded-2xl border-2 border-b-8"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        {/* Título da classificação */}
                        <div
                            className="flex items-center justify-between gap-3 border-b-2 px-5 py-5 sm:px-7"
                            style={{ borderColor: colors.border }}
                        >
                            <div>
                                <h2
                                    className="text-lg font-black"
                                    style={{ color: colors.text }}
                                >
                                    Ranking dos jogadores
                                </h2>

                                <p
                                    className="mt-1 text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    {animateTrigger
                                        ? "Classificação atualizada"
                                        : "Preparando classificação"}
                                </p>
                            </div>

                            <div
                                className="rounded-xl p-3"
                                style={{
                                    backgroundColor: `${colors.primary}20`,
                                    color: colors.primary,
                                }}
                            >
                                <FiAward size={22} />
                            </div>
                        </div>

                        <div className="space-y-3 p-4 sm:p-6">

                            {/* Erro */}
                            {error && (
                                <div
                                    className="rounded-xl border-2 p-4"
                                    style={{
                                        backgroundColor: `${colors.danger}10`,
                                        borderColor: `${colors.danger}50`,
                                        color: colors.danger,
                                    }}
                                >
                                    <p className="text-sm font-bold">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Carregamento */}
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div
                                        className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                                        style={{
                                            borderColor: colors.primary,
                                            borderTopColor: "transparent",
                                        }}
                                    />

                                    <p
                                        className="mt-4 text-sm font-semibold"
                                        style={{ color: colors.muted }}
                                    >
                                        Calculando classificação...
                                    </p>
                                </div>
                            ) : rankingList.length === 0 ? (
                                /* Ranking vazio */
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-2xl"
                                        style={{
                                            backgroundColor: `${colors.primary}20`,
                                            color: colors.primary,
                                        }}
                                    >
                                        <AiFillTrophy size={30} />
                                    </div>

                                    <h3
                                        className="mt-4 text-lg font-black"
                                        style={{ color: colors.text }}
                                    >
                                        Nenhum resultado encontrado
                                    </h3>

                                    <p
                                        className="mt-2 max-w-sm text-sm"
                                        style={{ color: colors.muted }}
                                    >
                                        Ainda não existem jogadores para exibir
                                        nesta classificação.
                                    </p>
                                </div>
                            ) : (
                                /* Lista de jogadores */
                                rankingList.map((player) => {
                                    const positionStyle = getPositionStyle(
                                        player.currentPos
                                    );

                                    return (
                                        <article
                                            key={player.player_id}
                                            className="flex items-center gap-3 rounded-xl border-2 p-3 transition-all duration-700 sm:gap-4 sm:p-4"
                                            style={{
                                                backgroundColor:
                                                    player.currentPos === 1
                                                        ? `${colors.primary}08`
                                                        : colors.background,
                                                borderColor:
                                                    player.currentPos === 1
                                                        ? `${colors.primary}60`
                                                        : colors.border,
                                            }}
                                        >
                                            {/* Posição */}
                                            <div
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-black sm:h-12 sm:w-12"
                                                style={positionStyle}
                                            >
                                                {getPositionLabel(
                                                    player.currentPos
                                                )}
                                            </div>

                                            {/* Jogador */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3
                                                        className="truncate text-sm font-black sm:text-base"
                                                        style={{
                                                            color: colors.text,
                                                        }}
                                                    >
                                                        {player.player_name}
                                                    </h3>

                                                    {player.currentPos === 1 && (
                                                        <span
                                                            className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase"
                                                            style={{
                                                                backgroundColor: `${colors.primary}20`,
                                                                color: colors.primary,
                                                            }}
                                                        >
                                                            Líder
                                                        </span>
                                                    )}
                                                </div>

                                                <p
                                                    className="mt-1 text-xs"
                                                    style={{
                                                        color: colors.muted,
                                                    }}
                                                >
                                                    Posição anterior:{" "}
                                                    {getPositionLabel(
                                                        player.prevPos
                                                    )}
                                                </p>
                                            </div>

                                            {/* Pontuação e diferença */}
                                            <div className="flex shrink-0 flex-col items-end gap-1">
                                                <span
                                                    className="text-base font-black tabular-nums sm:text-lg"
                                                    style={{
                                                        color: colors.text,
                                                    }}
                                                >
                                                    {player.score.toLocaleString(
                                                        "pt-BR"
                                                    )}
                                                    <span
                                                        className="ml-1 text-[10px] font-bold sm:text-xs"
                                                        style={{
                                                            color: colors.muted,
                                                        }}
                                                    >
                                                        XP
                                                    </span>
                                                </span>

                                                <div className="flex items-center gap-1">
                                                    {renderDifference(
                                                        player.diff
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            )}
                        </div>

                        {/* Legenda */}
                        {!loading && rankingList.length > 0 && (
                            <div
                                className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 px-5 py-4 sm:px-7"
                                style={{ borderColor: colors.border }}
                            >
                                <div className="flex items-center gap-2">
                                    <FiArrowUp
                                        size={14}
                                        style={{ color: colors.success }}
                                    />
                                    <span
                                        className="text-xs font-semibold"
                                        style={{ color: colors.muted }}
                                    >
                                        Subiu de posição
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FiArrowDown
                                        size={14}
                                        style={{ color: colors.danger }}
                                    />
                                    <span
                                        className="text-xs font-semibold"
                                        style={{ color: colors.muted }}
                                    >
                                        Caiu de posição
                                    </span>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Ações */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(-1)}
                            disabled={advancing}
                            leftIcon={<FiArrowLeft />}
                        >
                            Voltar
                        </Button>

                        <Button
                            variant="primary"
                            onClick={createNewRound}
                            disabled={
                                loading ||
                                advancing ||
                                !!error ||
                                rankingList.length === 0
                            }
                            isLoading={advancing}
                            rightIcon={
                                !advancing ? <FiRefreshCw /> : undefined
                            }
                        >
                            Próxima rodada
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default RankingPage;
