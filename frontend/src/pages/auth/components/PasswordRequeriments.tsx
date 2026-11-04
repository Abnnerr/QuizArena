import React from 'react';
import { BiCheck } from 'react-icons/bi';

interface Requirement {
    label: string;
    met: boolean;
}

interface PasswordRequirementsProps {
    requirements: Requirement[];
}
export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements, ...props }) => {
    return (
        <div className="mt-3 grid grid-cols-2 gap-2">
            {requirements.map((req, index) => (
                <div
                    {...props}
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-b-4 transition-all duration-150 select-none ${req.met
                            ? 'bg-[#15320F] border-[#58CC02] text-[#8BEA44]'
                            : 'bg-[#151515] border-[#2A2A2A] text-[#666666]'
                        } ${index === requirements.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                    <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${req.met
                                ? 'bg-[#58CC02] text-[#121212] shadow-sm'
                                : 'bg-[#2A2A2A] text-transparent'
                            }`}
                    >
                        {req.met && (
                            <BiCheck className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                    </div>
                    <span className="text-xs font-black leading-none truncate tracking-wide">
                        {req.label}
                    </span>
                </div>
            ))}
        </div>
    );
};