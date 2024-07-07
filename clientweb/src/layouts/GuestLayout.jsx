/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export const GuestLayout = ({ children, logo }) => {
    const location = useLocation();
    return (
        <>
            <div className="w-full h-screen">
                <Navbar></Navbar>
                {children}
                <Footer></Footer>
            </div>
        </>
    );
};
