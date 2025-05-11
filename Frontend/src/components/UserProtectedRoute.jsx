// import { Navigate, Outlet } from "react-router-dom";
// import { UserContext } from "../contexts/UserContext"
// import { useContext } from "react";

// const UserProtectedRoute = () => {
//     const context = useContext(UserContext);
//     const waitAuth=async ()=>{
//         await context.checkAuthState()
//     }
//     waitAuth()
//     const isAuthenticated = context.accessToken !== ''; 
//     console.log(context.accessToken!='')
//     console.log(context.accessToken)
//     console.log(isAuthenticated)
//     return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" />;
// };

// export default UserProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState, useEffect } from "react";

const UserProtectedRoute = () => {
    const context = useContext(UserContext);
    const [authChecked, setAuthChecked] = useState(false);
    useEffect(()=>{
        const waitAuth = async () => {
            if (!authChecked) {
                await context.checkAuthState();
                setAuthChecked(true);
            }
        };
        waitAuth();
    
        
    },[context,authChecked])
    
    if (context.loading || !authChecked) {
        return <div>Loading...</div>; // 🔥 Show loader until auth is done
    }
    const isAuthenticated = context.accessToken !== '';
    return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" />;
};

export default UserProtectedRoute;

