import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function Layout({children}) {
    const context=useContext(UserContext)
    return ( 
        <div className="min-h-screen flex flex-col">
        <div id="header" className="p-5 border-b-2 border-b-gray-300 flex justify-between">
            <i className="text-3xl ">TezzRides</i>
            <i >{context.userName}</i>
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