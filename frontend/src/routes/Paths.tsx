import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

const AuthLayout = lazy(() => import("../layouts/AuthLayout"))
const HomeLayout = lazy(() => import("../layouts/HomeLayout"))

const HomePage = lazy(() => import("../pages/home/HomePage"));

const LoginPage = lazy(() => import("../pages/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/pages/RegisterPage"));
const ForgotPage = lazy(() => import("../pages/auth/pages/ForgotPage"));
const ResetPage = lazy(() => import("../pages/auth/pages/ResetPage"));

const RoomLobbyPage = lazy(() => import("../pages/rooms/pages/RoomLobbyPage"));
const PlayerNamePage = lazy(() => import("../pages/rooms/pages/PlayerNamePage"));
const RoomStartPage = lazy(() => import("../pages/rooms/pages/RoomStartPage"));
const RoomLivePage = lazy(() => import("../pages/rooms/pages/RoomLivePage"));
const RoomCreatePage = lazy(() => import("../pages/rooms/pages/RoomCreatePage"));

const RankingPage = lazy(() => import("../pages/rooms/pages/RankingPage"));
const PodioPage = lazy(() => import("../pages/rooms/pages/PodioPage"));

const NotFoundPage = lazy(() => import("../shared/pages/NotFound"));

const Paths = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Carregando página...</div>}>
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
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
                        <Route path="player/username/:roomName" element={<PlayerNamePage />} />
                        <Route path=":roomCode/lobby" element={<RoomLobbyPage />} />
                        <Route path=":roomCode/start" element={<RoomStartPage />} />
                        <Route path=":roomCode/live" element={<RoomLivePage />} />
                    </Route>

                    <Route path="/:roomCode/:round/ranking" element={<RankingPage />} />
                    <Route path="/:roomCode/:round/podio" element={<PodioPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default Paths;