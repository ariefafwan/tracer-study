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
import Select from "react-select";
import Creatable from "react-select/creatable";
import CreatableSelect from "react-select/creatable";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const ShowHasilKuisioner = () => {
    let navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [dataAlumni, setDataAlumni] = useState({
        program_studi: "",
        fakultas: "",
        jenis_kelamin: "",
        nama: "",
        nik: "",
        nim: "",
        tahun_lulus: "",
        npwp: "",
    });
    const [adaKuisionerLainnya, setAdaKuisionerLainnya] = useState(false);
    const [checkOptional, setCheckOptional] = useState(true);

    const [formKuisioner, setFormKuisioner] = useState([
        {
            id_pertanyaan: "",
            pertanyaan: "",
            tipe: "",
            is_jawaban_lainnya: "",
            urutan: "",
            dataPilihanJawaban: [
                {
                    label: "",
                    value: "",
                },
            ],
            pilihan_jawaban_subtopik: [
                {
                    id_sub_topik_pertanyaan: "",
                    sub_topik_pertanyaan: "",
                    value: "",
                },
            ],
            jawaban_input: "",
            pilihan_jawaban_2_sisi: [
                {
                    id_sub_pertanyaan: "",
                    sub_pertanyaan: "",
                    value: [
                        {
                            id_sub_topik_pertanyaan: "",
                            sub_topik_pertanyaan: "",
                            value: {
                                label: "",
                                value: "",
                            },
                        },
                    ],
                },
            ],
            pilihan_jawaban: {
                label: "",
                value: "",
            },
            pilihan_dengan_inputan: [
                {
                    id_pilihan_jawaban: "",
                    nama_pilihan: "",
                    isInput: false,
                },
            ],
            jawaban_pilihan_inputan: {
                id_pilihan_jawaban: "",
                jawaban_input: "",
            },
            checkbox: [
                {
                    id_pilihan_jawaban: "",
                    nama_pilihan: "",
                    value: false,
                    jawaban_input: "",
                    isLainnya: false,
                },
            ],
        },
    ]);
    const [formKuisionerOptional, setFormKuisionerOptional] = useState([
        {
            id_pertanyaan: "",
            pertanyaan: "",
            id_parent: "",
            tipe: "",
            jenis_subpertanyaan: "",
            is_jawaban_lainnya: "",
            isTampil: false,
            id_tampil_pilihan_jawaban: "",
            dataPilihanJawaban: [
                {
                    label: "",
                    value: "",
                },
            ],
            pilihan_jawaban: {
                label: "",
                value: "",
            },
            jawaban_input: "",
        },
    ]);

    useEffect(() => {
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/hasil/hasil/show_hasil/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                setDataAlumni({
                    program_studi: res.data.alumni.data_prodi.nama,
                    fakultas: res.data.alumni.data_prodi.data_fakultas.nama,
                    jenis_kelamin: res.data.alumni.jenis_kelamin,
                    nama: res.data.alumni.nama,
                    nik: res.data.alumni.nik,
                    nim: res.data.alumni.nim,
                    tahun_lulus: res.data.alumni.tahun_lulus,
                    npwp:
                        res.data.alumni.npwp == null
                            ? "Tidak Ada Data"
                            : res.data.alumni.npwp,
                });
                setFormKuisioner(
                    res.data.pertanyaan.map((data) => {
                        var jawabanterpilih = res.data.data.filter(
                            (val, i) => val.id_pertanyaan == data.id
                        );
                        if (jawabanterpilih.length > 0) {
                            if (data.tipe == "Pilihan") {
                                return {
                                    id_pertanyaan: data.id,
                                    pertanyaan: data.pertanyaan,
                                    tipe: data.tipe,
                                    is_jawaban_lainnya: data.is_jawaban_lainnya,
                                    urutan: data.urutan,
                                    dataPilihanJawaban:
                                        data.data_pilihan_jawaban.map((val) => {
                                            return {
                                                label: val.nama_pilihan,
                                                value: val.id,
                                            };
                                        }),
                                    pilihan_jawaban_subtopik: [],
                                    jawaban_input: "",
                                    pilihan_jawaban_2_sisi: [],
                                    pilihan_jawaban: {
                                        label: jawabanterpilih[0]
                                            .data_hasil_jawaban_pilihan[0]
                                            .data_master_pilihan_jawaban
                                            .nama_pilihan,
                                        value: jawabanterpilih[0]
                                            .data_hasil_jawaban_pilihan[0]
                                            .id_pilihan_jawaban,
                                    },
                                    pilihan_dengan_inputan: [],
                                    jawaban_pilihan_inputan: {
                                        id_pilihan_jawaban: "",
                                        jawaban_input: "",
                                    },
                                    checkbox: [],
                                };
                            } else if (data.tipe == "Checkbox") {
                                return {
                                    id_pertanyaan: data.id,
                                    pertanyaan: data.pertanyaan,
                                    tipe: data.tipe,
                                    is_jawaban_lainnya: data.is_jawaban_lainnya,
                                    urutan: data.urutan,
                                    dataPilihanJawaban: [],
                                    pilihan_jawaban_subtopik: [],
                                    jawaban_input: "",
                                    pilihan_jawaban_2_sisi: [],
                                    pilihan_jawaban: {
                                        label: "",
                                        value: "",
                                    },
                                    pilihan_dengan_inputan: [],
                                    jawaban_pilihan_inputan: {
                                        id_pilihan_jawaban: "",
                                        jawaban_input: "",
                                    },
                                    checkbox:
                                        jawabanterpilih[0].data_hasil_jawaban_pilihan.map(
                                            (val) => {
                                                if (
                                                    val.id_pilihan_jawaban ==
                                                        null ||
                                                    val.id_pilihan_jawaban == ""
                                                ) {
                                                    return {
                                                        id_pilihan_jawaban: "",
                                                        nama_pilihan: "Lainnya",
                                                        value: true,
                                                        jawaban_input:
                                                            val.jawaban_input,
                                                        isLainnya: true,
                                                    };
                                                } else {
                                                    return {
                                                        id_pilihan_jawaban:
                                                            val.id_pilihan_jawaban,
                                                        nama_pilihan:
                                                            val
                                                                .data_master_pilihan_jawaban
                                                                .nama_pilihan,
                                                        value: true,
                                                        jawaban_input: "",
                                                        isLainnya: false,
                                                    };
                                                }
                                            }
                                        ),
                                };
                            } else if (
                                data.tipe == "Inputan_Angka" ||
                                data.tipe == "Inputan_Text" ||
                                data.tipe == "Inputan_Tanggal"
                            ) {
                                return {
                                    id_pertanyaan: data.id,
                                    pertanyaan: data.pertanyaan,
                                    tipe: data.tipe,
                                    is_jawaban_lainnya: data.is_jawaban_lainnya,
                                    urutan: data.urutan,
                                    dataPilihanJawaban: [],
                                    pilihan_jawaban_subtopik: [],
                                    jawaban_input:
                                        jawabanterpilih[0]
                                            .data_hasil_jawaban_pilihan[0]
                                            .jawaban_input,
                                    pilihan_jawaban_2_sisi: [],
                                    pilihan_jawaban: {
                                        label: "",
                                        value: "",
                                    },
                                    pilihan_dengan_inputan: [],
                                    jawaban_pilihan_inputan: {
                                        id_pilihan_jawaban: "",
                                        jawaban_input: "",
                                    },
                                    checkbox: [],
                                };
                            } else if (data.tipe == "Pilihan_Dengan_SubTopik") {
                                return {
                                    id_pertanyaan: data.id,
                                    pertanyaan: data.pertanyaan,
                                    tipe: data.tipe,
                                    is_jawaban_lainnya: data.is_jawaban_lainnya,
                                    urutan: data.urutan,
                                    dataPilihanJawaban: [],
                                    pilihan_jawaban_subtopik:
                                        jawabanterpilih[0].data_hasil_jawaban_sub_topik.map(
                                            (val) => {
                                                return {
                                                    id_sub_topik_pertanyaan:
                                                        val.id_sub_topik,
                                                    sub_topik_pertanyaan:
                                                        val
                                                            .data_master_sub_topik_pertanyaan
                                                            .sub_topik_pertanyaan,
                                                    value: val.jawaban,
                                                };
                                            }
                                        ),
                                    jawaban_input: "",
                                    pilihan_jawaban_2_sisi: [],
                                    pilihan_jawaban: {
                                        label: "",
                                        value: "",
                                    },
                                    pilihan_dengan_inputan: [],
                                    jawaban_pilihan_inputan: {
                                        id_pilihan_jawaban: "",
                                        jawaban_input: "",
                                    },
                                    checkbox: [],
                                };
                            } else if (data.tipe == "Pilihan_Dengan_Inputan") {
                                return {
                                    id_pertanyaan: data.id,
                                    pertanyaan: data.pertanyaan,
                                    tipe: data.tipe,
                                    is_jawaban_lainnya: data.is_jawaban_lainnya,
                                    urutan: data.urutan,
                                    dataPilihanJawaban: [],
                                    pilihan_jawaban_subtopik: [],
                                    jawaban_input: "",
                                    pilihan_jawaban_2_sisi: [],
                                    pilihan_jawaban: {
                                        label: "",
                                        value: "",
                                    },
                                    pilihan_dengan_inputan:
                                        data.data_pilihan_jawaban.map((val) => {
                                            return {
                                                id_pilihan_jawaban: val.id,
                                                nama_pilihan: val.nama_pilihan,
                                                isInput:
                                                    val.isInput == "Ya"
                                                        ? true
                                                        : false,
                                            };
                                        }),
                                    jawaban_pilihan_inputan: {
                                        id_pilihan_jawaban:
                                            jawabanterpilih[0]
                                                .data_hasil_jawaban_pilihan[0]
                                                .id_pilihan_jawaban,
                                        jawaban_input:
                                            jawabanterpilih[0]
                                                .data_hasil_jawaban_pilihan[0]
                                                .jawaban_input,
                                    },
                                    checkbox: [],
                                };
                            } else if (
                                data.tipe == "Pilihan_2_Sisi_Pertanyaan"
                            ) {
                                return {
                                    id_pertanyaan: data.id,
                                    pertanyaan: data.pertanyaan,
                                    tipe: data.tipe,
                                    is_jawaban_lainnya: data.is_jawaban_lainnya,
                                    urutan: data.urutan,
                                    dataPilihanJawaban: [],
                                    pilihan_jawaban_subtopik: [],
                                    jawaban_input: "",
                                    pilihan_jawaban_2_sisi:
                                        jawabanterpilih[0].data_hasil_jawaban_sub_pertanyaan.map(
                                            (val) => {
                                                return {
                                                    id_sub_pertanyaan:
                                                        val.id_sub_pertanyaan,
                                                    sub_pertanyaan:
                                                        val
                                                            .data_master_sub_pertanyaan
                                                            .sub_pertanyaan,
                                                    value: val.data_hasil_jawaban2_sisi.map(
                                                        (main) => {
                                                            return {
                                                                id_sub_topik_pertanyaan:
                                                                    main.id_sub_topik,
                                                                sub_topik_pertanyaan:
                                                                    main
                                                                        .data_master_sub_topik_pertanyaan
                                                                        .sub_topik_pertanyaan,
                                                                value: {
                                                                    label: main.jawaban,
                                                                    value: main.jawaban,
                                                                },
                                                            };
                                                        }
                                                    ),
                                                };
                                            }
                                        ),
                                    pilihan_jawaban: {
                                        label: "",
                                        value: "",
                                    },
                                    pilihan_dengan_inputan: [],
                                    jawaban_pilihan_inputan: {
                                        id_pilihan_jawaban: "",
                                        jawaban_input: "",
                                    },
                                    checkbox: [],
                                };
                            }
                        }
                    })
                );

                if (res.data.pertanyaanOptional.length > 0) {
                    setFormKuisionerOptional(
                        res.data.pertanyaanOptional.map((data) => {
                            var jawabanOptionalTerpilih = res.data.data.filter(
                                (val) => {
                                    return val.id_pertanyaan == data.id;
                                }
                            );
                            if (jawabanOptionalTerpilih.length > 0) {
                                if (
                                    data.data_sub_pertanyaan[0]
                                        .jenis_subpertanyaan == "Pilihan"
                                ) {
                                    return {
                                        id_pertanyaan: data.id,
                                        pertanyaan: data.pertanyaan,
                                        id_parent: data.id_parent,
                                        tipe: data.tipe,
                                        jenis_subpertanyaan:
                                            data.data_sub_pertanyaan[0]
                                                .jenis_subpertanyaan,
                                        is_jawaban_lainnya:
                                            data.is_jawaban_lainnya,
                                        isTampil: true,
                                        id_tampil_pilihan_jawaban:
                                            data.data_sub_pertanyaan[0]
                                                .id_pilihan_jawaban,
                                        dataPilihanJawaban:
                                            data.data_pilihan_jawaban.map(
                                                (val) => {
                                                    return {
                                                        label: val.nama_pilihan,
                                                        value: val.id,
                                                    };
                                                }
                                            ),
                                        pilihan_jawaban: {
                                            label: jawabanOptionalTerpilih[0]
                                                .data_hasil_jawaban_pilihan[0]
                                                .data_master_pilihan_jawaban
                                                .nama_pilihan,
                                            value: jawabanOptionalTerpilih[0]
                                                .data_hasil_jawaban_pilihan[0]
                                                .id_pilihan_jawaban,
                                        },
                                        jawaban_input: "",
                                    };
                                } else {
                                    return {
                                        id_pertanyaan: data.id,
                                        pertanyaan: data.pertanyaan,
                                        id_parent: data.id_parent,
                                        tipe: data.tipe,
                                        jenis_subpertanyaan:
                                            data.data_sub_pertanyaan[0]
                                                .jenis_subpertanyaan,
                                        is_jawaban_lainnya:
                                            data.is_jawaban_lainnya,
                                        isTampil: true,
                                        id_tampil_pilihan_jawaban:
                                            data.data_sub_pertanyaan[0]
                                                .id_pilihan_jawaban,
                                        dataPilihanJawaban: [],
                                        pilihan_jawaban: {
                                            label: "",
                                            value: "",
                                        },
                                        jawaban_input:
                                            jawabanOptionalTerpilih[0]
                                                .data_hasil_jawaban_pilihan[0]
                                                .jawaban_input,
                                    };
                                }
                            } else {
                                return {
                                    id_pertanyaan: "",
                                    pertanyaan: "",
                                    id_parent: "",
                                    tipe: "",
                                    jenis_subpertanyaan: "",
                                    is_jawaban_lainnya: "",
                                    isTampil: false,
                                    id_tampil_pilihan_jawaban: "",
                                    dataPilihanJawaban: [
                                        {
                                            label: "",
                                            value: "",
                                        },
                                    ],
                                    pilihan_jawaban: {
                                        label: "",
                                        value: "",
                                    },
                                    jawaban_input: "",
                                };
                            }
                        })
                    );
                }
                setLoading(false);
                setCheckOptional(false);
            })
            .catch((error) => {
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!checkOptional) {
            if (formKuisionerOptional.length == 1) {
                if (formKuisionerOptional[0].isTampil == true) {
                    setAdaKuisionerLainnya(true);
                }
            } else {
                setAdaKuisionerLainnya(false);
            }
        }
    }, [checkOptional, setCheckOptional]);

    const option2SisiPertanyaan = [
        {
            label: "Sangat Tinggi",
            value: "Sangat Tinggi",
        },
        {
            label: "Tinggi",
            value: "Tinggi",
        },
        {
            label: "Cukup",
            value: "Cukup",
        },
        {
            label: "Rendah",
            value: "Rendah",
        },
        {
            label: "Sangat Rendah",
            value: "Sangat Rendah",
        },
    ];

    return (
        <>
            <DashboardLayout>
                <div className="w-full px-4 py-2 mt-12">
                    <section className="bg-white mx-auto max-w-screen-xl px-8 pb-16">
                        <div className="w-full">
                            {loading ? (
                                <div className="flex justify-center mt-8">
                                    <Loader></Loader>
                                </div>
                            ) : (
                                <div>
                                    <div className="mx-auto max-w-screen-xl p-8 sm:px-6 mb-2">
                                        <h6 className="font-bold text-xl mb-4">
                                            Identitas Alumni
                                        </h6>
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                            <div className="md:col-span-3">
                                                <label htmlFor="nama">
                                                    Nama
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nama"
                                                    id="nama"
                                                    value={dataAlumni.nama}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="nim">NIM</label>
                                                <input
                                                    type="number"
                                                    name="nim"
                                                    id="nim"
                                                    value={dataAlumni.nim}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="lulusan">
                                                    Tahun Lulus
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lulusan"
                                                    id="lulusan"
                                                    value={
                                                        dataAlumni.tahun_lulus
                                                    }
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="nik">NIK</label>
                                                <input
                                                    type="text"
                                                    name="nik"
                                                    id="nik"
                                                    value={dataAlumni.nik}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="Program_Studi">
                                                    Fakultas
                                                </label>
                                                <input
                                                    type="text"
                                                    name="prodi"
                                                    id="prodi"
                                                    value={dataAlumni.fakultas}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="Program_Studi">
                                                    Program Studi
                                                </label>
                                                <input
                                                    type="text"
                                                    name="prodi"
                                                    id="prodi"
                                                    value={
                                                        dataAlumni.program_studi
                                                    }
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="jenis_kelamin">
                                                    Jenis Kelamin
                                                </label>
                                                <select
                                                    value={
                                                        dataAlumni.jenis_kelamin
                                                    }
                                                    id="jenis_kelamin"
                                                    required
                                                    disabled
                                                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                >
                                                    <option value="">
                                                        Pilih Jenis Kelamin
                                                    </option>
                                                    <option value="Laki-Laki">
                                                        Laki-Laki
                                                    </option>
                                                    <option value="Perempuan">
                                                        Perempuan
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="npwp">
                                                    NPWP
                                                </label>
                                                <input
                                                    type="text"
                                                    name="npwp"
                                                    id="npwp"
                                                    value={dataAlumni.npwp}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"
                                                    placeholder="..."
                                                    required
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mx-auto max-w-screen-xl px-8 pt-4 sm:px-6 lg:px-8">
                                        <h6 className="font-bold text-xl">
                                            Kuisioner Wajib
                                        </h6>
                                        {formKuisioner.map((data, i) => {
                                            if (data.tipe == "Input_Text") {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="px-8">
                                                            <input
                                                                type="text"
                                                                id={
                                                                    data.id_pertanyaan
                                                                }
                                                                disabled
                                                                value={
                                                                    data.jawaban_input
                                                                }
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (
                                                data.tipe == "Input_Angka"
                                            ) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="px-8">
                                                            <input
                                                                type="number"
                                                                id={
                                                                    data.id_pertanyaan
                                                                }
                                                                disabled
                                                                value={
                                                                    data.jawaban_input
                                                                }
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (
                                                data.tipe == "Input_Tanggal"
                                            ) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="px-8">
                                                            <input
                                                                type="date"
                                                                id={
                                                                    data.id_pertanyaan
                                                                }
                                                                disabled
                                                                value={
                                                                    data.jawaban_input
                                                                }
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (data.tipe == "Pilihan") {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}{" "}
                                                            {data.is_jawaban_lainnya ==
                                                            "Ya"
                                                                ? "(Jawaban Bisa Diisi Selain Dari Pilihan Yang Ada)"
                                                                : ""}
                                                        </label>
                                                        <div className="px-8">
                                                            {data.is_jawaban_lainnya ==
                                                            "Ya" ? (
                                                                <CreatableSelect
                                                                    isClearable
                                                                    placeholder={
                                                                        "Pilihan"
                                                                    }
                                                                    id={
                                                                        data.id_pertanyaan
                                                                    }
                                                                    isDisabled
                                                                    value={
                                                                        data.pilihan_jawaban
                                                                    }
                                                                    options={
                                                                        data.dataPilihanJawaban
                                                                    }
                                                                    required
                                                                    className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                />
                                                            ) : (
                                                                <Select
                                                                    id={
                                                                        data.id_pertanyaan
                                                                    }
                                                                    isDisabled
                                                                    value={
                                                                        data.pilihan_jawaban
                                                                    }
                                                                    options={
                                                                        data.dataPilihanJawaban
                                                                    }
                                                                    required
                                                                    placeholder="Pilihan"
                                                                    className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (
                                                data.tipe == "Checkbox"
                                            ) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="px-8">
                                                            {data.checkbox.map(
                                                                (
                                                                    checkbox,
                                                                    index
                                                                ) => {
                                                                    return checkbox.isLainnya ==
                                                                        false ? (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center mb-2"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                id={
                                                                                    checkbox.id_pilihan_jawaban
                                                                                }
                                                                                name={
                                                                                    data.id_pertanyaan
                                                                                }
                                                                                checked={
                                                                                    checkbox.value
                                                                                }
                                                                                disabled
                                                                                value={
                                                                                    checkbox.value
                                                                                }
                                                                                required
                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                            />
                                                                            <label
                                                                                htmlFor={
                                                                                    checkbox.id_pilihan_jawaban
                                                                                }
                                                                                className="ms-2 text-sm font-medium text-gray-900"
                                                                            >
                                                                                {
                                                                                    checkbox.nama_pilihan
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <div className="flex items-center mb-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={
                                                                                        checkbox.id_pilihan_jawaban
                                                                                    }
                                                                                    name={
                                                                                        data.id_pertanyaan
                                                                                    }
                                                                                    checked={
                                                                                        checkbox.value
                                                                                    }
                                                                                    disabled
                                                                                    value={
                                                                                        checkbox.value
                                                                                    }
                                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                                />
                                                                                <label
                                                                                    htmlFor={
                                                                                        checkbox.id_pilihan_jawaban
                                                                                    }
                                                                                    className="ms-2 text-sm font-medium text-gray-900"
                                                                                >
                                                                                    {
                                                                                        checkbox.nama_pilihan
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                id={
                                                                                    checkbox.nama_pilihan
                                                                                }
                                                                                value={
                                                                                    checkbox.jawaban_input
                                                                                }
                                                                                disabled
                                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                                required={
                                                                                    checkbox.value
                                                                                }
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (
                                                data.tipe ===
                                                "Pilihan_Dengan_SubTopik"
                                            ) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="grid grid-cols-3 gap-4 px-8">
                                                            {data.pilihan_jawaban_subtopik.map(
                                                                (
                                                                    subtopik,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <label
                                                                                htmlFor={
                                                                                    subtopik.sub_topik_pertanyaan
                                                                                }
                                                                                className="block mb-2 text-sm font-normal text-gray-900"
                                                                            >
                                                                                {
                                                                                    subtopik.sub_topik_pertanyaan
                                                                                }
                                                                            </label>
                                                                            <div>
                                                                                <div className="flex items-center mb-2">
                                                                                    <input
                                                                                        id={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "sangatbesar"
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            subtopik.value
                                                                                        }
                                                                                        checked={
                                                                                            subtopik.value ==
                                                                                            "Sangat Besar"
                                                                                        }
                                                                                        disabled
                                                                                        name={
                                                                                            subtopik.id_sub_topik_pertanyaan
                                                                                        }
                                                                                        required
                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "sangatbesar"
                                                                                        }
                                                                                        className="ms-2 text-sm font-medium text-gray-900"
                                                                                    >
                                                                                        Sangat
                                                                                        Besar
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center mb-2">
                                                                                    <input
                                                                                        id={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "besar"
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            subtopik.value
                                                                                        }
                                                                                        checked={
                                                                                            subtopik.value ==
                                                                                            "Besar"
                                                                                        }
                                                                                        disabled
                                                                                        name={
                                                                                            subtopik.id_sub_topik_pertanyaan
                                                                                        }
                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "besar"
                                                                                        }
                                                                                        className="ms-2 text-sm font-medium text-gray-900"
                                                                                    >
                                                                                        Besar
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center mb-2">
                                                                                    <input
                                                                                        id={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "cukupbesar"
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            subtopik.value
                                                                                        }
                                                                                        checked={
                                                                                            subtopik.value ==
                                                                                            "Cukup Besar"
                                                                                        }
                                                                                        disabled
                                                                                        name={
                                                                                            subtopik.id_sub_topik_pertanyaan
                                                                                        }
                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "cukupbesar"
                                                                                        }
                                                                                        className="ms-2 text-sm font-medium text-gray-900"
                                                                                    >
                                                                                        Cukup
                                                                                        Besar
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center mb-2">
                                                                                    <input
                                                                                        id={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "kurangbesar"
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            subtopik.value
                                                                                        }
                                                                                        checked={
                                                                                            subtopik.value ==
                                                                                            "Kurang Besar"
                                                                                        }
                                                                                        disabled
                                                                                        name={
                                                                                            subtopik.id_sub_topik_pertanyaan
                                                                                        }
                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "kurangbesar"
                                                                                        }
                                                                                        className="ms-2 text-sm font-medium text-gray-900"
                                                                                    >
                                                                                        Kurang
                                                                                        Besar
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex items-center mb-2">
                                                                                    <input
                                                                                        id={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "tidaksamesekali"
                                                                                        }
                                                                                        type="radio"
                                                                                        value={
                                                                                            subtopik.value
                                                                                        }
                                                                                        checked={
                                                                                            subtopik.value ==
                                                                                            "Tidak Sama Sekali"
                                                                                        }
                                                                                        disabled
                                                                                        name={
                                                                                            subtopik.id_sub_topik_pertanyaan
                                                                                        }
                                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={
                                                                                            subtopik.id_sub_topik_pertanyaan +
                                                                                            "tidaksamasekali"
                                                                                        }
                                                                                        className="ms-2 text-sm font-medium text-gray-900"
                                                                                    >
                                                                                        Tidak
                                                                                        Sama
                                                                                        Sekali
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (
                                                data.tipe ==
                                                "Pilihan_Dengan_Inputan"
                                            ) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="px-8">
                                                            {data.pilihan_dengan_inputan.map(
                                                                (
                                                                    pilihan_input,
                                                                    x
                                                                ) => {
                                                                    return pilihan_input.isInput ? (
                                                                        <div
                                                                            key={
                                                                                x
                                                                            }
                                                                            className="flex items-center mb-2"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    pilihan_input.id_pilihan_jawaban
                                                                                }
                                                                                type="radio"
                                                                                value={
                                                                                    data
                                                                                        .jawaban_pilihan_inputan
                                                                                        .id_pilihan_jawaban
                                                                                }
                                                                                checked={
                                                                                    data
                                                                                        .jawaban_pilihan_inputan
                                                                                        .id_pilihan_jawaban ==
                                                                                    pilihan_input.id_pilihan_jawaban
                                                                                }
                                                                                disabled
                                                                                name={
                                                                                    data.id_pertanyaan
                                                                                }
                                                                                required
                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                            />
                                                                            <label
                                                                                htmlFor={
                                                                                    pilihan_input.id_pilihan_jawaban
                                                                                }
                                                                                className="ms-2 flex text-sm font-medium text-gray-900"
                                                                            >
                                                                                <span className="my-auto">
                                                                                    {
                                                                                        pilihan_input.nama_pilihan
                                                                                    }
                                                                                </span>
                                                                                {
                                                                                    "  "
                                                                                }
                                                                                &nbsp;
                                                                                <input
                                                                                    type="number"
                                                                                    value={
                                                                                        data
                                                                                            .jawaban_pilihan_inputan
                                                                                            .jawaban_input
                                                                                    }
                                                                                    required={
                                                                                        data
                                                                                            .jawaban_pilihan_inputan
                                                                                            .id_pilihan_jawaban ==
                                                                                        pilihan_input.id_pilihan_jawaban
                                                                                    }
                                                                                    disabled
                                                                                    className={
                                                                                        (data
                                                                                            .jawaban_pilihan_inputan
                                                                                            .id_pilihan_jawaban !==
                                                                                        pilihan_input.id_pilihan_jawaban
                                                                                            ? "hidden "
                                                                                            : "") +
                                                                                        "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-2/6 p-2.5"
                                                                                    }
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            key={
                                                                                x
                                                                            }
                                                                            className="flex items-center mb-2"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    pilihan_input.id_pilihan_jawaban
                                                                                }
                                                                                type="radio"
                                                                                value={
                                                                                    data
                                                                                        .jawaban_pilihan_inputan
                                                                                        .id_pilihan_jawaban
                                                                                }
                                                                                checked={
                                                                                    data
                                                                                        .jawaban_pilihan_inputan
                                                                                        .id_pilihan_jawaban ==
                                                                                    pilihan_input.id_pilihan_jawaban
                                                                                }
                                                                                disabled
                                                                                name={
                                                                                    data.id_pertanyaan
                                                                                }
                                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                            />
                                                                            <label
                                                                                htmlFor={
                                                                                    pilihan_input.id_pilihan_jawaban
                                                                                }
                                                                                className="ms-2 text-sm font-medium text-gray-900"
                                                                            >
                                                                                {
                                                                                    pilihan_input.nama_pilihan
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (
                                                data.tipe ==
                                                "Pilihan_2_Sisi_Pertanyaan"
                                            ) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-full text-black mt-4"
                                                    >
                                                        <label
                                                            htmlFor={
                                                                data.id_pertanyaan
                                                            }
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            {i + 1}.{" "}
                                                            {data.pertanyaan}
                                                        </label>
                                                        <div className="w-full px-8">
                                                            {data.pilihan_jawaban_2_sisi.map(
                                                                (
                                                                    pilihan,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <div className="mb-2 mt-5 text-sm">
                                                                                <p>
                                                                                    {
                                                                                        pilihan.sub_pertanyaan
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <div className="mb-2">
                                                                                <div className="mb-2 font-normal text-left text-sm text-gray-900 grid grid-cols-3 gap-1">
                                                                                    {pilihan.value.map(
                                                                                        (
                                                                                            sub_topik,
                                                                                            key
                                                                                        ) => {
                                                                                            return (
                                                                                                <div
                                                                                                    key={
                                                                                                        key
                                                                                                    }
                                                                                                    className="w-full text-black mt-2 px-4"
                                                                                                >
                                                                                                    <label
                                                                                                        htmlFor={
                                                                                                            sub_topik.id_sub_topik_pertanyaan +
                                                                                                            pilihan.id_sub_pertanyaan
                                                                                                        }
                                                                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                                                                    >
                                                                                                        {
                                                                                                            sub_topik.sub_topik_pertanyaan
                                                                                                        }
                                                                                                    </label>
                                                                                                    <Select
                                                                                                        id={
                                                                                                            sub_topik.id_sub_topik_pertanyaan +
                                                                                                            pilihan.id_sub_pertanyaan
                                                                                                        }
                                                                                                        required
                                                                                                        options={
                                                                                                            option2SisiPertanyaan
                                                                                                        }
                                                                                                        value={
                                                                                                            sub_topik.value
                                                                                                        }
                                                                                                        isDisabled
                                                                                                        className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                                                    />
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                        {adaKuisionerLainnya ? (
                                            <h6 className="font-bold text-xl mt-8">
                                                Kuisioner Tambahan
                                            </h6>
                                        ) : (
                                            ""
                                        )}
                                        {adaKuisionerLainnya
                                            ? formKuisionerOptional.map(
                                                  (data, i) => {
                                                      if (
                                                          data.isTampil &&
                                                          data.jenis_subpertanyaan ==
                                                              "Input_Text"
                                                      ) {
                                                          return (
                                                              <div
                                                                  key={i}
                                                                  className="w-full text-black mt-4"
                                                              >
                                                                  <label
                                                                      htmlFor={
                                                                          data.id_pertanyaan
                                                                      }
                                                                      className="block mb-2 text-sm font-medium text-gray-900"
                                                                  >
                                                                      {i + 1}.{" "}
                                                                      {
                                                                          data.pertanyaan
                                                                      }
                                                                  </label>
                                                                  <div className="px-8">
                                                                      <input
                                                                          type="text"
                                                                          id={
                                                                              data.id_pertanyaan
                                                                          }
                                                                          disabled
                                                                          value={
                                                                              data.jawaban_input
                                                                          }
                                                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                          );
                                                      } else if (
                                                          data.isTampil &&
                                                          data.jenis_subpertanyaan ==
                                                              "Input_Angka"
                                                      ) {
                                                          return (
                                                              <div
                                                                  key={i}
                                                                  className="w-full text-black mt-4"
                                                              >
                                                                  <label
                                                                      htmlFor={
                                                                          data.id_pertanyaan
                                                                      }
                                                                      className="block mb-2 text-sm font-medium text-gray-900"
                                                                  >
                                                                      {i + 1}.{" "}
                                                                      {
                                                                          data.pertanyaan
                                                                      }
                                                                  </label>
                                                                  <div className="px-8">
                                                                      <input
                                                                          type="number"
                                                                          id={
                                                                              data.id_pertanyaan
                                                                          }
                                                                          disabled
                                                                          value={
                                                                              data.jawaban_input
                                                                          }
                                                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                          );
                                                      } else if (
                                                          data.isTampil &&
                                                          data.jenis_subpertanyaan ==
                                                              "Input_Tanggal"
                                                      ) {
                                                          return (
                                                              <div
                                                                  key={i}
                                                                  className="w-full text-black mt-4"
                                                              >
                                                                  <label
                                                                      htmlFor={
                                                                          data.id_pertanyaan
                                                                      }
                                                                      className="block mb-2 text-sm font-medium text-gray-900"
                                                                  >
                                                                      {i + 1}.{" "}
                                                                      {
                                                                          data.pertanyaan
                                                                      }
                                                                  </label>
                                                                  <div className="px-8">
                                                                      <input
                                                                          type="date"
                                                                          id={
                                                                              data.id_pertanyaan
                                                                          }
                                                                          disabled
                                                                          value={
                                                                              data.jawaban_input
                                                                          }
                                                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-8/12 p-2.5"
                                                                          required
                                                                      />
                                                                  </div>
                                                              </div>
                                                          );
                                                      } else if (
                                                          data.isTampil &&
                                                          data.jenis_subpertanyaan ==
                                                              "Pilihan"
                                                      ) {
                                                          return (
                                                              <div
                                                                  key={i}
                                                                  className="w-full text-black mt-4"
                                                              >
                                                                  <label
                                                                      htmlFor={
                                                                          data.id_pertanyaan
                                                                      }
                                                                      className="block mb-2 text-sm font-medium text-gray-900"
                                                                  >
                                                                      {i + 1}.{" "}
                                                                      {
                                                                          data.pertanyaan
                                                                      }{" "}
                                                                      {data.is_jawaban_lainnya ==
                                                                      "Ya"
                                                                          ? "(Jawaban Bisa Diisi Selain Dari Pilihan Yang Ada)"
                                                                          : ""}
                                                                  </label>
                                                                  <div className="px-8">
                                                                      {data.is_jawaban_lainnya ==
                                                                      "Ya" ? (
                                                                          <CreatableSelect
                                                                              isClearable
                                                                              placeholder={
                                                                                  "Pilihan"
                                                                              }
                                                                              id={
                                                                                  data.id_pertanyaan
                                                                              }
                                                                              isDisabled
                                                                              value={
                                                                                  data.pilihan_jawaban
                                                                              }
                                                                              options={
                                                                                  data.dataPilihanJawaban
                                                                              }
                                                                              required
                                                                              className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                          />
                                                                      ) : (
                                                                          <Select
                                                                              id={
                                                                                  data.id_pertanyaan
                                                                              }
                                                                              isDisabled
                                                                              value={
                                                                                  data.pilihan_jawaban
                                                                              }
                                                                              options={
                                                                                  data.dataPilihanJawaban
                                                                              }
                                                                              required
                                                                              placeholder="Pilihan"
                                                                              className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                          />
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          );
                                                      }
                                                  }
                                              )
                                            : ""}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </DashboardLayout>
        </>
    );
};
