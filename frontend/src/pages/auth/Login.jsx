import { useState } from 'react';
import {
    FaGamepad,
    FaUser,
    FaLock,
    FaArrowRight,
    FaShieldAlt,
    FaStar
} from 'react-icons/fa';
import { useLogin } from '../../hooks/hookLogin';

export default function LoginPage() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        isLoading,
        errorMsg,
        successMsg,
        handleSubmit
    } = useLogin
    return (
        <main className="flex-1 flex items-center justify-center p-4 z-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-b-8 border-gray-200 relative transform transition-all">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight">
                        Entrar na Conta
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">
                        Insira seus dados para começar a jogar e criar quizzes!
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 font-bold text-sm rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-100 border-2 border-green-400 text-green-700 font-bold text-sm rounded-xl text-center">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-gray-700 text-xs font-black uppercase tracking-wider mb-2">
                            UserName
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                <FaUser className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ex: SuperQuizMaster"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-[#46178f] focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 text-xs font-black uppercase tracking-wider">
                                Senha
                            </label>
                            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-[#1368ce] hover:underline">
                                Esqueceu a senha?
                            </a>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                <FaLock className="w-5 h-5" />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-[#46178f] focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 bg-[#26890c] hover:bg-[#1d6b09] active:bg-[#155206] text-white font-black text-lg py-4 rounded-2xl shadow-lg border-b-4 border-[#155206] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Entrar</span>
                                <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}