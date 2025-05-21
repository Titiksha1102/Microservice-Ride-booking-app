import { useContext, useState } from "react"
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'
import { CaptainContext } from "../contexts/CaptainContext"
const CaptainLogin=()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const context=useContext(CaptainContext)
    const navigate=useNavigate()
    async function submitHandler(){
        const captain={
            email:email,
            password:password
        }
        try {
            const response=await axios.post("http://localhost:4002/captains/login",captain,{withCredentials: true})
            const data=response.data
            console.log(data.accessToken)
            context.setAccessToken(data.accessToken)
            //context.setRefreshToken(data.refreshToken)
            context.setEmail(captain.email)
            console.log(context.email==='')
            navigate('/captain/home')
        } catch (error) {
            console.log(error)
            navigate('/error')
        }

    }
    return(
        <div className="py-5">
            <h3>Login</h3>
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
            <span>Don't have an account? <Link to='/captain/signup' className="text-blue-600">Create an account as captain</Link></span><br></br>
            <span>Want to book a ride ? <Link to='/user/login' className="text-blue-600">Login as rider</Link></span>


        </div>
    )
}
export default CaptainLogin