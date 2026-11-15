
import { Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

const PageLayout = () => {
    const { colors } = useTheme();

    return (
        <main
            className="
                h-dvh w-full
                flex flex-col
                relative overflow-hidden
                select-none
            "
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    opacity: 0.15,
                    backgroundImage: `radial-gradient(${colors.pattern} 1px, transparent 3px)`,
                    backgroundSize: "30px 30px",
                }}
            />

            <Outlet />
        </main>
    );
};

export default PageLayout;
