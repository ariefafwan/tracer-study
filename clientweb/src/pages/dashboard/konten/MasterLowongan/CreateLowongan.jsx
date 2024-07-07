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
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Creatable from "react-select/creatable";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const CreateLowongan = () => {
    let navigate = useNavigate();
    const [lowonganForm, setLowonganForm] = useState({
        id: 0,
        judul_lowongan: "",
        nama_perusahaan: "",
        logo_perusahaan: "",
        kota: "",
        link_lowongan: "",
        bidang_usaha: {
            label: "",
            value: "",
        },
        desk: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        data_kualifikasi_prodi: [],
        data_kualifikasi_umum: [{ label: "", value: "" }],
    });

    const [rekomBidangUsaha, setRekomBidangUsaha] = useState([]);
    const [dataProgramStudi, setDataProgramStudi] = useState([]);
    const [rekomKualifikasiUmum, setRekomKualifikasiUmum] = useState([]);

    const onChangeDataKualifikasi = (index, e) => {
        let onChangeValue = [...lowonganForm.data_kualifikasi_umum];
        onChangeValue[index] = e;
        setLowonganForm({
            ...lowonganForm,
            data_kualifikasi_umum: onChangeValue,
        });
    };

    const hapusKualifikasi = (value) => {
        const newArray = [...lowonganForm.data_kualifikasi_umum];
        newArray.splice(value, 1);
        setLowonganForm({
            ...lowonganForm,
            data_kualifikasi_umum: newArray,
        });
    };

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_ALL_BASE_URL}/konten/lowongan/data`, {
                headers: {
                    Authorization: "Bearer " + Cookies.get("token"),
                },
            })
            .then((res) => {
                setDataProgramStudi([...res.data.program_studi]);
                setRekomBidangUsaha([...res.data.bidang_usaha]);
                setRekomKualifikasiUmum([...res.data.kualifikasi_umum]);
            })
            .catch((error) => {
                if (error.response.status == 403) {
                    Cookies.remove("token");
                    navigate("/");
                } else {
                    alert(error.response.data.error);
                }
            });
    }, []);

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
                axios
                    .post(
                        `${
                            import.meta.env.VITE_ALL_BASE_URL
                        }/konten/lowongan/store`,
                        lowonganForm,
                        {
                            headers: {
                                Authorization: "Bearer " + Cookies.get("token"),
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    )
                    .then((res) => {
                        Swal.fire({
                            title: "Success!",
                            text: "Data Berhasil Ditambahkan.",
                            icon: "success",
                        });
                        setLowonganForm({
                            id: 0,
                            judul_lowongan: "",
                            nama_perusahaan: "",
                            logo_perusahaan: "",
                            kota: "",
                            link_lowongan: "",
                            bidang_usaha: {
                                label: "",
                                value: "",
                            },
                            desk: "",
                            tanggal_mulai: "",
                            tanggal_selesai: "",
                            data_kualifikasi_prodi: [],
                            data_kualifikasi_umum: [{ label: "", value: "" }],
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
                    <form onSubmit={handlerSubmit}>
                        <div className="container max-w-screen-lg mx-auto">
                            <div>
                                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                        <div className="text-gray-700">
                                            <p className="font-medium text-lg">
                                                Detail Lowongan
                                            </p>
                                            <p>Silahkan Isi Seluruh Data</p>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                                <div className="md:col-span-6">
                                                    <label htmlFor="judul_lowongan">
                                                        Judul Lowongan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="judul_lowongan"
                                                        id="judul_lowongan"
                                                        value={
                                                            lowonganForm.judul_lowongan
                                                        }
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                judul_lowongan:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-6">
                                                    <label htmlFor="nama_perusahaan">
                                                        Nama Perusahaan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="nama_perusahaan"
                                                        id="nama_perusahaan"
                                                        value={
                                                            lowonganForm.nama_perusahaan
                                                        }
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                nama_perusahaan:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="kota_perusahaan">
                                                        Kota
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="kota_perusahaan"
                                                        id="kota_perusahaan"
                                                        value={
                                                            lowonganForm.kota
                                                        }
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                kota: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="link_lowongan">
                                                        Link Lowongan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="link_lowongan"
                                                        id="link_lowongan"
                                                        value={
                                                            lowonganForm.link_lowongan
                                                        }
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                link_lowongan:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        placeholder="..."
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="bidang_usaha">
                                                        Bidang Usaha
                                                    </label>
                                                    <CreatableSelect
                                                        isClearable
                                                        options={
                                                            rekomBidangUsaha
                                                        }
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                bidang_usaha: e,
                                                            })
                                                        }
                                                        placeholder={"..."}
                                                        value={
                                                            lowonganForm.bidang_usaha
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="logo_perusahaan">
                                                        Logo Perusahaan
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="logo_perusahaan"
                                                        id="logo_perusahaan"
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                logo_perusahaan:
                                                                    e.target
                                                                        .files[0],
                                                            })
                                                        }
                                                        required
                                                        className="h-10 border mt-1 rounded px-4 py-2 w-full bg-gray-50"
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="tanggal_mulai">
                                                        Dibuka Dari Tanggal
                                                    </label>
                                                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                                        <input
                                                            name="tanggal_mulai"
                                                            id="tanggal_mulai"
                                                            type="date"
                                                            value={
                                                                lowonganForm.tanggal_mulai
                                                            }
                                                            onChange={(e) =>
                                                                setLowonganForm(
                                                                    {
                                                                        ...lowonganForm,
                                                                        tanggal_mulai:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            required
                                                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="tanggal_selesai">
                                                        Sampai Dengan Tanggal
                                                    </label>
                                                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                                        <input
                                                            name="tanggal_selesai"
                                                            id="tanggal_selesai"
                                                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                                                            type="date"
                                                            value={
                                                                lowonganForm.tanggal_selesai
                                                            }
                                                            onChange={(e) =>
                                                                setLowonganForm(
                                                                    {
                                                                        ...lowonganForm,
                                                                        tanggal_selesai:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-6">
                                                    <label htmlFor="desk">
                                                        Deskripsi
                                                    </label>
                                                    <textarea
                                                        id="desk"
                                                        rows={4}
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="..."
                                                        value={
                                                            lowonganForm.desk
                                                        }
                                                        onChange={(e) =>
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                desk: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container max-w-screen-lg mx-auto">
                            <div>
                                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                        <div className="text-gray-700">
                                            <p className="font-medium text-lg">
                                                Kualifikasi Umum Lowongan
                                            </p>
                                            <p>Tentukan Persyaratan Lowongan</p>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                                {lowonganForm.data_kualifikasi_umum.map(
                                                    (value, i) => {
                                                        return i != 0 ? (
                                                            <div
                                                                key={i}
                                                                className="col-span-6 flex justify-between w-full"
                                                            >
                                                                <div className="w-full text-black me-3">
                                                                    <div
                                                                        key={i}
                                                                        className="col-span-6"
                                                                    >
                                                                        <CreatableSelect
                                                                            isClearable
                                                                            options={
                                                                                rekomKualifikasiUmum
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                onChangeDataKualifikasi(
                                                                                    i,
                                                                                    e
                                                                                )
                                                                            }
                                                                            placeholder={
                                                                                "..."
                                                                            }
                                                                            value={
                                                                                value
                                                                            }
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="inline-flex justify-end rounded-md shadow-sm m-auto"
                                                                    role="group"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            hapusKualifikasi(
                                                                                i
                                                                            );
                                                                        }}
                                                                        className="p-2 text-sm font-medium m-auto text-white bg-red-500 border border-gray-200 rounded-lg hover:bg-red-600"
                                                                    >
                                                                        -
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={i}
                                                                className="col-span-6"
                                                            >
                                                                <CreatableSelect
                                                                    isClearable
                                                                    options={
                                                                        rekomKualifikasiUmum
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        onChangeDataKualifikasi(
                                                                            i,
                                                                            e
                                                                        )
                                                                    }
                                                                    placeholder={
                                                                        "..."
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                    required
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            <div className="text-left mt-2">
                                                <div className="inline-flex items-start">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setLowonganForm({
                                                                ...lowonganForm,
                                                                data_kualifikasi_umum:
                                                                    [
                                                                        ...lowonganForm.data_kualifikasi_umum,
                                                                        {
                                                                            label: "",
                                                                            value: "",
                                                                        },
                                                                    ],
                                                            });
                                                        }}
                                                        required
                                                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                    >
                                                        + Kualifikasi
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container max-w-screen-lg mx-auto">
                            <div>
                                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                        <div className="text-gray-700">
                                            <p className="font-medium text-lg">
                                                Kualifikasi Studi Lowongan
                                            </p>
                                            <p>
                                                Pilih Apa Saja Program Studi
                                                Kualifikasi
                                            </p>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <div>
                                                <Select
                                                    isMulti
                                                    onChange={(value) =>
                                                        setLowonganForm({
                                                            ...lowonganForm,
                                                            data_kualifikasi_prodi:
                                                                value,
                                                        })
                                                    }
                                                    value={
                                                        lowonganForm.data_kualifikasi_prodi
                                                    }
                                                    options={dataProgramStudi}
                                                />
                                            </div>
                                            <div className="text-right mt-2">
                                                <div className="inline-flex items-end">
                                                    <button
                                                        type="submit"
                                                        className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        </>
    );
};
