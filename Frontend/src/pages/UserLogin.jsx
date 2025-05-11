import { useContext, useState } from "react"
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from "../contexts/UserContext"
const UserLogin=()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const context=useContext(UserContext)
    const navigate=useNavigate()
    async function submitHandler(){
        const user={
            email:email,
            password:password
        }
        try {
            const response=await axios.post("http://localhost:4001/users/login",user,{withCredentials: true})
            const data=response.data
            context.setAccessToken(data.accessToken)
            //context.setRefreshToken(data.refreshToken)
            context.setEmail(user.email)
            console.log(context.email==='')
            navigate('/user/home')
        } catch (error) {
            console.log(error)
            navigate('/error')
        }

    }
    return(
        <div className="py-5">
            <input type="email" placeholder="Email"
            value={email} 
            onChange={(e)=>{setEmail(e.target.value)}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>

            <input type="password" placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br />

            <button type="submit"
                className="bg-black rounded-md text-white p-2" onClick={submitHandler}>Login</button><br />
            <span>Don't have an account? <Link to='/user/signup' className="text-blue-600">Create an account</Link></span><br></br>
            <span>Want to drive for <i>TezzRides</i>? <Link to='/captain/login' className="text-blue-600">Login as captain</Link></span>


        </div>
    )
}
export default UserLogin