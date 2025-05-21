import { useContext, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainContext } from "../contexts/CaptainContext"
const CaptainSignup=()=>{
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [vehicleNumber,setVehicleNumber]=useState('')
    const [licenseNumber,setLicenseNumber]=useState('')
    const [warning,setWarning]=useState('')
    const context=useContext(CaptainContext)
    const navigate=useNavigate()
    function emailexistnavigate(){
        navigate('/captain/login')
    }
    async function submitHandler(){
        const captain={
            name:name,
            email:email,
            password:password,
            vehicleNumber:vehicleNumber,
            licenseNumber:licenseNumber
        }
        const response=await axios.post("http://localhost:4002/captains/register",captain)
        if (response.status===200||response.status===201){
            return navigate('/captain/login')
        }
        if (response.status===409){
            setWarning('Email already exists.Use another email or <a onClick={emailexistnavigate}>login</a> to recover your account')
            return await navigate('/captain/signup')
        }
        else{
            console.log(response)
            return await navigate('/error')
        }
    }
    return(
        <div>
            <h3>Sign Up</h3>
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

            <input 
            type="text" 
            placeholder="Vehicle Number" 
            value={vehicleNumber} 
            onChange={(e)=>{setVehicleNumber(e.target.value)}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>
            
            <input 
            type="text" 
            placeholder="Driving License Number" 
            value={licenseNumber} 
            onChange={(e)=>{setLicenseNumber(e.target.value)}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>

            <input 
            type="file" 
            placeholder="Driving License" 
             
            onChange={(e)=>{}}
            className="border-gray-500 border-2 rounded-md p-2 m-2"></input><br/>

            <button type="submit" onClick={submitHandler}
            className="bg-black rounded-md text-white p-2">Sign Up</button><br/>

            <span>Already have an account? <Link to='/captain/login' className="text-blue-600">Login here</Link></span>
        </div>
    )
}
export default CaptainSignup