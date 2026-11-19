import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../pages/home";
import LoginPage from "../pages/auth/pages/Login";
import RegisterPage from "../pages/auth/pages/register";
import ForgotPage from "../pages/auth/pages/forgot";
import ResetPage from "../pages/auth/pages/reset/ResetPage";
import HomeLayout from "../layouts/HomeLayout";
import RoomLobbyPage from "../pages/rooms/pages/lobby";
import NotFoundPage from "../shared/pages/NotFound";
import PlayerNamePage from "../pages/rooms/pages/playerName";
import RoomLivePage from "../pages/rooms/pages/live"
import AuthLayout from "../layouts/AuthLayout";
import RoomCreatePage from "../pages/rooms/pages/RoomCreatePage";
import RankingPage from "../pages/rooms/pages/ranking";
import PageLayout from "../layouts/PageLayout";
import RoomLayout from "../layouts/RoomLayout";
import PublicLayout from "../layouts/PublicLayout";
import UserPage from "../pages/auth/pages/user";
import PodioPage from "../pages/rooms/pages/podio";


export const preloadRoomLivePage = () => {
    import("../pages/rooms/pages/live");
};


const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/auth" element={<AuthLayout />} >
                        <Route path="login" element={<LoginPage />} />
                        <Route path="user" element={<UserPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="forgot-password" element={<ForgotPage />} />
                        <Route path="reset-password/:token" element={<ResetPage />} />
                    </Route>
                    <Route element={<HomeLayout />}>
                        <Route index element={<HomePage />} />
                    </Route>
                    <Route path="/room">
                        <Route path="create" element={<RoomCreatePage />} />
                        <Route path=":roomCode/live" element={<RoomLivePage />} />
                        <Route element={<RoomLayout />}>
                            <Route path="player/username/:roomName" element={<PlayerNamePage />} />
                            <Route path=":roomCode/lobby" element={<RoomLobbyPage />} />
                        </Route>
                    </Route>
                </Route>

                <Route element={<PublicLayout />}>
                    <Route path="/:roomCode/:round/ranking" element={<RankingPage />} />
                    <Route path="/:roomCode/:round/podio" element={<PodioPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;