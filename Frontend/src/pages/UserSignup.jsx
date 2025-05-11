import { useContext, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from "../contexts/UserContext"
const UserSignup=()=>{
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [warning,setWarning]=useState('')
    const context=useContext(UserContext)
    const navigate=useNavigate()
    function emailexistnavigate(){
        navigate('/user/login')
    }
    async function submitHandler(){
        const user={
            name:name,
            email:email,
            password:password
        }
        const response=await axios.post("http://localhost:4001/users/register",user)
        if (response.status===200||response.status===201){
            return navigate('/user/login')
        }
        if (response.status===409){
            setWarning('Email already exists.Use another email or <a onClick={emailexistnavigate}>login</a> to recover your account')
            return await navigate('/user/signup')
        }
        else{
            return await navigate('/error')
        }
    }
    return(
        <div>
            
            <p>{warning}</p>
            <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e)=>{setName(e.target.value)}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>
            
            <input type="email" placeholder="Email"
            value={email} 
            onChange={(e)=>{setEmail(e.target.value)}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>

            <input type="password" placeholder="Password"
            value={password} 
            onChange={(e)=>{setPassword(e.target.value)}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>
            
            <button type="submit" onClick={submitHandler}
            className="bg-black rounded-md text-white p-2">Sign Up</button><br/>

            <span>Already have an account? <Link to='/user/login' className="text-blue-600">Login here</Link></span>
        </div>
    )
}
export default UserSignup