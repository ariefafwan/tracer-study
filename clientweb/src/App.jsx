import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import Welcome from "./Pages/Welcome";
import Login from "./pages/auth/Login";
import { Home } from "./pages/client/Home";
import { NoAuthenticated } from "./routes/NoAuthenticated";
import { Authenticated } from "./routes/Authenticated";
import { Lowongan } from "./pages/client/Lowongan";
import { Faq } from "./pages/client/Faq";
import { Fakultas } from "./pages/dashboard/master/Fakultas";
import { ProgramStudi } from "./pages/dashboard/master/ProgramStudi";
import { Alumni } from "./pages/dashboard/pengguna/Alumni";
import { Dosen } from "./pages/dashboard/pengguna/Dosen";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { MasterFAQ } from "./pages/dashboard/konten/MasterFAQ";
import { MasterKonten } from "./pages/dashboard/konten/MasterKonten";
import { MasterLowongan } from "./pages/dashboard/konten/MasterLowongan/MasterLowongan";
import { KategoriPertanyaan } from "./pages/dashboard/pertanyaan/KategoriPertanyaan";
// import { Statistik } from "./pages/dashboard/hasil/Statistik";
import { Profile } from "./pages/dashboard/Profile";
import { MainProvider } from "./Context/MainContext";
import { EditLowongan } from "./pages/dashboard/konten/MasterLowongan/EditLowongan";
import { CreateLowongan } from "./pages/dashboard/konten/MasterLowongan/CreateLowongan";
import { CreatePertanyaan } from "./pages/dashboard/pertanyaan/Pertanyaan/CreatePertanyaan";
import { EditPertanyaan } from "./pages/dashboard/pertanyaan/Pertanyaan/EditPertanyaan";
import { Kuisioner } from "./pages/client/Kuisioner";
import { HasilPertanyaan } from "./pages/dashboard/hasil/HasilPertanyaan";
import { ShowHasilKuisioner } from "./pages/dashboard/hasil/ShowHasilKuisioner";
import { MasterPertanyaan } from "./pages/dashboard/pertanyaan/Pertanyaan/MasterPertanyaan";
import { MasterStatistik } from "./pages/dashboard/hasil/Statistik/MasterStatistik";
import { StatistikPerKategori } from "./pages/dashboard/hasil/Statistik/StatistikPerKategori";
import { StatistikPerPertanyaan } from "./pages/dashboard/hasil/Statistik/StatistikPerPertanyaan";
import { DetailLowongan } from "./pages/client/DetailLowongan";

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
                <MainProvider>
                    <Routes>
                        <Route path="/" element={<Home></Home>}></Route>
                        <Route
                            path="/lowongan"
                            element={<Lowongan></Lowongan>}
                        ></Route>
                        <Route path="/faq" element={<Faq></Faq>}></Route>
                        <Route
                            path="/kuisioner"
                            element={<Kuisioner></Kuisioner>}
                        ></Route>
                        <Route
                            path="/lowongan/detail/:id"
                            element={<DetailLowongan></DetailLowongan>}
                        ></Route>
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
                            element={
                                <Authenticated>
                                    <Dashboard></Dashboard>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/profile"
                            element={
                                <Authenticated>
                                    <Profile></Profile>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/master/fakultas"
                            element={
                                <Authenticated>
                                    <Fakultas></Fakultas>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/master/program-studi"
                            element={
                                <Authenticated>
                                    <ProgramStudi></ProgramStudi>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/pengguna/alumni"
                            element={
                                <Authenticated>
                                    <Alumni></Alumni>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/pengguna/dosen"
                            element={
                                <Authenticated>
                                    <Dosen></Dosen>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/konten/faq"
                            element={
                                <Authenticated>
                                    <MasterFAQ></MasterFAQ>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/konten/konten-website"
                            element={
                                <Authenticated>
                                    <MasterKonten></MasterKonten>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/konten/lowongan"
                            element={
                                <Authenticated>
                                    <MasterLowongan></MasterLowongan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/konten/lowongan/create"
                            element={
                                <Authenticated>
                                    <CreateLowongan></CreateLowongan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/konten/lowongan/edit/:slug"
                            element={
                                <Authenticated>
                                    <EditLowongan></EditLowongan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/pertanyaan/kategori-pertanyaan"
                            element={
                                <Authenticated>
                                    <KategoriPertanyaan></KategoriPertanyaan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/pertanyaan/pertanyaan"
                            element={
                                <Authenticated>
                                    <MasterPertanyaan></MasterPertanyaan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/pertanyaan/pertanyaan/create"
                            element={
                                <Authenticated>
                                    <CreatePertanyaan></CreatePertanyaan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/pertanyaan/pertanyaan/edit/:id"
                            element={
                                <Authenticated>
                                    <EditPertanyaan></EditPertanyaan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/hasil/hasil-kuisioner"
                            element={
                                <Authenticated>
                                    <HasilPertanyaan></HasilPertanyaan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/hasil/hasil-kuisioner/:id"
                            element={
                                <Authenticated>
                                    <ShowHasilKuisioner></ShowHasilKuisioner>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/hasil/statistik"
                            element={
                                <Authenticated>
                                    <MasterStatistik></MasterStatistik>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/hasil/statistik/per-kategori/:id/:tahun_lulus"
                            element={
                                <Authenticated>
                                    <StatistikPerKategori></StatistikPerKategori>
                                </Authenticated>
                            }
                        ></Route>
                        <Route
                            path="/hasil/statistik/per-pertanyaan/:id/:tahun_lulus"
                            element={
                                <Authenticated>
                                    <StatistikPerPertanyaan></StatistikPerPertanyaan>
                                </Authenticated>
                            }
                        ></Route>
                        <Route path="*" element={<ErrorPage />}></Route>
                    </Routes>
                </MainProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
