/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Line, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Loader } from "../../components/Loader";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const Dashboard = () => {
    let navigate = useNavigate();
    const [loaderGrafikLine, setLoaderGrafikLine] = useState(true);
    const [loaderGrafikBar, setLoaderGrafikBar] = useState(true);
    const [totalALumni, setTotalAlumni] = useState(0);
    const [totalDosen, setTotalDosen] = useState(0);
    const [filterGrafikLine, setFilterGrafikLine] = useState(12);
    const [filterGrafikBar, setFilterGrafikBar] = useState(12);
    const [loading, setLoading] = useState(true);
    const [dataLineChart, setDataLineChart] = useState({
        labels: [],
        datasets: [
            {
                label: "Total Pengisian Kuisioner",
                data: [],
                fill: true,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    });

    const optionsLinechart = {
        responsive: true,
        tension: 0.3,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const [dataBarChart, setDataBarChart] = useState({
        labels: [],
        datasets: [
            {
                label: "Prodi Terbanyak Mengisi Kuisioner",
                data: [],
                fill: true,
                borderColor: "rgb(63, 209, 0)",
                backgroundColor: "rgba(63, 209, 0, 0.5)",
            },
        ],
    });

    const optionsBarChart = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const tanggal = (value) => {
        return new Date(value).toLocaleString("id", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const labelfilter = (value) => {
        return new Date(value).toLocaleString("id", {
            year: "numeric",
            month: "numeric",
        });
    };

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/dashboard/dashboard`, {
                headers: {
                    Authorization: "Bearer " + Cookies.get("token"),
                },
            })
            .then((res) => {
                setTotalAlumni(res.data.total_alumni);
                setTotalDosen(res.data.total_dosen);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
            });
    }, []);

    useEffect(() => {
        setLoaderGrafikLine(true);
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/dashboard/grafik_kuisioner?filterbulan=${filterGrafikLine}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                const labelformat = [];
                const dataperlabel = [];

                if (filterGrafikLine == 12 || filterGrafikLine == 3) {
                    res.data.label.map((label) => {
                        labelformat.push(
                            new Date(label).toLocaleString("id", {
                                year: "numeric",
                                month: "long",
                            })
                        );

                        let fildata = res.data.data.filter(
                            (e) =>
                                labelfilter(`${e.tahun}-${e.month}`) ==
                                labelfilter(label)
                        );
                        if (fildata.length > 0) {
                            dataperlabel.push(fildata[0].jumlah);
                        } else {
                            dataperlabel.push(0);
                        }
                    });
                } else {
                    res.data.label.map((label) => {
                        labelformat.push(
                            new Date(label).toLocaleString("id", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                        );

                        let fildata = res.data.data.filter(
                            (e) => tanggal(e.hari) == tanggal(label)
                        );
                        if (fildata.length > 0) {
                            dataperlabel.push(fildata[0].jumlah);
                        } else {
                            dataperlabel.push(0);
                        }
                    });
                }

                setDataLineChart({
                    labels: [...labelformat],
                    datasets: [
                        {
                            label: "Total Pengisian Kuisioner",
                            data: [...dataperlabel],
                            fill: true,
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                        },
                    ],
                });
                setLoaderGrafikLine(false);
            })
            .catch((error) => {
                setLoaderGrafikLine(false);
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
            });
    }, [filterGrafikLine, setFilterGrafikLine]);

    useEffect(() => {
        setLoaderGrafikBar(true);
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/dashboard/grafik_prodi_kuisioner?filterbulan=${filterGrafikBar}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                let namaprodi = [];
                let jumlahpengisikuisioner = [];
                res.data.map((label) => {
                    namaprodi.push(label.nama_prodi);
                    jumlahpengisikuisioner.push(label.jumlah);
                });

                setDataBarChart({
                    labels: [...namaprodi],
                    datasets: [
                        {
                            label: "Prodi Terbanyak Mengisi Kuisioner",
                            data: jumlahpengisikuisioner,
                            fill: true,
                            borderColor: "rgb(63, 209, 0)",
                            backgroundColor: "rgba(63, 209, 0, 0.5)",
                        },
                    ],
                });
                setLoaderGrafikBar(false);
            })
            .catch((error) => {
                setLoaderGrafikBar(false);
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
            });
    }, [filterGrafikBar, setFilterGrafikBar]);

    return (
        <DashboardLayout>
            <div className="w-full p-5 mt-12 font-semibold text-left rtl:text-right text-gray-900">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {loading ? (
                            <>
                                <div className="flex items-center justify-center h-24 border-2 bg-white rounded-lg overflow-hidden shadow">
                                    <Loader></Loader>
                                </div>
                                <div className="flex items-center justify-center h-24 border-2 bg-white rounded-lg overflow-hidden shadow">
                                    <Loader></Loader>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-start h-24 border-2 bg-white rounded-lg overflow-hidden shadow">
                                    <div className="h-full w-24 p-4 bg-teal-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-12 w-12 text-white m-auto"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="px-4 text-black">
                                        <h3 className="text-sm tracking-wider">
                                            Alumni Terdaftar Aktif
                                        </h3>
                                        <p className="text-3xl font-bold">
                                            {totalALumni}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-start h-24 border-2 bg-white rounded-lg overflow-hidden shadow">
                                    <div className="h-full w-24 p-4 bg-red-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-12 w-12 text-white m-auto"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="px-4 text-black">
                                        <h3 className="text-sm tracking-wider">
                                            Dosen Terdaftar Aktif
                                        </h3>
                                        <p className="text-3xl font-bold">
                                            {totalDosen}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 place-content-center h-auto mb-4 p-4 border-2 rounded-lg bg-white">
                        <div className="w-full">
                            <p className="text-black text-xl text-center font-bold mb-2">
                                Grafik Pengisian Kuisioner
                            </p>
                            <div className="flex justify-end mb-2 pl-1 pr-4">
                                <div className="relative">
                                    <select
                                        value={filterGrafikLine}
                                        onChange={(e) => {
                                            setFilterGrafikLine(e.target.value);
                                        }}
                                        className="h-full border text-xs rounded-lg block appearance-none w-full bg-white border-gray-300 text-black py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                        <option value="12">
                                            1 Tahun Terakhir
                                        </option>
                                        <option value="3">
                                            3 Bulan Terakhir
                                        </option>
                                        <option value="1">Bulan Ini</option>
                                        <option value="15">
                                            15 Hari Terakhir
                                        </option>
                                        <option value="7">
                                            1 Minggu Terakhir
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute top-3 right-0 flex items-center px-2 text-black">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {loaderGrafikLine ? (
                                <div className="flex w-full justify-center">
                                    <Loader></Loader>
                                </div>
                            ) : (
                                <Line
                                    height={400}
                                    width={800}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    options={optionsLinechart}
                                    data={dataLineChart}
                                />
                            )}
                        </div>
                        <div className="w-full">
                            <div className="w-full">
                                <p className="text-black text-xl text-center font-bold mb-2">
                                    Prodi Terbanyak Mengisi Kuisioner
                                </p>
                                <div className="flex justify-end mb-2">
                                    <div className="relative w-fit">
                                        <select
                                            value={filterGrafikBar}
                                            onChange={(e) => {
                                                setFilterGrafikBar(
                                                    e.target.value
                                                );
                                            }}
                                            className="h-full border text-xs rounded-lg block appearance-none w-full bg-white border-gray-300 text-black py-2 px-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="12">
                                                1 Tahun Terakhir
                                            </option>
                                            <option value="3">
                                                3 Bulan Terakhir
                                            </option>
                                            <option value="1">Bulan Ini</option>
                                            <option value="15">
                                                15 Hari Terakhir
                                            </option>
                                            <option value="7">
                                                1 Minggu Terakhir
                                            </option>
                                        </select>
                                        <div className="pointer-events-none absolute top-3 right-0 flex items-center px-2 text-black">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {loaderGrafikBar ? (
                                    <div className="flex w-full justify-center">
                                        <Loader></Loader>
                                    </div>
                                ) : (
                                    <Bar
                                        height={400}
                                        width={800}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        options={optionsBarChart}
                                        data={dataBarChart}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
