import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/pages/LoginPage";
import RegisterPage from "../pages/auth/pages/RegisterPage";
import ForgotPage from "../pages/auth/pages/ForgotPage";
import ResetPage from "../pages/auth/pages/ResetPage";
import HomeLayout from "../layouts/HomeLayout";
import RoomCreatePage from "../pages/rooms/pages/RoomCreatePage";
import RoomLobbyPage from "../pages/rooms/pages/RoomLobbyPage";
import NotFoundPage from "../shared/pages/NotFound";

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" >
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPage />} />
                    <Route path="reset-password/:token" element={<ResetPage />} />
                </Route>
                <Route element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/room">
                    <Route path="create" element={<RoomCreatePage />} />
                    <Route path="lobby" element={<RoomLobbyPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;