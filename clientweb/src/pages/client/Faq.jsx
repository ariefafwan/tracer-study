/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { Head } from "../../components/Head";
import { GuestLayout } from "../../layouts/GuestLayout";
import { MainContext } from "../../Context/MainContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader } from "../../components/Loader";

export const Faq = () => {
    const { checkAuth, setCheckAuth } = useContext(MainContext);
    const [intervalTiming, setIntervalTiming] = useState(1000);
    useEffect(() => {
        const interval = setInterval(() => {
            setCheckAuth(true);
            setIntervalTiming(5 * 60 * 1000);
        }, intervalTiming);

        return () => clearInterval(interval);
    }, [checkAuth, setCheckAuth]);

    const [kontenFaq, setKontenFaq] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataFaq, setDataFaq] = useState([]);
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/konten`)
            .then((res) => {
                setKontenFaq(
                    res.data.konten.filter((data) => data.nama == "FAQ")
                );
                setDataFaq([...res.data.faq]);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <>
            <Head title={"FAQs"} />
            <GuestLayout>
                <section className="bg-white mx-auto max-w-screen-xl px-8 pt-24 pb-8 lg:py-32">
                    <div className="container mx-auto">
                        <div className="-mx-4 flex flex-wrap">
                            <div className="w-full max-xs:px-4">
                                <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
                                    <span className="mb-2 block max-xs:text-md text-lg font-semibold text-primary">
                                        FAQs
                                    </span>
                                    <h2 className="max-xs:text-2xl mb-4 text-3xl font-bold text-black sm:text-[40px]/[48px]">
                                        Ada Pertanyaan? Temukan Jawabannya!
                                    </h2>
                                    <p className="max-xs:text-sm text-base text-body-color">
                                        {kontenFaq.length > 0
                                            ? kontenFaq[0].konten
                                            : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid max-xs:grid-cols-1 grid-cols-2 gap-8">
                        {dataFaq.length > 0 ? (
                            dataFaq.map((data, i) => {
                                return (
                                    <>
                                        <div className="w-full">
                                            <details className="group border-s-4 border-green-500 bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden">
                                                <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                                                    <h2 className="max-xs:text-sm text-md font-medium text-gray-900">
                                                        {data.pertanyaan}
                                                    </h2>

                                                    <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </span>
                                                </summary>

                                                <p className="mt-4 text-sm leading-relaxed text-justify text-gray-700">
                                                    {data.jawaban}
                                                </p>
                                            </details>
                                        </div>
                                    </>
                                );
                            })
                        ) : (
                            <div className="col-span-2 flex justify-center">
                                <Loader></Loader>
                            </div>
                        )}
                    </div>
                </section>
            </GuestLayout>
        </>
    );
};
