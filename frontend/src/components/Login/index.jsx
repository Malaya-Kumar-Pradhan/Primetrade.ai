import { useState} from "react";
import {useNavigate} from 'react-router'
import Cookies from 'js-cookie'
import "./index.css"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isError,setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  const onSubmitSuccess=(jwtToken)=>{
    Cookies.set('jwt_token',jwtToken,{expires:30})
    navigate("/dashboard")
  }

  const onSubmitFailure = (error) =>{
    setErrorMsg(error)
    setError(true)
  }

  const onClickLogin = async (event) =>{
    event.preventDefault()
    const userDetails = {username,password}
    const url = 'https://primetrade-ai-8z46.onrender.com/api/v2/login'
    const options = {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(userDetails)
    }
    const response = await fetch(url,options)
    const data = await response.json()
    if(response.ok){
        onSubmitSuccess(data.jwtToken)
    }
    else{
        onSubmitFailure(data.error_msg)
    }
  }

  return (
    <div className="login-container">
      <div className="login-cart-container">
        <form className="login-form" onSubmit={onClickLogin}>
          <div className="input-container">
            <label htmlFor="username">USERNAME</label><br/>
            <input type='text' className="input-element" id="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder='Enter your username'/>
          </div>
          <div className="input-container">
            <label htmlFor="password">PASSWORD</label><br/>
            <input type='password' className="input-element" id="password" value={password} minLength={8} maxLength={8} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Enter your Password'/>
          </div>
          <div className="btn-container">
            <button className="btn" type='submit'>Login</button>
            <button type="button" className="btn" onClick={()=>{navigate('/register')}}>SignUp</button>
          </div>
          {isError && <p className="error" style={{ color: 'red' }}>*{errorMsg}</p>}
        </form>
      </div>
    </div>
  )}

export default Login
