import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { useRegister } from '../hooks/useRegister';
import { BiArrowBack, BiLock, BiMailSend, BiUser } from 'react-icons/bi';
import { BsArrowRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import { PasswordRequirements } from '../components/PasswordRequeriments';
import { Input } from '../../../shared/ui/Input';

const RegisterPage: React.FC = () => {
    const {
        userName,
        setUserName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        handleSubmit,
    } = useRegister();

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
                <title>QuizArena • Registrar</title>
            </Helmet>
            <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-xl mx-auto my-auto min-h-[calc(100vh-120px)]">
                <div className="w-full flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="inline-flex h-10 items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] active:border-b-2 active:translate-y-0.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                        <BiArrowBack className="w-5 h-5 text-[#AFAFAF]" />
                        <span>Início</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-[#E5B200]">
                        <span>Criar Conta</span>
                    </div>
                </div>
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 p-3 shadow-sm flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                        <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                    </div>

                    <div className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-sm w-full sm:w-auto">
                        <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#E5E5E5]" />
                        <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />

                        <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                            Crie sua conta de Host!
                        </h2>
                        <p className="text-[#777777] text-xs sm:text-sm font-extrabold mt-1">
                            Monte seus próprios quizes e jogue com seus amigos na arena.
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <Input
                            label="Nome de Usuário"
                            icon={<BiUser className="w-6 h-6 text-[#FFC800]" />}
                            type="text"
                            required
                            value={userName}
                            onChange={(e: any) => setUserName(e.target.value)}
                            placeholder="Ex: Gilberto"
                        />

                        <Input
                            label="E-mail"
                            icon={<BiMailSend className="w-6 h-6 text-[#FFC800]" />}
                            type="email"
                            required
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                        />

                        <div>
                            <Input
                                label="Senha"
                                icon={<BiLock className="w-6 h-6 text-[#FFC800]" />}
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <BsEyeSlash className="w-6 h-6" /> : <BsEye className="w-6 h-6" />}
                                    </button>
                                }
                            />
                            <PasswordRequirements requirements={passwordRequirements} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-15 bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl shadow-sm transition-all duration-75 flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer"
                    >
                        <span>Criar Conta</span>
                        <BsArrowRight className="w-6 h-6" />
                    </button>
                </form>
                <div className="mt-6 text-center text-xs sm:text-sm font-black text-[#AFAFAF]">
                    Já tem uma conta na arena?{' '}
                    <Link
                        to="/auth/login"
                        className="text-[#1CB0F6] hover:text-[#0092D6] font-black uppercase tracking-wider ml-1 underline underline-offset-4 transition-colors"
                    >
                        Fazer Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;