import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiGame, BiGroup, BiTime, BiPlus, BiTrash, BiCheckCircle, BiArrowBack } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { useRoomCreate } from '../hooks/useRoomCreate';

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
        loading,
        error,
        handleAddQuestion,
        handleRemoveQuestion,
        handleQuestionChange,
        handleAddAlternative,
        handleRemoveAlternative,
        handleAlternativeChange,
        handleSetCorrectAlternative,
        handleSubmit,
    } = useRoomCreate();

    return (
        <>
            <Helmet>
                <title>QuizArena • Criar Sala</title>
            </Helmet>

            <main className="w-full min-h-[100dvh] bg-[#121212] text-[#F3F4F6] flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 relative overflow-x-hidden select-none font-['Nunito',sans-serif]">

                {/* Background Dot Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-15 z-0"
                    style={{
                        backgroundImage: "radial-gradient(#383838 2px, transparent 2px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="w-full max-w-2xl relative z-10 space-y-5 my-auto">

                    {/* Topbar: Botão Voltar + Tag */}
                    <div className="flex items-center justify-between">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-[#282828] border-2 border-[#2A2A2A] border-b-4 text-[#AAAAAA] hover:text-[#F3F4F6] px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-sm"
                        >
                            <BiArrowBack className="w-4 h-4 text-[#888888]" />
                            <span>Voltar</span>
                        </Link>

                        <div className="inline-flex items-center gap-2 bg-[#FFC800] border-b-4 border-[#C69B00] text-[#7A5B00] font-black px-4 py-1.5 rounded-2xl text-xs uppercase tracking-wider shadow-sm">
                            Nova Sala
                        </div>
                    </div>

                    {/* Título */}
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F3F4F6]">
                            Criar Arena
                        </h1>
                        <p className="text-[#AAAAAA] text-xs sm:text-sm font-extrabold">
                            Configure as regras e monte as perguntas do seu desafio
                        </p>
                    </div>

                    {/* Card do Formulário */}
                    <div className="bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-8 rounded-3xl p-5 sm:p-8 shadow-xl relative">
                        {error && (
                            <div className="mb-6 p-3.5 rounded-2xl text-xs font-black text-center border-2 bg-[#3B1515] border-[#FF4B4B] text-[#FF6B6B]">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nome da Sala */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#AAAAAA] mb-1.5">
                                    Nome da Sala
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                                        <BiGame className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex: Desafio JavaScript Avançado"
                                        className="w-full bg-[#151515] border-2 border-[#2A2A2A] rounded-2xl pl-11 pr-4 py-3 text-[#F3F4F6] font-extrabold placeholder-[#666666] focus:outline-none focus:border-[#1CB0F6] transition-all text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Grid Max Jogadores & Tempo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-[#AAAAAA] mb-1.5">
                                        Max Jogadores (2-20)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                                            <BiGroup className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            min={2}
                                            max={20}
                                            required
                                            value={maxPlayers}
                                            onChange={(e) => setMaxPlayers(Number(e.target.value))}
                                            className="w-full bg-[#151515] border-2 border-[#2A2A2A] rounded-2xl pl-11 pr-4 py-3 text-[#F3F4F6] font-extrabold focus:outline-none focus:border-[#1CB0F6] transition-all text-xs sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-[#AAAAAA] mb-1.5">
                                        Tempo/Questão (seg)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#888888]">
                                            <BiTime className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="number"
                                            min={5}
                                            max={120}
                                            required
                                            value={timeLimit}
                                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                                            className="w-full bg-[#151515] border-2 border-[#2A2A2A] rounded-2xl pl-11 pr-4 py-3 text-[#F3F4F6] font-extrabold focus:outline-none focus:border-[#1CB0F6] transition-all text-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modo de Jogo */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#AAAAAA] mb-1.5">
                                    Modo de Jogo
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMode('NORMAL')}
                                        className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-b-4 transition-all cursor-pointer ${mode === 'NORMAL'
                                                ? 'bg-[#1CB0F6] border-[#0092D6] text-white shadow-sm'
                                                : 'bg-[#151515] border-[#2A2A2A] text-[#888888] hover:text-[#F3F4F6]'
                                            }`}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode('HARDCORE')}
                                        className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-b-4 transition-all cursor-pointer ${mode === 'HARDCORE'
                                                ? 'bg-[#FF4B4B] border-[#D43F3F] text-white shadow-sm'
                                                : 'bg-[#151515] border-[#2A2A2A] text-[#888888] hover:text-[#F3F4F6]'
                                            }`}
                                    >
                                        Hardcore
                                    </button>
                                </div>
                            </div>

                            <hr className="border-[#2A2A2A] my-4" />

                            {/* Seção de Perguntas */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
                                        Perguntas ({questions.length})
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={handleAddQuestion}
                                        className="inline-flex items-center gap-1.5 bg-[#1CB0F6] hover:bg-[#0092D6] text-white text-xs font-black px-3.5 py-2 rounded-xl border-b-4 border-[#0073A8] transition-all cursor-pointer shadow-sm"
                                    >
                                        <BiPlus className="w-4 h-4" /> Nova Pergunta
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                                    {questions.map((q: any, qIndex: number) => (
                                        <div key={qIndex} className="bg-[#151515] border-2 border-[#2A2A2A] rounded-2xl p-4 space-y-3 relative">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-black text-[#888888] uppercase tracking-wider">
                                                    Pergunta #{qIndex + 1}
                                                </span>
                                                {questions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveQuestion(qIndex)}
                                                        className="text-[#FF6B6B] hover:text-red-300 p-1 transition-colors cursor-pointer"
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
                                                className="w-full bg-[#121212] border-2 border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-[#F3F4F6] text-xs sm:text-sm font-extrabold placeholder-[#666666] focus:outline-none focus:border-[#1CB0F6]"
                                            />

                                            <div className="space-y-2 pt-1">
                                                <div className="flex items-center justify-between text-[11px] font-black text-[#888888]">
                                                    <span>Alternativas (clique no ícone para marcar a correta):</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddAlternative(qIndex)}
                                                        className="text-[#1CB0F6] hover:underline cursor-pointer"
                                                    >
                                                        + Alternativa
                                                    </button>
                                                </div>

                                                {q.alternatives.map((alt: any, aIndex: number) => (
                                                    <div key={aIndex} className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetCorrectAlternative(qIndex, aIndex)}
                                                            className={`p-2 rounded-xl border-2 border-b-4 transition-all cursor-pointer ${alt.isCorrect
                                                                    ? "bg-[#58CC02] border-[#46A302] text-white shadow-sm"
                                                                    : "bg-[#121212] border-[#2A2A2A] text-[#666666] hover:text-[#AAAAAA]"
                                                                }`}
                                                            title={alt.isCorrect ? "Alternativa Correta" : "Marcar como correta"}
                                                        >
                                                            <BiCheckCircle className="w-4 h-4" />
                                                        </button>

                                                        <input
                                                            type="text"
                                                            required
                                                            value={alt.text}
                                                            onChange={(e) => handleAlternativeChange(qIndex, aIndex, e.target.value)}
                                                            placeholder={`Alternativa ${aIndex + 1}`}
                                                            className="flex-1 bg-[#121212] border-2 border-[#2A2A2A] rounded-xl px-3 py-2 text-[#F3F4F6] text-xs font-extrabold placeholder-[#666666] focus:outline-none focus:border-[#1CB0F6]"
                                                        />

                                                        {q.alternatives.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveAlternative(qIndex, aIndex)}
                                                                className="text-[#666666] hover:text-[#FF6B6B] p-1 transition-colors cursor-pointer"
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
                            </div>

                            {/* Botão Salvar / Criar */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-3.5 rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer shadow-md disabled:bg-[#222222] disabled:border-[#2F2F2F] disabled:text-[#666666] disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                <span>{loading ? 'Criando Sala...' : 'Criar Sala Agora'}</span>
                                {!loading && <BsArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default RoomCreatePage;