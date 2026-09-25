import { BrowserRouter, Route, Routes } from "react-router"
import Home from "../pages/Home";
const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;