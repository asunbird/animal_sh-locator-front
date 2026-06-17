// set up the authentication context using React's context API

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";


// the provider for the authentication context.
// It receives children as a prop, that will have access to the authentication context.
const AuthProvider = ({ children }) => {
    // State to hold the authentication token

    // token represents the authentication token.
    // localStorage.getItem("token") retrieves the token value from the local storage if it exists.
    const [token, setToken_] = useState(localStorage.getItem("token"));

    // Function to set the authentication token
    // Create the setToken function to update the authentication token value.
    const setToken = (newToken) => {
        setToken_(newToken);
    };

    // Use useEffect() to set the default authorization header in axios 
    // and stores the token value in the local storage using localStorage.setItem()
    useEffect(() => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = 
            "Bearer " + token;
        localStorage.setItem('token',token);
    } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('token')
    }
    }, [token]);


    // Memoized value of the authentication context
    // Create the memoized context value using useMemo()
    // The token value is used as a dependency for memoization
    const contextValue = useMemo(
    () => ({
        token,
        setToken,
    }),
    [token]
    );

    // Provide the authentication context to the child components. 
    // Pass the contextValue as the value prop of the provider
    return (
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
    );

};

export default AuthProvider;