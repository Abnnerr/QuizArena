
import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
    rightElement?: React.ReactNode;
}

export const Input: React.FC<AuthInputProps> = ({ label, icon, rightElement, ...props }) => {
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
                    className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl pl-12 pr-12 py-3.5 text-[#4B4B4B] font-black text-base sm:text-lg placeholder:text-[#CECECE] focus:outline-none focus:border-[#1CB0F6] focus:bg-white focus:border-b-4 transition-all"
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