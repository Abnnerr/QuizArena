
import React from "react";
import { useTheme } from "../../../contexts/hooks/useTheme";

const JoinRoomFooter: React.FC = () => {
    const { colors } = useTheme();

    return (
        <p
            className="text-center text-[9px] sm:text-xs font-bold mt-3"
            style={{ color: colors.muted }}
        >
            Prepare-se para testar seus conhecimentos!
        </p>
    );
};

export default JoinRoomFooter;
