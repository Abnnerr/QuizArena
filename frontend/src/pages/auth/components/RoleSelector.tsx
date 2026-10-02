// src/pages/auth/components/RoleSelector.tsx
import React from 'react';

interface RoleSelectorProps {
    role: number;
    setRole: (role: number) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ role, setRole }) => {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2">
                Escolha seu perfil
            </label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setRole(1)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border-2 font-extrabold text-xs transition-all duration-150 active:translate-y-1 ${role === 1
                            ? 'bg-[#1368CE] border-[#398bf3] text-white shadow-[0_4px_0_0_#0C4488]'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span>Jogador</span>
                </button>

                <button
                    type="button"
                    onClick={() => setRole(2)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border-2 font-extrabold text-xs transition-all duration-150 active:translate-y-1 ${role === 2
                            ? 'bg-[#D89E00] border-[#f1b719] text-white shadow-[0_4px_0_0_#966e00]'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span>Host</span>
                </button>
            </div>
        </div>
    );
};