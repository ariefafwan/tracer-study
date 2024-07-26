/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { Head } from "../../components/Head";
import { GuestLayout } from "../../layouts/GuestLayout";
import axios from "axios";
import Cookies from "js-cookie";
import { CardLowongan } from "../../components/CardLowongan";
import { MainContext } from "../../Context/MainContext";
import { Loader } from "../../components/Loader";

export const Lowongan = () => {
    const { checkAuth, setCheckAuth } = useContext(MainContext);
    const [intervalTiming, setIntervalTiming] = useState(1000);
    useEffect(() => {
        const interval = setInterval(() => {
            setCheckAuth(true);
            setIntervalTiming(5 * 60 * 1000);
        }, intervalTiming);

        return () => clearInterval(interval);
    }, [checkAuth, setCheckAuth]);

    const [ordering, setOrdering] = useState("");
    const [dataLowongan, setDataLowongan] = useState({
        current_page: 1,
        data: [],
        first_page_url: "",
        from: 1,
        last_page: 1,
        last_page_url: "",
        links: "",
        next_page_url: null,
        path: "",
        per_page: 10,
        prev_page_url: null,
        to: 2,
        total: 1,
    });
    const [loading, setLoading] = useState(true);
    const [kontenLowongan, setKontenLowongan] = useState([]);

    useEffect(() => {
        if (loading == true) {
            axios
                .get(
                    `${
                        import.meta.env.VITE_ALL_BASE_URL
                    }/client/lowongan?ordering=${ordering}`
                )
                .then((res) => {
                    setDataLowongan({
                        current_page: res.data.current_page,
                        data: [...res.data.data],
                        first_page_url: res.data.first_page_url,
                        from: res.data.from,
                        last_page: res.data.last_page,
                        last_page_url: res.data.last_page_url,
                        links: res.data.links,
                        next_page_url: res.data.next_page_url,
                        path: res.data.path,
                        per_page: res.data.per_page,
                        prev_page_url: res.data.prev_page_url,
                        to: res.data.to,
                        total: res.data.total,
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [loading, setLoading]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/konten`)
            .then((res) => {
                setKontenLowongan(
                    res.data.konten.filter(
                        (data) => data.nama == "Lowongan Pekerjaan"
                    )
                );
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <Head title="Lowongan Pekerjaan" />
            <GuestLayout>
                <section className="bg-white mx-auto max-w-screen-xl px-8 pb-16 pt-24 lg:py-36">
                    <div className="w-full">
                        <header>
                            <h2 className="text-xl max-lg:text-center font-bold text-gray-900 sm:text-3xl">
                                Lowongan Pekerjaan
                            </h2>

                            <p className="mt-4 max-lg:text-sm max-lg:text-center max-lg:max-w-full max-w-md text-gray-500">
                                {kontenLowongan.length > 0
                                    ? kontenLowongan[0].konten
                                    : ""}
                            </p>
                        </header>

                        <div className="mt-8 block lg:hidden">
                            <button className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
                                <span className="text-sm font-medium">
                                    {" "}
                                    Filters & Sorting{" "}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-4 rtl:rotate-180"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
                            <div className="hidden space-y-4 lg:block">
                                <div>
                                    <label
                                        htmlFor="SortBy"
                                        className="block text-xs font-medium text-gray-700"
                                    >
                                        {" "}
                                        Sort By{" "}
                                    </label>

                                    <select
                                        id="SortBy"
                                        value={ordering}
                                        onChange={(e) => {
                                            setOrdering(e.target.value);
                                            setLoading(true);
                                        }}
                                        className="mt-1 rounded border-gray-300 text-sm"
                                    >
                                        <option value="">A-Z</option>
                                        <option value="Z-A">Z-A</option>
                                    </select>
                                </div>

                                <div>
                                    <p className="block text-xs font-medium text-gray-700">
                                        Filters
                                    </p>

                                    <div className="mt-1 space-y-2">
                                        <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                                            <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                                                <span className="text-sm font-medium">
                                                    Program Studi
                                                </span>
                                                <span className="transition group-open:-rotate-180">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </span>
                                            </summary>

                                            <div className="border-t border-gray-200 bg-white">
                                                <header className="flex items-center justify-between p-4">
                                                    <span className="text-sm text-gray-700">
                                                        {" "}
                                                        0 Selected{" "}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="text-sm text-gray-900 underline underline-offset-4"
                                                    >
                                                        Reset
                                                    </button>
                                                </header>

                                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                                    <li>
                                                        <label
                                                            htmlFor="FilterInStock"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterInStock"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                In Stock (5+){" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterPreOrder"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterPreOrder"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Pre Order (3+){" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterOutOfStock"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterOutOfStock"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Out of Stock
                                                                (10+){" "}
                                                            </span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </details>

                                        <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                                            <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                                                <span className="text-sm font-medium">
                                                    Bidang Usaha
                                                </span>

                                                <span className="transition group-open:-rotate-180">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </span>
                                            </summary>

                                            <div className="border-t border-gray-200 bg-white">
                                                <header className="flex items-center justify-between p-4">
                                                    <span className="text-sm text-gray-700">
                                                        {" "}
                                                        The highest price is
                                                        $600{" "}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="text-sm text-gray-900 underline underline-offset-4"
                                                    >
                                                        Reset
                                                    </button>
                                                </header>

                                                <div className="border-t border-gray-200 p-4">
                                                    <div className="flex justify-between gap-4">
                                                        <label
                                                            htmlFor="FilterPriceFrom"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="text-sm text-gray-600">
                                                                $
                                                            </span>

                                                            <input
                                                                type="number"
                                                                id="FilterPriceFrom"
                                                                placeholder="From"
                                                                className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                            />
                                                        </label>

                                                        <label
                                                            htmlFor="FilterPriceTo"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="text-sm text-gray-600">
                                                                $
                                                            </span>

                                                            <input
                                                                type="number"
                                                                id="FilterPriceTo"
                                                                placeholder="To"
                                                                className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                        <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                                            <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                                                <span className="text-sm font-medium">
                                                    Periode
                                                </span>
                                                <span className="transition group-open:-rotate-180">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </span>
                                            </summary>

                                            <div className="border-t border-gray-200 bg-white">
                                                <header className="flex items-center justify-between p-4">
                                                    <span className="text-sm text-gray-700">
                                                        {" "}
                                                        0 Selected{" "}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="text-sm text-gray-900 underline underline-offset-4"
                                                    >
                                                        Reset
                                                    </button>
                                                </header>

                                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                                    <li>
                                                        <label
                                                            htmlFor="FilterRed"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterRed"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Red{" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterBlue"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterBlue"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Blue{" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterGreen"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterGreen"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Green{" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterOrange"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterOrange"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Orange{" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterPurple"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterPurple"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Purple{" "}
                                                            </span>
                                                        </label>
                                                    </li>

                                                    <li>
                                                        <label
                                                            htmlFor="FilterTeal"
                                                            className="inline-flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id="FilterTeal"
                                                                className="size-5 rounded border-gray-300"
                                                            />

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {" "}
                                                                Teal{" "}
                                                            </span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {loading == true ? (
                                        <div className="lg:col-span-3 sm:col-span-2 flex justify-center w-full h-full">
                                            <Loader></Loader>
                                        </div>
                                    ) : (
                                        dataLowongan.data.map((val, i) => {
                                            return (
                                                <CardLowongan
                                                    data={val}
                                                    key={i}
                                                ></CardLowongan>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </GuestLayout>
        </>
    );
};
