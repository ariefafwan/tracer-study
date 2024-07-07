import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const Footer = () => {
    const [profile, setProfile] = useState({
        nama: "",
        alamat: "",
        kontak: "",
        no_telp: "",
        logo: "",
        email: "",
    });

    useEffect(() => {
        if (Cookies.get("profile") !== undefined) {
            let cek = JSON.parse(Cookies.get("profile"));
            setProfile({
                nama: cek.nama,
                alamat: cek.alamat,
                kontak: cek.kontak,
                no_telp: cek.no_telp,
                logo: cek.logo,
                email: cek.email,
            });
        }
    }, []);

    return (
        <>
            <footer className="bg-white">
                <div className="mx-auto max-w-5xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
                    <div className="flex justify-center text-teal-600 text-lg font-bold">
                        <img
                            className="h-8 w-8 rounded-full"
                            src={
                                profile.logo != undefined &&
                                profile.logo != "" &&
                                profile.logo != null
                                    ? `${
                                          import.meta.env
                                              .VITE_AUTH_MAIN_BASE_URL
                                      }/storage/Profile/Logo/${profile.logo}`
                                    : "/profil_img.jpg"
                            }
                            alt=""
                        />
                        &nbsp;&nbsp;
                        <span className="my-auto">
                            Tracer Study {profile.nama}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="mx-auto mt-6 max-w-md">
                            <strong className="font-medium text-black mb-1 ">
                                Alamat
                            </strong>
                            <p className="max-md: text-sm leading-relaxed text-gray-500">
                                {profile.alamat !== ""
                                    ? profile.alamat
                                    : `Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Incidunt consequuntur amet
                                culpa cum itaque neque.`}
                            </p>
                        </div>
                        <div className="mx-auto mt-6 max-w-md">
                            <strong className="font-medium text-black mb-1">
                                Kontak
                            </strong>
                            <div className="max-md: text-sm leading-relaxed text-gray-500">
                                <ul>
                                    <li>
                                        No Telp :{" "}
                                        {profile.no_telp !== ""
                                            ? profile.no_telp
                                            : `XXXXXXXXXX`}
                                    </li>
                                    <li>
                                        Email :{" "}
                                        {profile.email !== ""
                                            ? profile.email
                                            : `xxxx@gmail.com`}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="max-lg:mt-4 lg:mt-12 border-t border-gray-100 pt-6">
                        <div className="text-center sm:flex sm:justify-between sm:text-left">
                            <p className="text-sm text-gray-500">
                                <span className="block sm:inline">
                                    All rights reserved.
                                </span>
                            </p>

                            <p className="text-sm text-gray-500 sm:order-first sm:mt-0">
                                &copy; 2022{" "}
                                {profile.nama !== ""
                                    ? profile.nama
                                    : "Company Name"}
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};
