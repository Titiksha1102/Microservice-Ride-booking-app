import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"
import { useContext, useEffect } from "react";

const UserPublicRoute = () => {
    
    const context = useContext(UserContext);
    useEffect(()=>{
        const waitAuth=async ()=>{
            await context.checkAuthState()
        }
        waitAuth()
    },[context.accessToken])
    
        
    const isAuthenticated = context.accessToken!=''

    return isAuthenticated ? <Navigate to="/user/home" /> : <Outlet />;
};

export default UserPublicRoute;
