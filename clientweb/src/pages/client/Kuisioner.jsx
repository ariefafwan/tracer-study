/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { GuestLayout } from "../../layouts/GuestLayout";
import { Head } from "../../components/Head";
import { useContext, useEffect, useState } from "react";
import { CardLowongan } from "../../components/CardLowongan";
import { MainContext } from "../../Context/MainContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Select from "react-select";
import Creatable from "react-select/creatable";
import CreatableSelect from "react-select/creatable";
import { Loader } from "../../components/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const Kuisioner = () => {
    let navigate = useNavigate();
    const { checkAuth, setCheckAuth } = useContext(MainContext);
    const [intervalTiming, setIntervalTiming] = useState(1000);
    useEffect(() => {
        const interval = setInterval(() => {
            setCheckAuth(true);
            setIntervalTiming(5 * 60 * 1000);
        }, intervalTiming);

        return () => clearInterval(interval);
    }, [checkAuth, setCheckAuth]);

    const [loading, setLoading] = useState(true);
    const [checkisLainnya, setCheckIsLainnya] = useState(false);
    const [checkIsTampilOptional, setCheckIsTampilOptional] = useState(false);
    const [adaKuisionerLainnya, setAdaKuisionerLainnya] = useState(false);
    const [checkOptional, setCheckOptional] = useState(true);
    const [dataMahasiswa, setDataMahasiswa] = useState({
        id: "",
        nama: "",
        nik: "",
        nim: "",
        id_program_studi: "",
        jenis_kelamin: "",
    });
    const [dataProgramStudi, setDataProgramStudi] = useState([]);
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

    const [formAlumni, setFormAlumni] = useState({
        nama: "",
        nik: "",
        nim: "",
        id_program_studi: {
            label: "",
            value: "",
        },
        jenis_kelamin: "",
    });

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/programstudi`)
            .then((res) => {
                setDataProgramStudi([...res.data]);
            })
            .catch((error) => {
                alert(error);
            });
    }, []);

    const checkAlumni = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Tidak Ada Data Yang Salah?",
            text: "Pastikan Data Sudah Benar",
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
                    .get(
                        `${
                            import.meta.env.VITE_ALL_BASE_URL
                        }/client/checkAlumni?nik=${formAlumni.nik}&nim=${
                            formAlumni.nim
                        }&id_program_studi=${
                            formAlumni.id_program_studi.value
                        }&jenis_kelamin=${formAlumni.jenis_kelamin}&nama=${
                            formAlumni.nama
                        }`
                    )
                    .then((res) => {
                        setDataMahasiswa({
                            id: res.data.id,
                            nama: res.data.nama,
                            nik: res.data.nik,
                            nim: res.data.nim,
                            id_program_studi: res.data.id_program_studi,
                            jenis_kelamin: res.data.jenis_kelamin,
                        });
                        Swal.fire({
                            title: "Success!",
                            text: "Verifikasi Data Berhasil, Silahkan Isi Kuisioner Berikut",
                            icon: "success",
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: "Error!",
                            text: error.response.data.error,
                            icon: "error",
                        });
                    });
            }
        });
    };

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/pertanyaan`)
            .then((res) => {
                setFormKuisioner(
                    res.data.pertanyaan.map((data) => {
                        return {
                            id_pertanyaan: data.id,
                            pertanyaan: data.pertanyaan,
                            tipe: data.tipe,
                            is_jawaban_lainnya: data.is_jawaban_lainnya,
                            urutan: data.urutan,
                            dataPilihanJawaban: data.data_pilihan_jawaban.map(
                                (val) => {
                                    return {
                                        label: val.nama_pilihan,
                                        value: val.id,
                                    };
                                }
                            ),
                            pilihan_jawaban_subtopik:
                                data.data_sub_topik_pertanyaan.map((val) => {
                                    return {
                                        id_sub_topik_pertanyaan: val.id,
                                        sub_topik_pertanyaan:
                                            val.sub_topik_pertanyaan,
                                        value: "",
                                    };
                                }),
                            jawaban_input: "",
                            pilihan_jawaban_2_sisi:
                                data.data_sub_pertanyaan.map((val) => {
                                    return {
                                        id_sub_pertanyaan: val.id,
                                        sub_pertanyaan: val.sub_pertanyaan,
                                        value: data.data_sub_topik_pertanyaan.map(
                                            (main) => {
                                                return {
                                                    id_sub_topik_pertanyaan:
                                                        main.id,
                                                    sub_topik_pertanyaan:
                                                        main.sub_topik_pertanyaan,
                                                    value: {
                                                        label: "",
                                                        value: "",
                                                    },
                                                };
                                            }
                                        ),
                                    };
                                }),
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
                                            val.isInput == "Ya" ? true : false,
                                    };
                                }),
                            jawaban_pilihan_inputan: {
                                id_pilihan_jawaban: "",
                                jawaban_input: "",
                            },
                            checkbox: data.data_pilihan_jawaban.map((val) => {
                                return {
                                    id_pilihan_jawaban: val.id,
                                    nama_pilihan: val.nama_pilihan,
                                    value: false,
                                    jawaban_input: "",
                                    isLainnya: false,
                                };
                            }),
                        };
                    })
                );

                setFormKuisionerOptional(
                    res.data.pertanyaanOptional.map((data) => {
                        return {
                            id_pertanyaan: data.id,
                            pertanyaan: data.pertanyaan,
                            id_parent: data.id_parent,
                            tipe: data.tipe,
                            jenis_subpertanyaan:
                                data.data_sub_pertanyaan[0].jenis_subpertanyaan,
                            is_jawaban_lainnya: data.is_jawaban_lainnya,
                            isTampil: false,
                            id_tampil_pilihan_jawaban:
                                data.data_sub_pertanyaan[0].id_pilihan_jawaban,
                            dataPilihanJawaban: data.data_pilihan_jawaban.map(
                                (val) => {
                                    return {
                                        label: val.nama_pilihan,
                                        value: val.id,
                                    };
                                }
                            ),
                            pilihan_jawaban: {
                                label: "",
                                value: "",
                            },
                            jawaban_input: "",
                        };
                    })
                );
                setLoading(false);
                setCheckIsLainnya(true);
            })
            .catch((error) => {
                alert(error);
            });
    }, []);

    useEffect(() => {
        if (checkisLainnya) {
            setFormKuisioner(
                formKuisioner.map((main, index) => {
                    if (main.is_jawaban_lainnya == "Ya") {
                        return {
                            ...main,
                            checkbox: [
                                ...main.checkbox,
                                {
                                    id_pilihan_jawaban: 0,
                                    nama_pilihan: "Lainnya",
                                    value: false,
                                    jawaban_input: "",
                                    isLainnya: true,
                                },
                            ],
                        };
                    } else {
                        return main;
                    }
                })
            );
            setCheckIsLainnya(false);
            setCheckOptional(false);
            // setTes(false);
        }
    }, [checkisLainnya, setCheckIsLainnya]);

    useEffect(() => {
        if (!checkOptional) {
            formKuisionerOptional.forEach((main, index) => {
                var filter = formKuisioner.filter((kuis, x) => {
                    return kuis.id_pertanyaan == main.id_parent;
                });
                if (filter.length > 0) {
                    if (
                        filter[0].pilihan_jawaban.value ==
                        main.id_tampil_pilihan_jawaban
                    ) {
                        setFormKuisionerOptional(
                            formKuisionerOptional.map((value, ind) => {
                                if (value.id_pertanyaan == main.id_pertanyaan) {
                                    return {
                                        ...value,
                                        isTampil: true,
                                    };
                                } else {
                                    return value;
                                }
                            })
                        );
                    } else {
                        setFormKuisionerOptional(
                            formKuisionerOptional.map((value, ind) => {
                                if (value.id_pertanyaan == main.id_pertanyaan) {
                                    return {
                                        ...value,
                                        isTampil: false,
                                    };
                                } else {
                                    return value;
                                }
                            })
                        );
                    }
                    setCheckIsTampilOptional(true);
                }
            });
        }
    }, [formKuisioner, setFormKuisioner]);

    useEffect(() => {
        if (checkIsTampilOptional) {
            let filterOptional = formKuisionerOptional.filter((val) => {
                return val.isTampil == true;
            });
            if (filterOptional.length > 0) {
                setAdaKuisionerLainnya(true);
            } else {
                setAdaKuisionerLainnya(false);
            }
            setCheckIsTampilOptional(false);
        }
    }, [checkIsTampilOptional, setCheckIsTampilOptional]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        let validate = true;

        try {
            formKuisioner.map((check, i) => {
                if (check.tipe == "Checkbox") {
                    const checkboxes = document.querySelectorAll(
                        `input[name="${check.id_pertanyaan}"]`
                    );
                    if ([...checkboxes].some((e) => e.checked) != true) {
                        throw "Harap Isi Keseluruhan Pertanyaan";
                    }
                } else if (check.tipe == "Pilihan") {
                    if (check.pilihan_jawaban.value == "") {
                        throw "Harap Isi Keseluruhan Pertanyaan";
                    }
                } else if (check.tipe == "Pilihan_2_Sisi_Pertanyaan") {
                    check.pilihan_jawaban_2_sisi.map((sub_pertanyaan, i) => {
                        sub_pertanyaan.value.map((value, i) => {
                            if (value.value.value == "") {
                                throw "Harap Isi Keseluruhan Pertanyaan";
                            }
                        });
                    });
                }
            });

            formKuisionerOptional.map((check, i) => {
                if (check.isTampil == true) {
                    if (check.jenis_subpertanyaan == "Pilihan") {
                        if (check.pilihan_jawaban.value == "") {
                            throw "Harap Isi Keseluruhan Pertanyaan";
                        }
                    }
                }
            });
        } catch (error) {
            alert("Harap Isi Keseluruhan Pertanyaan");
            validate = false;
        }

        if (validate) {
            let valueJawaban = {
                wajib: formKuisioner,
                id_alumni: dataMahasiswa.id,
                optional: formKuisionerOptional,
            };
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
                    axios
                        .post(
                            `${
                                import.meta.env.VITE_ALL_BASE_URL
                            }/client/kuisioner`,
                            valueJawaban
                        )
                        .then((res) => {
                            Swal.fire({
                                title: "Success!",
                                text: "Data Berhasil Ditambahkan.",
                                icon: "success",
                            });
                            // setLoading(true);
                            navigate("/");
                        })
                        .catch((error) => {
                            Swal.fire({
                                title: "Error!",
                                text: error.response.data.error,
                                icon: "error",
                            });
                        });
                }
            });
        }
    };

    return (
        <>
            <Head title="Welcome - Tracer Study" />
            <GuestLayout>
                {dataMahasiswa.id == null || dataMahasiswa.id == "" ? (
                    <section className="bg-white mx-auto max-w-screen-xl px-8 pb-16 pt-24 lg:py-36">
                        <div className="container max-w-screen-lg mx-auto">
                            <form onSubmit={checkAlumni}>
                                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                        <div className="text-gray-700">
                                            <p className="font-medium text-lg">
                                                Biodata Anda Sebagai Alumni
                                            </p>
                                            <p>Silahkan Isi Seluruh Data</p>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                                <div className="md:col-span-6">
                                                    <label htmlFor="nama">
                                                        Nama
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="nama"
                                                        id="nama"
                                                        value={formAlumni.nama}
                                                        onChange={(e) =>
                                                            setFormAlumni({
                                                                ...formAlumni,
                                                                nama: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-6">
                                                    <label htmlFor="nim">
                                                        NIM
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="nim"
                                                        id="nim"
                                                        value={formAlumni.nim}
                                                        onChange={(e) =>
                                                            setFormAlumni({
                                                                ...formAlumni,
                                                                nim: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="nik">
                                                        NIK
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="nik"
                                                        id="nik"
                                                        value={formAlumni.nik}
                                                        onChange={(e) =>
                                                            setFormAlumni({
                                                                ...formAlumni,
                                                                nik: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>

                                                <div className="md:col-span-3">
                                                    <label htmlFor="Program_Studi">
                                                        Program Studi
                                                    </label>
                                                    <Select
                                                        options={
                                                            dataProgramStudi
                                                        }
                                                        onChange={(e) =>
                                                            setFormAlumni({
                                                                ...formAlumni,
                                                                id_program_studi:
                                                                    e,
                                                            })
                                                        }
                                                        required={true}
                                                        placeholder={"..."}
                                                        value={
                                                            formAlumni.id_program_studi
                                                        }
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="jenis_kelamin">
                                                        Jenis Kelamin
                                                    </label>
                                                    <select
                                                        value={
                                                            formAlumni.jenis_kelamin
                                                        }
                                                        id="jenis_kelamin"
                                                        onChange={(e) =>
                                                            setFormAlumni({
                                                                ...formAlumni,
                                                                jenis_kelamin:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        required
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-8">
                                        <div className="inline-flex items-center">
                                            <button
                                                type="submit"
                                                required
                                                className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                            >
                                                Selanjutnya
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                ) : (
                    <section className="bg-white mx-auto max-w-screen-xl px-8 pb-16 pt-24 lg:py-36">
                        <div className="w-full">
                            <header className="max-w-3xl mx-auto flex justify-center">
                                <h2 className="text-xl max-lg:text-center font-bold text-gray-900 sm:text-3xl">
                                    Isi Kuisioner
                                </h2>
                            </header>
                            {loading ? (
                                <div className="flex justify-center mt-8">
                                    <Loader></Loader>
                                </div>
                            ) : (
                                <>
                                    <div className="mx-auto max-w-screen-xl px-8 pt-4 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
                                        <h6 className="font-bold text-xl mb-4">
                                            Identitas
                                        </h6>
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                            <div className="md:col-span-6">
                                                <label htmlFor="nama">
                                                    Nama
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nama"
                                                    id="nama"
                                                    value={formAlumni.nama}
                                                    onChange={(e) =>
                                                        setFormAlumni({
                                                            ...formAlumni,
                                                            nama: e.target
                                                                .value,
                                                        })
                                                    }
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
                                                    value={formAlumni.nim}
                                                    onChange={(e) =>
                                                        setFormAlumni({
                                                            ...formAlumni,
                                                            nim: e.target.value,
                                                        })
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
                                                    type="number"
                                                    name="nik"
                                                    id="nik"
                                                    value={formAlumni.nik}
                                                    onChange={(e) =>
                                                        setFormAlumni({
                                                            ...formAlumni,
                                                            nik: e.target.value,
                                                        })
                                                    }
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
                                                <Select
                                                    options={dataProgramStudi}
                                                    onChange={(e) =>
                                                        setFormAlumni({
                                                            ...formAlumni,
                                                            id_program_studi: e,
                                                        })
                                                    }
                                                    required={true}
                                                    placeholder={"..."}
                                                    value={
                                                        formAlumni.id_program_studi
                                                    }
                                                    isDisabled
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="jenis_kelamin">
                                                    Jenis Kelamin
                                                </label>
                                                <select
                                                    value={
                                                        formAlumni.jenis_kelamin
                                                    }
                                                    id="jenis_kelamin"
                                                    onChange={(e) =>
                                                        setFormAlumni({
                                                            ...formAlumni,
                                                            jenis_kelamin:
                                                                e.target.value,
                                                        })
                                                    }
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
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mx-auto max-w-screen-xl px-8 pt-4 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
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
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setFormKuisioner(
                                                                            formKuisioner.map(
                                                                                (
                                                                                    fil
                                                                                ) => {
                                                                                    if (
                                                                                        fil.id_pertanyaan ==
                                                                                        data.id_pertanyaan
                                                                                    ) {
                                                                                        return {
                                                                                            ...fil,
                                                                                            jawaban_input:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        };
                                                                                    } else {
                                                                                        return fil;
                                                                                    }
                                                                                }
                                                                            )
                                                                        );
                                                                    }}
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
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setFormKuisioner(
                                                                            formKuisioner.map(
                                                                                (
                                                                                    fil
                                                                                ) => {
                                                                                    if (
                                                                                        fil.id_pertanyaan ==
                                                                                        data.id_pertanyaan
                                                                                    ) {
                                                                                        return {
                                                                                            ...fil,
                                                                                            jawaban_input:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        };
                                                                                    } else {
                                                                                        return fil;
                                                                                    }
                                                                                }
                                                                            )
                                                                        );
                                                                    }}
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
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setFormKuisioner(
                                                                            formKuisioner.map(
                                                                                (
                                                                                    fil
                                                                                ) => {
                                                                                    if (
                                                                                        fil.id_pertanyaan ==
                                                                                        data.id_pertanyaan
                                                                                    ) {
                                                                                        return {
                                                                                            ...fil,
                                                                                            jawaban_input:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        };
                                                                                    } else {
                                                                                        return fil;
                                                                                    }
                                                                                }
                                                                            )
                                                                        );
                                                                    }}
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
                                                    data.tipe == "Pilihan"
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
                                                                        required={
                                                                            true
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setFormKuisioner(
                                                                                formKuisioner.map(
                                                                                    (
                                                                                        fil
                                                                                    ) => {
                                                                                        if (
                                                                                            fil.id_pertanyaan ==
                                                                                            data.id_pertanyaan
                                                                                        ) {
                                                                                            return {
                                                                                                ...fil,
                                                                                                pilihan_jawaban:
                                                                                                    e,
                                                                                            };
                                                                                        } else {
                                                                                            return fil;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
                                                                        value={
                                                                            data.pilihan_jawaban
                                                                        }
                                                                        options={
                                                                            data.dataPilihanJawaban
                                                                        }
                                                                        className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                    />
                                                                ) : (
                                                                    <Select
                                                                        id={
                                                                            data.id_pertanyaan
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setFormKuisioner(
                                                                                formKuisioner.map(
                                                                                    (
                                                                                        fil
                                                                                    ) => {
                                                                                        if (
                                                                                            fil.id_pertanyaan ==
                                                                                            data.id_pertanyaan
                                                                                        ) {
                                                                                            return {
                                                                                                ...fil,
                                                                                                pilihan_jawaban:
                                                                                                    e,
                                                                                            };
                                                                                        } else {
                                                                                            return fil;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
                                                                        required={
                                                                            true
                                                                        }
                                                                        value={
                                                                            data.pilihan_jawaban
                                                                        }
                                                                        options={
                                                                            data.dataPilihanJawaban
                                                                        }
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
                                                                {
                                                                    data.pertanyaan
                                                                }
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setFormKuisioner(
                                                                                            formKuisioner.map(
                                                                                                (
                                                                                                    fil
                                                                                                ) => {
                                                                                                    if (
                                                                                                        fil.id_pertanyaan ==
                                                                                                        data.id_pertanyaan
                                                                                                    ) {
                                                                                                        return {
                                                                                                            ...fil,
                                                                                                            checkbox:
                                                                                                                data.checkbox.map(
                                                                                                                    (
                                                                                                                        main,
                                                                                                                        ind
                                                                                                                    ) => {
                                                                                                                        if (
                                                                                                                            ind ==
                                                                                                                            index
                                                                                                                        ) {
                                                                                                                            return {
                                                                                                                                ...main,
                                                                                                                                value: e
                                                                                                                                    .target
                                                                                                                                    .checked,
                                                                                                                            };
                                                                                                                        } else {
                                                                                                                            return main;
                                                                                                                        }
                                                                                                                    }
                                                                                                                ),
                                                                                                        };
                                                                                                    } else {
                                                                                                        return fil;
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }}
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
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            setFormKuisioner(
                                                                                                formKuisioner.map(
                                                                                                    (
                                                                                                        fil
                                                                                                    ) => {
                                                                                                        if (
                                                                                                            fil.id_pertanyaan ==
                                                                                                            data.id_pertanyaan
                                                                                                        ) {
                                                                                                            return {
                                                                                                                ...fil,
                                                                                                                checkbox:
                                                                                                                    data.checkbox.map(
                                                                                                                        (
                                                                                                                            main,
                                                                                                                            ind
                                                                                                                        ) => {
                                                                                                                            if (
                                                                                                                                ind ==
                                                                                                                                index
                                                                                                                            ) {
                                                                                                                                return {
                                                                                                                                    ...main,
                                                                                                                                    value: e
                                                                                                                                        .target
                                                                                                                                        .checked,
                                                                                                                                };
                                                                                                                            } else {
                                                                                                                                return main;
                                                                                                                            }
                                                                                                                        }
                                                                                                                    ),
                                                                                                            };
                                                                                                        } else {
                                                                                                            return fil;
                                                                                                        }
                                                                                                    }
                                                                                                )
                                                                                            );
                                                                                        }}
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setFormKuisioner(
                                                                                            formKuisioner.map(
                                                                                                (
                                                                                                    fil
                                                                                                ) => {
                                                                                                    if (
                                                                                                        fil.id_pertanyaan ==
                                                                                                        data.id_pertanyaan
                                                                                                    ) {
                                                                                                        return {
                                                                                                            ...fil,
                                                                                                            checkbox:
                                                                                                                data.checkbox.map(
                                                                                                                    (
                                                                                                                        main,
                                                                                                                        ind
                                                                                                                    ) => {
                                                                                                                        if (
                                                                                                                            ind ==
                                                                                                                            index
                                                                                                                        ) {
                                                                                                                            return {
                                                                                                                                ...main,
                                                                                                                                jawaban_input:
                                                                                                                                    e
                                                                                                                                        .target
                                                                                                                                        .value,
                                                                                                                            };
                                                                                                                        } else {
                                                                                                                            return main;
                                                                                                                        }
                                                                                                                    }
                                                                                                                ),
                                                                                                        };
                                                                                                    } else {
                                                                                                        return fil;
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }}
                                                                                    disabled={
                                                                                        checkbox.value !==
                                                                                        true
                                                                                    }
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
                                                                {
                                                                    data.pertanyaan
                                                                }
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
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                setFormKuisioner(
                                                                                                    formKuisioner.map(
                                                                                                        (
                                                                                                            fil
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                fil.id_pertanyaan ==
                                                                                                                data.id_pertanyaan
                                                                                                            ) {
                                                                                                                return {
                                                                                                                    ...fil,
                                                                                                                    pilihan_jawaban_subtopik:
                                                                                                                        data.pilihan_jawaban_subtopik.map(
                                                                                                                            (
                                                                                                                                main,
                                                                                                                                ind
                                                                                                                            ) => {
                                                                                                                                if (
                                                                                                                                    ind ==
                                                                                                                                    index
                                                                                                                                ) {
                                                                                                                                    return {
                                                                                                                                        ...main,
                                                                                                                                        value: "Sangat Besar",
                                                                                                                                    };
                                                                                                                                } else {
                                                                                                                                    return main;
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ),
                                                                                                                };
                                                                                                            } else {
                                                                                                                return fil;
                                                                                                            }
                                                                                                        }
                                                                                                    )
                                                                                                );
                                                                                            }}
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
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                setFormKuisioner(
                                                                                                    formKuisioner.map(
                                                                                                        (
                                                                                                            fil
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                fil.id_pertanyaan ==
                                                                                                                data.id_pertanyaan
                                                                                                            ) {
                                                                                                                return {
                                                                                                                    ...fil,
                                                                                                                    pilihan_jawaban_subtopik:
                                                                                                                        data.pilihan_jawaban_subtopik.map(
                                                                                                                            (
                                                                                                                                main,
                                                                                                                                ind
                                                                                                                            ) => {
                                                                                                                                if (
                                                                                                                                    ind ==
                                                                                                                                    index
                                                                                                                                ) {
                                                                                                                                    return {
                                                                                                                                        ...main,
                                                                                                                                        value: "Besar",
                                                                                                                                    };
                                                                                                                                } else {
                                                                                                                                    return main;
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ),
                                                                                                                };
                                                                                                            } else {
                                                                                                                return fil;
                                                                                                            }
                                                                                                        }
                                                                                                    )
                                                                                                );
                                                                                            }}
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
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                setFormKuisioner(
                                                                                                    formKuisioner.map(
                                                                                                        (
                                                                                                            fil
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                fil.id_pertanyaan ==
                                                                                                                data.id_pertanyaan
                                                                                                            ) {
                                                                                                                return {
                                                                                                                    ...fil,
                                                                                                                    pilihan_jawaban_subtopik:
                                                                                                                        data.pilihan_jawaban_subtopik.map(
                                                                                                                            (
                                                                                                                                main,
                                                                                                                                ind
                                                                                                                            ) => {
                                                                                                                                if (
                                                                                                                                    ind ==
                                                                                                                                    index
                                                                                                                                ) {
                                                                                                                                    return {
                                                                                                                                        ...main,
                                                                                                                                        value: "Cukup Besar",
                                                                                                                                    };
                                                                                                                                } else {
                                                                                                                                    return main;
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ),
                                                                                                                };
                                                                                                            } else {
                                                                                                                return fil;
                                                                                                            }
                                                                                                        }
                                                                                                    )
                                                                                                );
                                                                                            }}
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
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                setFormKuisioner(
                                                                                                    formKuisioner.map(
                                                                                                        (
                                                                                                            fil
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                fil.id_pertanyaan ==
                                                                                                                data.id_pertanyaan
                                                                                                            ) {
                                                                                                                return {
                                                                                                                    ...fil,
                                                                                                                    pilihan_jawaban_subtopik:
                                                                                                                        data.pilihan_jawaban_subtopik.map(
                                                                                                                            (
                                                                                                                                main,
                                                                                                                                ind
                                                                                                                            ) => {
                                                                                                                                if (
                                                                                                                                    ind ==
                                                                                                                                    index
                                                                                                                                ) {
                                                                                                                                    return {
                                                                                                                                        ...main,
                                                                                                                                        value: "Kurang Besar",
                                                                                                                                    };
                                                                                                                                } else {
                                                                                                                                    return main;
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ),
                                                                                                                };
                                                                                                            } else {
                                                                                                                return fil;
                                                                                                            }
                                                                                                        }
                                                                                                    )
                                                                                                );
                                                                                            }}
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
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                setFormKuisioner(
                                                                                                    formKuisioner.map(
                                                                                                        (
                                                                                                            fil
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                fil.id_pertanyaan ==
                                                                                                                data.id_pertanyaan
                                                                                                            ) {
                                                                                                                return {
                                                                                                                    ...fil,
                                                                                                                    pilihan_jawaban_subtopik:
                                                                                                                        data.pilihan_jawaban_subtopik.map(
                                                                                                                            (
                                                                                                                                main,
                                                                                                                                ind
                                                                                                                            ) => {
                                                                                                                                if (
                                                                                                                                    ind ==
                                                                                                                                    index
                                                                                                                                ) {
                                                                                                                                    return {
                                                                                                                                        ...main,
                                                                                                                                        value: "Tidak Sama Sekali",
                                                                                                                                    };
                                                                                                                                } else {
                                                                                                                                    return main;
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ),
                                                                                                                };
                                                                                                            } else {
                                                                                                                return fil;
                                                                                                            }
                                                                                                        }
                                                                                                    )
                                                                                                );
                                                                                            }}
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
                                                                {
                                                                    data.pertanyaan
                                                                }
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setFormKuisioner(
                                                                                            formKuisioner.map(
                                                                                                (
                                                                                                    fil
                                                                                                ) => {
                                                                                                    if (
                                                                                                        fil.id_pertanyaan ==
                                                                                                        data.id_pertanyaan
                                                                                                    ) {
                                                                                                        return {
                                                                                                            ...fil,
                                                                                                            jawaban_pilihan_inputan:
                                                                                                                {
                                                                                                                    ...fil.jawaban_pilihan_inputan,
                                                                                                                    id_pilihan_jawaban:
                                                                                                                        pilihan_input.id_pilihan_jawaban,
                                                                                                                },
                                                                                                        };
                                                                                                    } else {
                                                                                                        return fil;
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }}
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
                                                                                        disabled={
                                                                                            data
                                                                                                .jawaban_pilihan_inputan
                                                                                                .id_pilihan_jawaban !==
                                                                                            pilihan_input.id_pilihan_jawaban
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            setFormKuisioner(
                                                                                                formKuisioner.map(
                                                                                                    (
                                                                                                        fil
                                                                                                    ) => {
                                                                                                        if (
                                                                                                            fil.id_pertanyaan ==
                                                                                                            data.id_pertanyaan
                                                                                                        ) {
                                                                                                            return {
                                                                                                                ...fil,
                                                                                                                jawaban_pilihan_inputan:
                                                                                                                    {
                                                                                                                        ...fil.jawaban_pilihan_inputan,
                                                                                                                        jawaban_input:
                                                                                                                            e
                                                                                                                                .target
                                                                                                                                .value,
                                                                                                                    },
                                                                                                            };
                                                                                                        } else {
                                                                                                            return fil;
                                                                                                        }
                                                                                                    }
                                                                                                )
                                                                                            );
                                                                                        }}
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setFormKuisioner(
                                                                                            formKuisioner.map(
                                                                                                (
                                                                                                    fil
                                                                                                ) => {
                                                                                                    if (
                                                                                                        fil.id_pertanyaan ==
                                                                                                        data.id_pertanyaan
                                                                                                    ) {
                                                                                                        return {
                                                                                                            ...fil,
                                                                                                            jawaban_pilihan_inputan:
                                                                                                                {
                                                                                                                    ...fil.jawaban_pilihan_inputan,
                                                                                                                    id_pilihan_jawaban:
                                                                                                                        pilihan_input.id_pilihan_jawaban,
                                                                                                                },
                                                                                                        };
                                                                                                    } else {
                                                                                                        return fil;
                                                                                                    }
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }}
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
                                                                {
                                                                    data.pertanyaan
                                                                }
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
                                                                                                            required={
                                                                                                                true
                                                                                                            }
                                                                                                            options={
                                                                                                                option2SisiPertanyaan
                                                                                                            }
                                                                                                            value={
                                                                                                                sub_topik.value
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                setFormKuisioner(
                                                                                                                    formKuisioner.map(
                                                                                                                        (
                                                                                                                            fil
                                                                                                                        ) => {
                                                                                                                            if (
                                                                                                                                fil.id_pertanyaan ==
                                                                                                                                data.id_pertanyaan
                                                                                                                            ) {
                                                                                                                                return {
                                                                                                                                    ...fil,
                                                                                                                                    pilihan_jawaban_2_sisi:
                                                                                                                                        data.pilihan_jawaban_2_sisi.map(
                                                                                                                                            (
                                                                                                                                                main,
                                                                                                                                                ind
                                                                                                                                            ) => {
                                                                                                                                                if (
                                                                                                                                                    ind ==
                                                                                                                                                    index
                                                                                                                                                ) {
                                                                                                                                                    return {
                                                                                                                                                        ...main,
                                                                                                                                                        value: main.value.map(
                                                                                                                                                            (
                                                                                                                                                                topik,
                                                                                                                                                                x
                                                                                                                                                            ) => {
                                                                                                                                                                if (
                                                                                                                                                                    x ==
                                                                                                                                                                    key
                                                                                                                                                                ) {
                                                                                                                                                                    return {
                                                                                                                                                                        ...topik,
                                                                                                                                                                        value: e,
                                                                                                                                                                    };
                                                                                                                                                                } else {
                                                                                                                                                                    return topik;
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        ),
                                                                                                                                                    };
                                                                                                                                                } else {
                                                                                                                                                    return main;
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        ),
                                                                                                                                };
                                                                                                                            } else {
                                                                                                                                return fil;
                                                                                                                            }
                                                                                                                        }
                                                                                                                    )
                                                                                                                );
                                                                                                            }}
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
                                            {formKuisionerOptional.map(
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
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setFormKuisionerOptional(
                                                                                formKuisionerOptional.map(
                                                                                    (
                                                                                        fil
                                                                                    ) => {
                                                                                        if (
                                                                                            fil.id_pertanyaan ==
                                                                                            data.id_pertanyaan
                                                                                        ) {
                                                                                            return {
                                                                                                ...fil,
                                                                                                jawaban_input:
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                            };
                                                                                        } else {
                                                                                            return fil;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
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
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setFormKuisionerOptional(
                                                                                formKuisionerOptional.map(
                                                                                    (
                                                                                        fil
                                                                                    ) => {
                                                                                        if (
                                                                                            fil.id_pertanyaan ==
                                                                                            data.id_pertanyaan
                                                                                        ) {
                                                                                            return {
                                                                                                ...fil,
                                                                                                jawaban_input:
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                            };
                                                                                        } else {
                                                                                            return fil;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
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
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setFormKuisionerOptional(
                                                                                formKuisionerOptional.map(
                                                                                    (
                                                                                        fil
                                                                                    ) => {
                                                                                        if (
                                                                                            fil.id_pertanyaan ==
                                                                                            data.id_pertanyaan
                                                                                        ) {
                                                                                            return {
                                                                                                ...fil,
                                                                                                jawaban_input:
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                            };
                                                                                        } else {
                                                                                            return fil;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
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
                                                                            required={
                                                                                true
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setFormKuisionerOptional(
                                                                                    formKuisionerOptional.map(
                                                                                        (
                                                                                            fil
                                                                                        ) => {
                                                                                            if (
                                                                                                fil.id_pertanyaan ==
                                                                                                data.id_pertanyaan
                                                                                            ) {
                                                                                                return {
                                                                                                    ...fil,
                                                                                                    pilihan_jawaban:
                                                                                                        e,
                                                                                                };
                                                                                            } else {
                                                                                                return fil;
                                                                                            }
                                                                                        }
                                                                                    )
                                                                                );
                                                                            }}
                                                                            value={
                                                                                data.pilihan_jawaban
                                                                            }
                                                                            options={
                                                                                data.dataPilihanJawaban
                                                                            }
                                                                            className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                        />
                                                                    ) : (
                                                                        <Select
                                                                            id={
                                                                                data.id_pertanyaan
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setFormKuisionerOptional(
                                                                                    formKuisionerOptional.map(
                                                                                        (
                                                                                            fil
                                                                                        ) => {
                                                                                            if (
                                                                                                fil.id_pertanyaan ==
                                                                                                data.id_pertanyaan
                                                                                            ) {
                                                                                                return {
                                                                                                    ...fil,
                                                                                                    pilihan_jawaban:
                                                                                                        e,
                                                                                                };
                                                                                            } else {
                                                                                                return fil;
                                                                                            }
                                                                                        }
                                                                                    )
                                                                                );
                                                                            }}
                                                                            required={
                                                                                true
                                                                            }
                                                                            value={
                                                                                data.pilihan_jawaban
                                                                            }
                                                                            options={
                                                                                data.dataPilihanJawaban
                                                                            }
                                                                            placeholder="Pilihan"
                                                                            className="text-gray-900 text-sm rounded-lg block w-8/12"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }
                                            )}
                                            <div className="text-center mt-8">
                                                <div className="inline-flex items-center">
                                                    <button
                                                        type="submit"
                                                        required
                                                        className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                    >
                                                        Simpan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </section>
                )}
            </GuestLayout>
        </>
    );
};
