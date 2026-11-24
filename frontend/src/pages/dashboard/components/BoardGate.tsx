import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../contexts/hooks/useAuth";
import Loading from "../../../shared/pages/Loading";

const BoardGate = () => {
    const { logado, user, loading } = useAuth();

    if (loading) {
        return <Loading message="Carregando Dashboard" />
    }
    if (!logado || !user || user.role_name !== "host" && user.role_name !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default BoardGate;