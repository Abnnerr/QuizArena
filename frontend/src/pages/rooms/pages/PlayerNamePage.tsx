
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Link } from 'react-router';
import { BiUser, BiArrowBack } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { usePlayerName } from '../hooks/userPlayerName';
import { useTheme } from '../../../contexts/ThemeContext';


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
                {/* TOPBAR */}
                <div className="w-full flex items-center justify-between mb-5">
                    <Link
                        to="/dashboard"
                        className="
                            inline-flex items-center gap-2
                            h-10 px-4
                            border-2 border-b-4
                            active:border-b-2 active:translate-y-0.5
                            rounded-2xl font-black uppercase tracking-wider
                            text-xs sm:text-sm
                            transition-all cursor-pointer
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.muted,
                        }}
                    >
                        <BiArrowBack className="w-5 h-5" />
                        <span>Voltar</span>
                    </Link>

                    <div
                        className="
                            inline-flex items-center gap-2
                            px-4 py-2 text-xs
                            font-black rounded-2xl
                            border-b-4 uppercase tracking-wider
                        "
                        style={{
                            backgroundColor: colors.primary,
                            color: '#493817',
                            borderColor: colors.border,
                        }}
                    >
                        <span>Identidade</span>
                    </div>
                </div>

                {/* CARD PRINCIPAL */}
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
                    {/* HEADER */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div
                            className="
                                rounded-3xl border-2 border-b-8
                                p-3 shadow-sm flex-shrink-0
                                flex items-center justify-center
                                w-24 h-24 sm:w-28 sm:h-28
                                transform hover:scale-105 transition-transform
                            "
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }}
                        >
                            <img
                                src="/favicon-quiz.png"
                                alt="QuizArena"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="space-y-2">
                            <h1
                                className="
                                    font-black tracking-tight
                                    text-xl sm:text-2xl
                                "
                                style={{ color: colors.text }}
                            >
                                Escolha seu apelido!
                            </h1>

                            <p
                                className="
                                    font-extrabold
                                    text-xs sm:text-sm
                                "
                                style={{ color: colors.muted }}
                            >
                                Como os outros jogadores vão te conhecer na arena?
                            </p>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div
                        className="w-full h-px"
                        style={{ backgroundColor: colors.border }}
                    />

                    {/* ERROR */}
                    {error && (
                        <div
                            className="
                                w-full p-4 rounded-2xl
                                text-sm font-black text-center
                                border-2 border-b-4
                                flex items-center justify-center gap-2
                            "
                            style={{
                                backgroundColor: `${colors.danger}15`,
                                borderColor: colors.danger,
                                color: colors.danger,
                            }}
                        >
                            <span>{error}</span>
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="w-full space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="playerName"
                                className="
                                    block font-black uppercase tracking-widest
                                    mb-3 text-center sm:text-left
                                    text-xs
                                "
                                style={{ color: colors.muted }}
                            >
                                Seu apelido na arena
                            </label>

                            <div className="relative">
                                <div
                                    className="
                                        absolute inset-y-0 left-0 pl-4
                                        flex items-center pointer-events-none z-10
                                    "
                                    style={{ color: colors.primary }}
                                >
                                    <BiUser className="w-7 h-7" />
                                </div>

                                <input
                                    id="playerName"
                                    type="text"
                                    required
                                    maxLength={25}
                                    value={playerName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setPlayerName(e.target.value)
                                    }
                                    placeholder="MESTREDOSQUIZ"
                                    className="
                                        w-full border-2 border-b-4 rounded-2xl
                                        pl-12 pr-4 py-4
                                        font-black tracking-widest
                                        text-center text-lg sm:text-xl
                                        placeholder:opacity-60
                                        focus:outline-none
                                        transition-all uppercase
                                    "
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                        color: colors.text,
                                        caretColor: colors.primary,
                                    }}
                                />
                            </div>

                            <div className="flex justify-end mt-2">
                                <span
                                    className="text-xs font-bold"
                                    style={{ color: colors.muted }}
                                >
                                    {playerName.length}/25
                                </span>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading || !playerName.trim()}
                            className="
                                w-full h-14 text-lg
                                border-b-4 active:border-b-0
                                active:translate-y-1
                                font-black rounded-2xl shadow-sm
                                transition-all duration-75
                                flex items-center justify-center gap-3
                                uppercase tracking-wider cursor-pointer
                                disabled:cursor-not-allowed
                                disabled:translate-y-0
                                disabled:border-b-4
                            "
                            style={{
                                backgroundColor:
                                    loading || !playerName.trim()
                                        ? colors.surface
                                        : colors.success,
                                borderColor:
                                    loading || !playerName.trim()
                                        ? colors.border
                                        : colors.success,
                                color:
                                    loading || !playerName.trim()
                                        ? colors.muted
                                        : '#FFFFFF',
                            }}
                        >
                            <span>
                                {loading ? 'Salvando...' : 'Confirmar Apelido'}
                            </span>

                            {!loading && (
                                <BsArrowRight className="w-6 h-6" />
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </>
    );
};

export default PlayerNamePage;
