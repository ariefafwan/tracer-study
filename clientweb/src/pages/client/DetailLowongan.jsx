/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { Head } from "../../components/Head";
import { GuestLayout } from "../../layouts/GuestLayout";
import { MainContext } from "../../Context/MainContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader } from "../../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";

export const DetailLowongan = () => {
    let { id } = useParams();
    const { checkAuth, setCheckAuth } = useContext(MainContext);
    const [intervalTiming, setIntervalTiming] = useState(1000);
    useEffect(() => {
        const interval = setInterval(() => {
            setCheckAuth(true);
            setIntervalTiming(5 * 60 * 1000);
        }, intervalTiming);

        return () => clearInterval(interval);
    }, [checkAuth, setCheckAuth]);

    const [loading, setLoading] = useState(true);
    const [dataLowongan, setDataLowongan] = useState({
        id: "",
        bidang_usaha: "",
        data_kualifikasi_prodi: [],
        data_kualifikasi_umum: [],
        desk: "",
        judul_lowongan: "",
        kota: "",
        link_lowongan: "",
        logo_perusahaan: "",
        nama_perusahaan: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
    });

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/client/detail_lowongan/${id}`
            )
            .then((res) => {
                setDataLowongan(res.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                alert(error);
            });
    }, []);

    const tanggal = (value) => {
        return new Date(value).toLocaleString("id", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <Head title={"FAQs"} />
            <GuestLayout>
                <section className="bg-white mx-auto max-w-screen-xl px-8 pt-20 pb-8 lg:py-20">
                    <div className="container mx-auto">
                        <div className="-mx-4 flex flex-wrap">
                            {loading ? (
                                <div className="w-full flex justify-center">
                                    <Loader />
                                </div>
                            ) : (
                                <div className="bg-white antialiased">
                                    <div className="max-w-screen-xl px-8 mx-auto 2xl:px-0">
                                        <div className="w-full">
                                            <img
                                                className="h-24 w-24 mb-2"
                                                src={
                                                    dataLowongan.logo_perusahaan !==
                                                        null ||
                                                    dataLowongan.logo_perusahaan !==
                                                        ""
                                                        ? `${
                                                              import.meta.env
                                                                  .VITE_AUTH_MAIN_BASE_URL
                                                          }/storage/Logo/${
                                                              dataLowongan.logo_perusahaan
                                                          }`
                                                        : "/loading.jpg"
                                                }
                                                alt=""
                                            />
                                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                                {dataLowongan.judul_lowongan}
                                            </h1>
                                            <div className="mt-2 sm:items-center sm:gap-4 sm:flex">
                                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                                                        />
                                                    </svg>

                                                    <p className="text-sm font-medium leading-none text-gray-500">
                                                        {
                                                            dataLowongan.nama_perusahaan
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:items-center sm:gap-4 sm:flex">
                                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                                                        />
                                                    </svg>

                                                    <p className="text-sm font-medium leading-none text-gray-500">
                                                        {
                                                            dataLowongan.bidang_usaha
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:items-center sm:gap-4 sm:flex">
                                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                                        />
                                                    </svg>
                                                    <p className="text-sm font-medium leading-none text-gray-500">
                                                        {dataLowongan.kota}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:items-center sm:gap-4 sm:flex">
                                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>

                                                    <p className="text-sm font-medium leading-none text-gray-500">
                                                        {tanggal(
                                                            dataLowongan.tanggal_mulai
                                                        )}{" "}
                                                        -{" "}
                                                        {tanggal(
                                                            dataLowongan.tanggal_selesai
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:gap-4 sm:items-center sm:flex">
                                                <a
                                                    href={
                                                        dataLowongan.link_lowongan
                                                    }
                                                    target="_blank"
                                                    className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-teal-500 rounded-lg hover:bg-teal-700 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                                    role="button"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-5 h-5 -ms-2 me-2"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                                                        />
                                                    </svg>
                                                    Lamar Sekarang
                                                </a>
                                            </div>
                                            <hr className="my-3 border-gray-200" />
                                            <p className="mb-4 text-gray-500">
                                                {dataLowongan.desk}
                                            </p>
                                            <hr className="my-3 border-gray-200" />
                                            <div className="w-full">
                                                <h6 className="font-semibold text-sm mb-4">
                                                    Kualifikasi Umum
                                                </h6>
                                                <ul className="mb-4 list-disc list-inside text-gray-500">
                                                    {dataLowongan.data_kualifikasi_umum.map(
                                                        (data, index) => (
                                                            <li
                                                                className="mb-2"
                                                                key={index}
                                                            >
                                                                {
                                                                    data.kualifikasi
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                            {dataLowongan.data_kualifikasi_prodi
                                                .length > 0 ? (
                                                <>
                                                    <hr className="my-3 border-gray-200" />
                                                    <div className="w-full">
                                                        <h6 className="font-semibold text-sm mb-4">
                                                            Kualifikasi Program
                                                            Studi
                                                        </h6>
                                                        <p className="mb-4 text-gray-500">
                                                            {dataLowongan.data_kualifikasi_prodi.map(
                                                                (
                                                                    data,
                                                                    index
                                                                ) => {
                                                                    return `${data.data_prodi.nama}, `;
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </GuestLayout>
        </>
    );
};
