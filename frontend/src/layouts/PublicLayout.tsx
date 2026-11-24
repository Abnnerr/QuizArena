import { Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

const PublicLayout = () => {
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

            <Outlet />
        </main>
    );
}
export default PublicLayout;