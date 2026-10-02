import { BrowserRouter, Route, Routes } from "react-router"
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import AuthLayout from "../layouts/AuthLayout";
import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../pages/Home";
const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/auth">
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<RegisterPage />} />

                    </Route>
                </Route>
                <Route element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;