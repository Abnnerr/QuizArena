
import { Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

const PageLayout = () => {
    const { colors } = useTheme();

    return (
        <main
            className="
                min-h-dvh w-full
                flex flex-col
                relative
                overflow-x-hidden
                select-none
            "
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            {/* <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    opacity: 0.15,
                    backgroundImage: `radial-gradient(${colors.pattern} 1px, transparent 3px)`,
                    backgroundSize: "30px 30px",
                }}
            /> */}

            {/* PÁGINAS */}
            <div className="relative z-10 flex flex-col flex-1 min-h-dvh">
                <Outlet />
            </div>
        </main>
    );
};

export default PageLayout;
