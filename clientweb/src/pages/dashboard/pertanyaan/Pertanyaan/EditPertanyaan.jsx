/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DashboardLayout } from "../../../../layouts/DashboardLayout";
import { TableData } from "../../../../components/TableData";
import { ButtonEdit } from "../../../../components/ButtonEdit";
import { ButtonDelete } from "../../../../components/ButtonDelete";
import { ButtonPagination } from "../../../../components/ButtonPagination";
import { ModalSecondary } from "../../../../components/ModalSecondary";
import { Loader } from "../../../../components/Loader";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Creatable from "react-select/creatable";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export const EditPertanyaan = () => {
    let navigate = useNavigate();
    let { id } = useParams();

    const optionJenisPertanyaan = [
        {
            label: "Pilih Tipe Pertanyaan",
            value: "",
        },
        {
            label: "Pilihan",
            value: "Pilihan",
        },
        {
            label: "Inputan Text",
            value: "Inputan_Text",
        },
        {
            label: "Inputan Angka",
            value: "Inputan_Angka",
        },
        {
            label: "Inputan Tanggal",
            value: "Inputan_Tanggal",
        },
        {
            label: "Pilihan 2 Sisi Pertanyaan",
            value: "Pilihan_2_Sisi_Pertanyaan",
        },
        {
            label: "Pilihan Dengan SubTopik",
            value: "Pilihan_Dengan_SubTopik",
        },
        {
            label: "Pilihan Dengan Inputan",
            value: "Pilihan_Dengan_Inputan",
        },
        {
            label: "Checkbox",
            value: "Checkbox",
        },
        {
            label: "Pertanyaan Sebagai SubPertanyaan",
            value: "Sub_Pertanyaan",
        },
    ];

    const optionJenisSubPertanyaan = [
        {
            label: "Pilihan",
            value: "Pilihan",
        },
        {
            label: "Inputan Angka",
            value: "Inputan_Angka",
        },
        {
            label: "Inputan Text",
            value: "Inputan_Text",
        },
        {
            label: "Inputan Tanggal",
            value: "Inputan_Tanggal",
        },
    ];

    const optionStatusPertanyaan = [
        {
            label: "Wajib",
            value: "Wajib",
        },
        {
            label: "Optional",
            value: "Optional",
        },
        {
            label: "Nonaktif",
            value: "Nonaktif",
        },
    ];

    const [pertanyaanForm, setPertanyaanForm] = useState({
        id: 0,
        urutan: "",
        id_kategori_pertanyaan: "",
        pertanyaan: "",
        tipe_pertanyaan: {
            label: "Pilih Tipe Pertanyaan",
            value: "",
        },
        jenis_sub_pertanyaan: {
            label: "",
            value: "",
        },
        id_parent: {
            label: "",
            value: "",
        },
        id_pilihan_jawaban: {
            label: "",
            value: "",
        },
        pilihan: [
            {
                id: "",
                urutan: "",
                value: "",
            },
        ],
        pilihan_inputan: [
            {
                id: "",
                urutan: "",
                value: "",
                isInput: true,
            },
        ],
        checkbox: [
            {
                id: "",
                urutan: "",
                value: "",
            },
        ],
        pilihan_lainnya: false,
        sub_topik: [
            {
                id: "",
                urutan: "",
                value: "",
            },
        ],
        sub_pertanyaan: [
            {
                id: "",
                urutan: "",
                value: "",
            },
            {
                id: "",
                urutan: "",
                value: "",
            },
        ],
        sub_topik_pertanyaan: [
            {
                id: "",
                urutan: "",
                value: "",
            },
        ],
        status: {
            label: "Wajib",
            value: "Wajib",
        },
    });

    const [modalContoh, setModalContoh] = useState(false);
    const [dataMasterKategoriPertanyaan, serDataMasterKategoriPertanyaan] =
        useState([]);
    const [dataParent, setDataParent] = useState([]);
    const [pilihanJawabanKondisi, setPilihanJawabanKondisi] = useState([]);

    useEffect(() => {
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/pertanyaan/pertanyaan/create`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                serDataMasterKategoriPertanyaan([
                    ...res.data.kategoripertanyaan,
                ]);
                setDataParent([...res.data.pertanyaan]);
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

    useEffect(() => {
        if (pertanyaanForm.tipe_pertanyaan.value == "Sub_Pertanyaan") {
            if (pertanyaanForm.id_parent.value != "") {
                axios
                    .get(
                        `${
                            import.meta.env.VITE_ALL_BASE_URL
                        }/pertanyaan/pertanyaan/data/${
                            pertanyaanForm.id_parent.value
                        }`,
                        {
                            headers: {
                                Authorization: "Bearer " + Cookies.get("token"),
                            },
                        }
                    )
                    .then((res) => {
                        setPilihanJawabanKondisi([...res.data]);
                    })
                    .catch((error) => {
                        if (error.response.status == 403) {
                            Cookies.remove("token");
                            navigate("/");
                        } else {
                            alert(error.response.data.error);
                        }
                    });
            }
        }
    }, [pertanyaanForm.id_parent.value]);

    useEffect(() => {
        var cek = pilihanJawabanKondisi.filter((data) => {
            return (
                data.value == pertanyaanForm.id_pilihan_jawaban.value &&
                data.label == pertanyaanForm.id_pilihan_jawaban.label
            );
        });
        if (cek.length < 1) {
            setPertanyaanForm({
                ...pertanyaanForm,
                id_pilihan_jawaban: {
                    label: "",
                    value: "",
                },
            });
        }
    }, [pilihanJawabanKondisi, setPilihanJawabanKondisi]);

    useEffect(() => {
        axios
            .get(
                `${
                    import.meta.env.VITE_ALL_BASE_URL
                }/pertanyaan/pertanyaan/edit/${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                    },
                }
            )
            .then((res) => {
                var filter = res.data.data_sub_pertanyaan.filter(
                    (data) => data.id_pilihan_jawaban !== null
                );

                setPertanyaanForm({
                    id: res.data.id,
                    urutan: res.data.urutan,
                    id_kategori_pertanyaan: {
                        label: res.data.data_kategori_pertanyaan.nama,
                        value: res.data.id_kategori_pertanyaan,
                    },
                    pertanyaan: res.data.pertanyaan,
                    tipe_pertanyaan: {
                        label: res.data.tipe,
                        value: res.data.tipe,
                    },
                    jenis_sub_pertanyaan: {
                        label:
                            res.data.data_sub_pertanyaan.length > 0
                                ? res.data.data_sub_pertanyaan[0]
                                      .jenis_subpertanyaan
                                : "",
                        value:
                            res.data.data_sub_pertanyaan.length > 0
                                ? res.data.data_sub_pertanyaan[0]
                                      .jenis_subpertanyaan
                                : "",
                    },
                    id_parent: {
                        label:
                            res.data.data_parent !== null
                                ? res.data.data_parent.pertanyaan
                                : "",
                        value: res.data.id_parent,
                    },
                    id_pilihan_jawaban: {
                        label:
                            filter.length > 0
                                ? filter[0].data_pilihan_jawaban.nama_pilihan
                                : "",
                        value:
                            filter.length > 0
                                ? filter[0].id_pilihan_jawaban
                                : "",
                    },
                    pilihan: res.data.data_pilihan_jawaban.map((data) => {
                        return {
                            id: data.id,
                            urutan: data.urutan,
                            value: data.nama_pilihan,
                        };
                    }),
                    pilihan_inputan: res.data.data_pilihan_jawaban.map(
                        (data) => {
                            return {
                                id: data.id,
                                urutan: data.urutan,
                                value: data.nama_pilihan,
                                isInput: data.isInput == "Ya" ? true : false,
                            };
                        }
                    ),
                    checkbox: res.data.data_pilihan_jawaban.map((data) => {
                        return {
                            id: data.id,
                            urutan: data.urutan,
                            value: data.nama_pilihan,
                        };
                    }),
                    pilihan_lainnya:
                        res.data.is_jawaban_lainnya == "Ya" ? true : false,
                    sub_topik: res.data.data_sub_topik_pertanyaan.map(
                        (data) => {
                            return {
                                id: data.id,
                                urutan: data.urutan,
                                value: data.sub_topik_pertanyaan,
                            };
                        }
                    ),
                    sub_pertanyaan: res.data.data_sub_pertanyaan.map((data) => {
                        return {
                            id: data.id,
                            urutan: data.urutan,
                            value: data.sub_pertanyaan,
                        };
                    }),
                    sub_topik_pertanyaan:
                        res.data.data_sub_topik_pertanyaan.map((data) => {
                            return {
                                id: data.id,
                                urutan: data.urutan,
                                value: data.sub_topik_pertanyaan,
                            };
                        }),
                    status: {
                        label: res.data.status,
                        value: res.data.status,
                    },
                });
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

    const onChangePilihan = (index, e, params) => {
        let onChangeValue = [...pertanyaanForm.pilihan];
        if (params == "urutan") {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: e.target.value,
                value: onChangeValue[index].value,
            };
        } else {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: onChangeValue[index].urutan,
                value: e.target.value,
            };
        }
        setPertanyaanForm({
            ...pertanyaanForm,
            pilihan: onChangeValue,
        });
    };

    const onChangePilihanInputan = (index, e, isInput, params) => {
        let onChangeValue = [...pertanyaanForm.pilihan_inputan];
        if (params == "urutan") {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: e.target.value,
                value: onChangeValue[index].value,
                isInput: isInput,
            };
        } else {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: onChangeValue[index].urutan,
                value: e.target.value,
                isInput: isInput,
            };
        }
        setPertanyaanForm({
            ...pertanyaanForm,
            pilihan_inputan: onChangeValue,
        });
    };

    const onChangeSubTopik = (index, e, params) => {
        let onChangeValue = [...pertanyaanForm.sub_topik];
        if (params == "urutan") {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: e.target.value,
                value: onChangeValue[index].value,
            };
        } else {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: onChangeValue[index].urutan,
                value: e.target.value,
            };
        }
        setPertanyaanForm({
            ...pertanyaanForm,
            sub_topik: onChangeValue,
        });
    };

    const onChangeSubPertanyaan = (index, e, params) => {
        let onChangeValue = [...pertanyaanForm.sub_pertanyaan];
        if (params == "urutan") {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: e.target.value,
                value: onChangeValue[index].value,
            };
        } else {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: onChangeValue[index].urutan,
                value: e.target.value,
            };
        }
        setPertanyaanForm({
            ...pertanyaanForm,
            sub_pertanyaan: onChangeValue,
        });
    };

    const onChangeSubTopikPertanyaan = (index, e, params) => {
        let onChangeValue = [...pertanyaanForm.sub_topik_pertanyaan];
        if (params == "urutan") {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: e.target.value,
                value: onChangeValue[index].value,
            };
        } else {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: onChangeValue[index].urutan,
                value: e.target.value,
            };
        }
        setPertanyaanForm({
            ...pertanyaanForm,
            sub_topik_pertanyaan: onChangeValue,
        });
    };

    const onChangeCheckbox = (index, e, params) => {
        let onChangeValue = [...pertanyaanForm.checkbox];
        if (params == "urutan") {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: e.target.value,
                value: onChangeValue[index].value,
            };
        } else {
            onChangeValue[index] = {
                id: onChangeValue[index].id,
                urutan: onChangeValue[index].urutan,
                value: e.target.value,
            };
        }
        setPertanyaanForm({
            ...pertanyaanForm,
            checkbox: onChangeValue,
        });
    };

    const hapusPilihan = (value) => {
        const newArray = [...pertanyaanForm.pilihan];
        newArray.splice(value, 1);
        setPertanyaanForm({
            ...pertanyaanForm,
            pilihan: newArray,
        });
    };

    const hapusPilihanInputan = (value) => {
        const newArray = [...pertanyaanForm.pilihan_inputan];
        newArray.splice(value, 1);
        setPertanyaanForm({
            ...pertanyaanForm,
            pilihan_inputan: newArray,
        });
    };

    const hapusSubTopik = (value) => {
        const newArray = [...pertanyaanForm.sub_topik];
        newArray.splice(value, 1);
        setPertanyaanForm({
            ...pertanyaanForm,
            sub_topik: newArray,
        });
    };

    const hapusSubPertanyaanTopik = (value) => {
        const newArray = [...pertanyaanForm.sub_topik_pertanyaan];
        newArray.splice(value, 1);
        setPertanyaanForm({
            ...pertanyaanForm,
            sub_topik_pertanyaan: newArray,
        });
    };

    const hapusCheckbox = (value) => {
        const newArray = [...pertanyaanForm.checkbox];
        newArray.splice(value, 1);
        setPertanyaanForm({
            ...pertanyaanForm,
            checkbox: newArray,
        });
    };

    // useEffect(() => {
    //     console.log(pertanyaanForm);
    // }, [pertanyaanForm]);

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
                        }/pertanyaan/pertanyaan/update`,
                        pertanyaanForm,
                        {
                            headers: {
                                Authorization: "Bearer " + Cookies.get("token"),
                            },
                        }
                    )
                    .then((res) => {
                        Swal.fire({
                            title: "Success!",
                            text: "Data Berhasil DiUpdate.",
                            icon: "success",
                        });
                        navigate("/pertanyaan/pertanyaan");
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
                                                Detail Pertanyaan
                                            </p>
                                            <p>Silahkan Isi Seluruh Data</p>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                                <div className="md:col-span-3">
                                                    <label htmlFor="kategori_pertanyaan">
                                                        Kategori Pertanyaan
                                                    </label>
                                                    <Select
                                                        id="kategori_pertanyaan"
                                                        onChange={(value) =>
                                                            setPertanyaanForm({
                                                                ...pertanyaanForm,
                                                                id_kategori_pertanyaan:
                                                                    value,
                                                            })
                                                        }
                                                        required
                                                        value={
                                                            pertanyaanForm.id_kategori_pertanyaan
                                                        }
                                                        options={
                                                            dataMasterKategoriPertanyaan
                                                        }
                                                        placeholder="Pilih Kategori Pertanyaan"
                                                    />
                                                </div>
                                                <div className="md:col-span-3">
                                                    <label htmlFor="status_pertanyaan">
                                                        Status Pertanyaan
                                                    </label>
                                                    <Select
                                                        id="status_pertanyaan"
                                                        onChange={(value) =>
                                                            setPertanyaanForm({
                                                                ...pertanyaanForm,
                                                                status: value,
                                                            })
                                                        }
                                                        required
                                                        value={
                                                            pertanyaanForm.status
                                                        }
                                                        isDisabled={
                                                            pertanyaanForm
                                                                .tipe_pertanyaan
                                                                .value ==
                                                            "Sub_Pertanyaan"
                                                                ? true
                                                                : false
                                                        }
                                                        options={
                                                            optionStatusPertanyaan
                                                        }
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label htmlFor="urutan">
                                                        Urutan
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="urutan"
                                                        id="urutan"
                                                        onChange={(e) =>
                                                            setPertanyaanForm({
                                                                ...pertanyaanForm,
                                                                urutan: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        value={
                                                            pertanyaanForm.urutan
                                                        }
                                                        required
                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                    />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <label htmlFor="tipe">
                                                        Tipe Pertanyaan
                                                    </label>
                                                    <Select
                                                        id="tipe"
                                                        onChange={(value) =>
                                                            setPertanyaanForm({
                                                                ...pertanyaanForm,
                                                                tipe_pertanyaan:
                                                                    value,
                                                            })
                                                        }
                                                        isDisabled={true}
                                                        value={
                                                            pertanyaanForm.tipe_pertanyaan
                                                        }
                                                        options={
                                                            optionJenisPertanyaan
                                                        }
                                                        placeholder="Pilih Tipe Pertanyaan"
                                                    />
                                                </div>
                                                <div className="w-full my-auto mt-5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setModalContoh(true)
                                                        }
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
                                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {pertanyaanForm.tipe_pertanyaan
                                                    .value ==
                                                "Sub_Pertanyaan" ? (
                                                    <>
                                                        <div className="md:col-span-3">
                                                            <label htmlFor="jenis_sub_pertanyaan">
                                                                Jenis Sub
                                                                Pertanyaan
                                                            </label>
                                                            <Select
                                                                id="jenis_sub_pertanyaan"
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setPertanyaanForm(
                                                                        {
                                                                            ...pertanyaanForm,
                                                                            jenis_sub_pertanyaan:
                                                                                value,
                                                                        }
                                                                    )
                                                                }
                                                                required
                                                                isDisabled={
                                                                    true
                                                                }
                                                                value={
                                                                    pertanyaanForm.jenis_sub_pertanyaan
                                                                }
                                                                options={
                                                                    optionJenisSubPertanyaan
                                                                }
                                                            />
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <label htmlFor="id_parent">
                                                                Sub Pertanyaan
                                                                Dari Pertanyaan
                                                            </label>
                                                            <Select
                                                                id="id_parent"
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setPertanyaanForm(
                                                                        {
                                                                            ...pertanyaanForm,
                                                                            id_parent:
                                                                                value,
                                                                        }
                                                                    )
                                                                }
                                                                required
                                                                value={
                                                                    pertanyaanForm.id_parent
                                                                }
                                                                options={
                                                                    dataParent
                                                                }
                                                            />
                                                        </div>
                                                        <div className="md:col-span-6">
                                                            <label htmlFor="id_pilihan_jawaban">
                                                                Jika Jawaban
                                                                Yang Dipilih
                                                            </label>
                                                            <Select
                                                                id="id_pilihan_jawaban"
                                                                onChange={(
                                                                    value
                                                                ) =>
                                                                    setPertanyaanForm(
                                                                        {
                                                                            ...pertanyaanForm,
                                                                            id_pilihan_jawaban:
                                                                                value,
                                                                        }
                                                                    )
                                                                }
                                                                required
                                                                value={
                                                                    pertanyaanForm.id_pilihan_jawaban
                                                                }
                                                                options={
                                                                    pilihanJawabanKondisi
                                                                }
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                                <div className="md:col-span-6">
                                                    <label htmlFor="pertanyaan">
                                                        Pertanyaan
                                                    </label>
                                                    <textarea
                                                        id="pertanyaan"
                                                        rows={4}
                                                        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="..."
                                                        value={
                                                            pertanyaanForm.pertanyaan
                                                        }
                                                        onChange={(e) =>
                                                            setPertanyaanForm({
                                                                ...pertanyaanForm,
                                                                pertanyaan:
                                                                    e.target
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
                                {pertanyaanForm.tipe_pertanyaan.value !== "" ? (
                                    pertanyaanForm.tipe_pertanyaan.value !==
                                        "Inputan_Angka" &&
                                    pertanyaanForm.tipe_pertanyaan.value !==
                                        "Inputan_Text" &&
                                    pertanyaanForm.tipe_pertanyaan.value !==
                                        "Inputan_Tanggal" &&
                                    pertanyaanForm.tipe_pertanyaan.value !==
                                        "Sub_Pertanyaan" ? (
                                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                                <div className="text-gray-700">
                                                    <p className="font-medium text-lg">
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value == "Pilihan"
                                                            ? "Pilihan Pertanyaan"
                                                            : ""}{" "}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_Dengan_SubTopik"
                                                            ? "Pilihan Dengan SubTopik"
                                                            : ""}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_Dengan_Inputan"
                                                            ? "Pilihan Dengan Jawaban Input"
                                                            : ""}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_2_Sisi_Pertanyaan"
                                                            ? "Pilihan Dengan 2 Sisi Pertanyaan"
                                                            : ""}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value == "Checkbox"
                                                            ? "Pilihan Checkbox"
                                                            : ""}
                                                    </p>
                                                    <p>
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                            "Pilihan" ||
                                                        pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                            "Pilihan_Dengan_Inputan" ||
                                                        pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value == "Checkbox"
                                                            ? "Tentukan Pilihan Pertanyaan"
                                                            : ""}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_Dengan_SubTopik"
                                                            ? "Tentukan SubTopik Pertanyaan"
                                                            : ""}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_2_Sisi_Pertanyaan"
                                                            ? "Tentukan Sub Pertanyaan & Sub Topik Pertanyaan"
                                                            : ""}
                                                    </p>
                                                </div>
                                                <div className="lg:col-span-2">
                                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                                        {/* Form Pilihan */}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value == "Pilihan"
                                                            ? pertanyaanForm.pilihan.map(
                                                                  (
                                                                      value,
                                                                      i
                                                                  ) => {
                                                                      return value.id ==
                                                                          0 ? (
                                                                          <div
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3 w-full"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="urutan_pilihan">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      name="urutan_pilihan"
                                                                                      id="urutan_pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full text-black col-span-4">
                                                                                  <label htmlFor="pilihan">
                                                                                      Pilihan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan"
                                                                                      id="pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div
                                                                                  className="inline-flex justify-center rounded-md shadow-sm mt-5 ml-auto"
                                                                                  role="group"
                                                                              >
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={(
                                                                                          e
                                                                                      ) => {
                                                                                          hapusPilihan(
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
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="urutan_pilihan">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      name="urutan_pilihan"
                                                                                      id="urutan_pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full text-black col-span-5">
                                                                                  <label htmlFor="pilihan">
                                                                                      Pilihan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan"
                                                                                      id="pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  }
                                                              )
                                                            : ""}
                                                        {/* Form Pilihan Dengan Inputan */}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_Dengan_Inputan"
                                                            ? pertanyaanForm.pilihan_inputan.map(
                                                                  (
                                                                      value,
                                                                      i
                                                                  ) => {
                                                                      return value.id ==
                                                                          0 ? (
                                                                          <div
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3 w-full"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="urutan_pilihan_dengan_inputan">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      name="urutan_pilihan_dengan_inputan"
                                                                                      id="urutan_pilihan_dengan_inputan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihanInputan(
                                                                                              i,
                                                                                              e,
                                                                                              value.isInput,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full text-black col-span-4">
                                                                                  <label htmlFor="pilihan_dengan_inputan">
                                                                                      Pilihan
                                                                                      {value.isInput ==
                                                                                      true
                                                                                          ? " Dengan "
                                                                                          : " Tanpa "}
                                                                                      Inputan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan_dengan_inputan"
                                                                                      id="pilihan_dengan_inputan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihanInputan(
                                                                                              i,
                                                                                              e,
                                                                                              value.isInput,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div
                                                                                  className="inline-flex justify-center rounded-md shadow-sm mt-5 ml-auto"
                                                                                  role="group"
                                                                              >
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={(
                                                                                          e
                                                                                      ) => {
                                                                                          hapusPilihanInputan(
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
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="urutan_pilihan_dengan_inputan">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      name="urutan_pilihan_dengan_inputan"
                                                                                      id="urutan_pilihan_dengan_inputan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihanInputan(
                                                                                              i,
                                                                                              e,
                                                                                              value.isInput,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full text-black col-span-5">
                                                                                  <label htmlFor="pilihan_dengan_inputan">
                                                                                      Pilihan
                                                                                      {value.isInput ==
                                                                                      true
                                                                                          ? " Dengan "
                                                                                          : " Tanpa "}
                                                                                      Inputan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan_dengan_inputan"
                                                                                      id="pilihan_dengan_inputan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihanInputan(
                                                                                              i,
                                                                                              e,
                                                                                              value.isInput,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  }
                                                              )
                                                            : ""}
                                                        {/* Form Pilihan Dengan SubTopik */}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_Dengan_SubTopik"
                                                            ? pertanyaanForm.sub_topik.map(
                                                                  (
                                                                      value,
                                                                      i
                                                                  ) => {
                                                                      return value.id ==
                                                                          0 ? (
                                                                          <div
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3 w-full"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="urutan_pilihan_dengan_subtopik">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      name="urutan_pilihan_dengan_subtopik"
                                                                                      id="urutan_pilihan_dengan_subtopik"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangeSubTopik(
                                                                                              i,
                                                                                              e,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full text-black col-span-4">
                                                                                  <label htmlFor="pilihan_dengan_subtopik">
                                                                                      Pilihan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan_dengan_subtopik"
                                                                                      id="pilihan_dengan_subtopik"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangeSubTopik(
                                                                                              i,
                                                                                              e,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div
                                                                                  className="inline-flex justify-center rounded-md shadow-sm mt-5 ml-auto"
                                                                                  role="group"
                                                                              >
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={(
                                                                                          e
                                                                                      ) => {
                                                                                          hapusSubTopik(
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
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="urutan_pilihan_dengan_subtopik">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      name="urutan_pilihan_dengan_subtopik"
                                                                                      id="urutan_pilihan_dengan_subtopik"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangeSubTopik(
                                                                                              i,
                                                                                              e,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full col-span-5">
                                                                                  <label htmlFor="pilihan_dengan_subtopik">
                                                                                      Pilihan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan_dengan_subtopik"
                                                                                      id="pilihan_dengan_subtopik"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangeSubTopik(
                                                                                              i,
                                                                                              e,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  }
                                                              )
                                                            : ""}
                                                        {/* Form Checkbox */}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Checkbox" ? (
                                                            <>
                                                                {pertanyaanForm.checkbox.map(
                                                                    (
                                                                        value,
                                                                        i
                                                                    ) => {
                                                                        return value.id ==
                                                                            0 ? (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="col-span-6 grid grid-cols-7 gap-3 w-full"
                                                                            >
                                                                                <div className="w-full col-span-2">
                                                                                    <label htmlFor="urutan_checkbox">
                                                                                        Urutan
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        name="urutan_checkbox"
                                                                                        id="urutan_checkbox"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeCheckbox(
                                                                                                i,
                                                                                                e,
                                                                                                "urutan"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.urutan
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full text-black col-span-4">
                                                                                    <label htmlFor="pilihan_checkbox">
                                                                                        Pilihan
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="pilihan_checkbox"
                                                                                        id="pilihan_checkbox"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeCheckbox(
                                                                                                i,
                                                                                                e,
                                                                                                "value"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.value
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="inline-flex justify-center rounded-md shadow-sm mt-5 ml-auto"
                                                                                    role="group"
                                                                                >
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) => {
                                                                                            hapusCheckbox(
                                                                                                i
                                                                                            );
                                                                                        }}
                                                                                        className="p-2  text-sm font-medium m-auto text-white bg-red-500 border border-gray-200 rounded-lg hover:bg-red-600"
                                                                                    >
                                                                                        -
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="col-span-6 grid grid-cols-7 gap-3"
                                                                            >
                                                                                <div className="w-full col-span-2">
                                                                                    <label htmlFor="urutan_checkbox">
                                                                                        Urutan
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        name="urutan_checkbox"
                                                                                        id="urutan_checkbox"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeCheckbox(
                                                                                                i,
                                                                                                e,
                                                                                                "urutan"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.urutan
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full col-span-5">
                                                                                    <label htmlFor="pilihan_checkbox">
                                                                                        Pilihan
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="pilihan_checkbox"
                                                                                        id="pilihan_checkbox"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeCheckbox(
                                                                                                i,
                                                                                                e,
                                                                                                "value"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.value
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                        {pertanyaanForm
                                                            .tipe_pertanyaan
                                                            .value ==
                                                        "Pilihan_2_Sisi_Pertanyaan" ? (
                                                            <>
                                                                {pertanyaanForm.sub_pertanyaan.map(
                                                                    (
                                                                        value,
                                                                        i
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="col-span-6 grid grid-cols-7 gap-3"
                                                                            >
                                                                                <div className="w-full col-span-2">
                                                                                    <label htmlFor="urutan_pilihan_2_sisi_pertanyaan_sub_pertanyaan">
                                                                                        Urutan
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        name="urutan_pilihan_2_sisi_pertanyaan_sub_pertanyaan"
                                                                                        id="urutan_pilihan_2_sisi_pertanyaan_sub_pertanyaan"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeSubPertanyaan(
                                                                                                i,
                                                                                                e,
                                                                                                "urutan"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.urutan
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full col-span-5">
                                                                                    <label htmlFor="pilihan_2_sisi_pertanyaan_sub_pertanyaan">
                                                                                        Sub
                                                                                        Pertanyaan
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="pilihan_2_sisi_pertanyaan_sub_pertanyaan"
                                                                                        id="pilihan_2_sisi_pertanyaan_sub_pertanyaan"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeSubPertanyaan(
                                                                                                i,
                                                                                                e,
                                                                                                "value"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.value
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                                {pertanyaanForm.sub_topik_pertanyaan.map(
                                                                    (
                                                                        value,
                                                                        i
                                                                    ) => {
                                                                        return value.id ==
                                                                            0 ? (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="col-span-6 grid grid-cols-7 gap-3 w-full"
                                                                            >
                                                                                <div className="w-full col-span-2">
                                                                                    <label htmlFor="urutan_pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan">
                                                                                        Urutan
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        name="urutan_pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        id="urutan_pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeSubTopikPertanyaan(
                                                                                                i,
                                                                                                e,
                                                                                                "urutan"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.urutan
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full text-black col-span-4">
                                                                                    <label htmlFor="pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan">
                                                                                        Sub
                                                                                        Topik
                                                                                        Pertanyaan
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        id="pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeSubTopikPertanyaan(
                                                                                                i,
                                                                                                e,
                                                                                                "value"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.value
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    className="inline-flex justify-center rounded-md shadow-sm mt-5 ml-auto"
                                                                                    role="group"
                                                                                >
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(
                                                                                            e
                                                                                        ) => {
                                                                                            hapusSubPertanyaanTopik(
                                                                                                i
                                                                                            );
                                                                                        }}
                                                                                        className="p-2  text-sm font-medium m-auto text-white bg-red-500 border border-gray-200 rounded-lg hover:bg-red-600"
                                                                                    >
                                                                                        -
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="col-span-6 grid grid-cols-7 gap-3"
                                                                            >
                                                                                <div className="w-full col-span-2">
                                                                                    <label htmlFor="urutan_pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan">
                                                                                        Urutan
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        name="urutan_pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        id="urutan_pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeSubTopikPertanyaan(
                                                                                                i,
                                                                                                e,
                                                                                                "urutan"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.urutan
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full col-span-5">
                                                                                    <label htmlFor="pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan">
                                                                                        Sub
                                                                                        Topik
                                                                                        Pertanyaan
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        id="pilihan_2_sisi_pertanyaan_sub_topik_pertanyaan"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            onChangeSubTopikPertanyaan(
                                                                                                i,
                                                                                                e,
                                                                                                "value"
                                                                                            )
                                                                                        }
                                                                                        value={
                                                                                            value.value
                                                                                        }
                                                                                        required
                                                                                        className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    {pertanyaanForm
                                                        .tipe_pertanyaan
                                                        .value == "Pilihan" ? (
                                                        <>
                                                            <div className="text-left mt-2">
                                                                <div className="inline-flex items-start">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    pilihan:
                                                                                        [
                                                                                            ...pertanyaanForm.pilihan,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        +
                                                                        Pilihan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="text-left mt-2">
                                                                <div className="mb-1">
                                                                    <label htmlFor="tipe">
                                                                        Apakah
                                                                        Pertanyaan
                                                                        Ini
                                                                        Memerlukan
                                                                        Pilihan
                                                                        Lainnya
                                                                        Yang
                                                                        Dapat
                                                                        Dibuat
                                                                        Sendiri
                                                                        Oleh
                                                                        Penjawab?
                                                                    </label>
                                                                </div>
                                                                <div className="inline-flex items-start">
                                                                    <div className="flex items-center mb-4">
                                                                        <input
                                                                            id="default-radio-1"
                                                                            type="radio"
                                                                            name="default-radio"
                                                                            value={
                                                                                pertanyaanForm.pilihan_lainnya
                                                                            }
                                                                            onChange={() =>
                                                                                setPertanyaanForm(
                                                                                    {
                                                                                        ...pertanyaanForm,
                                                                                        pilihan_lainnya: true,
                                                                                    }
                                                                                )
                                                                            }
                                                                            defaultChecked={
                                                                                pertanyaanForm.pilihan_lainnya ==
                                                                                true
                                                                            }
                                                                            className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                        />
                                                                        <label
                                                                            htmlFor="default-radio-1"
                                                                            className="me-2 text-sm font-medium text-gray-900"
                                                                        >
                                                                            Ya
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id="default-radio-2"
                                                                            type="radio"
                                                                            name="default-radio"
                                                                            value={
                                                                                pertanyaanForm.pilihan_lainnya
                                                                            }
                                                                            onChange={() =>
                                                                                setPertanyaanForm(
                                                                                    {
                                                                                        ...pertanyaanForm,
                                                                                        pilihan_lainnya: false,
                                                                                    }
                                                                                )
                                                                            }
                                                                            defaultChecked={
                                                                                pertanyaanForm.pilihan_lainnya ==
                                                                                false
                                                                            }
                                                                            className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                        />
                                                                        <label
                                                                            htmlFor="default-radio-2"
                                                                            className="me-2 text-sm font-medium text-gray-900"
                                                                        >
                                                                            Tidak
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {pertanyaanForm
                                                        .tipe_pertanyaan
                                                        .value ==
                                                    "Pilihan_Dengan_Inputan" ? (
                                                        <>
                                                            <div className="text-left mt-2">
                                                                <div className="inline-flex items-start">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    pilihan_inputan:
                                                                                        [
                                                                                            ...pertanyaanForm.pilihan_inputan,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                                isInput: true,
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white me-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        +
                                                                        Pilihan
                                                                        Dengan
                                                                        Inputan
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    pilihan_inputan:
                                                                                        [
                                                                                            ...pertanyaanForm.pilihan_inputan,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                                isInput: false,
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white me-2 bg-yellow-700 hover:bg-yellow-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        +
                                                                        Pilihan
                                                                        Tanpa
                                                                        Inputan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {pertanyaanForm
                                                        .tipe_pertanyaan
                                                        .value ==
                                                    "Pilihan_Dengan_SubTopik" ? (
                                                        <>
                                                            <div className="text-left mt-2">
                                                                <div className="inline-flex items-start">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    sub_topik:
                                                                                        [
                                                                                            ...pertanyaanForm.sub_topik,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        + Sub
                                                                        Topik
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {pertanyaanForm
                                                        .tipe_pertanyaan
                                                        .value ==
                                                    "Pilihan_2_Sisi_Pertanyaan" ? (
                                                        <>
                                                            <div className="text-left mt-2">
                                                                <div className="inline-flex items-start">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    sub_topik_pertanyaan:
                                                                                        [
                                                                                            ...pertanyaanForm.sub_topik_pertanyaan,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        + Sub
                                                                        Topik
                                                                        Pertanyaan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {pertanyaanForm
                                                        .tipe_pertanyaan
                                                        .value == "Checkbox" ? (
                                                        <>
                                                            <div className="text-left mt-2">
                                                                <div className="inline-flex items-start">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    checkbox:
                                                                                        [
                                                                                            ...pertanyaanForm.checkbox,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        +
                                                                        Pilihan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )
                                ) : (
                                    ""
                                )}
                                {pertanyaanForm.tipe_pertanyaan.value ==
                                    "Sub_Pertanyaan" &&
                                pertanyaanForm.jenis_sub_pertanyaan.value ==
                                    "Pilihan" ? (
                                    <>
                                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                                <div className="text-gray-700">
                                                    <p className="font-medium text-lg">
                                                        {pertanyaanForm
                                                            .jenis_sub_pertanyaan
                                                            .value == "Pilihan"
                                                            ? "Pilihan Pertanyaan"
                                                            : ""}{" "}
                                                    </p>
                                                    <p>
                                                        {pertanyaanForm
                                                            .jenis_sub_pertanyaan
                                                            .value == "Pilihan"
                                                            ? "Tentukan Pilihan Pertanyaan"
                                                            : ""}
                                                    </p>
                                                </div>
                                                <div className="lg:col-span-2">
                                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                                        {/* Form Pilihan */}
                                                        {pertanyaanForm
                                                            .jenis_sub_pertanyaan
                                                            .value == "Pilihan"
                                                            ? pertanyaanForm.pilihan.map(
                                                                  (
                                                                      value,
                                                                      i
                                                                  ) => {
                                                                      return i !=
                                                                          0 ? (
                                                                          <div
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 w-full grid grid-cols-7 gap-3"
                                                                          >
                                                                              <div className="w-full text-black col-span-2">
                                                                                  <label htmlFor="pilihan">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      min={
                                                                                          1
                                                                                      }
                                                                                      name="urutan_pilihan"
                                                                                      id="urutan_pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full text-black col-span-4">
                                                                                  <label htmlFor="pilihan">
                                                                                      Pilihan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan"
                                                                                      id="pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "value"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div
                                                                                  className="inline-flex mt-5 justify-center ml-auto rounded-md shadow-sm"
                                                                                  role="group"
                                                                              >
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={(
                                                                                          e
                                                                                      ) => {
                                                                                          hapusPilihan(
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
                                                                              key={
                                                                                  i
                                                                              }
                                                                              className="col-span-6 grid grid-cols-7 gap-3"
                                                                          >
                                                                              <div className="w-full col-span-2">
                                                                                  <label htmlFor="pilihan">
                                                                                      Urutan
                                                                                  </label>
                                                                                  <input
                                                                                      type="number"
                                                                                      min={
                                                                                          1
                                                                                      }
                                                                                      name="urutan_pilihan"
                                                                                      id="urutan_pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "urutan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.urutan
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                              <div className="w-full col-span-5">
                                                                                  <label htmlFor="pilihan">
                                                                                      Pilihan
                                                                                  </label>
                                                                                  <input
                                                                                      type="text"
                                                                                      name="pilihan"
                                                                                      id="pilihan"
                                                                                      onChange={(
                                                                                          e
                                                                                      ) =>
                                                                                          onChangePilihan(
                                                                                              i,
                                                                                              e,
                                                                                              "pilihan"
                                                                                          )
                                                                                      }
                                                                                      value={
                                                                                          value.value
                                                                                      }
                                                                                      required
                                                                                      className="h-9.5 border rounded px-4 py-2 w-full bg-white"
                                                                                  />
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  }
                                                              )
                                                            : ""}
                                                    </div>
                                                    {pertanyaanForm
                                                        .tipe_pertanyaan
                                                        .value ==
                                                        "Sub_Pertanyaan" &&
                                                    pertanyaanForm
                                                        .jenis_sub_pertanyaan
                                                        .value == "Pilihan" ? (
                                                        <>
                                                            <div className="text-left mt-2">
                                                                <div className="inline-flex items-start">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setPertanyaanForm(
                                                                                {
                                                                                    ...pertanyaanForm,
                                                                                    pilihan:
                                                                                        [
                                                                                            ...pertanyaanForm.pilihan,
                                                                                            {
                                                                                                id: 0,
                                                                                                urutan: "",
                                                                                                value: "",
                                                                                            },
                                                                                        ],
                                                                                }
                                                                            );
                                                                        }}
                                                                        required
                                                                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 text-center"
                                                                    >
                                                                        +
                                                                        Pilihan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="text-left mt-2">
                                                                <div className="mb-1">
                                                                    <label htmlFor="tipe">
                                                                        Apakah
                                                                        Pertanyaan
                                                                        Ini
                                                                        Memerlukan
                                                                        Pilihan
                                                                        Lainnya
                                                                        Yang
                                                                        Dapat
                                                                        Dibuat
                                                                        Sendiri
                                                                        Oleh
                                                                        Penjawab?
                                                                    </label>
                                                                </div>
                                                                <div className="inline-flex items-start">
                                                                    <div className="flex items-center mb-4">
                                                                        <input
                                                                            id="default-radio-1"
                                                                            type="radio"
                                                                            name="default-radio"
                                                                            value={
                                                                                pertanyaanForm.pilihan_lainnya
                                                                            }
                                                                            onChange={() =>
                                                                                setPertanyaanForm(
                                                                                    {
                                                                                        ...pertanyaanForm,
                                                                                        pilihan_lainnya: true,
                                                                                    }
                                                                                )
                                                                            }
                                                                            defaultChecked={
                                                                                pertanyaanForm.pilihan_lainnya ==
                                                                                true
                                                                            }
                                                                            className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                        />
                                                                        <label
                                                                            htmlFor="default-radio-1"
                                                                            className="me-2 text-sm font-medium text-gray-900"
                                                                        >
                                                                            Ya
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id="default-radio-2"
                                                                            type="radio"
                                                                            name="default-radio"
                                                                            value={
                                                                                pertanyaanForm.pilihan_lainnya
                                                                            }
                                                                            onChange={() =>
                                                                                setPertanyaanForm(
                                                                                    {
                                                                                        ...pertanyaanForm,
                                                                                        pilihan_lainnya: false,
                                                                                    }
                                                                                )
                                                                            }
                                                                            defaultChecked={
                                                                                pertanyaanForm.pilihan_lainnya ==
                                                                                false
                                                                            }
                                                                            className="w-4 h-4 me-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                                        />
                                                                        <label
                                                                            htmlFor="default-radio-2"
                                                                            className="me-2 text-sm font-medium text-gray-900"
                                                                        >
                                                                            Tidak
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                                <div className="text-right mt-2">
                                    <div className="inline-flex items-end">
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
                        </div>
                    </form>
                </div>
                <ModalSecondary
                    header={"Gambaran Pertanyaan"}
                    open={modalContoh}
                    submitAction={handlerSubmit}
                    closeModal={() => setModalContoh(false)}
                >
                    <div className="block">
                        {pertanyaanForm.tipe_pertanyaan.value == "Pilihan" ? (
                            <img
                                alt="contoh_pilihan.jpg"
                                src={"/contoh_pilihan.jpg"}
                                className="h-max w-full object-cover"
                            />
                        ) : pertanyaanForm.tipe_pertanyaan.value ==
                          "Pilihan_2_Sisi_Pertanyaan" ? (
                            <img
                                alt="contoh_pilihan_2_sisi_pertanyaan.jpg"
                                src={"/contoh_pilihan_2_sisi_pertanyaan.jpg"}
                                className="h-max w-full object-cover"
                            />
                        ) : (
                            ""
                        )}

                        {pertanyaanForm.tipe_pertanyaan.value ==
                        "Pilihan_Dengan_Inputan" ? (
                            <img
                                alt="contoh_pilihan_2_sisi_pertanyaan.jpg"
                                src={"/contoh_pilihan_2_sisi_pertanyaan.jpg"}
                                className="h-max w-full object-cover"
                            />
                        ) : (
                            ""
                        )}

                        {pertanyaanForm.tipe_pertanyaan.value == "Checkbox" ? (
                            <img
                                alt="contoh_checkbox.jpg"
                                src={"/contoh_checkbox.jpg"}
                                className="h-max w-full object-cover"
                            />
                        ) : (
                            ""
                        )}

                        {pertanyaanForm.tipe_pertanyaan.value ==
                        "Pilihan_Dengan_SubTopik" ? (
                            <img
                                alt="contoh_pilihan_dengan_subtopik.jpg"
                                src={"/contoh_pilihan_dengan_subtopik.jpg"}
                                className="h-max w-full object-cover"
                            />
                        ) : (
                            ""
                        )}

                        {pertanyaanForm.tipe_pertanyaan.value ==
                            "Inputan_Angka" ||
                        pertanyaanForm.tipe_pertanyaan.value ==
                            "Inputan_Text" ||
                        pertanyaanForm.tipe_pertanyaan.value ==
                            "Inputan_Tanggal" ? (
                            <img
                                alt="contoh_inputan.jpg"
                                src={"/contoh_inputan.jpg"}
                                className="h-max w-full object-cover"
                            />
                        ) : (
                            ""
                        )}

                        {pertanyaanForm.tipe_pertanyaan.value ==
                        "Sub_Pertanyaan" ? (
                            pertanyaanForm.jenis_sub_pertanyaan.value ==
                            "Pilihan" ? (
                                <img
                                    alt="contoh_pilihan.jpg"
                                    src={"/contoh_pilihan.jpg"}
                                    className="h-max w-full object-cover"
                                />
                            ) : (
                                <img
                                    alt="contoh_inputan.jpg"
                                    src={"/contoh_inputan.jpg"}
                                    className="h-max w-full object-cover"
                                />
                            )
                        ) : (
                            ""
                        )}
                    </div>
                </ModalSecondary>
            </DashboardLayout>
        </>
    );
};
