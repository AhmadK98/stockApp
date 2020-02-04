import React, {useState, useEffect} from 'react'
import './login.scss'
import {
    Redirect
  } from "react-router-dom";

function LoginForm() {
    const [logged, setLogged] = useState(null)

    const loginSubmit = async (e) => {
        e.preventDefault()
        let userLoginInfo = JSON.stringify({
            "user": document.getElementById('username').value,
            "password": document.getElementById('password').value
        })
        fetch('/users/login',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: userLoginInfo,
                credentials: "include"
            })
            .then((req) =>req.json())
            .then((data)=>{
                setLogged(data)
                console.log(data)})
        

    }
    // useEffect([logged])
    console.log(typeof null)

    if(logged != null & logged !='fail'){
        console.log(logged)
        return <Redirect to="/dash" />
    }else{
        console.log(typeof logged)
    return (
        <form id='loginForm' onSubmit={loginSubmit}>
            <div className='div-login-form' >
                <div className='welcome-message'>Welcome</div>
                <div className='username'>
                    <input type="text" placeholder='Username' className="form-input" id='username' />
                </div>
                <div>
                    <input type="password" placeholder='Password' className="form-input" id='password'></input>
                </div>
                <div>
                    <button type="submit" className='button-submit'>Login</button>
                </div>
                <div className='additional-links'>
                    <div className='forgot-password'>
                        Forgot password?
                    </div>
                    <div className='register-here'>
                        Register here.
                    </div>
                </div>

            </div>
        </form>

    )
    }
}

export default LoginForm