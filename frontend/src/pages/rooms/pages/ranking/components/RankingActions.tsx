import React from "react";
import { BsArrowRight } from "react-icons/bs";
import Button from "../../../../../shared/ui/Button";


interface RankingActionsProps {
    onNextRound: () => void;
    disabled: boolean;
}

const RankingActions: React.FC<RankingActionsProps> = ({
    onNextRound,
    disabled,
}) => {
    return (
        <div className="pt-2">
            <Button
                type="button"
                variant="success"
                size="lg"
                fullWidth
                disabled={disabled}
                onClick={onNextRound}
                rightIcon={
                    <BsArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
                }
                className="
                    py-3 sm:py-4
                    h-10
                    text-base sm:text-xl
                    uppercase tracking-wider
                    shadow-sm
                "
            >
                Avançar Partida
            </Button>
        </div>
    );
};

export default RankingActions;