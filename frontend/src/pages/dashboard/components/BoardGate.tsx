import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../contexts/hooks/useAuth";

const BoardGate = () => {
    const { logado, user, loading} = useAuth();

    if(loading) {
        return <div>carregando...</div>  
    }
    if (!logado || !user  || user.role_name !== "host" &&  user.role_name !== "admin" ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default BoardGate;