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

export const StatistikPerPertanyaan = () => {
    let navigate = useNavigate();
    let { id, tahun_lulus } = useParams();

    const [loading, setLoading] = useState(true);
    const [dataPieChartJawaban, setDataPieChartJawaban] = useState({
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
                                        fontColor: ["green", "white", "red"],
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
    });

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

    const [dataJawabanKuisioner, setDataJawabanKuisioner] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/hasil/statistik/statistik-per-pertanyaan/${id}/${tahun_lulus}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setDataJawabanKuisioner(res.data.data);
                setDataPieChartJawaban(() => {
                    if (res.data.pertanyaan.tipe == "Pilihan") {
                        let dataJawaban = res.data.data.filter(
                            (e) => e.id_pertanyaan == res.data.pertanyaan.id
                        );
                        if (dataJawaban.length > 0) {
                            let label = [];
                            let dataperlabel = [];
                            res.data.pertanyaan.data_pilihan_jawaban.forEach(
                                (val) => {
                                    label.push(val.nama_pilihan);

                                    var jumlah = dataJawaban.filter(
                                        (e) =>
                                            e.data_hasil_jawaban_pilihan[0]
                                                .id_pilihan_jawaban == val.id
                                    );
                                    if (jumlah.length > 0) {
                                        dataperlabel.push(jumlah.length);
                                    } else {
                                        dataperlabel.push(0);
                                    }
                                }
                            );
                            if (
                                res.data.pertanyaan.is_jawaban_lainnya == "Ya"
                            ) {
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
                                id_pertanyaan: res.data.pertanyaan.id,
                                pertanyaan: res.data.pertanyaan.pertanyaan,
                                tipe: res.data.pertanyaan.tipe,
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
                        res.data.pertanyaan.tipe == "Input_Text" ||
                        res.data.pertanyaan.tipe == "Input_Angka" ||
                        res.data.pertanyaan.tipe == "Input_Tanggal"
                    ) {
                        let dataJawaban = res.data.data.filter(
                            (e) => e.id_pertanyaan == res.data.pertanyaan.id
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
                                id_pertanyaan: res.data.pertanyaan.id,
                                pertanyaan: res.data.pertanyaan.pertanyaan,
                                tipe: res.data.pertanyaan.tipe,
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
                        res.data.pertanyaan.tipe == "Pilihan_2_Sisi_Pertanyaan"
                    ) {
                        let dataJawaban = res.data.data.filter(
                            (e) => e.id_pertanyaan == res.data.pertanyaan.id
                        );
                        if (dataJawaban.length > 0) {
                            return {
                                id_pertanyaan: res.data.pertanyaan.id,
                                pertanyaan: res.data.pertanyaan.pertanyaan,
                                tipe: res.data.pertanyaan.tipe,
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
                                        res.data.pertanyaan.data_sub_pertanyaan.map(
                                            (sub_pertanyaan) => {
                                                return {
                                                    sub_pertanyaan:
                                                        sub_pertanyaan.sub_pertanyaan,
                                                    value: res.data.pertanyaan.data_sub_topik_pertanyaan.map(
                                                        (sub_topik) => {
                                                            let label = [];
                                                            let dataperlabel =
                                                                [];
                                                            let counter = {};
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
                        res.data.pertanyaan.tipe == "Pilihan_Dengan_SubTopik"
                    ) {
                        let dataJawaban = res.data.data.filter(
                            (e) => e.id_pertanyaan == res.data.pertanyaan.id
                        );
                        if (dataJawaban.length > 0) {
                            return {
                                id_pertanyaan: res.data.pertanyaan.id,
                                pertanyaan: res.data.pertanyaan.pertanyaan,
                                tipe: res.data.pertanyaan.tipe,
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
                                        res.data.pertanyaan.data_sub_topik_pertanyaan.map(
                                            (subtopik) => {
                                                let label = [];
                                                let dataperlabel = [];
                                                let counter = {};
                                                var datahasilsubtopik = [];

                                                dataJawaban.forEach((val) => {
                                                    var check =
                                                        val.data_hasil_jawaban_sub_topik.filter(
                                                            (r) =>
                                                                r.id_sub_topik ==
                                                                subtopik.id
                                                        );
                                                    if (check.length > 0) {
                                                        datahasilsubtopik.push(
                                                            check[0]
                                                        );
                                                    }
                                                });

                                                datahasilsubtopik.forEach(
                                                    (val) => {
                                                        if (
                                                            counter[val.jawaban]
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
                    } else if (res.data.pertanyaan.tipe == "Checkbox") {
                        let dataJawaban = res.data.data.filter(
                            (e) => e.id_pertanyaan == res.data.pertanyaan.id
                        );
                        if (dataJawaban.length > 0) {
                            let label = [];
                            let dataperlabel = [];
                            let counter = {};
                            dataJawaban.forEach((val) => {
                                val.data_hasil_jawaban_pilihan.forEach(
                                    (main) => {
                                        if (main.id_pilihan_jawaban != null) {
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

                            if (
                                res.data.pertanyaan.is_jawaban_lainnya == "Ya"
                            ) {
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
                                id_pertanyaan: res.data.pertanyaan.id,
                                pertanyaan: res.data.pertanyaan.pertanyaan,
                                tipe: res.data.pertanyaan.tipe,
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
                        res.data.pertanyaan.tipe == "Pilihan_Dengan_Inputan"
                    ) {
                        let dataJawaban = res.data.data.filter(
                            (e) => e.id_pertanyaan == res.data.pertanyaan.id
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

                            res.data.pertanyaan.data_pilihan_jawaban.forEach(
                                (val) => {
                                    if (val.isInput == "Tidak") {
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
                                }
                            );
                            return {
                                id_pertanyaan: res.data.pertanyaan.id,
                                pertanyaan: res.data.pertanyaan.pertanyaan,
                                tipe: res.data.pertanyaan.tipe,
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
                    } else if (res.data.pertanyaan.tipe == "Sub_Pertanyaan") {
                        if (
                            res.data.pertanyaan.data_sub_pertanyaan[0]
                                .jenis_subpertanyaan == "Pilihan"
                        ) {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == res.data.pertanyaan.id
                            );
                            if (dataJawaban.length > 0) {
                                let label = [];
                                let dataperlabel = [];
                                res.data.pertanyaan.data_pilihan_jawaban.forEach(
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
                                if (
                                    res.data.pertanyaan.is_jawaban_lainnya ==
                                    "Ya"
                                ) {
                                    var lihatjawaban = dataJawaban.filter(
                                        (e) =>
                                            e.data_hasil_jawaban_pilihan[0]
                                                .jawaban_input != "" ||
                                            e.data_hasil_jawaban_pilihan[0]
                                                .jawaban_input != null
                                    );

                                    if (lihatjawaban.length > 0) {
                                        label.push("Jawaban Lainnya");
                                        dataperlabel.push(lihatjawaban.length);
                                    }
                                }
                                return {
                                    id_pertanyaan: res.data.pertanyaan.id,
                                    pertanyaan: res.data.pertanyaan.pertanyaan,
                                    tipe: res.data.pertanyaan.tipe,
                                    jenis_subpertanyaan:
                                        res.data.pertanyaan
                                            .data_sub_pertanyaan[0]
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
                            res.data.pertanyaan.tipe == "Input_Text" ||
                            res.data.pertanyaan.tipe == "Input_Angka" ||
                            res.data.pertanyaan.tipe == "Input_Tanggal"
                        ) {
                            let dataJawaban = res.data.data.filter(
                                (e) => e.id_pertanyaan == res.data.pertanyaan.id
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
                                    id_pertanyaan: res.data.pertanyaan.id,
                                    pertanyaan: res.data.pertanyaan.pertanyaan,
                                    tipe: res.data.pertanyaan.tipe,
                                    jenis_subpertanyaan:
                                        res.data.pertanyaan
                                            .data_sub_pertanyaan[0]
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
                        }
                    }
                });
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

    var loop = [1];

    return (
        <DashboardLayout>
            <div className="w-full p-5 mt-12 font-semibold text-left rtl:text-right text-gray-900">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                    <p className="text-xl mb-4">
                        Statistik Kuisioner Pertanyaan Lulusan Tahun{" "}
                        {tahun_lulus}
                    </p>
                    {loading ? (
                        <div className="w-full flex justify-center">
                            <Loader></Loader>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 place-content-center h-auto mb-4 p-4">
                            {loop.map((biar) => {
                                {
                                    if (
                                        (dataPieChartJawaban.isTampil &&
                                            dataPieChartJawaban.tipe ==
                                                "Pilihan") ||
                                        dataPieChartJawaban.tipe ==
                                            "Checkbox" ||
                                        dataPieChartJawaban.tipe ==
                                            "Pilihan_Dengan_Inputan"
                                    ) {
                                        return (
                                            <div key={biar} className="mb-4">
                                                <div className="w-full">
                                                    <p className="block mb-2 text-sm font-bold text-gray-900">
                                                        <span className="my-auto">
                                                            {1}.{" "}
                                                            {
                                                                dataPieChartJawaban.pertanyaan
                                                            }
                                                        </span>
                                                    </p>
                                                    <div className="w-full h-80 flex justify-center">
                                                        <Doughnut
                                                            data={
                                                                dataPieChartJawaban
                                                                    .data
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
                                                <div className="w-full px-4 py-2 mt-12">
                                                    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                                                        <TableData
                                                            head={[
                                                                "Waktu Pengisian",
                                                                "Program Studi",
                                                                "Nama",
                                                                "Jawaban Dipilih",
                                                            ]}
                                                            label={
                                                                "Data Hasil Kuisioner"
                                                            }
                                                            filter={false}
                                                            buttonModal={false}
                                                            changeSearch={false}
                                                        >
                                                            {dataJawabanKuisioner.length >
                                                            0 ? (
                                                                loading ==
                                                                false ? (
                                                                    dataJawabanKuisioner.map(
                                                                        (
                                                                            all,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                <tr
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="bg-white border-b font-normal"
                                                                                >
                                                                                    <th
                                                                                        scope="row"
                                                                                        className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                                                    >
                                                                                        {i +
                                                                                            1}
                                                                                    </th>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {tanggal(
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .tanggal_pengisian
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .data_alumni
                                                                                                .data_prodi
                                                                                                .nama
                                                                                        }
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .data_alumni
                                                                                                .nama
                                                                                        }
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {all.data_hasil_jawaban_pilihan.map(
                                                                                            (
                                                                                                val
                                                                                            ) => {
                                                                                                if (
                                                                                                    val.jawaban_input !=
                                                                                                    null
                                                                                                ) {
                                                                                                    if (
                                                                                                        val.id_pilihan_jawaban !=
                                                                                                        null
                                                                                                    ) {
                                                                                                        return `${val.data_master_pilihan_jawaban.nama_pilihan}: ${val.jawaban_input}, `;
                                                                                                    } else {
                                                                                                        return `${val.jawaban_input}, `;
                                                                                                    }
                                                                                                } else {
                                                                                                    return `${val.data_master_pilihan_jawaban.nama_pilihan}, `;
                                                                                                }
                                                                                            }
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )
                                                                ) : (
                                                                    <tr className="bg-white border-b">
                                                                        <td
                                                                            colSpan={
                                                                                5
                                                                            }
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
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                    >
                                                                        {loading ==
                                                                        true ? (
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
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (
                                        dataPieChartJawaban.isTampil &&
                                        dataPieChartJawaban.tipe ==
                                            "Pilihan_2_Sisi_Pertanyaan"
                                    ) {
                                        return (
                                            <div key={biar} className="mb-4">
                                                <div className="w-full">
                                                    <p className="block mb-2 text-sm font-bold text-gray-900">
                                                        <span className="my-auto">
                                                            {1}.{" "}
                                                            {
                                                                dataPieChartJawaban.pertanyaan
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                                {dataPieChartJawaban.data.pilihan_2_sisi.map(
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
                                                                <div className="w-full px-4 py-2 mt-12">
                                                                    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                                                                        <TableData
                                                                            head={[
                                                                                "Waktu Pengisian",
                                                                                "Program Studi",
                                                                                "Nama",
                                                                                "Jawaban Subtopik",
                                                                            ]}
                                                                            label={`Data Hasil Kuisioner Sub Pertanyaan: ${datapilihan_2_sisi.sub_pertanyaan}`}
                                                                            filter={
                                                                                false
                                                                            }
                                                                            buttonModal={
                                                                                false
                                                                            }
                                                                            changeSearch={
                                                                                false
                                                                            }
                                                                        >
                                                                            {dataJawabanKuisioner.length >
                                                                            0 ? (
                                                                                loading ==
                                                                                false ? (
                                                                                    dataJawabanKuisioner.map(
                                                                                        (
                                                                                            all,
                                                                                            i
                                                                                        ) => {
                                                                                            return (
                                                                                                <tr
                                                                                                    key={
                                                                                                        i
                                                                                                    }
                                                                                                    className="bg-white border-b font-normal"
                                                                                                >
                                                                                                    <th
                                                                                                        scope="row"
                                                                                                        className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                                                                    >
                                                                                                        {i +
                                                                                                            1}
                                                                                                    </th>
                                                                                                    <td className="px-6 py-4 text-black">
                                                                                                        {tanggal(
                                                                                                            all
                                                                                                                .data_hasil_kuisioner
                                                                                                                .tanggal_pengisian
                                                                                                        )}
                                                                                                    </td>
                                                                                                    <td className="px-6 py-4 text-black">
                                                                                                        {
                                                                                                            all
                                                                                                                .data_hasil_kuisioner
                                                                                                                .data_alumni
                                                                                                                .data_prodi
                                                                                                                .nama
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td className="px-6 py-4 text-black">
                                                                                                        {
                                                                                                            all
                                                                                                                .data_hasil_kuisioner
                                                                                                                .data_alumni
                                                                                                                .nama
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td className="text-black w-fit">
                                                                                                        <table className="w-full">
                                                                                                            <thead>
                                                                                                                <tr className="border-b w-full border-gray-300 text-center">
                                                                                                                    <th className="border-l">
                                                                                                                        SubTopik
                                                                                                                    </th>
                                                                                                                    <th className="border-l">
                                                                                                                        Jawaban
                                                                                                                    </th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody>
                                                                                                                {all.data_hasil_jawaban_sub_pertanyaan
                                                                                                                    .filter(
                                                                                                                        (
                                                                                                                            cal
                                                                                                                        ) =>
                                                                                                                            cal
                                                                                                                                .data_master_sub_pertanyaan
                                                                                                                                .sub_pertanyaan ===
                                                                                                                            datapilihan_2_sisi.sub_pertanyaan
                                                                                                                    )[0]
                                                                                                                    .data_hasil_jawaban2_sisi.map(
                                                                                                                        (
                                                                                                                            val
                                                                                                                        ) => {
                                                                                                                            return (
                                                                                                                                <tr
                                                                                                                                    key={
                                                                                                                                        val.id
                                                                                                                                    }
                                                                                                                                    className="border-t w-full border-gray-300"
                                                                                                                                >
                                                                                                                                    <td className="px-6 w-full border-l">
                                                                                                                                        {`${val.data_master_sub_topik_pertanyaan.sub_topik_pertanyaan}`}
                                                                                                                                    </td>
                                                                                                                                    <td className="px-6 w-full border-l">
                                                                                                                                        {`${val.jawaban}`}
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            );
                                                                                                                        }
                                                                                                                    )}
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        }
                                                                                    )
                                                                                ) : (
                                                                                    <tr className="bg-white border-b">
                                                                                        <td
                                                                                            colSpan={
                                                                                                5
                                                                                            }
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
                                                                                        colSpan={
                                                                                            5
                                                                                        }
                                                                                        className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                                    >
                                                                                        {loading ==
                                                                                        true ? (
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        );
                                    } else if (
                                        dataPieChartJawaban.isTampil &&
                                        dataPieChartJawaban.tipe ==
                                            "Pilihan_Dengan_SubTopik"
                                    ) {
                                        return (
                                            <div key={biar} className="mb-4">
                                                <div className="w-full">
                                                    <p className="block mb-2 text-sm font-bold text-gray-900">
                                                        <span className="my-auto">
                                                            {1}.{" "}
                                                            {
                                                                dataPieChartJawaban.pertanyaan
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-y-4 gap-2 place-content-center w-full mt-4 px-2">
                                                    {dataPieChartJawaban.data.sub_topik.map(
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
                                                <div className="w-full px-4 py-2 mt-12">
                                                    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                                                        <TableData
                                                            head={[
                                                                "Waktu Pengisian",
                                                                "Program Studi",
                                                                "Nama",
                                                                "Jawaban Subtopik",
                                                            ]}
                                                            label={
                                                                "Data Hasil Kuisioner"
                                                            }
                                                            filter={false}
                                                            buttonModal={false}
                                                            changeSearch={false}
                                                        >
                                                            {dataJawabanKuisioner.length >
                                                            0 ? (
                                                                loading ==
                                                                false ? (
                                                                    dataJawabanKuisioner.map(
                                                                        (
                                                                            all,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                <tr
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="bg-white border-b font-normal"
                                                                                >
                                                                                    <th
                                                                                        scope="row"
                                                                                        className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                                                    >
                                                                                        {i +
                                                                                            1}
                                                                                    </th>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {tanggal(
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .tanggal_pengisian
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .data_alumni
                                                                                                .data_prodi
                                                                                                .nama
                                                                                        }
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .data_alumni
                                                                                                .nama
                                                                                        }
                                                                                    </td>
                                                                                    <td className="text-black w-fit">
                                                                                        <table className="w-full">
                                                                                            <thead>
                                                                                                <tr className="border-b w-full border-gray-300 text-center">
                                                                                                    <th className="border-l">
                                                                                                        SubTopik
                                                                                                    </th>
                                                                                                    <th className="border-l">
                                                                                                        Jawaban
                                                                                                    </th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {all.data_hasil_jawaban_sub_topik.map(
                                                                                                    (
                                                                                                        val
                                                                                                    ) => {
                                                                                                        return (
                                                                                                            <tr
                                                                                                                key={
                                                                                                                    val.id
                                                                                                                }
                                                                                                                className="border-t w-full border-gray-300"
                                                                                                            >
                                                                                                                <td className="px-6 w-full border-l">
                                                                                                                    {`${val.data_master_sub_topik_pertanyaan.sub_topik_pertanyaan}`}
                                                                                                                </td>
                                                                                                                <td className="px-6 w-full border-l">
                                                                                                                    {`${val.jawaban}`}
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        );
                                                                                                    }
                                                                                                )}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )
                                                                ) : (
                                                                    <tr className="bg-white border-b">
                                                                        <td
                                                                            colSpan={
                                                                                5
                                                                            }
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
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                    >
                                                                        {loading ==
                                                                        true ? (
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
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (
                                        (dataPieChartJawaban.isTampil &&
                                            dataPieChartJawaban.tipe ==
                                                "Input_Text") ||
                                        dataPieChartJawaban.tipe ==
                                            "Input_Angka" ||
                                        dataPieChartJawaban.tipe ==
                                            "Input_Tanggal"
                                    ) {
                                        return (
                                            <div key={biar} className="mb-4">
                                                <div className="w-full">
                                                    <p className="block mb-2 text-sm font-bold text-gray-900">
                                                        <span className="my-auto">
                                                            {1}.{" "}
                                                            {
                                                                dataPieChartJawaban.pertanyaan
                                                            }
                                                        </span>
                                                    </p>
                                                    <div className="w-full h-80 flex justify-center">
                                                        <Doughnut
                                                            data={
                                                                dataPieChartJawaban
                                                                    .data
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
                                                <div className="w-full px-4 py-2 mt-12">
                                                    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                                                        <TableData
                                                            head={[
                                                                "Waktu Pengisian",
                                                                "Program Studi",
                                                                "Nama",
                                                                "Jawaban Dipilih",
                                                            ]}
                                                            label={
                                                                "Data Hasil Kuisioner"
                                                            }
                                                            filter={false}
                                                            buttonModal={false}
                                                            changeSearch={false}
                                                        >
                                                            {dataJawabanKuisioner.length >
                                                            0 ? (
                                                                loading ==
                                                                false ? (
                                                                    dataJawabanKuisioner.map(
                                                                        (
                                                                            all,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                <tr
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="bg-white border-b font-normal"
                                                                                >
                                                                                    <th
                                                                                        scope="row"
                                                                                        className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                                                    >
                                                                                        {i +
                                                                                            1}
                                                                                    </th>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {tanggal(
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .tanggal_pengisian
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .data_alumni
                                                                                                .data_prodi
                                                                                                .nama
                                                                                        }
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {
                                                                                            all
                                                                                                .data_hasil_kuisioner
                                                                                                .data_alumni
                                                                                                .nama
                                                                                        }
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-black">
                                                                                        {all.data_hasil_jawaban_pilihan.map(
                                                                                            (
                                                                                                val
                                                                                            ) => {
                                                                                                if (
                                                                                                    val.jawaban_input !=
                                                                                                    null
                                                                                                ) {
                                                                                                    if (
                                                                                                        val.id_pilihan_jawaban !=
                                                                                                        null
                                                                                                    ) {
                                                                                                        return `${val.data_master_pilihan_jawaban.nama_pilihan}: ${val.jawaban_input}, `;
                                                                                                    } else {
                                                                                                        return `${val.jawaban_input}, `;
                                                                                                    }
                                                                                                } else {
                                                                                                    return `${val.data_master_pilihan_jawaban.nama_pilihan}, `;
                                                                                                }
                                                                                            }
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )
                                                                ) : (
                                                                    <tr className="bg-white border-b">
                                                                        <td
                                                                            colSpan={
                                                                                5
                                                                            }
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
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                    >
                                                                        {loading ==
                                                                        true ? (
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
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (
                                        dataPieChartJawaban.isTampil &&
                                        dataPieChartJawaban.tipe ==
                                            "Sub_Pertanyaan"
                                    ) {
                                        if (
                                            dataPieChartJawaban.jenis_subpertanyaan ==
                                            "Pilihan"
                                        ) {
                                            return (
                                                <div
                                                    key={biar}
                                                    className="mb-4"
                                                >
                                                    <div className="w-full">
                                                        <p className="block mb-2 text-sm font-bold text-gray-900">
                                                            <span className="my-auto">
                                                                {1}.{" "}
                                                                {
                                                                    dataPieChartJawaban.pertanyaan
                                                                }
                                                            </span>
                                                        </p>
                                                        <div className="w-full h-80 flex justify-center">
                                                            <Doughnut
                                                                data={
                                                                    dataPieChartJawaban
                                                                        .data
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
                                                    <div className="w-full px-4 py-2 mt-12">
                                                        <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                                                            <TableData
                                                                head={[
                                                                    "Waktu Pengisian",
                                                                    "Program Studi",
                                                                    "Nama",
                                                                    "Jawaban Dipilih",
                                                                ]}
                                                                label={
                                                                    "Data Hasil Kuisioner"
                                                                }
                                                                filter={false}
                                                                buttonModal={
                                                                    false
                                                                }
                                                                changeSearch={
                                                                    false
                                                                }
                                                            >
                                                                {dataJawabanKuisioner.length >
                                                                0 ? (
                                                                    loading ==
                                                                    false ? (
                                                                        dataJawabanKuisioner.map(
                                                                            (
                                                                                all,
                                                                                i
                                                                            ) => {
                                                                                return (
                                                                                    <tr
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        className="bg-white border-b font-normal"
                                                                                    >
                                                                                        <th
                                                                                            scope="row"
                                                                                            className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                                                        >
                                                                                            {i +
                                                                                                1}
                                                                                        </th>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {tanggal(
                                                                                                all
                                                                                                    .data_hasil_kuisioner
                                                                                                    .tanggal_pengisian
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {
                                                                                                all
                                                                                                    .data_hasil_kuisioner
                                                                                                    .data_alumni
                                                                                                    .data_prodi
                                                                                                    .nama
                                                                                            }
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {
                                                                                                all
                                                                                                    .data_hasil_kuisioner
                                                                                                    .data_alumni
                                                                                                    .nama
                                                                                            }
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {all.data_hasil_jawaban_pilihan.map(
                                                                                                (
                                                                                                    val
                                                                                                ) => {
                                                                                                    if (
                                                                                                        val.jawaban_input !=
                                                                                                        null
                                                                                                    ) {
                                                                                                        if (
                                                                                                            val.id_pilihan_jawaban !=
                                                                                                            null
                                                                                                        ) {
                                                                                                            return `${val.data_master_pilihan_jawaban.nama_pilihan}: ${val.jawaban_input}, `;
                                                                                                        } else {
                                                                                                            return `${val.jawaban_input}, `;
                                                                                                        }
                                                                                                    } else {
                                                                                                        return `${val.data_master_pilihan_jawaban.nama_pilihan}, `;
                                                                                                    }
                                                                                                }
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            }
                                                                        )
                                                                    ) : (
                                                                        <tr className="bg-white border-b">
                                                                            <td
                                                                                colSpan={
                                                                                    5
                                                                                }
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
                                                                            colSpan={
                                                                                5
                                                                            }
                                                                            className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                        >
                                                                            {loading ==
                                                                            true ? (
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
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={biar}
                                                    className="mb-4"
                                                >
                                                    <div className="w-full">
                                                        <p className="block mb-2 text-sm font-bold text-gray-900">
                                                            <span className="my-auto">
                                                                {1}.{" "}
                                                                {
                                                                    dataPieChartJawaban.pertanyaan
                                                                }
                                                            </span>
                                                        </p>
                                                        <div className="w-full h-80 flex justify-center">
                                                            <Doughnut
                                                                data={
                                                                    dataPieChartJawaban
                                                                        .data
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
                                                    <div className="w-full px-4 py-2 mt-12">
                                                        <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                                                            <TableData
                                                                head={[
                                                                    "Waktu Pengisian",
                                                                    "Program Studi",
                                                                    "Nama",
                                                                    "Jawaban Dipilih",
                                                                ]}
                                                                label={
                                                                    "Data Hasil Kuisioner"
                                                                }
                                                                filter={false}
                                                                buttonModal={
                                                                    false
                                                                }
                                                                changeSearch={
                                                                    false
                                                                }
                                                            >
                                                                {dataJawabanKuisioner.length >
                                                                0 ? (
                                                                    loading ==
                                                                    false ? (
                                                                        dataJawabanKuisioner.map(
                                                                            (
                                                                                all,
                                                                                i
                                                                            ) => {
                                                                                return (
                                                                                    <tr
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        className="bg-white border-b font-normal"
                                                                                    >
                                                                                        <th
                                                                                            scope="row"
                                                                                            className="py-4 text-center font-semibold text-gray-900 whitespace-nowrap"
                                                                                        >
                                                                                            {i +
                                                                                                1}
                                                                                        </th>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {tanggal(
                                                                                                all
                                                                                                    .data_hasil_kuisioner
                                                                                                    .tanggal_pengisian
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {
                                                                                                all
                                                                                                    .data_hasil_kuisioner
                                                                                                    .data_alumni
                                                                                                    .data_prodi
                                                                                                    .nama
                                                                                            }
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {
                                                                                                all
                                                                                                    .data_hasil_kuisioner
                                                                                                    .data_alumni
                                                                                                    .nama
                                                                                            }
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-black">
                                                                                            {all.data_hasil_jawaban_pilihan.map(
                                                                                                (
                                                                                                    val
                                                                                                ) => {
                                                                                                    if (
                                                                                                        val.jawaban_input !=
                                                                                                        null
                                                                                                    ) {
                                                                                                        if (
                                                                                                            val.id_pilihan_jawaban !=
                                                                                                            null
                                                                                                        ) {
                                                                                                            return `${val.data_master_pilihan_jawaban.nama_pilihan}: ${val.jawaban_input}, `;
                                                                                                        } else {
                                                                                                            return `${val.jawaban_input}, `;
                                                                                                        }
                                                                                                    } else {
                                                                                                        return `${val.data_master_pilihan_jawaban.nama_pilihan}, `;
                                                                                                    }
                                                                                                }
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            }
                                                                        )
                                                                    ) : (
                                                                        <tr className="bg-white border-b">
                                                                            <td
                                                                                colSpan={
                                                                                    5
                                                                                }
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
                                                                            colSpan={
                                                                                5
                                                                            }
                                                                            className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                        >
                                                                            {loading ==
                                                                            true ? (
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
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
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
