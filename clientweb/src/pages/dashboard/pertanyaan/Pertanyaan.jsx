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

export const Pertanyaan = () => {
    let navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
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
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/pertanyaan/pertanyaan?page=${page}&q=${search}&paginate=${paginate}`,
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
                        }/pertanyaan/pertanyaan/delete/${id}`,
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
                                "Kategori Pertanyaan",
                                "Urutan",
                                "Pertanyaan",
                                "Aksi",
                            ]}
                            label={"Data Pertanyaan"}
                            filter={false}
                            pagination={paginate}
                            changePagination={(e) =>
                                setPaginate(e.target.value)
                            }
                            inputsearch={search}
                            changeSearch={(e) => setSearch(e.target.value)}
                            buttonModal={() =>
                                navigate("/pertanyaan/pertanyaan/create")
                            }
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
                                                    className="p-3 font-semibold text-gray-900 whitespace-nowrap"
                                                >
                                                    {i + allData.from}
                                                </th>
                                                <td className="p-3 text-black">
                                                    {
                                                        all.nama_kategori_pertanyaan
                                                    }
                                                </td>
                                                <td className="p-3 w-fit text-black ">
                                                    {all.urutan}
                                                </td>
                                                <td className="p-3 text-black">
                                                    <p className="line-clamp-1">
                                                        {all.pertanyaan}
                                                    </p>
                                                </td>
                                                <td className="p-3 text-black">
                                                    <div>
                                                        <Link
                                                            type="button"
                                                            to={`/pertanyaan/pertanyaan/edit/${all.id}`}
                                                            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center me-2"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-5 h-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                />
                                                            </svg>
                                                        </Link>
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
                                            colSpan={5}
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
                                        colSpan={5}
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
