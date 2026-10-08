import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useReset } from '../hooks/useReset';
import { BiLock } from 'react-icons/bi';
import { BsArrowRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import { AuthInput } from '../components/ui/AuthInput';
import { PasswordRequirements } from '../components/PasswordRequeriments';

const ResetPage: React.FC = () => {
    const {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        loading,
        feedback,
        handleSubmit,
    } = useReset();

    const passwordRequirements = [
        { label: '8+ caracteres', met: hasMinLength },
        { label: 'Letra maiúscula', met: hasUpper },
        { label: 'Letra minúscula', met: hasLower },
        { label: 'Número (0-9)', met: hasNumber },
        { label: 'Caractere especial', met: hasSpecial },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena • Reset Password</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-[#D89E00] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#997000] mb-4">
                            Redefinir Senha
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Quiz</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Arena</span>
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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <AuthInput
                                    label="Nova Senha"
                                    icon={<BiLock className="w-5 h-5" />}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-zinc-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
                                        </button>
                                    }
                                />
                                <PasswordRequirements requirements={passwordRequirements} />
                            </div>

                            <AuthInput
                                label="Confirmar Nova Senha"
                                icon={<BiLock className="w-5 h-5" />}
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
                                    </button>
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'Redefinindo...' : 'Salvar Nova Senha'}</span>
                                {!loading && <BsArrowRight className="w-5 h-5" />}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs font-bold text-zinc-400">
                            Lembrou a senha anterior?{' '}
                            <Link
                                to="/auth/login"
                                className="text-cyan-400 hover:text-cyan-300 font-extrabold underline underline-offset-4 transition-colors"
                            >
                                Fazer Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPage;