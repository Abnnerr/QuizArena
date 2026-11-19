
import { BsArrowRight } from "react-icons/bs";
import type { PodiumComponentProps } from "../types/types";

interface PodiumActionsProps extends PodiumComponentProps {
    onClearRoom: () => void;
}

export function PodiumActions({
    colors,
    onClearRoom,
}: PodiumActionsProps) {
    return (
        <div className="pt-4">
            <button
                type="button"
                onClick={onClearRoom}
                className="
                    w-full border-b-4
                    active:border-b-0
                    active:translate-y-1
                    text-white font-black
                    py-5 sm:py-4 rounded-2xl
                    flex items-center justify-center
                    gap-3 text-base sm:text-xl uppercase
                    tracking-wider cursor-pointer
                    transition-all shadow-sm
                    h-15
                "
                style={{
                    backgroundColor: colors.success,
                    borderColor: `${colors.success}CC`,
                }}
            >
                <span>Encerrar Partida</span>
                <BsArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
        </div>
    );
}
