import { useState} from "react";
import {useNavigate} from "react-router"
import './index.css'

const Register = () =>{
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [phoneNo,setNumber] = useState('')
    const [password,setPassword] = useState('')
    const [result,setResult] = useState('')
    const [isResult,setIsResult] = useState(false)
    const navigate = useNavigate()

    const onClickRegister = async (event) =>{
        event.preventDefault()
        const userDetails = {name,email,gender,phoneNo,password}
        const url = 'http://localhost:3000/api/v1/register'
        const options = {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(userDetails)
        }
        const response = await fetch(url, options);
        const data = await response.json()
        if(response.ok){
            navigate('/dashboard');
        }
        else{
            setIsResult(true)
            setResult(data.error_msg)
        }
    }

    return(
        <div className="register-container">
            <form className="register-form" onSubmit={onClickRegister}>
                <div className="input1-container">
                    <label htmlFor="name">Name</label><br/>
                    <input type="text" className="input1-element" id="name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div className="input1-container">
                    <label htmlFor="email">Email</label><br/>
                    <input type="text" id="email"  className="input1-element" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                </div>
                <div className="input1-container">
                    <label htmlFor="gender">Gender</label><br/>
                    <select id="gender" value={gender} className="select-element" onChange={(e)=>{setGender(e.target.value)}}>
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="input1-container">
                    <label htmlFor="phoneNo">Phone Number</label><br/>
                    <input type="tel" className="input1-element" id="phoneNo" value={phoneNo} onChange={(e)=>{setNumber(e.target.value)}}/>
                </div>
                <div className="input1-container">
                    <label htmlFor="password">Password</label><br/>
                    <input type="password" id="password" className="input1-element" maxLength={8} minLength={8} value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                <div className="btn-container">
                    <button type="submit" className="register-btn">Register</button>
                </div>
                {isResult && <p className="error">*{result}</p>}
            </form>
        </div>
    )

}

export default Register