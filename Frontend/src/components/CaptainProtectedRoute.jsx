import { Navigate, Outlet } from "react-router-dom";
import { CaptainContext } from "../contexts/CaptainContext";
import { useContext, useState, useEffect } from "react";

const CaptainProtectedRoute = () => {
    const context = useContext(CaptainContext);
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
    return isAuthenticated ? <Outlet /> : <Navigate to="/captain/login" />;
};

export default CaptainProtectedRoute;

