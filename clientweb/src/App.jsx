import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import Welcome from "./Pages/Welcome";
import Login from "./pages/auth/Login";
import { Home } from "./pages/client/Home";
import { NoAuthenticated } from "./routes/NoAuthenticated";
import { Lowongan } from "./pages/client/Lowongan";
import { Faq } from "./pages/client/Faq";
import { Dashboard } from "./pages/dashboard/Dashboard";

const ErrorPage = () => {
    return (
        <>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for could not be found.</p>
        </>
    );
};

function App() {
    return (
        <>
            <BrowserRouter>
                {/* <MainProvider> */}
                <Routes>
                    <Route path="/" element={<Home></Home>}></Route>
                    <Route
                        path="/lowongan"
                        element={<Lowongan></Lowongan>}
                    ></Route>
                    <Route path="/faq" element={<Faq></Faq>}></Route>
                    <Route
                        path="/login"
                        element={
                            <NoAuthenticated>
                                <Login></Login>
                            </NoAuthenticated>
                        }
                    ></Route>
                    <Route
                        path="/dashboard"
                        element={<Dashboard></Dashboard>}
                    ></Route>
                    <Route path="*" element={<ErrorPage />}></Route>
                </Routes>
                {/* </MainProvider> */}
            </BrowserRouter>
        </>
    );
}

export default App;
