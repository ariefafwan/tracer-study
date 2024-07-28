/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { TableData } from "../../../components/TableData";
import { ButtonEdit } from "../../../components/ButtonEdit";
import { ButtonDelete } from "../../../components/ButtonDelete";
import { ButtonPagination } from "../../../components/ButtonPagination";
import { ModalPrimary } from "../../../components/ModalPrimary";
import { Loader } from "../../../components/Loader";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Select from "react-select";

export const HasilPertanyaan = () => {
    let navigate = useNavigate();

    const [fakultas, setFakultas] = useState("");
    const [fakultasAlumni, setFakultasAlumni] = useState([]);

    const [prodi, setProdi] = useState("");
    const [prodiAll, setProdiAll] = useState([]);
    const [prodiAlumni, setProdiAlumni] = useState([]);

    const [loader, setLoader] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const [buttonPage, setButtonPage] = useState([]);
    let [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterTanggalDari, setFilterTanggalDari] = useState("");
    const [filterTanggalKe, setFilterTanggalKe] = useState("");

    const [filterTahunLulus, setFilterTahunLulus] = useState({
        value: "",
        label: "Lulusan",
    });

    const [pilihanTahun, setPilihanTahun] = useState([]);

    useEffect(() => {
        const createYear = (start, stop, step) =>
            Array.from(
                { length: (stop - start) / step + 1 },
                (_, i) => start + i * step
            );
        createYear(new Date().getFullYear(), 1901, -1).map((year) => {
            setPilihanTahun((prev) => [...prev, { label: year, value: year }]);
        });
    }, []);

    const [paginate, setPaginate] = useState(10);
    const [allData, setAllData] = useState({
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

    const tanggal = (value) => {
        return new Date(value).toLocaleString("id", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        setLoader(true);
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
                }/hasil/hasil?page=${page}&q=${search}&paginate=${paginate}&fakultas=${fakultas}&prodi=${prodi}&daritanggal=${filterTanggalDari}&ketanggal=${filterTanggalKe}&tahun_lulus=${
                    filterTahunLulus.value
                }`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setAllData({
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
                setPage(res.data.current_page);
                setLoader(false);
            })
            .catch((error) => {
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
                setLoader(false);
            });
    }, [
        page,
        setPage,
        paginate,
        setPaginate,
        search,
        setSearch,
        reloadTable,
        setReloadTable,
        prodi,
        setProdi,
        fakultas,
        setFakultas,
    ]);

    useEffect(() => {
        setLoader(true);
        setReloadTable(false);
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/hasil/hasil/create`, {
                headers: {
                    Authorization: "Bearer " + Cookies.get("token"),
                },
            })
            .then((res) => {
                setFakultasAlumni([...res.data.fakultas]);
                setProdiAll([...res.data.prodi]);
                setLoader(false);
            })
            .catch((error) => {
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: error.response.data.error,
                        icon: "error",
                    });
                }
            });
    }, []);

    useEffect(() => {
        setProdiAlumni(prodiAll.filter((prod) => prod.id_fakultas == fakultas));
        setProdi("");
    }, [fakultas, setFakultas]);

    useEffect(() => {
        const button = Math.min(5, allData.last_page);
        let first = allData.current_page - Math.floor(button / 2);
        first = Math.max(first, 1);
        first = Math.min(first, allData.last_page - button + 1);
        setButtonPage([...Array(button)].map((k, i) => i + first));
    }, [allData, setAllData]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Kamu Yakin?",
            text: "Data Akan Dihapus!",
            icon: "info",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: "Ya!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Now Loading!",
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                axios
                    .delete(
                        `${
                            import.meta.env.VITE_ALL_BASE_URL
                        }/hasil/hasil/delete/${id}`,
                        {
                            headers: {
                                Authorization: "Bearer " + Cookies.get("token"),
                            },
                        }
                    )
                    .then((res) => {
                        setReloadTable(true);
                        Swal.fire({
                            title: "Success!",
                            text: "Data Berhasil Dihapus.",
                            icon: "success",
                        });
                    })
                    .catch((error) => {
                        if (error.response.status == 403) {
                            Cookies.remove("token");
                            navigate("/");
                        } else {
                            Swal.fire({
                                title: "Error!",
                                text: error.response.data.error,
                                icon: "error",
                            });
                        }
                    });
            }
        });
    };

    return (
        <>
            <DashboardLayout>
                <div className="w-full px-4 py-2 mt-12">
                    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                        <TableData
                            head={[
                                "Waktu Pengisian",
                                "Fakultas",
                                "Program Studi",
                                "Nama",
                                "NIM",
                                "Lulusan",
                                "Aksi",
                            ]}
                            label={"Data Hasil Kuisioner"}
                            filter={
                                <>
                                    <div className="flex me-4">
                                        <p className="m-auto mx-1 text-xs font-semibold">
                                            Dari
                                        </p>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="tanggal"
                                                value={filterTanggalDari}
                                                onChange={(e) =>
                                                    setFilterTanggalDari(
                                                        e.target.value
                                                    )
                                                }
                                                className="h-full border block appearance-none w-fit bg-white border-gray-300 text-black py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                placeholder="Tanggal.."
                                            />
                                        </div>
                                        <p className="m-auto mx-1 text-xs font-semibold">
                                            Ke
                                        </p>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="tanggal"
                                                value={filterTanggalKe}
                                                onChange={(e) =>
                                                    setFilterTanggalKe(
                                                        e.target.value
                                                    )
                                                }
                                                className="h-full border block appearance-none w-fit bg-white border-gray-300 text-black py-2 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                                placeholder="Tanggal.."
                                            />
                                        </div>
                                        <button
                                            className="m-auto px-1"
                                            type="button"
                                            onClick={() => {
                                                setReloadTable(true);
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
                                                setFilterTanggalDari("");
                                                setFilterTanggalKe("");
                                                setReloadTable(true);
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
                                    <div className="relative">
                                        <select
                                            value={fakultas}
                                            onChange={(e) =>
                                                setFakultas(e.target.value)
                                            }
                                            className="h-full border block appearance-none w-20 bg-white border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="">Fakultas</option>
                                            {fakultasAlumni.map((kat, x) => {
                                                return (
                                                    <option
                                                        key={x}
                                                        value={kat.id}
                                                    >
                                                        {kat.nama}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="pointer-events-none absolute top-3 right-0 flex items-center px-2 text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={prodi}
                                            onChange={(e) =>
                                                setProdi(e.target.value)
                                            }
                                            className="h-full border block appearance-none w-fit bg-white border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="">Prodi</option>
                                            {prodiAlumni.map((kat, x) => {
                                                return (
                                                    <option
                                                        key={x}
                                                        value={kat.id}
                                                    >
                                                        {kat.nama}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <div className="pointer-events-none absolute top-3 right-0 flex items-center px-2 text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Select
                                            id="tahun_lulus"
                                            onChange={(value) =>
                                                setFilterTahunLulus(value)
                                            }
                                            required
                                            value={filterTahunLulus}
                                            options={pilihanTahun}
                                        />
                                    </div>
                                </>
                            }
                            pagination={paginate}
                            changePagination={(e) =>
                                setPaginate(e.target.value)
                            }
                            inputsearch={search}
                            changeSearch={(e) => setSearch(e.target.value)}
                            buttonModal={false}
                        >
                            {allData.data.length > 0 ? (
                                loader == false ? (
                                    allData.data.map((all, i) => {
                                        return (
                                            <tr
                                                key={i}
                                                className="bg-white border-b"
                                            >
                                                <th
                                                    scope="row"
                                                    className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    {i + allData.from}
                                                </th>
                                                <td className="px-6 py-4 text-black">
                                                    {tanggal(
                                                        all.tanggal_pengisian
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {
                                                        all.data_alumni
                                                            .data_prodi
                                                            .data_fakultas.nama
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {
                                                        all.data_alumni
                                                            .data_prodi.nama
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {all.data_alumni.nama}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {all.data_alumni.nim}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {
                                                        all.data_alumni
                                                            .tahun_lulus
                                                    }
                                                </td>
                                                <td className="py-4 text-black">
                                                    <div className="inline-flex justify-center">
                                                        <Link
                                                            type="button"
                                                            to={`/hasil/hasil-kuisioner/${all.id}`}
                                                            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center me-2"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="size-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                                />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                    <ButtonDelete
                                                        click={() =>
                                                            handleDelete(all.id)
                                                        }
                                                    ></ButtonDelete>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="bg-white border-b">
                                        <td
                                            colSpan={8}
                                            className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                        >
                                            <div className="flex w-full justify-center">
                                                <Loader></Loader>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr className="bg-white border-b">
                                    <td
                                        colSpan={8}
                                        className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {loader == true ? (
                                            <div className="flex w-full justify-center">
                                                <Loader></Loader>
                                            </div>
                                        ) : (
                                            "Belum Ada Data"
                                        )}
                                    </td>
                                </tr>
                            )}
                        </TableData>
                        <div className="p-5">
                            <ButtonPagination
                                from={allData.from}
                                to={allData.to}
                                total={allData.total}
                                next_page_url={allData.next_page_url}
                                prev_page_url={allData.prev_page_url}
                                nextPage={() => setPage(page++)}
                                prevPage={() => setPage(page--)}
                            >
                                {buttonPage.map((btn, i) => {
                                    return (
                                        <li key={i}>
                                            <button
                                                onClick={() => setPage(btn)}
                                                className={
                                                    "flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:text-gray-700 " +
                                                    (page == btn
                                                        ? "bg-teal-400 hover:bg-teal-600 text-gray-700"
                                                        : "bg-white hover:bg-gray-100 text-gray-500")
                                                }
                                            >
                                                {btn}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ButtonPagination>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
};
