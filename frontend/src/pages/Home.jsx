import React, { useState } from 'react';
import { FaArrowRight, FaGamepad, FaHandSparkles, FaKey, FaPlusCircle, FaShieldAlt, FaUser } from 'react-icons/fa';

export default function HomePage() {
    const [gamePin, setGamePin] = useState('');
    const [nickname, setNickname] = useState('');
    const [step, setStep] = useState('pin');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (step === 'pin') {
            if (!gamePin.trim()) {
                setErrorMsg('Por favor, insira o PIN da sala ou nome!');
                return;
            }
            setStep('nickname');
        } else {
            if (!nickname.trim()) {
                setErrorMsg('Por favor, escolha um apelido divertido!');
                return;
            }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                alert(`Entrando na sala "${gamePin}" como "${nickname}"! 🚀`);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-[#46178f] flex flex-col justify-between relative overflow-hidden font-sans select-none">
            <div className="absolute top-12 left-12 w-28 h-28 bg-[#1368ce] rounded-3xl rotate-12 opacity-80 animate-bounce duration-1000 hidden sm:block shadow-lg"></div>
            <div className="absolute bottom-20 right-20 w-36 h-36 bg-[#e21b3c] rounded-full opacity-80 animate-pulse hidden sm:block shadow-lg"></div>
            <div className="absolute top-1/3 right-16 w-24 h-24 bg-[#ffa602] rotate-45 rounded-2xl opacity-80 hidden md:block shadow-lg"></div>
            <div className="absolute bottom-1/4 left-20 w-32 h-32 bg-[#26890c] rounded-3xl -rotate-12 opacity-80 hidden md:block shadow-lg"></div>
    
            <main className="flex-1 flex items-center justify-center p-4 z-10">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-b-8 border-gray-200 relative transform transition-all">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight">
                            {step === 'pin' ? 'Entrar no Jogo' : 'Escolha um Apelido'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">
                            {step === 'pin'
                                ? 'Digite o PIN da sala ou nome para participar'
                                : `Sala: ${gamePin.toUpperCase()} • Como os outros te verão?`}
                        </p>
                    </div>
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 font-bold text-sm rounded-xl text-center">
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleNext} className="space-y-5">

                        {step === 'pin' ? (
                            <div>
                                <label className="block text-gray-700 text-xs font-black uppercase tracking-wider mb-2">
                                    PIN do Jogo / Nome da Sala
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                        <FaKey className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={gamePin}
                                        onChange={(e) => setGamePin(e.target.value)}
                                        placeholder="Ex: 123456 ou SalaDoProf"
                                        autoFocus
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-black text-xl text-gray-800 text-center tracking-widest focus:outline-none focus:border-[#46178f] focus:bg-white transition-all shadow-inner placeholder:font-normal placeholder:text-sm placeholder:tracking-normal"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-gray-700 text-xs font-black uppercase tracking-wider mb-2">
                                    Seu Apelido (Nickname)
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                        <FaUser className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Ex: SuperGamer99"
                                        autoFocus
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-lg text-gray-800 focus:outline-none focus:border-[#46178f] focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep('pin')}
                                    className="mt-2 text-xs font-bold text-[#1368ce] hover:underline block"
                                >
                                    ← Alterar PIN da sala
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-[#26890c] hover:bg-[#1d6b09] active:bg-[#155206] text-white font-black text-lg py-4 rounded-2xl shadow-lg border-b-4 border-[#155206] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>{step === 'pin' ? 'Entrar' : 'OK, vamos lá!'}</span>
                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
                        <p className="text-gray-500 text-xs font-medium">
                            Quer hospedar seu próprio jogo de perguntas? <br />
                            <span className="font-bold text-[#1368ce] cursor-pointer hover:underline" onClick={() => alert('Abra a tela de cadastro!')}>
                                Cadastre-se gratuitamente
                            </span>
                        </p>
                    </div>

                </div>
            </main>
        </div>
    );
}