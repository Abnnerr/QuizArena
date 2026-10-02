import {
    FiUser,
    FiMail,
    FiLock,
    FiCheckCircle,
    FiXCircle,
    FiPlay,
    FiArrowRight,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';
import { useRegister } from '../../hooks/hookRegister';


export default function RegisterPage() {
    const {
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        userName,
        email,
        role,
        password,
        showPassword,

        setShowPassword,
        setUserName,
        setEmail,
        setRole,
        setPassword,
        handleSubmit,
    } = useRegister()

    return (
        <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-[0_16px_0_0_rgba(0,0,0,0.2)] border-4 border-white relative z-10">

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-[#26890c] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-[0_4px_0_0_#134404]">
                    <FiPlay className="w-4 h-4 mr-1.5 inline" /> Cadastro de Jogador
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#333] tracking-tight">
                    Crie sua Conta
                </h1>
                <p className="text-gray-500 text-sm mt-1">Entre na diversão e comece a jogar agora mesmo!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-1">
                        Nome de Usuário
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FiUser className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            required
                            minLength={3}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Ex: SuperGamer2026"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1368ce] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-1">
                        E-mail
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FiMail className="w-5 h-5" />
                        </span>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu.email@exemplo.com"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1368ce] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-1">
                        Tipo de Perfil
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole(1)}
                            className={`py-3 px-4 rounded-2xl font-extrabold text-sm border-2 transition-all flex items-center justify-center space-x-2 ${role === 1
                                ? 'bg-[#1368ce] text-white border-[#1368ce] shadow-[0_4px_0_0_#0d478a]'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            <span>Jogador</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole(2)}
                            className={`py-3 px-4 rounded-2xl font-extrabold text-sm border-2 transition-all flex items-center justify-center space-x-2 ${role === 2
                                ? 'bg-[#ffa602] text-white border-[#ffa602] shadow-[0_4px_0_0_#b37401]'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            <span>Host</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-1">
                        Senha
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FiLock className="w-5 h-5" />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1368ce] focus:bg-white transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 bg-gray-50 p-3 rounded-2xl border-2 border-gray-100 text-xs font-medium">
                        <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-[#26890c]' : 'text-gray-400'}`}>
                            {hasMinLength ? <FiCheckCircle className="w-3.5 h-3.5 shrink-0" /> : <FiXCircle className="w-3.5 h-3.5 shrink-0" />}
                            <span>Mín. 8 caracteres</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 ${hasUpper ? 'text-[#26890c]' : 'text-gray-400'}`}>
                            {hasUpper ? <FiCheckCircle className="w-3.5 h-3.5 shrink-0" /> : <FiXCircle className="w-3.5 h-3.5 shrink-0" />}
                            <span>Letra maiúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 ${hasLower ? 'text-[#26890c]' : 'text-gray-400'}`}>
                            {hasLower ? <FiCheckCircle className="w-3.5 h-3.5 shrink-0" /> : <FiXCircle className="w-3.5 h-3.5 shrink-0" />}
                            <span>Letra minúscula</span>
                        </div>
                        <div className={`flex items-center space-x-1.5 ${hasNumber ? 'text-[#26890c]' : 'text-gray-400'}`}>
                            {hasNumber ? <FiCheckCircle className="w-3.5 h-3.5 shrink-0" /> : <FiXCircle className="w-3.5 h-3.5 shrink-0" />}
                            <span>Um número</span>
                        </div>
                        <div className={`col-span-2 flex items-center space-x-1.5 ${hasSpecial ? 'text-[#26890c]' : 'text-gray-400'}`}>
                            {hasSpecial ? <FiCheckCircle className="w-3.5 h-3.5 shrink-0" /> : <FiXCircle className="w-3.5 h-3.5 shrink-0" />}
                            <span>Um caractere especial (@$!%*?&)</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-2 bg-[#26890c] hover:bg-[#1f6e09] text-white font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_0_#134404] active:translate-y-1 active:shadow-[0_2px_0_0_#134404] transition-all uppercase tracking-wider text-base flex items-center justify-center space-x-2"
                >
                    <span>Cadastrar e Jogar</span>
                    <FiArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-xs text-gray-400 font-medium">
                    Já tem uma conta? <a href="#login" className="text-[#1368ce] font-bold hover:underline">Faça login</a>
                </p>
            </div>

        </div>
    );
}