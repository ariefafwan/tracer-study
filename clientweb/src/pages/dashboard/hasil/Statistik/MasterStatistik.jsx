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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const MasterStatistik = () => {
    let navigate = useNavigate();

    const [formTampilanStatistik, setFormTampilanStatistik] = useState({
        id_pertanyaan: {
            value: "",
            label: "Pilih Pertanyaan",
            urutan: "",
        },
        id_kategori_pertanyaan: {
            value: "",
            label: "Pilih Kategori Pertanyaan",
            urutan: "",
        },
        tahun_lulus: {
            value: "",
            label: "Lulusan",
        },
        tampilan_statistik: {
            value: "Perkategori Pertanyaan",
            label: "Perkategori Pertanyaan",
        },
    });

    const [dataKategoriPertanyaan, setDataKategoriPertanyaan] = useState([]);
    const [dataPertanyaan, setDataPertanyaan] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pilihanJenisTampilan, setPilihanJenisTampilan] = useState([
        {
            value: "Perkategori Pertanyaan",
            label: "Perkategori Pertanyaan",
        },
        {
            value: "Perpertanyaan",
            label: "Perpertanyaan",
        },
    ]);

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

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/hasil/statistik`, {
                headers: {
                    Authorization: "Bearer " + Cookies.get("token"),
                },
            })
            .then((res) => {
                setDataKategoriPertanyaan(res.data.kategoriPertanyaan);
                setDataPertanyaan(res.data.pertanyaan);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
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
        if (formTampilanStatistik.tampilan_statistik.value == "Perpertanyaan") {
            setFormTampilanStatistik({
                ...formTampilanStatistik,
                id_kategori_pertanyaan: {
                    value: "",
                    label: "Pilih Kategori Pertanyaan",
                    urutan: "",
                },
            });
        } else if (
            formTampilanStatistik.tampilan_statistik.value ==
            "Perkategori Pertanyaan"
        ) {
            setFormTampilanStatistik({
                ...formTampilanStatistik,
                id_pertanyaan: {
                    value: "",
                    label: "Pilih Pertanyaan",
                    urutan: "",
                },
            });
        }
    }, [formTampilanStatistik.tampilan_statistik.value]);

    const redirectToStatistik = (e) => {
        e.preventDefault();
        let validate = true;
        try {
            if (
                formTampilanStatistik.tampilan_statistik.value ==
                "Perpertanyaan"
            ) {
                if (formTampilanStatistik.id_pertanyaan.value == "") {
                    throw "Harap Pilih Satu Pertanyaan";
                }
            } else if (
                formTampilanStatistik.tampilan_statistik.value ==
                "Perkategori Pertanyaan"
            ) {
                if (formTampilanStatistik.id_kategori_pertanyaan.value == "") {
                    throw "Harap Pilih Satu Kategori Pertanyaan";
                }
            }

            if (formTampilanStatistik.tahun_lulus.value == "") {
                throw "Harap Pilih Satu Tahun Lulusan";
            }
        } catch (error) {
            alert(error);
            validate = false;
        }
        if (validate) {
            Swal.fire({
                title: "Yakin?",
                text: "Halaman Akan Dialihkan Ke Tampilan Statistik Terpilih",
                icon: "info",
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: "Ya!",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    if (
                        formTampilanStatistik.tampilan_statistik.value ==
                        "Perpertanyaan"
                    ) {
                        navigate(
                            `per-pertanyaan/${formTampilanStatistik.id_pertanyaan.value}/${formTampilanStatistik.tahun_lulus.value}`
                        );
                    } else if (
                        formTampilanStatistik.tampilan_statistik.value ==
                        "Perkategori Pertanyaan"
                    ) {
                        navigate(
                            `per-kategori/${formTampilanStatistik.id_kategori_pertanyaan.value}/${formTampilanStatistik.tahun_lulus.value}`
                        );
                    }
                }
            });
        }
    };

    return (
        <>
            <DashboardLayout>
                <section className="w-full p-5 mt-12 text-left rtl:text-right text-gray-900">
                    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                        {loading ? (
                            <div className="flex items-center justify-center w-full">
                                <Loader></Loader>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="text-gray-700">
                                        <p className="font-medium text-2xl">
                                            Pilih Jenis Statistik
                                        </p>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="grid gap-2 text-sm grid-cols-1">
                                            <div className="md:col-span-3">
                                                <label htmlFor="jenis_statistik">
                                                    Jenis Statistik
                                                </label>
                                                <Select
                                                    name="jenis_statistik"
                                                    id="jenis_statistik"
                                                    options={
                                                        pilihanJenisTampilan
                                                    }
                                                    onChange={(e) =>
                                                        setFormTampilanStatistik(
                                                            {
                                                                ...formTampilanStatistik,
                                                                tampilan_statistik:
                                                                    e,
                                                            }
                                                        )
                                                    }
                                                    required={true}
                                                    value={
                                                        formTampilanStatistik.tampilan_statistik
                                                    }
                                                />
                                            </div>
                                            {formTampilanStatistik
                                                .tampilan_statistik.value ==
                                            "Perkategori Pertanyaan" ? (
                                                <div className="w-full">
                                                    <label htmlFor="kategori_pertanyaan">
                                                        Pilih Kategori Petanyaan
                                                    </label>
                                                    <Select
                                                        name="id_kategori_pertanyaan"
                                                        id="id_kategori_pertanyaan"
                                                        options={
                                                            dataKategoriPertanyaan
                                                        }
                                                        onChange={(e) =>
                                                            setFormTampilanStatistik(
                                                                {
                                                                    ...formTampilanStatistik,
                                                                    id_kategori_pertanyaan:
                                                                        e,
                                                                }
                                                            )
                                                        }
                                                        required={true}
                                                        value={
                                                            formTampilanStatistik.id_kategori_pertanyaan
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {formTampilanStatistik
                                                .tampilan_statistik.value ==
                                            "Perpertanyaan" ? (
                                                <div className="w-full">
                                                    <label htmlFor="id_pertanyaan">
                                                        Pilih Pertanyaan
                                                    </label>
                                                    <Select
                                                        name="id_pertanyaan"
                                                        id="id_pertanyaan"
                                                        options={dataPertanyaan}
                                                        onChange={(e) =>
                                                            setFormTampilanStatistik(
                                                                {
                                                                    ...formTampilanStatistik,
                                                                    id_pertanyaan:
                                                                        e,
                                                                }
                                                            )
                                                        }
                                                        required={true}
                                                        value={
                                                            formTampilanStatistik.id_pertanyaan
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <div className="w-full">
                                                <label htmlFor="lulusan">
                                                    Lulusan
                                                </label>
                                                <Select
                                                    name="lulusan"
                                                    id="lulusan"
                                                    options={pilihanTahun}
                                                    onChange={(e) =>
                                                        setFormTampilanStatistik(
                                                            {
                                                                ...formTampilanStatistik,
                                                                tahun_lulus: e,
                                                            }
                                                        )
                                                    }
                                                    required={true}
                                                    value={
                                                        formTampilanStatistik.tahun_lulus
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-8">
                                    <div className="inline-flex items-center">
                                        <button
                                            type="button"
                                            onClick={(e) =>
                                                redirectToStatistik(e)
                                            }
                                            className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                        >
                                            Selanjutnya
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </DashboardLayout>
        </>
    );
};
