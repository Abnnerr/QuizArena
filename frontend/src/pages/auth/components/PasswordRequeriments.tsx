// src/pages/auth/components/PasswordRequirements.tsx
import React from 'react';
import { BiCheck } from 'react-icons/bi';

interface Requirement {
    label: string;
    met: boolean;
}

interface PasswordRequirementsProps {
    requirements: Requirement[];
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements }) => {
    return (
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            {requirements.map((req, index) => (
                <div
                    key={index}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-200 ${
                        req.met
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-black/20 border-white/5 text-zinc-500'
                    } ${index === requirements.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                    <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            req.met ? 'bg-emerald-500 text-black' : 'bg-white/10 text-transparent'
                        }`}
                    >
                        {req.met ? (
                            <BiCheck className="w-3 h-3 stroke-2" />
                        ) : (
                            <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                        )}
                    </div>
                    <span className="text-[11px] font-bold leading-none truncate">{req.label}</span>
                </div>
            ))}
        </div>
    );
};