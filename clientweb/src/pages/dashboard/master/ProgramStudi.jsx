/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Loader } from "../../../components/Loader";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { TableData } from "../../../components/TableData";
import { ButtonEdit } from "../../../components/ButtonEdit";
import { ButtonDelete } from "../../../components/ButtonDelete";
import { ButtonPagination } from "../../../components/ButtonPagination";
import { ModalPrimary } from "../../../components/ModalPrimary";
import { useNavigate } from "react-router-dom";

export const ProgramStudi = () => {
    let navigate = useNavigate();
    const [modalProdi, setModalProdi] = useState(false);
    const [prodiForm, setProdiForm] = useState({
        id: 0,
        nama: "",
        id_fakultas: "",
    });

    const [fakultas, setFakultas] = useState("");
    const [fakultasProdi, setFakultasProdi] = useState([]);
    const [loader, setLoader] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [headerModal, setHeaderModal] = useState("");
    const [buttonPage, setButtonPage] = useState([]);
    let [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
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
                }/data-master/prodi?page=${page}&q=${search}&paginate=${paginate}&fakultas=${fakultas}`,
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
        fakultas,
        setFakultas,
    ]);

    useEffect(() => {
        setLoader(true);
        setReloadTable(false);
        axios
            .get(
                `${import.meta.env.VITE_ALL_BASE_URL}/data-master/prodi/create`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setFakultasProdi([...res.data.fakultas]);
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
        const button = Math.min(5, allData.last_page);
        let first = allData.current_page - Math.floor(button / 2);
        first = Math.max(first, 1);
        first = Math.min(first, allData.last_page - button + 1);
        setButtonPage([...Array(button)].map((k, i) => i + first));
    }, [allData, setAllData]);

    useEffect(() => {
        if (modalProdi == false) {
            setProdiForm({
                id: 0,
                nama: "",
                id_fakultas: "",
            });
        }
    }, [modalProdi, setModalProdi]);

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
                if (prodiForm.id == 0) {
                    axios
                        .post(
                            `${
                                import.meta.env.VITE_ALL_BASE_URL
                            }/data-master/prodi/store`,
                            prodiForm,
                            {
                                headers: {
                                    Authorization:
                                        "Bearer " + Cookies.get("token"),
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )
                        .then((res) => {
                            setReloadTable(true);
                            setModalProdi(false);
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
                            }/data-master/prodi/update`,
                            prodiForm,
                            {
                                headers: {
                                    Authorization:
                                        "Bearer " + Cookies.get("token"),
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )
                        .then((res) => {
                            setReloadTable(true);
                            setModalProdi(false);
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
                }/data-master/prodi/edit/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setProdiForm({
                    id: res.data.id,
                    nama: res.data.nama,
                    id_fakultas: res.data.id_fakultas,
                });
                setHeaderModal("Edit Data");
                setModalProdi(true);
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
                        }/data-master/prodi/delete/${id}`,
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
                            head={["Fakultas", "Nama Prodi", "Aksi"]}
                            label={"Data Program Studi"}
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
                                            <option value="">
                                                Pilih Fakultas
                                            </option>
                                            {fakultasProdi.map((kat, x) => {
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
                                setModalProdi(true);
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
                                                    {all.data_fakultas.nama}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    {all.nama}
                                                </td>
                                                <td className="px-6 py-4 text-black">
                                                    <div>
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
                                            colSpan={4}
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
                                        colSpan={4}
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
                    open={modalProdi}
                    submitAction={handlerSubmit}
                    closeModal={() => setModalProdi(false)}
                >
                    <div className="w-full text-black">
                        <label
                            htmlFor="fakultas"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Fakultas
                        </label>
                        <select
                            value={prodiForm.id_fakultas}
                            id="fakultas"
                            onChange={(e) =>
                                setProdiForm({
                                    ...prodiForm,
                                    id_fakultas: e.target.value,
                                })
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        >
                            <option value="">Pilih Fakultas</option>
                            {fakultasProdi.map((kat, x) => {
                                return (
                                    <option key={x} value={kat.id}>
                                        {kat.nama}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="w-full text-black">
                        <label
                            htmlFor="nama"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Nama Program Studi
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={prodiForm.nama}
                            onChange={(e) =>
                                setProdiForm({
                                    ...prodiForm,
                                    nama: e.target.value,
                                })
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Nama Prodi.."
                            required
                        />
                    </div>
                </ModalPrimary>
            </DashboardLayout>
        </>
    );
};
