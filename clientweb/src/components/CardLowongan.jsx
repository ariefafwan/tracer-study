import { useEffect } from "react";
import { Link } from "react-router-dom";

export const CardLowongan = ({ data }) => {
    return (
        <>
            <Link
                className="block rounded-xl border border-teal-300 p-8 shadow-xl transition hover:border-teal-500/10 hover:shadow-teal-500/10"
                href="#"
            >
                <img
                    className="h-10 w-10"
                    src={
                        data.logo_perusahaan !== null ||
                        data.logo_perusahaan !== ""
                            ? `${
                                  import.meta.env.VITE_AUTH_MAIN_BASE_URL
                              }/storage/Logo/${data.logo_perusahaan}`
                            : "/loading.jpg"
                    }
                    alt=""
                />
                <h2 className="mt-2 text-lg font-bold text-gray-500">
                    {data.judul_lowongan}
                </h2>
                <p className="mt-1 inline-flex text-xs text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-3 my-auto"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                    </svg>
                    &nbsp;
                    {data.kota}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    {data.nama_perusahaan}
                </p>
            </Link>
        </>
    );
};
