
import { BiTrophy } from "react-icons/bi";
import type { PodiumComponentProps } from "../types/types";

export function PodiumHeader({ colors }: PodiumComponentProps) {
    return (
        <div className="flex justify-center">
            <div
                className="
                    inline-flex items-center gap-2
                    font-black px-5 py-3
                    rounded-2xl text-sm sm:text-base
                    uppercase tracking-wider
                    border-2 border-b-4 shadow-sm
                "
                style={{
                    backgroundColor: `${colors.primary}25`,
                    color: colors.primary,
                    borderColor: colors.primary,
                }}
            >
                <BiTrophy className="w-6 h-6" />
                <span>Pódio Final</span>
            </div>
        </div>
    );
}
