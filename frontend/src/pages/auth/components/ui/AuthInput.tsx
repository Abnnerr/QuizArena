
import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
    rightElement?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, icon, rightElement, ...props }) => {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    {icon}
                </div>
                <input
                    {...props}
                    className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-11 py-3 text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
};