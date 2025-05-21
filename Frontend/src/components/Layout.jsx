import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { CaptainContext } from "../contexts/CaptainContext";

function Layout({children}) {
    const context=useContext(UserContext)
    const captainContext=useContext(CaptainContext)
    return ( 
        <div className="min-h-screen flex flex-col">
        <div id="header" className="p-5 border-b-2 border-b-gray-300 flex justify-between">
                <i className="text-3xl ">TezzRides</i>
                {(context?.userName || captainContext?.userName) && (
                    <i>Welcome, {context?.userName || captainContext?.userName}</i>
                )}
                <button type=""
                className="bg-black rounded-md text-white p-2" onClick={()=>{
                    context?.setAccessToken('')
                    context?.setUserName('')
                    context?.setEmail('')
                    captainContext?.setAccessToken('')
                    captainContext?.setUserName('')
                    captainContext?.setEmail('')

                }}>Logout</button>
        </div>
        <div id="main" className="flex-grow py-2">
            {children}
        </div>
        <div id="footer" className="p-5 bg-gray-300 text-center">
            Footer
        </div>
        </div>
     );
}

export default Layout;