import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
    const location = useLocation();
    const [menuPertanyaan, setMenuPertanyaan] = useState(false);
    const [menuPengguna, setMenuPengguna] = useState(false);
    const [menuKonten, setMenuKonten] = useState(false);
    const [menuMaster, setMenuMaster] = useState(false);

    useEffect(() => {
        setMenuKonten(false);
        setMenuPertanyaan(false);
        setMenuPengguna(false);
        setMenuMaster(false);
        if (
            location.pathname == "/master/program-studi" ||
            location.pathname == "/master/fakultas"
        ) {
            setMenuMaster((menuMaster) => !menuMaster);
        } else if (
            location.pathname == "/pengguna/alumni" ||
            location.pathname == "/pengguna/dosen"
        ) {
            setMenuPengguna((menuPengguna) => !menuPengguna);
        } else if (
            location.pathname == "/konten/lowongan" ||
            location.pathname == "/konten/konten-website" ||
            location.pathname == "/konten/faq"
        ) {
            setMenuKonten((menuKonten) => !menuKonten);
        } else if (
            location.pathname == "/petanyaan/kategori" ||
            location.pathname == "/pertanyaan/pertanyaan" ||
            location.pathname == "/pengguna/statistik"
        ) {
            setMenuPertanyaan((menuPertanyaan) => !menuPertanyaan);
        }
    }, [location]);

    return (
        <>
            <aside className="fixed top-0 left-0 z-40 w-72 py-3 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                    <div>
                        <Link to={"/"} className="flex ms-2 md:me-24">
                            <img
                                src="https://flowbite.com/docs/images/logo.svg"
                                className="h-8 me-3"
                                alt="FlowBite Logo"
                            />
                            <span className="self-center text-xl font-semibold whitespace-nowrap">
                                Tracer Study
                            </span>
                        </Link>
                    </div>
                    <ul className="space-y-2 px-2 font-medium pt-8">
                        <li>
                            <Link
                                to={"/dashboard"}
                                className={
                                    (location.pathname == "/dashboard"
                                        ? "bg-teal-500"
                                        : "") +
                                    " flex items-center p-2 text-black rounded-lg hover:bg-teal-500"
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-black transition duration-75 group-hover:text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                                    />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() =>
                                    setMenuPengguna(
                                        (menuPengguna) => !menuPengguna
                                    )
                                }
                                className="flex items-center w-full p-2 text-base text-black transition duration-75 rounded-lg group hover:bg-teal-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-black transition duration-75 group-hover:text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                    />
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                    Pengguna
                                </span>
                                <svg
                                    className={
                                        (menuPengguna ? "rotate-180" : "") +
                                        " w-3 h-3 transition duration-75"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={
                                    (menuPengguna ? "" : "hidden") +
                                    " py-2 space-y-2"
                                }
                            >
                                <li>
                                    <Link
                                        to={"/pengguna/alumni"}
                                        className={
                                            (location.pathname ==
                                            "/pengguna/alumni"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Alumni Tedaftar
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/pengguna/dosen"}
                                        className={
                                            (location.pathname ==
                                            "/pengguna/dosen"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Dosen Terdaftar
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() =>
                                    setMenuMaster((menuMaster) => !menuMaster)
                                }
                                className="flex items-center w-full p-2 text-base text-black transition duration-75 rounded-lg group hover:bg-teal-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-black transition duration-75 group-hover:text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                                    />
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                    Master
                                </span>
                                <svg
                                    className={
                                        (menuMaster ? "rotate-180" : "") +
                                        " w-3 h-3 transition duration-75"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={
                                    (menuMaster ? "" : "hidden") +
                                    " py-2 space-y-2"
                                }
                            >
                                <li>
                                    <Link
                                        to={"/master/fakultas"}
                                        className={
                                            (location.pathname ==
                                            "/master/fakultas"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Fakultas
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/master/program-studi"}
                                        className={
                                            (location.pathname ==
                                            "/master/program-studi"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Program Studi
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() =>
                                    setMenuPertanyaan(
                                        (menuPertanyaan) => !menuPertanyaan
                                    )
                                }
                                className="flex items-center w-full p-2 text-base text-black transition duration-75 rounded-lg group hover:bg-teal-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="flex-shrink-0 w-5 h-5 text-black transition duration-75 group-hover:text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                                    />
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                    Pertanyaan
                                </span>
                                <svg
                                    className={
                                        (menuPertanyaan ? "rotate-180" : "") +
                                        " w-3 h-3 transition duration-75"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={
                                    (menuPertanyaan ? "" : "hidden") +
                                    " py-2 space-y-2"
                                }
                            >
                                <li>
                                    <Link
                                        to={"/pertanyaan/kategori-pertanyaan"}
                                        className={
                                            (location.pathname ==
                                            "/pertanyaan/kategori-pertanyaan"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Kategori
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/petanyaan/pertanyaan"}
                                        className={
                                            (location.pathname ==
                                            "/pertanyaan/pertanyaan"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Pertanyaan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/pertanyaan/statistik"}
                                        className={
                                            (location.pathname ==
                                            "/pertanyaan/statistik"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Statistik
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={() =>
                                    setMenuKonten((menuKonten) => !menuKonten)
                                }
                                className="flex items-center w-full p-2 text-base text-black transition duration-75 rounded-lg group hover:bg-teal-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-black transition duration-75 group-hover:text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                    />
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                    Konten
                                </span>
                                <svg
                                    className={
                                        (menuKonten ? "rotate-180" : "") +
                                        " w-3 h-3 transition duration-75"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={
                                    (menuKonten ? "" : "hidden") +
                                    " py-2 space-y-2"
                                }
                            >
                                <li>
                                    <Link
                                        to={"/konten/lowongan"}
                                        className={
                                            (location.pathname ==
                                            "/konten/lowongan"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Lowongan Pekerjaan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/konten/faq"}
                                        className={
                                            (location.pathname == "/konten/faq"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        FAQ's
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/konten/konten-website"}
                                        className={
                                            (location.pathname ==
                                            "/konten/konten-website"
                                                ? "bg-teal-500"
                                                : "") +
                                            " flex items-center text-sm w-full p-2 text-black transition duration-75 rounded-lg pl-11 group hover:bg-teal-500"
                                        }
                                    >
                                        Konten Website
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link
                                to={"/profile"}
                                className={
                                    (location.pathname == "/profile"
                                        ? "bg-teal-500"
                                        : "") +
                                    " flex items-center p-2 text-black rounded-lg hover:bg-teal-500"
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 text-black transition duration-75 group-hover:text-black"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                                    />
                                </svg>
                                <span className="ms-3">Profile</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};
