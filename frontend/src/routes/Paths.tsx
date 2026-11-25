import {  Route, Routes } from "react-router";
import HomePage from "../pages/home";
import LoginPage from "../pages/auth/pages/Login";
import RegisterPage from "../pages/auth/pages/register";
import ForgotPage from "../pages/auth/pages/forgot";
import ResetPage from "../pages/auth/pages/reset/ResetPage";
import HomeLayout from "../layouts/HomeLayout";
import RoomLobbyPage from "../pages/rooms/pages/lobby";
import NotFoundPage from "../shared/pages/NotFound";
import RoomLivePage from "../pages/rooms/pages/live"
import AuthLayout from "../layouts/AuthLayout";
import RankingPage from "../pages/rooms/pages/ranking";
import PageLayout from "../layouts/PageLayout";
import RoomLayout from "../layouts/RoomLayout";
import PublicLayout from "../layouts/PublicLayout";
import PodioPage from "../pages/rooms/pages/podio";
import DashBoardLayout from "../layouts/DashBoardLayout";
import BoardGate from "../pages/dashboard/components/BoardGate";
import BoardRoomsPage from "../pages/dashboard/pages/rooms";
import BoardRoomPage from "../pages/dashboard/pages/rooms/page/BoardRoomPage";
import BoardLibraryPage from "../pages/dashboard/pages/library";
import BoardLibraryDetailsPage from "../pages/dashboard/pages/library/pages/boardLibraryDetail";
import BoardCategoryPage from "../pages/dashboard/pages/library/pages/boardCategoryPage";
import BoardCategoriesPage from "../pages/dashboard/pages/library/pages/boardCategoriesPage";
import BoardHomePage from "../pages/dashboard/home";
import BoardConfigPage from "../pages/dashboard/config";
import Security from "../pages/dashboard/pages/auth/security";
import ChangePassword from "../pages/dashboard/pages/auth/changePassword";


export const preloadRoomLivePage = () => {
    import("../pages/rooms/pages/live");
};


const Paths = () => {
    return (
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/auth" element={<AuthLayout />} >
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="forgot-password" element={<ForgotPage />} />
                        <Route path="reset-password/:token" element={<ResetPage />} />
                    </Route>
                    <Route element={<HomeLayout />}>
                        <Route index element={<HomePage />} />
                    </Route>
                    <Route path="/room">
                        <Route path=":roomCode/live" element={<RoomLivePage />} />
                        <Route element={<RoomLayout />}>
                            <Route path=":roomCode/lobby" element={<RoomLobbyPage />} />
                        </Route>
                    </Route>
                </Route>
                <Route element={<BoardGate />}>
                    <Route path="/dashboard" element={<DashBoardLayout />}>
                        <Route index element={<BoardHomePage />} />
                        <Route path="config" element={<BoardConfigPage />} />
                        <Route path="security" element={<Security />} />
                        <Route path="changePassword" element={<ChangePassword />} />
                        <Route path="library" element={<BoardLibraryPage />} />
                        <Route path="library/:libraryId" element={<BoardLibraryDetailsPage />} />
                        <Route path="library/:libraryId/category/:categoryId" element={<BoardCategoryPage />} />
                        <Route path="categories" element={<BoardCategoriesPage />} />
                        <Route path="rooms" element={<BoardRoomsPage />} />
                        <Route path="rooms/:roomCode" element={<BoardRoomPage />} />
                    </Route>
                </Route>
                <Route element={<PublicLayout />}>
                    <Route path="/:roomCode/:round/ranking" element={<RankingPage />} />
                    <Route path="/:roomCode/:round/podio" element={<PodioPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
    );
}

export default Paths;