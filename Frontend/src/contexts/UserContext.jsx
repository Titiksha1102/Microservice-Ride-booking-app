import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName]=useState("")
    const [loading, setLoading] = useState(false);


    // async function checkAuthState() {
    //     try {
    //         const response = await axios.post(
    //             "http://localhost:4001/users/renewaccesstoken",{},
    //             { withCredentials: true }
    //         );

    //         if (response.status === 200 || response.status === 201) {
    //             setAccessToken(response.data.accessToken);

    //         } else {
    //             console.error("Unexpected status:", response.status, response.statusText);
    //         }
    //     } catch (error) {
    //         console.error("Error in checkAuthState:", error.response?.data || error.message);
    //     }
    // }

    async function checkAuthState() {
        setLoading(true); // NEW
        try {
            const response = await axios.post(
                "http://localhost:4001/users/renewaccesstoken", {},
                { withCredentials: true }
            );

            if (response.status === 200 || response.status === 201) {
                setAccessToken(response.data.accessToken);
                setEmail(response.data.user.email)
                setUserName(response.data.user.name)
            } else {
                console.error("Unexpected status:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error in checkAuthState:", error.response?.data || error.message);
        } finally {
            setLoading(false); // NEW
        }
    }


    return (
        <UserContext.Provider value={{ accessToken, setAccessToken, 
        refreshToken, setRefreshToken, 
        email, setEmail, 
        checkAuthState,
        loading }}>
            {props.children}
        </UserContext.Provider>
    );
};
