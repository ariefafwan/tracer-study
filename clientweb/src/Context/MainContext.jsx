/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const MainContext = createContext();

export const MainProvider = (props) => {
    const [dataProfile, setDataProfile] = useState([]);
    const [fetchProfile, setFetchProfile] = useState(false);
    const [checkAuth, setCheckAuth] = useState(false);

    useEffect(() => {
        if (fetchProfile === true) {
            axios
                .get(`${import.meta.env.VITE_ALL_BASE_URL}/client/profile`)
                .then((res) => {
                    if (Cookies.get("profile") == undefined) {
                        Cookies.set("profile", JSON.stringify(res.data), {
                            expires: 1,
                        });
                        setDataProfile([...res.data]);
                        setFetchProfile(false);
                    } else {
                        if (JSON.parse(Cookies.get("profile")) !== res.data) {
                            Cookies.set("profile", JSON.stringify(res.data), {
                                expires: 1,
                            });
                            setDataProfile([res.data]);
                            setFetchProfile(false);
                        }
                        setFetchProfile(false);
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }, [fetchProfile, setFetchProfile]);

    useEffect(() => {
        if (checkAuth) {
            if (Cookies.get("token") !== undefined) {
                axios
                    .get(
                        `${
                            import.meta.env.VITE_ALL_BASE_URL
                        }/getAuthenticatedUser`,
                        {
                            headers: {
                                Authorization: "Bearer " + Cookies.get("token"),
                            },
                        }
                    )
                    .then((res) => {
                        setCheckAuth(false);
                        // console.log(res);
                    })
                    .catch((error) => {
                        if (error.response.status == 403) {
                            Cookies.remove("token");
                        } else {
                            alert(error.response.data.error);
                        }
                        setCheckAuth(false);
                    });
            } else {
                setCheckAuth(false);
            }
        }
    }, [checkAuth, setCheckAuth]);

    const mainValue = {
        dataProfile,
        setDataProfile,
        fetchProfile,
        setFetchProfile,
        checkAuth,
        setCheckAuth,
    };

    return (
        <MainContext.Provider value={mainValue}>
            {props.children}
        </MainContext.Provider>
    );
};
