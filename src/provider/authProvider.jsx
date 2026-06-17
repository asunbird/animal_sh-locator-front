import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { getJwtToken, logout as clearAuth } from "../services/authService";

const AuthProvider = ({ children }) => {
    // Initialize from cookie so the JWT is the source of truth
    const [token, setToken_] = useState(getJwtToken);

    const setToken = (newToken) => {
        setToken_(newToken);
    };

    useEffect(() => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
        clearAuth();
    }
    }, [token]);


    const contextValue = useMemo(
        () => ({ token, setToken }),
        [token]
    );

    return (
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
    );

};

export default AuthProvider;