/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const GuestLayout = ({ children }) => {
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
