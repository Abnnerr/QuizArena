import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "../pages/home";
import LoginPage from "../pages/auth/pages/LoginPage";
import RegisterPage from "../pages/auth/pages/RegisterPage";
import ForgotPage from "../pages/auth/pages/ForgotPage";
import ResetPage from "../pages/auth/pages/ResetPage";

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
                <Route index element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;