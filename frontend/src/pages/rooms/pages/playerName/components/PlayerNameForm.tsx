import React from "react";
import { BsArrowRight } from "react-icons/bs";
import PlayerNameInput from "./PlayerNameInput";
import Button from "../../../../../shared/ui/Button";
import type { PlayerNameFormProps } from "../types/types";


const PlayerNameForm: React.FC<PlayerNameFormProps> = ({
    playerName,
    setPlayerName,
    loading,
    handleSubmit,
}) => {
    const isDisabled = loading || !playerName.trim();

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
        >
            <PlayerNameInput
                playerName={playerName}
                setPlayerName={setPlayerName}
            />

            <Button
                type="submit"
                variant={isDisabled ? "secondary" : "success"}
                size="lg"
                fullWidth
                isLoading={loading}
                disabled={!playerName.trim()}
                rightIcon={<BsArrowRight className="w-6 h-6" />}
                className="
                    h-14 text-lg
                    border-b-4 active:border-b-0
                    active:translate-y-1
                    font-black rounded-2xl shadow-sm
                    transition-all duration-75
                    uppercase tracking-wider cursor-pointer
                    disabled:cursor-not-allowed
                    disabled:translate-y-0
                    disabled:border-b-4
                "
            >
                Confirmar Apelido
            </Button>
        </form>
    );
};

export default PlayerNameForm;