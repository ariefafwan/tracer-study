/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DashboardLayout } from "../../../../layouts/DashboardLayout";
import { TableData } from "../../../../components/TableData";
import { ButtonEdit } from "../../../../components/ButtonEdit";
import { ButtonDelete } from "../../../../components/ButtonDelete";
import { ButtonPagination } from "../../../../components/ButtonPagination";
import { ModalPrimary } from "../../../../components/ModalPrimary";
import { Loader } from "../../../../components/Loader";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Doughnut, Pie } from "react-chartjs-2";
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
    ArcElement,
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
    Filler,
    ArcElement
);

export const StatistikPerKategori = () => {
    let navigate = useNavigate();
    let { id, tahun_lulus } = useParams();

    const [loading, setLoading] = useState(true);
    const [tes, setTes] = useState(false);
    const [dataPieChartJawaban, setDataPieChartJawaban] = useState([
        {
            id_pertanyaan: "",
            pertanyaan: "",
            tipe: "",
            jenis_subpertanyaan: "",
            isTampil: true,
            data: {
                pilihan: {
                    labels: [],
                    datasets: [],
                    plugins: {
                        labels: {
                            render: "percentage",
                            fontColor: ["green", "white", "red"],
                            precision: 2,
                        },
                    },
                    text: "23%",
                },
                sub_topik: [
                    {
                        sub_topik: "",
                        data: {
                            labels: [],
                            datasets: [],
                            plugins: {
                                labels: {
                                    render: "percentage",
                                    fontColor: ["green", "white", "red"],
                                    precision: 2,
                                },
                            },
                            text: "23%",
                        },
                    },
                ],
                pilihan_2_sisi: [
                    {
                        sub_pertanyaan: "",
                        value: [
                            {
                                sub_topik: "",
                                data: {
                                    labels: [],
                                    datasets: [],
                                    plugins: {
                                        labels: {
                                            render: "percentage",
                                            fontColor: [
                                                "green",
                                                "white",
                                                "red",
                                            ],
                                            precision: 2,
                                        },
                                    },
                                    text: "23%",
                                },
                            },
                        ],
                    },
                ],
                inputan: {
                    labels: [],
                    datasets: [],
                    plugins: {
                        labels: {
                            render: "percentage",
                            fontColor: ["green", "white", "red"],
                            precision: 2,
                        },
                    },
                    text: "23%",
                },
            },
        },
    ]);

    const optionsLinechart = {
        elements: {
            center: {
                legend: { display: true, position: "right" },
                text: "Red is 2/3 the total numbers",
                color: "#FF6384",
                fontStyle: "Arial",
                sidePadding: 20,
                minFontSize: 20,
                lineHeight: 25,
            },
        },
    };

    const backgroundColor = [
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
        "rgb(122,231,125)",
        "rgb(255, 255, 0)",
        "rgb(242,165,152)",
        "rgb(0, 255, 255)",
        "rgb(255, 0, 255)",
        "rgb(236,107,109)",
        "rgb(195,233,151)",
        "rgb(252, 186, 3)",
        "rgb(100,255,255)",
        "rgb(255, 0, 0)",
        "rgb(255,232,157)",
        "rgb(100, 100, 0)",
        "rgb(0, 100, 0)",
        "rgb(0, 0, 100)",
        "rgb(100, 0, 0)",
        "rgb(0, 100, 100)",
        "rgb(100, 0, 100)",
        "rgb(100, 100, 100)",
        "rgb(19, 40, 0)",
    ];

    const hoverBackgroundColor = [
        "#FFCE56",
        "#092e66",
        "#FF6384",
        "#eb4034",
        "#698cc2",
        "#4caf50",
        "#ff9800",
        "#00bcd4",
        "#ff5722",
        "#03a9f4",
        "#9c27b0",
        "#8bc34a",
        "#ffc107",
        "#795548",
        "#9e9e9e",
        "#607d8b",
        "#673ab7",
        "#2196f3",
        "#f44336",
        "#9e9e9e",
        "#607d8b",
    ];

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

    const [namaKategori, setNamaKategori] = useState("");

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/hasil/statistik/statistik-per-kategori/${id}/${tahun_lulus}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setNamaKategori(res.data.kategori.nama);
                setDataPieChartJawaban(
                    res.data.pertanyaan.map((pertanyaan, i) => {
                        if (pertanyaan.tipe == "Pilihan") {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                let label = [];
                                let dataperlabel = [];
                                pertanyaan.data_pilihan_jawaban.forEach(
                                    (val) => {
                                        label.push(val.nama_pilihan);

                                        var jumlah = dataJawaban.filter(
                                            (e) =>
                                                e.data_hasil_jawaban_pilihan[0]
                                                    .id_pilihan_jawaban ==
                                                val.id
                                        );
                                        if (jumlah.length > 0) {
                                            dataperlabel.push(jumlah.length);
                                        } else {
                                            dataperlabel.push(0);
                                        }
                                    }
                                );
                                if (pertanyaan.is_jawaban_lainnya == "Ya") {
                                    var jumlahlainnya = dataJawaban.filter(
                                        (e) =>
                                            e.data_hasil_jawaban_pilihan[0]
                                                .jawaban_input != "" ||
                                            e.data_hasil_jawaban_pilihan[0]
                                                .jawaban_input != null
                                    );

                                    if (jumlahlainnya.length > 0) {
                                        label.push("Jawaban Lainnya");
                                        dataperlabel.push(jumlahlainnya.length);
                                    }
                                }
                                return {
                                    id_pertanyaan: pertanyaan.id,
                                    pertanyaan: pertanyaan.pertanyaan,
                                    tipe: pertanyaan.tipe,
                                    jenis_subpertanyaan: "",
                                    isTampil: true,
                                    data: {
                                        pilihan: {
                                            labels: label,
                                            datasets: [
                                                {
                                                    data: dataperlabel,
                                                    backgroundColor:
                                                        backgroundColor,
                                                    hoverBackgroundColor:
                                                        hoverBackgroundColor,
                                                },
                                            ],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    isTampil: false,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: [
                                                    {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            }
                        } else if (
                            pertanyaan.tipe == "Input_Text" ||
                            pertanyaan.tipe == "Input_Angka" ||
                            pertanyaan.tipe == "Input_Tanggal"
                        ) {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                let label = [];
                                let dataperlabel = [];
                                let counter = {};

                                dataJawaban.forEach((val) => {
                                    if (
                                        counter[
                                            val.data_master_pilihan_jawaban[0]
                                                .jawaban_input
                                        ]
                                    ) {
                                        counter[
                                            val.data_master_pilihan_jawaban[0].jawaban_input
                                        ] += 1;
                                    } else {
                                        counter[
                                            val.data_master_pilihan_jawaban[0].jawaban_input
                                        ] = 1;
                                    }
                                });

                                label = Object.getOwnPropertyNames(counter);
                                dataperlabel = Object.values(counter);

                                return {
                                    id_pertanyaan: pertanyaan.id,
                                    pertanyaan: pertanyaan.pertanyaan,
                                    tipe: pertanyaan.tipe,
                                    jenis_subpertanyaan: "",
                                    isTampil: true,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            },
                                        ],
                                        inputan: {
                                            labels: label,
                                            datasets: [
                                                {
                                                    data: dataperlabel,
                                                    backgroundColor:
                                                        backgroundColor,
                                                    hoverBackgroundColor:
                                                        hoverBackgroundColor,
                                                },
                                            ],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    isTampil: false,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: [
                                                    {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            }
                        } else if (
                            pertanyaan.tipe == "Pilihan_2_Sisi_Pertanyaan"
                        ) {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                return {
                                    id_pertanyaan: pertanyaan.id,
                                    pertanyaan: pertanyaan.pertanyaan,
                                    tipe: pertanyaan.tipe,
                                    jenis_subpertanyaan: "",
                                    isTampil: true,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi:
                                            pertanyaan.data_sub_pertanyaan.map(
                                                (sub_pertanyaan) => {
                                                    return {
                                                        sub_pertanyaan:
                                                            sub_pertanyaan.sub_pertanyaan,
                                                        value: pertanyaan.data_sub_topik_pertanyaan.map(
                                                            (sub_topik) => {
                                                                let label = [];
                                                                let dataperlabel =
                                                                    [];
                                                                let counter =
                                                                    {};
                                                                var datahasiljawabansub =
                                                                    [];

                                                                dataJawaban.forEach(
                                                                    (val) => {
                                                                        var filtersub =
                                                                            val.data_hasil_jawaban_sub_pertanyaan.filter(
                                                                                (
                                                                                    r
                                                                                ) =>
                                                                                    r.id_sub_pertanyaan ==
                                                                                    sub_pertanyaan.id
                                                                            );
                                                                        if (
                                                                            filtersub.length >
                                                                            0
                                                                        ) {
                                                                            datahasiljawabansub.push(
                                                                                filtersub[0]
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                                var datahasilsubtopik =
                                                                    [];
                                                                datahasiljawabansub.forEach(
                                                                    (val) => {
                                                                        var check =
                                                                            val.data_hasil_jawaban2_sisi.filter(
                                                                                (
                                                                                    r
                                                                                ) =>
                                                                                    r.id_sub_topik ==
                                                                                    sub_topik.id
                                                                            );
                                                                        if (
                                                                            check.length >
                                                                            0
                                                                        ) {
                                                                            datahasilsubtopik.push(
                                                                                check[0]
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                                datahasilsubtopik.forEach(
                                                                    (val) => {
                                                                        if (
                                                                            counter[
                                                                                val
                                                                                    .jawaban
                                                                            ]
                                                                        ) {
                                                                            counter[
                                                                                val.jawaban
                                                                            ] += 1;
                                                                        } else {
                                                                            counter[
                                                                                val.jawaban
                                                                            ] = 1;
                                                                        }
                                                                    }
                                                                );
                                                                label =
                                                                    Object.getOwnPropertyNames(
                                                                        counter
                                                                    );
                                                                dataperlabel =
                                                                    Object.values(
                                                                        counter
                                                                    );

                                                                return {
                                                                    sub_topik:
                                                                        sub_topik.sub_topik_pertanyaan,
                                                                    data: {
                                                                        labels: label,
                                                                        datasets:
                                                                            [
                                                                                {
                                                                                    data: dataperlabel,
                                                                                    backgroundColor:
                                                                                        backgroundColor,
                                                                                    hoverBackgroundColor:
                                                                                        hoverBackgroundColor,
                                                                                },
                                                                            ],
                                                                        plugins:
                                                                            {
                                                                                labels: {
                                                                                    render: "percentage",
                                                                                    fontColor:
                                                                                        [
                                                                                            "green",
                                                                                            "white",
                                                                                            "red",
                                                                                        ],
                                                                                    precision: 2,
                                                                                },
                                                                            },
                                                                        text: "23%",
                                                                    },
                                                                };
                                                            }
                                                        ),
                                                    };
                                                }
                                            ),
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    isTampil: false,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: [
                                                    {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            }
                        } else if (
                            pertanyaan.tipe == "Pilihan_Dengan_SubTopik"
                        ) {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                return {
                                    id_pertanyaan: pertanyaan.id,
                                    pertanyaan: pertanyaan.pertanyaan,
                                    tipe: pertanyaan.tipe,
                                    jenis_subpertanyaan: "",
                                    isTampil: true,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik:
                                            pertanyaan.data_sub_topik_pertanyaan.map(
                                                (subtopik) => {
                                                    let label = [];
                                                    let dataperlabel = [];
                                                    let counter = {};
                                                    var datahasilsubtopik = [];

                                                    dataJawaban.forEach(
                                                        (val) => {
                                                            var check =
                                                                val.data_hasil_jawaban_sub_topik.filter(
                                                                    (r) =>
                                                                        r.id_sub_topik ==
                                                                        subtopik.id
                                                                );
                                                            if (
                                                                check.length > 0
                                                            ) {
                                                                datahasilsubtopik.push(
                                                                    check[0]
                                                                );
                                                            }
                                                        }
                                                    );

                                                    datahasilsubtopik.forEach(
                                                        (val) => {
                                                            if (
                                                                counter[
                                                                    val.jawaban
                                                                ]
                                                            ) {
                                                                counter[
                                                                    val.jawaban
                                                                ] += 1;
                                                            } else {
                                                                counter[
                                                                    val.jawaban
                                                                ] = 1;
                                                            }
                                                        }
                                                    );

                                                    label =
                                                        Object.getOwnPropertyNames(
                                                            counter
                                                        );
                                                    dataperlabel =
                                                        Object.values(counter);

                                                    return {
                                                        sub_topik:
                                                            subtopik.sub_topik_pertanyaan,
                                                        data: {
                                                            labels: label,
                                                            datasets: [
                                                                {
                                                                    data: dataperlabel,
                                                                    backgroundColor:
                                                                        backgroundColor,
                                                                    hoverBackgroundColor:
                                                                        hoverBackgroundColor,
                                                                },
                                                            ],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    };
                                                }
                                            ),
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    isTampil: false,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: [
                                                    {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            }
                        } else if (pertanyaan.tipe == "Checkbox") {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                let label = [];
                                let dataperlabel = [];
                                let counter = {};
                                dataJawaban.forEach((val) => {
                                    val.data_hasil_jawaban_pilihan.forEach(
                                        (main) => {
                                            if (
                                                main.id_pilihan_jawaban != null
                                            ) {
                                                if (
                                                    counter[
                                                        main
                                                            .data_master_pilihan_jawaban
                                                            .nama_pilihan
                                                    ]
                                                ) {
                                                    counter[
                                                        main.data_master_pilihan_jawaban.nama_pilihan
                                                    ] += 1;
                                                } else {
                                                    counter[
                                                        main.data_master_pilihan_jawaban.nama_pilihan
                                                    ] = 1;
                                                }
                                            }
                                        }
                                    );
                                });

                                label = Object.getOwnPropertyNames(counter);
                                dataperlabel = Object.values(counter);

                                if (pertanyaan.is_jawaban_lainnya == "Ya") {
                                    var checklainnya = dataJawaban.filter(
                                        (e) =>
                                            e.data_hasil_jawaban_pilihan[0]
                                                .jawaban_input != "" ||
                                            e.data_hasil_jawaban_pilihan[0]
                                                .jawaban_input != null
                                    );

                                    if (checklainnya.length > 0) {
                                        label.push("Jawaban Lainnya");
                                        dataperlabel.push(checklainnya.length);
                                    }
                                }
                                return {
                                    id_pertanyaan: pertanyaan.id,
                                    pertanyaan: pertanyaan.pertanyaan,
                                    tipe: pertanyaan.tipe,
                                    jenis_subpertanyaan: "",
                                    isTampil: true,
                                    data: {
                                        pilihan: {
                                            labels: label,
                                            datasets: [
                                                {
                                                    data: dataperlabel,
                                                    backgroundColor:
                                                        backgroundColor,
                                                    hoverBackgroundColor:
                                                        hoverBackgroundColor,
                                                },
                                            ],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    isTampil: false,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: [
                                                    {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            }
                        } else if (
                            pertanyaan.tipe == "Pilihan_Dengan_Inputan"
                        ) {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                let label = [];
                                let dataperlabel = [];
                                let counter = {};

                                dataJawaban.forEach((val) => {
                                    val.data_hasil_jawaban_pilihan.forEach(
                                        (main) => {
                                            if (
                                                main.data_master_pilihan_jawaban
                                                    .isInput == "Ya"
                                            ) {
                                                if (
                                                    counter[
                                                        main
                                                            .data_master_pilihan_jawaban
                                                            .nama_pilihan +
                                                            ": " +
                                                            main.jawaban_input
                                                    ]
                                                ) {
                                                    counter[
                                                        main
                                                            .data_master_pilihan_jawaban
                                                            .nama_pilihan +
                                                            ": " +
                                                            main.jawaban_input
                                                    ] += 1;
                                                } else {
                                                    counter[
                                                        main
                                                            .data_master_pilihan_jawaban
                                                            .nama_pilihan +
                                                            ": " +
                                                            main.jawaban_input
                                                    ] = 1;
                                                }
                                            }
                                        }
                                    );
                                });

                                label = Object.getOwnPropertyNames(counter);
                                dataperlabel = Object.values(counter);

                                pertanyaan.data_pilihan_jawaban.forEach(
                                    (val) => {
                                        if (val.isInput == "Tidak") {
                                            label.push(val.nama_pilihan);
                                            var jumlah = dataJawaban.filter(
                                                (e) =>
                                                    e
                                                        .data_hasil_jawaban_pilihan[0]
                                                        .id_pilihan_jawaban ==
                                                    val.id
                                            );
                                            if (jumlah.length > 0) {
                                                dataperlabel.push(
                                                    jumlah.length
                                                );
                                            } else {
                                                dataperlabel.push(0);
                                            }
                                        }
                                    }
                                );
                                return {
                                    id_pertanyaan: pertanyaan.id,
                                    pertanyaan: pertanyaan.pertanyaan,
                                    tipe: pertanyaan.tipe,
                                    jenis_subpertanyaan: "",
                                    isTampil: true,
                                    data: {
                                        pilihan: {
                                            labels: label,
                                            datasets: [
                                                {
                                                    data: dataperlabel,
                                                    backgroundColor:
                                                        backgroundColor,
                                                    hoverBackgroundColor:
                                                        hoverBackgroundColor,
                                                },
                                            ],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    isTampil: false,
                                    data: {
                                        pilihan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                        sub_topik: [
                                            {
                                                sub_topik: "",
                                                data: {
                                                    labels: [],
                                                    datasets: [],
                                                    plugins: {
                                                        labels: {
                                                            render: "percentage",
                                                            fontColor: [
                                                                "green",
                                                                "white",
                                                                "red",
                                                            ],
                                                            precision: 2,
                                                        },
                                                    },
                                                    text: "23%",
                                                },
                                            },
                                        ],
                                        pilihan_2_sisi: [
                                            {
                                                sub_pertanyaan: "",
                                                value: [
                                                    {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        inputan: {
                                            labels: [],
                                            datasets: [],
                                            plugins: {
                                                labels: {
                                                    render: "percentage",
                                                    fontColor: [
                                                        "green",
                                                        "white",
                                                        "red",
                                                    ],
                                                    precision: 2,
                                                },
                                            },
                                            text: "23%",
                                        },
                                    },
                                };
                            }
                        } else if (pertanyaan.tipe == "Sub_Pertanyaan") {
                            if (
                                pertanyaan.data_sub_pertanyaan[0]
                                    .jenis_subpertanyaan == "Pilihan"
                            ) {
                                let dataJawaban = res.data.data.filter(
                                    (e) => e.id_pertanyaan == pertanyaan.id
                                );
                                if (dataJawaban.length > 0) {
                                    let label = [];
                                    let dataperlabel = [];
                                    pertanyaan.data_pilihan_jawaban.forEach(
                                        (val) => {
                                            label.push(val.nama_pilihan);

                                            var jumlah = dataJawaban.filter(
                                                (e) =>
                                                    e
                                                        .data_hasil_jawaban_pilihan[0]
                                                        .id_pilihan_jawaban ==
                                                    val.id
                                            );
                                            if (jumlah.length > 0) {
                                                dataperlabel.push(
                                                    jumlah.length
                                                );
                                            } else {
                                                dataperlabel.push(0);
                                            }
                                        }
                                    );
                                    if (pertanyaan.is_jawaban_lainnya == "Ya") {
                                        var lihatjawaban = dataJawaban.filter(
                                            (e) =>
                                                e.data_hasil_jawaban_pilihan[0]
                                                    .jawaban_input != "" ||
                                                e.data_hasil_jawaban_pilihan[0]
                                                    .jawaban_input != null
                                        );

                                        if (lihatjawaban.length > 0) {
                                            label.push("Jawaban Lainnya");
                                            dataperlabel.push(
                                                lihatjawaban.length
                                            );
                                        }
                                    }
                                    return {
                                        id_pertanyaan: pertanyaan.id,
                                        pertanyaan: pertanyaan.pertanyaan,
                                        tipe: pertanyaan.tipe,
                                        jenis_subpertanyaan:
                                            pertanyaan.data_sub_pertanyaan[0]
                                                .jenis_subpertanyaan,
                                        isTampil: true,
                                        data: {
                                            pilihan: {
                                                labels: label,
                                                datasets: [
                                                    {
                                                        data: dataperlabel,
                                                        backgroundColor:
                                                            backgroundColor,
                                                        hoverBackgroundColor:
                                                            hoverBackgroundColor,
                                                    },
                                                ],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                            sub_topik: [
                                                {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            ],
                                            pilihan_2_sisi: [
                                                {
                                                    sub_pertanyaan: "",
                                                    value: {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                },
                                            ],
                                            inputan: {
                                                labels: [],
                                                datasets: [],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                        },
                                    };
                                } else {
                                    return {
                                        id_pertanyaan: "",
                                        pertanyaan: "",
                                        tipe: "",
                                        jenis_subpertanyaan: "",
                                        isTampil: false,
                                        data: {
                                            pilihan: {
                                                labels: [],
                                                datasets: [],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                            sub_topik: [
                                                {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            ],
                                            pilihan_2_sisi: [
                                                {
                                                    sub_pertanyaan: "",
                                                    value: [
                                                        {
                                                            sub_topik: "",
                                                            data: {
                                                                labels: [],
                                                                datasets: [],
                                                                plugins: {
                                                                    labels: {
                                                                        render: "percentage",
                                                                        fontColor:
                                                                            [
                                                                                "green",
                                                                                "white",
                                                                                "red",
                                                                            ],
                                                                        precision: 2,
                                                                    },
                                                                },
                                                                text: "23%",
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                            inputan: {
                                                labels: [],
                                                datasets: [],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                        },
                                    };
                                }
                            } else if (
                                pertanyaan.tipe == "Input_Text" ||
                                pertanyaan.tipe == "Input_Angka" ||
                                pertanyaan.tipe == "Input_Tanggal"
                            ) {
                                let dataJawaban = res.data.data.filter(
                                    (e) => e.id_pertanyaan == pertanyaan.id
                                );
                                if (dataJawaban.length > 0) {
                                    let label = [];
                                    let dataperlabel = [];
                                    let counter = {};

                                    dataJawaban.forEach((val) => {
                                        if (
                                            counter[
                                                val
                                                    .data_master_pilihan_jawaban[0]
                                                    .jawaban_input
                                            ]
                                        ) {
                                            counter[
                                                val.data_master_pilihan_jawaban[0].jawaban_input
                                            ] += 1;
                                        } else {
                                            counter[
                                                val.data_master_pilihan_jawaban[0].jawaban_input
                                            ] = 1;
                                        }
                                    });

                                    label = Object.getOwnPropertyNames(counter);
                                    dataperlabel = Object.values(counter);

                                    return {
                                        id_pertanyaan: pertanyaan.id,
                                        pertanyaan: pertanyaan.pertanyaan,
                                        tipe: pertanyaan.tipe,
                                        jenis_subpertanyaan:
                                            pertanyaan.data_sub_pertanyaan[0]
                                                .jenis_subpertanyaan,
                                        isTampil: true,
                                        data: {
                                            pilihan: {
                                                labels: [],
                                                datasets: [],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                            sub_topik: [
                                                {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            ],
                                            pilihan_2_sisi: [
                                                {
                                                    sub_pertanyaan: "",
                                                    value: {
                                                        sub_topik: "",
                                                        data: {
                                                            labels: [],
                                                            datasets: [],
                                                            plugins: {
                                                                labels: {
                                                                    render: "percentage",
                                                                    fontColor: [
                                                                        "green",
                                                                        "white",
                                                                        "red",
                                                                    ],
                                                                    precision: 2,
                                                                },
                                                            },
                                                            text: "23%",
                                                        },
                                                    },
                                                },
                                            ],
                                            inputan: {
                                                labels: label,
                                                datasets: [
                                                    {
                                                        data: dataperlabel,
                                                        backgroundColor:
                                                            backgroundColor,
                                                        hoverBackgroundColor:
                                                            hoverBackgroundColor,
                                                    },
                                                ],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                        },
                                    };
                                } else {
                                    return {
                                        id_pertanyaan: "",
                                        pertanyaan: "",
                                        tipe: "",
                                        jenis_subpertanyaan: "",
                                        isTampil: false,
                                        data: {
                                            pilihan: {
                                                labels: [],
                                                datasets: [],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                            sub_topik: [
                                                {
                                                    sub_topik: "",
                                                    data: {
                                                        labels: [],
                                                        datasets: [],
                                                        plugins: {
                                                            labels: {
                                                                render: "percentage",
                                                                fontColor: [
                                                                    "green",
                                                                    "white",
                                                                    "red",
                                                                ],
                                                                precision: 2,
                                                            },
                                                        },
                                                        text: "23%",
                                                    },
                                                },
                                            ],
                                            pilihan_2_sisi: [
                                                {
                                                    sub_pertanyaan: "",
                                                    value: [
                                                        {
                                                            sub_topik: "",
                                                            data: {
                                                                labels: [],
                                                                datasets: [],
                                                                plugins: {
                                                                    labels: {
                                                                        render: "percentage",
                                                                        fontColor:
                                                                            [
                                                                                "green",
                                                                                "white",
                                                                                "red",
                                                                            ],
                                                                        precision: 2,
                                                                    },
                                                                },
                                                                text: "23%",
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                            inputan: {
                                                labels: [],
                                                datasets: [],
                                                plugins: {
                                                    labels: {
                                                        render: "percentage",
                                                        fontColor: [
                                                            "green",
                                                            "white",
                                                            "red",
                                                        ],
                                                        precision: 2,
                                                    },
                                                },
                                                text: "23%",
                                            },
                                        },
                                    };
                                }
                            }
                        }
                    })
                );
                setLoading(false);
                setTes(true);
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

    // useEffect(() => {
    //     if (tes) {
    //         console.log(dataPieChartJawaban);
    //     }
    // }, [dataPieChartJawaban, setDataPieChartJawaban]);

    return (
        <DashboardLayout>
            <div className="w-full p-5 mt-12 font-semibold text-left rtl:text-right text-gray-900">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                    <p className="text-xl mb-4">
                        Statistik Kuisioner Kategori {namaKategori} Lulusan
                        Tahun {tahun_lulus}
                    </p>
                    {loading ? (
                        <div className="w-full flex justify-center">
                            <Loader></Loader>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 place-content-center h-auto mb-4 p-4">
                            {dataPieChartJawaban.map((data, index) => {
                                if (
                                    (data.isTampil && data.tipe == "Pilihan") ||
                                    data.tipe == "Checkbox" ||
                                    data.tipe == "Pilihan_Dengan_Inputan"
                                ) {
                                    return (
                                        <div key={index} className="mb-4">
                                            <div className="w-full">
                                                <p className="block mb-2 text-sm font-bold text-gray-900">
                                                    <span className="my-auto">
                                                        {index + 1}.{" "}
                                                        {data.pertanyaan}
                                                    </span>
                                                    &nbsp;
                                                    <Link
                                                        to={`/hasil/statistik/per-pertanyaan/${data.id_pertanyaan}/${tahun_lulus}`}
                                                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1 text-center my-auto"
                                                    >
                                                        Detail
                                                    </Link>
                                                </p>
                                                <div className="w-full h-80 flex justify-center">
                                                    <Doughnut
                                                        data={data.data.pilihan}
                                                        options={
                                                            optionsLinechart
                                                        }
                                                        height={200}
                                                        width={400}
                                                        style={{
                                                            width: "50%",
                                                            height: "50%",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (
                                    data.isTampil &&
                                    data.tipe == "Pilihan_2_Sisi_Pertanyaan"
                                ) {
                                    return (
                                        <div key={index} className="mb-4">
                                            <div className="w-full">
                                                <p className="block mb-2 text-sm font-bold text-gray-900">
                                                    <span className="my-auto">
                                                        {index + 1}.{" "}
                                                        {data.pertanyaan}
                                                    </span>
                                                    &nbsp;
                                                    <Link
                                                        to={`/hasil/statistik/per-pertanyaan/${data.id_pertanyaan}/${tahun_lulus}`}
                                                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1 text-center my-auto"
                                                    >
                                                        Detail
                                                    </Link>
                                                </p>
                                            </div>
                                            {data.data.pilihan_2_sisi.map(
                                                (
                                                    datapilihan_2_sisi,
                                                    index_pilihan_2_sisi
                                                ) => {
                                                    return (
                                                        <div
                                                            key={
                                                                index_pilihan_2_sisi
                                                            }
                                                            className="w-full px-4 mb-4"
                                                        >
                                                            <span className="text-sm font-normal text-gray-900">
                                                                {index_pilihan_2_sisi +
                                                                    1}
                                                                .{" "}
                                                                {
                                                                    datapilihan_2_sisi.sub_pertanyaan
                                                                }
                                                            </span>
                                                            <div className="grid grid-cols-2 gap-y-4 gap-2 place-content-center w-full mt-4 px-2">
                                                                {datapilihan_2_sisi.value.map(
                                                                    (
                                                                        datapersub,
                                                                        indexpersub
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    indexpersub
                                                                                }
                                                                            >
                                                                                <span className="font-normal text-xs">
                                                                                    {
                                                                                        datapersub.sub_topik
                                                                                    }
                                                                                </span>
                                                                                <div className="w-full h-60 flex justify-center">
                                                                                    <Doughnut
                                                                                        data={
                                                                                            datapersub.data
                                                                                        }
                                                                                        options={
                                                                                            optionsLinechart
                                                                                        }
                                                                                        height={
                                                                                            200
                                                                                        }
                                                                                        width={
                                                                                            400
                                                                                        }
                                                                                        style={{
                                                                                            width: "50%",
                                                                                            height: "50%",
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    );
                                } else if (
                                    data.isTampil &&
                                    data.tipe == "Pilihan_Dengan_SubTopik"
                                ) {
                                    return (
                                        <div key={index} className="mb-4">
                                            <div className="w-full">
                                                <p className="block mb-2 text-sm font-bold text-gray-900">
                                                    <span className="my-auto">
                                                        {index + 1}.{" "}
                                                        {data.pertanyaan}
                                                    </span>
                                                    &nbsp;
                                                    <Link
                                                        to={`/hasil/statistik/per-pertanyaan/${data.id_pertanyaan}/${tahun_lulus}`}
                                                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1 text-center my-auto"
                                                    >
                                                        Detail
                                                    </Link>
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-4 gap-2 place-content-center w-full mt-4 px-2">
                                                {data.data.sub_topik.map(
                                                    (
                                                        datapersub,
                                                        indexpersub
                                                    ) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    indexpersub
                                                                }
                                                            >
                                                                <span className="font-normal text-xs">
                                                                    {
                                                                        datapersub.sub_topik
                                                                    }
                                                                </span>
                                                                <div className="w-full h-60 flex justify-center">
                                                                    <Doughnut
                                                                        data={
                                                                            datapersub.data
                                                                        }
                                                                        options={
                                                                            optionsLinechart
                                                                        }
                                                                        height={
                                                                            200
                                                                        }
                                                                        width={
                                                                            400
                                                                        }
                                                                        style={{
                                                                            width: "50%",
                                                                            height: "50%",
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    );
                                } else if (
                                    (data.isTampil &&
                                        data.tipe == "Input_Text") ||
                                    data.tipe == "Input_Angka" ||
                                    data.tipe == "Input_Tanggal"
                                ) {
                                    return (
                                        <div key={index} className="mb-4">
                                            <div className="w-full">
                                                <p className="block mb-2 text-sm font-bold text-gray-900">
                                                    <span className="my-auto">
                                                        {index + 1}.{" "}
                                                        {data.pertanyaan}
                                                    </span>
                                                    &nbsp;
                                                    <Link
                                                        to={`/hasil/statistik/per-pertanyaan/${data.id_pertanyaan}/${tahun_lulus}`}
                                                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1 text-center my-auto"
                                                    >
                                                        Detail
                                                    </Link>
                                                </p>
                                                <div className="w-full h-80 flex justify-center">
                                                    <Doughnut
                                                        data={data.data.inputan}
                                                        options={
                                                            optionsLinechart
                                                        }
                                                        height={200}
                                                        width={400}
                                                        style={{
                                                            width: "50%",
                                                            height: "50%",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (
                                    data.isTampil &&
                                    data.tipe == "Sub_Pertanyaan"
                                ) {
                                    if (data.jenis_subpertanyaan == "Pilihan") {
                                        return (
                                            <div key={index} className="mb-4">
                                                <div className="w-full">
                                                    <p className="block mb-2 text-sm font-bold text-gray-900">
                                                        <span className="my-auto">
                                                            {index + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </span>
                                                        &nbsp;
                                                        <Link
                                                            to={`/hasil/statistik/per-pertanyaan/${data.id_pertanyaan}/${tahun_lulus}`}
                                                            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1 text-center my-auto"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </p>
                                                    <div className="w-full h-80 flex justify-center">
                                                        <Doughnut
                                                            data={
                                                                data.data
                                                                    .pilihan
                                                            }
                                                            options={
                                                                optionsLinechart
                                                            }
                                                            height={200}
                                                            width={400}
                                                            style={{
                                                                width: "50%",
                                                                height: "50%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index} className="mb-4">
                                                <div className="w-full">
                                                    <p className="block mb-2 text-sm font-bold text-gray-900">
                                                        <span className="my-auto">
                                                            {index + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </span>
                                                        &nbsp;
                                                        <Link
                                                            to={`/hasil/statistik/per-pertanyaan/${data.id_pertanyaan}/${tahun_lulus}`}
                                                            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xs px-3 py-1 text-center my-auto"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </p>
                                                    <div className="w-full h-80 flex justify-center">
                                                        <Doughnut
                                                            data={
                                                                data.data
                                                                    .inputan
                                                            }
                                                            options={
                                                                optionsLinechart
                                                            }
                                                            height={200}
                                                            width={400}
                                                            style={{
                                                                width: "50%",
                                                                height: "50%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
