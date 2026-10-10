import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { BiGame, BiTime, BiGroup, BiPlus, BiTrash, BiCheckCircle, BiArrowBack } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { useRoomCreate } from "../hooks/useRoomCreate";


const RoomCreatePage: React.FC = () => {
    const {
        name, setName,
        maxPlayers, setMaxPlayers,
        timeLimit, setTimeLimit,
        mode, setMode,
        questions,
        handleAddQuestion,
        handleRemoveQuestion,
        handleQuestionChange,
        handleAddAlternative,
        handleRemoveAlternative,
        handleAlternativeChange,
        handleSetCorrectAlternative,
        handleSubmit
    } = useRoomCreate();

    return (
        <>
            <Helmet>
                <title>QuizArena • Criar Sala</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 relative overflow-x-hidden select-none font-['Nunito',sans-serif]">
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-2xl relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/10 text-zinc-300 hover:text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all"
                        >
                            <BiArrowBack className="w-4 h-4" />
                            Voltar
                        </Link>

                        <div className="inline-flex items-center gap-2 bg-[#D89E00] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#997000]">
                            Nova Sala
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Criar</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Arena</span>
                        </h1>
                        <p className="text-zinc-400 text-sm font-semibold mt-2">
                            Configure as regras e monte as perguntas do seu desafio
                        </p>
                    </div>

                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Nome da Sala
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                        <BiGame className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Desafio JavaScript Avançado"
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Max Jogadores (2-20)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                            <BiGroup className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            min={2}
                                            max={20}
                                            required
                                            value={maxPlayers}
                                            onChange={(e) => setMaxPlayers(Number(e.target.value))}
                                            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white font-semibold focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Tempo/Questão (min)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                            <BiTime className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            min={1}
                                            max={15}
                                            required
                                            value={timeLimit}
                                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                                            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white font-semibold focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Modo de Jogo
                                    </label>
                                    <select
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value as "NORMAL" | "HARDCORE")}
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-4 py-3 text-white font-semibold focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm cursor-pointer"
                                    >
                                        <option value="NORMAL" className="bg-[#1E1145]">Normal</option>
                                        <option value="HARDCORE" className="bg-[#1E1145]">Hardcore</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-white/10 my-4" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
                                        Perguntas do Quiz ({questions.length})
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={handleAddQuestion}
                                        className="inline-flex items-center gap-1.5 bg-[#1368CE] hover:bg-[#1055ab] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_3px_0_0_#0E4B94] transition-all cursor-pointer"
                                    >
                                        <BiPlus className="w-4 h-4" /> Adicionar Pergunta
                                    </button>
                                </div>

                                {questions.map((q, qIndex) => (
                                    <div key={qIndex} className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3 relative">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-bold text-zinc-400 uppercase">
                                                Pergunta #{qIndex + 1}
                                            </span>
                                            {questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveQuestion(qIndex)}
                                                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                                                    title="Remover pergunta"
                                                >
                                                    <BiTrash className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            required
                                            value={q.text}
                                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                            placeholder="Digite o enunciado da pergunta..."
                                            className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-2.5 text-white font-medium placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] text-sm"
                                        />

                                        <div className="space-y-2 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-zinc-400">Alternativas (clique no ícone para marcar a correta):</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddAlternative(qIndex)}
                                                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                                                >
                                                    + Alternativa
                                                </button>
                                            </div>

                                            {q.alternatives.map((alt, aIndex) => (
                                                <div key={aIndex} className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSetCorrectAlternative(qIndex, aIndex)}
                                                        className={`p-2 rounded-xl border transition-all cursor-pointer ${alt.isCorrect
                                                            ? "bg-[#26890C] border-[#26890C] text-white shadow-[0_2px_0_0_#1a5c08]"
                                                            : "bg-black/40 border-white/10 text-zinc-500 hover:text-zinc-300"
                                                            }`}
                                                        title={alt.isCorrect ? "Alternativa Correta" : "Marcar como correta"}
                                                    >
                                                        <BiCheckCircle className="w-5 h-5" />
                                                    </button>

                                                    <input
                                                        type="text"
                                                        required
                                                        value={alt.text}
                                                        onChange={(e) => handleAlternativeChange(qIndex, aIndex, e.target.value)}
                                                        placeholder={`Alternativa ${aIndex + 1}`}
                                                        className="flex-1 bg-black/40 border-2 border-white/10 rounded-xl px-3 py-2 text-white text-sm font-medium placeholder-zinc-500 focus:outline-none focus:border-[#1368CE]"
                                                    />

                                                    {q.alternatives.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAlternative(qIndex, aIndex)}
                                                            className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                                        >
                                                            <BiTrash className="w-4 h-4" />
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
                                className="w-full mt-6 bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                            >
                                <span>Criar Sala Agora</span>
                                <BsArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomCreatePage;