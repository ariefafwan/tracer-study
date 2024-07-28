/* eslint-disable no-unused-vars */
import { Helmet, HelmetProvider } from "react-helmet-async";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Head = ({ title }) => {
    const [logo, setLogo] = useState("");

    useEffect(() => {
        if (Cookies.get("profile") !== undefined) {
            let profile = JSON.parse(Cookies.get("profile"));
            setLogo(profile.logo);
        }
    }, []);

    return (
        <>
            <HelmetProvider>
                <div>
                    <Helmet>
                        <link
                            rel="icon"
                            type="image/svg+xml"
                            href={
                                logo != undefined && logo != "" && logo != null
                                    ? `${
                                          import.meta.env
                                              .VITE_AUTH_MAIN_BASE_URL
                                      }/storage/Profile/Logo/${logo}`
                                    : ""
                            }
                        />
                        <title>{title}</title>
                    </Helmet>
                </div>
            </HelmetProvider>
        </>
    );
};
