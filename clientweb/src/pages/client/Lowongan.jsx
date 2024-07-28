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
import Select from "react-select";

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
    const [dataProgramStudi, setDataProgramStudi] = useState([]);
    const [dataBidangUsaha, setDataBidangUsaha] = useState([]);
    const [filterProgramStudi, setFilterProgramStudi] = useState([]);
    const [filterBidangUsaha, setFilterBidangUsaha] = useState("");

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
    const [filterTanggalDari, setFilterTanggalDari] = useState("");
    const [filterTanggalKe, setFilterTanggalKe] = useState("");
    const [reloadTable, setReloadTable] = useState(false);

    useEffect(() => {
        setLoading(true);
        setReloadTable(false);
        if (filterTanggalDari == "" && filterTanggalKe !== "") {
            setFilterTanggalDari(filterTanggalKe);
        } else if (filterTanggalKe == "" && filterTanggalDari !== "") {
            setFilterTanggalKe(filterTanggalDari);
        } else if (filterTanggalDari > filterTanggalKe) {
            let tanggalke = filterTanggalKe;
            setFilterTanggalKe(filterTanggalDari);
            setFilterTanggalDari(tanggalke);
        }
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/client/lowongan?ordering=${ordering}&daritanggal=${filterTanggalDari}&ketanggal=${filterTanggalKe}&bidang_usaha=${filterBidangUsaha}&prodi=${
                    filterProgramStudi.length > 0 ? filterProgramStudi : ""
                }`
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
                setLoading(false);
                alert(error);
            });
    }, [
        ordering,
        setOrdering,
        reloadTable,
        setReloadTable,
        filterBidangUsaha,
        setFilterBidangUsaha,
        filterProgramStudi,
        setFilterProgramStudi,
    ]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/data`)
            .then((res) => {
                setDataBidangUsaha(res.data.bidang_usaha);
                setDataProgramStudi(res.data.program_studi);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/konten`)
            .then((res) => {
                setKontenLowongan(
                    res.data.konten.filter(
                        (data) => data.nama == "Lowongan Pekerjaan"
                    )
                );
            })
            .catch((error) => {
                alert(error);
            });
    }, []);

    const aturFilterProdi = (e, id) => {
        if (e.target.checked == true) {
            setFilterProgramStudi([...filterProgramStudi, id]);
        } else {
            setFilterProgramStudi(
                filterProgramStudi.filter((data) => data != id)
            );
        }
    };

    // useEffect(() => {
    //     if (filterProgramStudi.length > 0) {
    //         console.log(filterProgramStudi);
    //     }
    // }, [filterProgramStudi]);

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
                                        onChange={(e) =>
                                            setOrdering(e.target.value)
                                        }
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
                                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                                    {dataProgramStudi.map(
                                                        (data) => (
                                                            <li key={data.id}>
                                                                <label
                                                                    htmlFor={
                                                                        data.id
                                                                    }
                                                                    className="inline-flex items-center gap-2"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        id={
                                                                            data.id
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            aturFilterProdi(
                                                                                e,
                                                                                data.id
                                                                            )
                                                                        }
                                                                        value={filterProgramStudi.includes(
                                                                            data.id
                                                                        )}
                                                                        checked={filterProgramStudi.includes(
                                                                            data.id
                                                                        )}
                                                                        className="size-5 rounded border-gray-300"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {
                                                                            data.nama
                                                                        }
                                                                    </span>
                                                                </label>
                                                            </li>
                                                        )
                                                    )}
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
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFilterBidangUsaha(
                                                                ""
                                                            );
                                                        }}
                                                        className="text-sm text-gray-900 underline underline-offset-4"
                                                    >
                                                        Reset
                                                    </button>
                                                </header>

                                                <div className="border-t border-gray-200 bg-white">
                                                    <ul className="space-y-1 border-t border-gray-200 p-4">
                                                        {dataBidangUsaha.map(
                                                            (data, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="mb-3"
                                                                >
                                                                    <label
                                                                        htmlFor={
                                                                            data.bidang_usaha
                                                                        }
                                                                        className="inline-flex text-xs items-center gap-2"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            id={
                                                                                data.bidang_usaha
                                                                            }
                                                                            onChange={() => {
                                                                                setFilterBidangUsaha(
                                                                                    data.bidang_usaha
                                                                                );
                                                                            }}
                                                                            checked={
                                                                                filterBidangUsaha ===
                                                                                data.bidang_usaha
                                                                            }
                                                                            name="filter_bidang_usaha"
                                                                            className="rounded border-gray-300"
                                                                        />
                                                                        <span className="text-xs font-medium text-gray-700">
                                                                            {
                                                                                data.bidang_usaha
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
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

                                            <div className="border-t border-gray-200 bg-white w-full">
                                                <div className="space-y-1 border-t border-gray-200 p-4">
                                                    <div className="block w-full text-xs">
                                                        <p className="m-auto text-xs font-semibold">
                                                            Dari
                                                        </p>
                                                        <div className="relative">
                                                            <input
                                                                type="date"
                                                                id="tanggal"
                                                                value={
                                                                    filterTanggalDari
                                                                }
                                                                onChange={(e) =>
                                                                    setFilterTanggalDari(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="h-full border block appearance-none w-full bg-white border-gray-300 text-black py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                                placeholder="Tanggal.."
                                                            />
                                                        </div>
                                                        <p className="m-auto text-xs font-semibold">
                                                            Ke
                                                        </p>
                                                        <div className="relative">
                                                            <input
                                                                type="date"
                                                                id="tanggal"
                                                                value={
                                                                    filterTanggalKe
                                                                }
                                                                onChange={(e) =>
                                                                    setFilterTanggalKe(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="h-full border block appearance-none w-full bg-white border-gray-300 text-black py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                                placeholder="Tanggal.."
                                                            />
                                                        </div>
                                                        <button
                                                            className="m-auto mt-4"
                                                            type="button"
                                                            onClick={() => {
                                                                setReloadTable(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-6 h-6 bg-green-600 text-white rounded-full"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="m-auto px-1"
                                                            type="button"
                                                            onClick={() => {
                                                                setFilterTanggalDari(
                                                                    ""
                                                                );
                                                                setFilterTanggalKe(
                                                                    ""
                                                                );
                                                                setReloadTable(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-6 h-6 bg-red-600 text-white rounded-full"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
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
