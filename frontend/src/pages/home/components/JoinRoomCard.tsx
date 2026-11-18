
import React from "react";
import { FaGamepad } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

import { useTheme } from "../../../contexts/ThemeContext";
import RoomCodeField from "./RoomCodeField";
import Button from "../../../shared/ui/Button";

interface JoinRoomCardProps {
    roomCode: string;
    setRoomCode: React.Dispatch<React.SetStateAction<string>>;
    handleJoinRoom: (event: React.FormEvent<HTMLFormElement>) => void;
    isWarning?: boolean;
}

const JoinRoomCard: React.FC<JoinRoomCardProps> = ({
    roomCode,
    setRoomCode,
    handleJoinRoom,
    isWarning = false,
}) => {
    const { colors } = useTheme();

    return (
        <form
            onSubmit={handleJoinRoom}
            className="w-full flex flex-col gap-6"
        >
            <div
                className="
                    w-full border-2 border-b-8
                    rounded-3xl
                    p-6
                    shadow-lg
                    transition-all duration-300
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: isWarning
                        ? colors.danger
                        : colors.border,
                }}
            >
                <RoomCodeField
                    roomCode={roomCode}
                    setRoomCode={setRoomCode}
                />
            </div>

            <Button
                type="submit"
                variant={roomCode.trim() ? "success" : "secondary"}
                size="lg"
                fullWidth
                disabled={!roomCode.trim()}
                leftIcon={<FaGamepad className="w-5 h-5" />}
                rightIcon={<BsArrowRight className="w-5 h-5" />}
                className="
                    h-14
                    rounded-3xl
                    text-xs sm:text-sm
                    tracking-wider
                    shadow-md
                "
            >
                Entrar na Sala
            </Button>
        </form>
    );
};

export default JoinRoomCard;
