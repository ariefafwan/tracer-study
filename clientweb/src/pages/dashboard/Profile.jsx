/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { ButtonDelete } from "../../components/ButtonDelete";
import { ButtonEdit } from "../../components/ButtonEdit";
import { ButtonPagination } from "../../components/ButtonPagination";
import { Loader } from "../../components/Loader";
import { ModalPrimary } from "../../components/ModalPrimary";
import { TableData } from "../../components/TableData";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const Profile = () => {
    let navigate = useNavigate();
    const [modalProfile, setModalProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        id: 0,
        nama: "",
        alamat: "",
        logo: "",
        no_telp: "",
        email: "",
    });
    const [dataProfile, setDataProfile] = useState({
        nama: "",
        alamat: "",
        logo: "",
        no_telp: "",
        email: "",
    });

    const [reload, setReload] = useState(true);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (reload == true) {
            setLoader(true);
            axios
                .get(`${import.meta.env.VITE_ALL_BASE_URL}/konten/profile`, {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                })
                .then((res) => {
                    setLoader(false);
                    setReload(false);
                    setDataProfile({
                        nama: res.data.nama,
                        alamat: res.data.alamat,
                        logo: res.data.logo,
                        no_telp: res.data.no_telp,
                        email: res.data.email,
                    });
                    setProfileForm({
                        id: res.data.id == null ? 0 : res.data.id,
                        nama: res.data.nama,
                        alamat: res.data.alamat,
                        logo: "",
                        no_telp: res.data.no_telp,
                        email: res.data.email,
                    });
                })
                .catch((error) => {
                    if (error.response.status == 403) {
                        Cookies.remove("token");
                        navigate("/");
                    } else {
                        alert(error.response.data.error);
                    }
                    setReload(false);
                    setLoader(false);
                });
        }
    }, [reload, setReload]);

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
                if (profileForm.id == 0) {
                    axios
                        .post(
                            `${
                                import.meta.env.VITE_ALL_BASE_URL
                            }/konten/profile/store`,
                            profileForm,
                            {
                                headers: {
                                    Authorization:
                                        "Bearer " + Cookies.get("token"),
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )
                        .then((res) => {
                            setReload(true);
                            setModalProfile(false);
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
                            }/konten/profile/update`,
                            profileForm,
                            {
                                headers: {
                                    Authorization:
                                        "Bearer " + Cookies.get("token"),
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )
                        .then((res) => {
                            setReload(true);
                            setModalProfile(false);
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

    return (
        <>
            <DashboardLayout>
                <div className="w-full px-4 py-2 mt-12">
                    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
                        <div className="bg-white relative shadow rounded-lg w-5/6 md:w-5/6 lg:w-4/6 xl:w-3/6 mx-auto my-20 p-8">
                            {loader ? (
                                <div className="flex justify-center w-full">
                                    <Loader></Loader>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <img
                                            src={
                                                dataProfile.logo
                                                    ? `${
                                                          import.meta.env
                                                              .VITE_AUTH_MAIN_BASE_URL
                                                      }/storage/Profile/Logo/${
                                                          dataProfile.logo
                                                      }`
                                                    : "/profil_img.jpg"
                                            }
                                            alt=""
                                            className="rounded-full mx-auto absolute -top-20 w-24 h-24 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"
                                        />
                                    </div>
                                    <div className="">
                                        <h1 className="font-bold text-center text-2xl text-gray-900">
                                            {dataProfile.nama == "" ||
                                            dataProfile.nama == null
                                                ? "Universitas XX"
                                                : dataProfile.nama}
                                        </h1>
                                        <div className="w-full">
                                            <div className="w-full flex flex-col items-center overflow-hidden text-sm">
                                                <div className="w-full text-black col-span-1">
                                                    <label
                                                        htmlFor="nama"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Nama
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nama"
                                                        min={1}
                                                        value={dataProfile.nama}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                        placeholder="Nama..."
                                                        disabled
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 mt-1 gap-2">
                                            <div className="w-full">
                                                <div className="w-full flex flex-col items-center overflow-hidden text-sm">
                                                    <div className="w-full text-black col-span-1">
                                                        <label
                                                            htmlFor="no_telp"
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            No Telp
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="no_telp"
                                                            min={1}
                                                            value={
                                                                dataProfile.no_telp
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                            placeholder="No Telp..."
                                                            disabled
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full  mt-1">
                                                <div className="w-full flex flex-col items-center overflow-hidden text-sm">
                                                    <div className="w-full text-black col-span-1">
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-gray-900"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            min={1}
                                                            value={
                                                                dataProfile.email
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                            placeholder="Email..."
                                                            disabled
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="w-full flex flex-col items-center overflow-hidden text-sm">
                                                <div className="w-full text-black col-span-1">
                                                    <label
                                                        htmlFor="alamat"
                                                        className="block mb-2 text-sm font-medium text-gray-900"
                                                    >
                                                        Alamat
                                                    </label>
                                                    <textarea
                                                        id="alamat"
                                                        rows={4}
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="..."
                                                        value={
                                                            dataProfile.alamat
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-5 w-full">
                                        <div className="inline-flex justify-center items-center w-full">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModalProfile(true)
                                                }
                                                required
                                                className="inline-flex justify-center items-center w-full text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                            >
                                                Atur Profile &nbsp;{" "}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m15 11.25 1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 1 0-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25 12.75 9"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <ModalPrimary
                    header={"Atur Profile"}
                    open={modalProfile}
                    submitAction={handlerSubmit}
                    closeModal={() => setModalProfile(false)}
                >
                    <div className="w-full text-black col-span-1">
                        <label
                            htmlFor="nama"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Nama
                        </label>
                        <input
                            type="text"
                            id="nama"
                            value={profileForm.nama}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Nama..."
                            onChange={(e) =>
                                setProfileForm({
                                    ...profileForm,
                                    nama: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="w-full text-black col-span-1">
                            <label
                                htmlFor="no_telp"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                No Telp
                            </label>
                            <input
                                type="number"
                                id="no_telp"
                                min={1}
                                value={profileForm.no_telp}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="No Telp..."
                                onChange={(e) =>
                                    setProfileForm({
                                        ...profileForm,
                                        no_telp: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="w-full text-black col-span-1">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={profileForm.email}
                                onChange={(e) =>
                                    setProfileForm({
                                        ...profileForm,
                                        email: e.target.value,
                                    })
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Email..."
                                required
                            />
                        </div>
                    </div>
                    <div className="w-full text-black col-span-1">
                        <label
                            htmlFor="alamat"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Alamat
                        </label>
                        <textarea
                            id="alamat"
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="..."
                            value={profileForm.alamat}
                            onChange={(e) =>
                                setProfileForm({
                                    ...profileForm,
                                    alamat: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="w-full text-black">
                        <label
                            htmlFor="gambar"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Logo
                        </label>
                        <input
                            type="file"
                            name="logo"
                            id="logo"
                            onChange={(e) =>
                                setProfileForm({
                                    ...profileForm,
                                    logo: e.target.files[0],
                                })
                            }
                            required={profileForm.id == 0 ? true : false}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    </div>
                </ModalPrimary>
            </DashboardLayout>
        </>
    );
};
