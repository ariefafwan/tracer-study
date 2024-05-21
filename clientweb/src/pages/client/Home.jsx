/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { GuestLayout } from "../../layouts/GuestLayout";
import { Head } from "../../components/Head";
import { useEffect, useState } from "react";
import { CardLowongan } from "../../components/CardLowongan";

export const Home = () => {
    const [card, setCard] = useState([1, 2, 3, 4, 5, 6]);
    return (
        <>
            <Head title="Log in" />
            <GuestLayout>
                <section className="bg-white mx-auto max-w-screen-xl px-8 pb-16 pt-24 lg:py-36">
                    <div className="grid max-w-screen-xl mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12">
                        <div className="lg:mr-auto place-self-center lg:col-span-7 space-y-8">
                            <div className="lg:max-w-2xl space-y-6">
                                <h1 className="text-2xl max-lg:text-center md:text-3xl xl:text-4xl font-medium tracking-tight leading-none">
                                    Selamat Datang!
                                </h1>
                                <h1 className="text-3xl max-lg:text-center md:text-4xl xl:text-5xl font-extrabold tracking-tight leading-none">
                                    Tracer{" "}
                                    <span className="bg-teal-600 rounded-full text-white px-4">
                                        Study
                                    </span>
                                </h1>
                            </div>
                            <p className="max-w-2xl max-lg:text-center mb-6 font-light text-gray-500 lg:mb-8 md:text-lg">
                                Selamat datang di Laman Tracer Study, Direktorat
                                Pemebelajaran dan Kemahasiswaan, Direktorat
                                Jenderal Pendidikan Tinggi. Laman ini
                                diperuntukkan untuk mengelola data hasil tracer
                                study yang dilaksanakan oleh Perguruan Tinggi di
                                Indonesia.
                            </p>
                            <div className="max-w-2xl flex max-lg:justify-center">
                                <a
                                    href="#"
                                    className="inline-flex items-center bg-teal-600 justify-center px-5 py-3 text-base font-medium text-center text-white rounded-lg hover:bg-teal-500"
                                >
                                    Isi Kuisioner &nbsp;
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                            <img
                                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
                                alt="mockup"
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-white">
                    <div className="mx-auto max-w-screen-xl px-8 pt-4 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
                        <div className="mx-auto max-w-lg text-center">
                            <h2 className="text-xl md:text-3xl font-bold sm:text-4xl text-black">
                                Tentang Tracer Study
                            </h2>
                        </div>
                        <div className="flex justify-center mt-6">
                            <p className="text-sm md:text-md text-gray-500 font-normal text-justify">
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Perferendis qui reprehenderit
                                numquam nam autem! Dolorum aspernatur aliquam
                                aut veritatis delectus. Veniam optio repudiandae
                                dolorum atque sapiente aperiam corrupti
                                necessitatibus ad?Lorem ipsum dolor, sit amet
                                consectetur adipisicing elit. Temporibus sint
                                ratione animi soluta sed impedit ab blanditiis
                                totam dolores perferendis debitis, distinctio
                                sequi molestiae molestias fuga harum sapiente
                                modi iusto!Lorem
                            </p>
                        </div>
                    </div>
                </section>
                <section className="bg-white text-black">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                        <div className="mx-auto max-w-lg text-center">
                            <h2 className="text-xl md:text-3xl font-bold sm:text-4xl text-black">
                                Lowongan Pekerjaan
                            </h2>
                        </div>
                        <div className="mt-8 hidden md:grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {card.map((val, i) => {
                                return <CardLowongan key={i}></CardLowongan>;
                            })}
                        </div>
                        <div className="mt-8 max-md:grid hidden grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {card.slice(0, 3).map((val, i) => {
                                return <CardLowongan key={i}></CardLowongan>;
                            })}
                        </div>
                        <div className="mt-12 text-center">
                            <a
                                href="#"
                                className="inline-flex rounded-md bg-teal-600 px-8 text-md py-2 text-sm font-medium text-white transition hover:bg-teal-500 focus:outline-none"
                            >
                                <span className="my-auto">Lihat Lainnya</span>{" "}
                                &nbsp;
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>
            </GuestLayout>
        </>
    );
};
