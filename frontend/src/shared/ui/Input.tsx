
import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
    color?: string
    border?: string;
    rightElement?: React.ReactNode;
}
export const Input: React.FC<AuthInputProps> = ({ label, icon, rightElement, color, border, ...props }) => {
    return (
        <div>
            {label && (
                <label className="block text-xs font-bold uppercase tracking-wider text-[#888888] mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#FFC800]">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    style={{
                        borderColor: border,
                        backgroundColor: color
                    }}
                    className={`w-full ${color ? '' : 'bg-[#151515]'} ${border ? '' : 'border-[#2A2A2A]'} border-2 border-b-4 rounded-2xl ${icon ? 'pl-12' : 'pl-4'
                        } ${rightElement ? 'pr-12' : 'pr-4'
                        } py-3.5 text-[#F3F4F6] font-black text-base sm:text-lg placeholder:text-[#444444] focus:outline-none focus:border-[#1CB0F6] focus:bg-[#1A1A1A] focus:border-b-4 transition-all`}
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