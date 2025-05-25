import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const CaptainContext = createContext();

export const CaptainContextProvider = (props) => {
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName]=useState("")
    const [loading, setLoading] = useState(false);

    async function checkAuthState() {
        setLoading(true); // NEW
        try {
            const response = await axios.post(
                `${VITE_CAPTAIN_SERVICE_URL}/captains/renewaccesstoken`, {},
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
        <CaptainContext.Provider value={{ accessToken, setAccessToken, 
        refreshToken, setRefreshToken, 
        email, setEmail, 
        checkAuthState,
        userName, setUserName,
        loading }}>
            {props.children}
        </CaptainContext.Provider>
    );
};
