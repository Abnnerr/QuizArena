import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiGroup, BiTime, BiJoystick, BiPlus, BiTrash, BiCheckCircle } from 'react-icons/bi';
import { BsArrowRight, BsQuestionCircle } from 'react-icons/bs';
import { useRoomCreate } from '../hooks/useRoomCreate';
import { AuthInput } from '../../auth/components/ui/AuthInput';

const RoomCreatePage: React.FC = () => {
    const {
        name,
        setName,
        maxPlayers,
        setMaxPlayers,
        timeLimit,
        setTimeLimit,
        mode,
        setMode,
        questions,
        addQuestion,
        removeQuestion,
        updateQuestionText,
        addAlternative,
        removeAlternative,
        updateAlternativeText,
        setCorrectAlternative,
        loading,
        feedback,
        handleSubmit,
    } = useRoomCreate();

    return (
        <>
            <Helmet>
                <title>QuizArena • Criar Sala</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-2xl relative z-10 my-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-[#1368CE] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#0E4B94] mb-4">
                            Lobby & Desafios
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Criar</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Sala</span>
                        </h1>
                    </div>
                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">
                        {feedback && (
                            <div
                                className={`mb-4 p-3 rounded-2xl text-xs font-bold text-center border-2 ${feedback.type === 'Success'
                                        ? 'bg-[#26890C]/20 border-[#26890C] text-green-300'
                                        : feedback.type === 'Warning'
                                            ? 'bg-[#D89E00]/20 border-[#D89E00] text-amber-300'
                                            : 'bg-[#E21B3C]/20 border-[#E21B3C] text-red-300'
                                    }`}
                            >
                                {feedback.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AuthInput
                                label="Nome da Sala"
                                icon={<BiJoystick className="w-5 h-5" />}
                                type="text"
                                required
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                                placeholder="Ex: Torneio dos Mestres"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <AuthInput
                                    label="Máx. Jogadores (2 - 20)"
                                    icon={<BiGroup className="w-5 h-5" />}
                                    type="number"
                                    min={2}
                                    max={20}
                                    required
                                    value={maxPlayers}
                                    onChange={(e: any) => setMaxPlayers(Number(e.target.value))}
                                />

                                <AuthInput
                                    label="Tempo / Pergunta (1 - 15 min)"
                                    icon={<BiTime className="w-5 h-5" />}
                                    type="number"
                                    min={1}
                                    max={15}
                                    required
                                    value={timeLimit}
                                    onChange={(e: any) => setTimeLimit(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Modo de Jogo
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMode('NORMAL')}
                                        className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all cursor-pointer ${mode === 'NORMAL'
                                                ? 'bg-[#1368CE] border-[#38bdf8] text-white shadow-[0_4px_0_0_#0E4B94]'
                                                : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode('HARDCORE')}
                                        className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all cursor-pointer ${mode === 'HARDCORE'
                                                ? 'bg-[#E21B3C] border-[#f43f5e] text-white shadow-[0_4px_0_0_#A0132B]'
                                                : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        Hardcore
                                    </button>
                                </div>
                            </div>

                            <hr className="border-white/10 my-6" />
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                                        <BsQuestionCircle className="w-4 h-4 text-cyan-400" />
                                        Perguntas da Sala ({questions.length})
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="inline-flex items-center gap-1 bg-[#26890C] hover:bg-[#2cb20d] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-[0_3px_0_0_#1a5c08] transition-all cursor-pointer"
                                    >
                                        <BiPlus className="w-4 h-4" />
                                        Add Pergunta
                                    </button>
                                </div>

                                {questions.map((q: any, qIndex: any) => (
                                    <div key={qIndex} className="bg-black/40 border-2 border-white/10 rounded-2xl p-4 space-y-4 relative">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-black uppercase text-cyan-400">
                                                Pergunta #{qIndex + 1}
                                            </span>
                                            {questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="text-red-400 hover:text-red-300 p-1 transition-colors cursor-pointer"
                                                >
                                                    <BiTrash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={q.text}
                                            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                            placeholder="Digite o enunciado da pergunta..."
                                            className="w-full bg-black/50 border-2 border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#1368CE]"
                                        />
                                        <div className="space-y-2 pt-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                                    Alternativas (Marque a correta)
                                                </label>
                                                {q.alternatives.length < 5 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => addAlternative(qIndex)}
                                                        className="text-[11px] font-extrabold text-cyan-400 hover:underline cursor-pointer"
                                                    >
                                                        + Opção
                                                    </button>
                                                )}
                                            </div>

                                            {q.alternatives.map((alt: any, aIndex: any) => (
                                                <div key={aIndex} className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCorrectAlternative(qIndex, aIndex)}
                                                        title="Marcar como correta"
                                                        className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${alt.isCorrect
                                                                ? 'bg-[#26890C] border-[#4ade80] text-white shadow-[0_2px_0_0_#1a5c08]'
                                                                : 'bg-black/30 border-white/10 text-zinc-600 hover:text-zinc-400'
                                                            }`}
                                                    >
                                                        <BiCheckCircle className="w-4 h-4" />
                                                    </button>

                                                    <input
                                                        type="text"
                                                        required
                                                        value={alt.text}
                                                        onChange={(e) => updateAlternativeText(qIndex, aIndex, e.target.value)}
                                                        placeholder={`Alternativa ${aIndex + 1}`}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#1368CE]"
                                                    />

                                                    {q.alternatives.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAlternative(qIndex, aIndex)}
                                                            className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                                        >
                                                            <BiTrash className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'Criando Arena...' : 'Lançar Sala'}</span>
                                {!loading && <BsArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-xs font-bold text-zinc-400">
                            Mudou de ideia?{' '}
                            <Link
                                to="/"
                                className="text-cyan-400 hover:text-cyan-300 font-extrabold underline underline-offset-4 transition-colors"
                            >
                                Voltar para as Salas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomCreatePage;