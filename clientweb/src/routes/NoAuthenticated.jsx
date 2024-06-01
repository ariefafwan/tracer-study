import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
export const NoAuthenticated = ({ children }) => {
    if (Cookies.get("token") !== undefined) {
        return <Navigate to={"/dashboard"} />;
    } else if (Cookies.get("token") === undefined) {
        return children;
    }
};
