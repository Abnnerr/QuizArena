
import React from "react";
import { BiHash } from "react-icons/bi";
import { useTheme } from "../../../contexts/hooks/useTheme";
import Input from "../../../shared/ui/Input";

interface RoomCodeFieldProps {
    roomCode: string;
    setRoomCode: React.Dispatch<React.SetStateAction<string>>;
}

const RoomCodeField: React.FC<RoomCodeFieldProps> = ({
    roomCode,
    setRoomCode,
}) => {
    const { colors } = useTheme();

    return (
        <div className="w-full">
            <div className="flex flex-col items-center mb-4">
                <div
                    className="
                        w-10 h-10 sm:w-12 sm:h-12
                        rounded-xl sm:rounded-2xl
                        border-2 mb-2
                        flex items-center justify-center
                    "
                    style={{
                        backgroundColor: `${colors.primary}18`,
                        borderColor: `${colors.primary}50`,
                    }}
                >
                    <BiHash
                        className="w-6 h-6 sm:w-7 sm:h-7"
                        style={{ color: colors.primary }}
                    />
                </div>

                <p
                    className="
                        text-[10px] sm:text-[11px]
                        font-bold mt-1 text-center
                    "
                    style={{ color: colors.muted }}
                >
                    Insira o código disponibilizado pelo anfitrião
                </p>
            </div>

            <Input
                label="Código da Sala"
                type="text"
                required
                value={roomCode}
                onChange={(event: any) =>
                    setRoomCode(event.target.value.toUpperCase())
                }
                placeholder="ARENA123"
                maxLength={12}
                color={colors.surface}
                border={colors.border}
                icon={<BiHash className="w-5 h-5" />}
                className="
                    h-14
                    text-center
                    text-xl sm:text-3xl
                    tracking-[0.2em]
                    uppercase
                    placeholder:tracking-widest
                "
            />

            <div className="flex items-center justify-between mt-2">
                <span
                    className="
                        text-[9px] sm:text-[10px]
                        font-black uppercase tracking-wider
                    "
                    style={{ color: colors.muted }}
                >
                    Máximo de 12 caracteres
                </span>

                <span
                    className="text-xs font-black"
                    style={{
                        color:
                            roomCode.length === 12
                                ? colors.success
                                : colors.muted,
                    }}
                >
                    {roomCode.length}/12
                </span>
            </div>
        </div>
    );
};

export default RoomCodeField;
