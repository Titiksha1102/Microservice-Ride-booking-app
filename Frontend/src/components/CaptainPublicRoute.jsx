import { Navigate, Outlet } from "react-router-dom";
import { CaptainContext } from "../contexts/CaptainContext"
import { useContext, useEffect } from "react";

const CaptainPublicRoute = () => {
    
    const context = useContext(CaptainContext);
    useEffect(()=>{
        const waitAuth=async ()=>{
            await context.checkAuthState()
        }
        waitAuth()
    },[context.accessToken])
    
        
    const isAuthenticated = context.accessToken!=''

    return isAuthenticated ? <Navigate to="/captain/home" /> : <Outlet />;
};

export default CaptainPublicRoute;
