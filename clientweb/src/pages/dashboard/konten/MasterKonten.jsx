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
// import {
//     BtnBold,
//     BtnItalic,
//     Editor,
//     EditorProvider,
//     Toolbar,
// } from "react-simple-wysiwyg";
import Editor from "react-simple-wysiwyg";

export const MasterKonten = () => {
    let navigate = useNavigate();
    const [modalKonten, setModalKonten] = useState(false);
    const [kontenForm, setKontenForm] = useState({
        id: 0,
        nama: "",
        gambar: "",
        tipe_konten: "",
        konten: "",
    });
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
                }/konten/konten?page=${page}&q=${search}&paginate=${paginate}`,
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
    ]);

    useEffect(() => {
        const button = Math.min(5, allData.last_page);
        let first = allData.current_page - Math.floor(button / 2);
        first = Math.max(first, 1);
        first = Math.min(first, allData.last_page - button + 1);
        setButtonPage([...Array(button)].map((k, i) => i + first));
    }, [allData, setAllData]);

    useEffect(() => {
        if (modalKonten == false) {
            setKontenForm({
                id: 0,
                nama: "",
                gambar: "",
                tipe_konten: "",
                konten: "",
            });
        }
    }, [modalKonten, setModalKonten]);

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
                if (kontenForm.id == 0) {
                    axios
                        .post(
                            `${
                                import.meta.env.VITE_ALL_BASE_URL
                            }/konten/konten/store`,
                            kontenForm,
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
                            setModalKonten(false);
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
                            }/konten/konten/update`,
                            kontenForm,
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
                            setModalKonten(false);
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
                `${import.meta.env.VITE_ALL_BASE_URL}/konten/konten/edit/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setKontenForm({
                    id: res.data.id,
                    nama: res.data.nama,
                    konten: res.data.konten,
                    gambar: "",
                    tipe_konten: res.data.tipe_konten,
                });
                setHeaderModal("Edit Data");
                setModalKonten(true);
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
                        }/konten/konten/delete/${id}`,
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
                            head={["Tipe Konten", "Nama Konten", "Aksi"]}
                            label={"Data Konten"}
                            filter={false}
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
                                                    className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    {i + allData.from}
                                                </th>
                                                <td className="px-6 py-4 text-black">
                                                    {all.tipe_konten}
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
                    open={modalKonten}
                    submitAction={handlerSubmit}
                    closeModal={() => setModalKonten(false)}
                >
                    <div className="w-full text-black">
                        <label
                            htmlFor="nama"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Nama Konten
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={kontenForm.nama}
                            onChange={(e) =>
                                setKontenForm({
                                    ...kontenForm,
                                    nama: e.target.value,
                                })
                            }
                            disabled
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Nama Konten..."
                            required
                        />
                    </div>
                    <div className="w-full text-black">
                        <label
                            htmlFor="tipe_konten"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Tipe Konten
                        </label>
                        <select
                            value={kontenForm.tipe_konten}
                            id="tipe_konten"
                            onChange={(e) =>
                                setKontenForm({
                                    ...kontenForm,
                                    tipe_konten: e.target.value,
                                })
                            }
                            disabled
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        >
                            <option value="">Pilih Tipe Konten</option>
                            <option value="Text">Text</option>
                            <option value="HTML">HTML</option>
                            <option value="Gambar">Gambar</option>
                        </select>
                    </div>
                    {kontenForm.tipe_konten == "Text" ? (
                        <div className="w-full text-black">
                            <label
                                htmlFor="isi"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Isi Konten
                            </label>
                            <textarea
                                id="isi"
                                value={kontenForm.konten}
                                onChange={(e) =>
                                    setKontenForm({
                                        ...kontenForm,
                                        konten: e.target.value,
                                    })
                                }
                                rows={4}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Isi Konten..."
                                required
                            />
                        </div>
                    ) : (
                        ""
                    )}
                    {kontenForm.tipe_konten == "HTML" ? (
                        <div className="w-full text-black">
                            <label
                                htmlFor="isi"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Isi Konten
                            </label>
                            <Editor
                                value={kontenForm.konten}
                                onChange={(e) =>
                                    setKontenForm({
                                        ...kontenForm,
                                        konten: e.target.value,
                                    })
                                }
                            />
                        </div>
                    ) : (
                        ""
                    )}
                    {kontenForm.tipe_konten == "Gambar" ? (
                        <div className="w-full text-black">
                            <label
                                htmlFor="gambar"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Gambar
                            </label>
                            <input
                                type="file"
                                name="gambar"
                                id="gambar"
                                onChange={(e) =>
                                    setKontenForm({
                                        ...kontenForm,
                                        gambar: e.target.files[0],
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </ModalPrimary>
            </DashboardLayout>
        </>
    );
};
