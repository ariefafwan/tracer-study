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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Select from "react-select";

export const Alumni = () => {
    let navigate = useNavigate();
    const [modalAlumni, setModalAlumni] = useState(false);
    const [alumniForm, setAlumniForm] = useState({
        id: 0,
        nama: "",
        id_program_studi: {
            value: "",
            label: "",
            id_fakultas: "",
        },
        jenis_kelamin: "Laki-Laki",
        nim: "",
        nik: "",
        npwp: "",
        status: "",
        tahun_lulus: {
            value: "",
            label: "",
        },
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

    const [fakultas, setFakultas] = useState("");
    const [fakultasAlumni, setFakultasAlumni] = useState([]);
    const [selectFakultas, setSelectFakultas] = useState({
        value: "",
        label: "",
    });
    const [selectProdi, setSelectProdi] = useState([]);
    const [prodi, setProdi] = useState("");
    const [prodiAll, setProdiAll] = useState([]);
    const [prodiAlumni, setProdiAlumni] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterTahunLulus, setFilterTahunLulus] = useState({
        value: "",
        label: "Lulusan",
    });
    const [loader, setLoader] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [headerModal, setHeaderModal] = useState("");
    const [buttonPage, setButtonPage] = useState([]);
    let [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [allStatus, setAllStatus] = useState([]);
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

    useEffect(() => {
        setLoader(true);
        setReloadTable(false);
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/pengguna/alumni?page=${page}&q=${search}&paginate=${paginate}&fakultas=${fakultas}&prodi=${prodi}&status=${filterStatus}&tahun_lulus=${
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
                setAllStatus([
                    ...res.data.data.map((stat) => {
                        return {
                            id: stat.id,
                            status: stat.status,
                        };
                    }),
                ]);
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
        filterStatus,
        setFilterStatus,
    ]);

    useEffect(() => {
        setLoader(true);
        setReloadTable(false);
        axios
            .get(
                `${import.meta.env.VITE_ALL_BASE_URL}/pengguna/alumni/create`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setFakultasAlumni(res.data.fakultas);
                setProdiAll(res.data.prodi);
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
        setSelectProdi(
            prodiAll.filter((prod) => prod.id_fakultas == selectFakultas.value)
        );
    }, [selectFakultas, setSelectFakultas]);

    useEffect(() => {
        const button = Math.min(5, allData.last_page);
        let first = allData.current_page - Math.floor(button / 2);
        first = Math.max(first, 1);
        first = Math.min(first, allData.last_page - button + 1);
        setButtonPage([...Array(button)].map((k, i) => i + first));
    }, [allData, setAllData]);

    useEffect(() => {
        if (modalAlumni == false) {
            setSelectFakultas({
                value: "",
                label: "",
            });
            setAlumniForm({
                id: 0,
                nama: "",
                id_program_studi: {
                    value: "",
                    label: "",
                    id_fakultas: "",
                },
                jenis_kelamin: "Laki-Laki",
                nim: "",
                nik: "",
                npwp: "",
                status: "",
                tahun_lulus: {
                    value: "",
                    label: "",
                },
            });
        }

        if (headerModal == "Tambah Data") {
            setAlumniForm({
                ...alumniForm,
                status: "Aktif",
            });
        }
    }, [modalAlumni, setModalAlumni]);

    const handlerSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Kamu Yakin?",
            text: "Data Akan Disimpan, Pastikan Data Sudah Benar",
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
                if (alumniForm.id == 0) {
                    axios
                        .post(
                            `${
                                import.meta.env.VITE_ALL_BASE_URL
                            }/pengguna/alumni/store`,
                            alumniForm,
                            {
                                headers: {
                                    Authorization:
                                        "Bearer " + Cookies.get("token"),
                                },
                            }
                        )
                        .then((res) => {
                            setReloadTable(true);
                            setModalAlumni(false);
                            Swal.fire({
                                title: "Success!",
                                text: "Data Berhasil Ditambahkan.",
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
                } else {
                    axios
                        .post(
                            `${
                                import.meta.env.VITE_ALL_BASE_URL
                            }/pengguna/alumni/update`,
                            alumniForm,
                            {
                                headers: {
                                    Authorization:
                                        "Bearer " + Cookies.get("token"),
                                },
                            }
                        )
                        .then((res) => {
                            setReloadTable(true);
                            setModalAlumni(false);
                            Swal.fire({
                                title: "Success!",
                                text: "Data Berhasil Diupdate.",
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
            }
        });
    };

    const editData = (id) => {
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/pengguna/alumni/edit/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setSelectFakultas({
                    value: res.data.data_prodi.id_fakultas,
                    label: res.data.data_prodi.data_fakultas.nama,
                });
                setAlumniForm({
                    id: res.data.id,
                    nama: res.data.nama,
                    id_program_studi: {
                        value: res.data.id_program_studi,
                        label: res.data.data_prodi.nama,
                        id_fakultas: res.data.data_prodi.id_fakultas,
                    },
                    jenis_kelamin: res.data.jenis_kelamin,
                    nim: res.data.nim,
                    nik: res.data.nik,
                    npwp: res.data.npwp == null ? "" : res.data.npwp,
                    status: res.data.status,
                    tahun_lulus: {
                        value: res.data.tahun_lulus,
                        label: res.data.tahun_lulus,
                    },
                });
                setHeaderModal("Edit Data");
                setModalAlumni(true);
            })
            .catch((error) => {
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
            });
    };

    const changeStatus = (e, id_alumni) => {
        setAllStatus(
            allStatus.map((apa) => {
                if (apa.id == id_alumni) {
                    return {
                        id: id_alumni,
                        status: e.target.value,
                    };
                } else {
                    return apa;
                }
            })
        );
    };

    const handleUpdateStatus = (id) => {
        Swal.fire({
            title: "Kamu Yakin?",
            text: "Status Akan Diupdate!",
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
                    .post(
                        `${
                            import.meta.env.VITE_ALL_BASE_URL
                        }/pengguna/alumni/update_status`,
                        allStatus.filter((stat) => stat.id == id)[0],
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
                            text: "Status Berhasil Diupdate.",
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
                        }/pengguna/alumni/delete/${id}`,
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
                                "Fakultas",
                                "Program Studi",
                                "Nama",
                                "NIM",
                                "Status",
                                "Aksi",
                            ]}
                            label={"Data Alumni"}
                            filter={
                                <>
                                    <div className="relative">
                                        <select
                                            value={fakultas}
                                            onChange={(e) =>
                                                setFakultas(e.target.value)
                                            }
                                            className="h-full border block appearance-none w-full bg-white border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="">Fakultas</option>
                                            {fakultasAlumni.map((kat, x) => {
                                                return (
                                                    <option
                                                        key={x}
                                                        value={kat.value}
                                                    >
                                                        {kat.label}
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
                                            className="h-full border block appearance-none w-full bg-white border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="">Prodi</option>
                                            {prodiAlumni.map((kat, x) => {
                                                return (
                                                    <option
                                                        key={x}
                                                        value={kat.value}
                                                    >
                                                        {kat.label}
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
                                    <div className="relative">
                                        <select
                                            value={filterStatus}
                                            onChange={(e) =>
                                                setFilterStatus(e.target.value)
                                            }
                                            className="h-full border block appearance-none w-full bg-white border-gray-300 text-gray-700 py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="">Status</option>
                                            <option value="Aktif">Aktif</option>
                                            <option value="Nonaktif">
                                                Nonaktif
                                            </option>
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
                                </>
                            }
                            pagination={paginate}
                            changePagination={(e) =>
                                setPaginate(e.target.value)
                            }
                            inputsearch={search}
                            changeSearch={(e) => setSearch(e.target.value)}
                            buttonModal={() => {
                                setHeaderModal("Tambah Data");
                                setModalAlumni(true);
                            }}
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
                                                    className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    {i + allData.from}
                                                </th>
                                                <td className="px-6 py-4 text-black">
                                                    {
                                                        all.data_prodi
                                                            .data_fakultas.nama
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {all.data_prodi.nama}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {all.nama}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {all.nim}
                                                </td>
                                                <td className="inline-flex justify-center px-6 py-4 text-black">
                                                    <div className="w-full text-black me-3">
                                                        <select
                                                            value={
                                                                allStatus.filter(
                                                                    (stat) =>
                                                                        stat.id ==
                                                                        all.id
                                                                )[0].status
                                                            }
                                                            id="updatestatus"
                                                            onChange={(e) =>
                                                                changeStatus(
                                                                    e,
                                                                    all.id
                                                                )
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                            required
                                                        >
                                                            <option value="Aktif">
                                                                Aktif
                                                            </option>
                                                            <option value="Nonaktif">
                                                                Nonaktif
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="text-black bg-green-500 hover:bg-green-600 focus:ring-4font-medium rounded-lg text-sm px-2 py-2 me-2 h-fit m-auto"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                all.id
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="size-5 text-white"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    <div className="inline-flex justify-center">
                                                        <ButtonEdit
                                                            click={() =>
                                                                editData(all.id)
                                                            }
                                                        ></ButtonEdit>
                                                        <ButtonDelete
                                                            click={() =>
                                                                handleDelete(
                                                                    all.id
                                                                )
                                                            }
                                                        ></ButtonDelete>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="bg-white border-b">
                                        <td
                                            colSpan={7}
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
                                        colSpan={7}
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
                <ModalPrimary
                    header={headerModal}
                    open={modalAlumni}
                    submitAction={handlerSubmit}
                    closeModal={() => setModalAlumni(false)}
                >
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="w-full text-black">
                            <label
                                htmlFor="fakultas"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Pilih Fakultas
                            </label>
                            <Select
                                id="fakultas"
                                onChange={(value) => setSelectFakultas(value)}
                                required
                                value={selectFakultas}
                                options={fakultasAlumni}
                                placeholder="Pilih Fakultas"
                            />
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="fakultas"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Pilih Program Studi
                            </label>
                            <Select
                                id="fakultas"
                                onChange={(value) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        id_program_studi: {
                                            value: value.value,
                                            label: value.label,
                                            id_fakultas: selectFakultas.value,
                                        },
                                    })
                                }
                                required
                                value={alumniForm.id_program_studi}
                                options={selectProdi}
                                isDisabled={selectFakultas.value == ""}
                                placeholder="Pilih Program Studi"
                            />
                        </div>
                        <div className="w-full col-span-2 text-black">
                            <label
                                htmlFor="nama"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Nama Alumni
                            </label>
                            <input
                                type="text"
                                id="nama"
                                value={alumniForm.nama}
                                onChange={(e) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        nama: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Nama Alumni.."
                                required
                            />
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="nim"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                NIM
                            </label>
                            <input
                                type="number"
                                id="nim"
                                value={alumniForm.nim}
                                onChange={(e) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        nim: e.target.value,
                                    })
                                }
                                min={1}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="tahun_lulus"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Pilih Tahun Lulus
                            </label>
                            <Select
                                id="tahun_lulus"
                                onChange={(value) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        tahun_lulus: value,
                                    })
                                }
                                required
                                value={alumniForm.tahun_lulus}
                                options={pilihanTahun}
                                placeholder="Pilih Tahun Lulus"
                            />
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="jenis"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Jenis Kelamin
                            </label>
                            <select
                                value={alumniForm.jenis_kelamin}
                                id="jenis"
                                onChange={(e) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        jenis_kelamin: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                required
                            >
                                <option value="Laki-Laki">Laki-Laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="nik"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                NIK
                            </label>
                            <input
                                type="number"
                                id="nik"
                                value={alumniForm.nik}
                                onChange={(e) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        nik: e.target.value,
                                    })
                                }
                                min={1}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                required
                            />
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="nim"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                NPWP (Optional)
                            </label>
                            <input
                                type="number"
                                id="nim"
                                value={alumniForm.npwp}
                                onChange={(e) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        npwp: e.target.value,
                                    })
                                }
                                min={1}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            />
                        </div>
                        <div className="w-full text-black">
                            <label
                                htmlFor="status"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Status
                            </label>
                            <select
                                value={alumniForm.status}
                                id="status"
                                onChange={(e) =>
                                    setAlumniForm({
                                        ...alumniForm,
                                        status: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                required
                            >
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                </ModalPrimary>
            </DashboardLayout>
        </>
    );
};
