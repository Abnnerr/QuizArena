import { BiUser } from "react-icons/bi";
import { useTheme } from "../../../../../contexts/ThemeContext";
import Input from "../../../../../shared/ui/Input";
import type { PlayerNameInputProps } from "../types/types";



const PlayerNameInput: React.FC<PlayerNameInputProps> = ({
    playerName,
    setPlayerName,
}) => {
    const { colors } = useTheme();

    return (
        <div>
            <label
                htmlFor="playerName"
                className="
                    block font-black uppercase tracking-widest
                    mb-3 text-center sm:text-left
                    text-xs
                "
                style={{ color: colors.muted }}
            >
                Seu apelido na arena
            </label>

            <Input
                id="playerName"
                name="playerName"
                type="text"
                required
                maxLength={25}
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="MESTREDOSQUIZ"
                icon={<BiUser className="w-7 h-7" />}
                color={colors.surface}
                border={colors.border}
                style={{
                    caretColor: colors.primary,
                }}
                className="
                    py-4
                    font-black tracking-widest
                    text-center text-lg sm:text-xl
                    placeholder:opacity-60
                    uppercase
                "
            />

            <div className="flex justify-end mt-2">
                <span
                    className="text-xs font-bold"
                    style={{ color: colors.muted }}
                >
                    {playerName.length}/25
                </span>
            </div>
        </div>
    );
};

export default PlayerNameInput;