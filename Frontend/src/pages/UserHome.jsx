import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import PlacesComponent4 from "../PlacesComponent4"

const UserHome=()=>{
    const context=useContext(UserContext)
    
    return(
        <>
        
        <PlacesComponent4/>
        </>
        
    )
}
export default UserHome