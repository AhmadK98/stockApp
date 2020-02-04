import React from 'react'
import './login.scss'

function LoginForm() {

    const loginFormStyles = {
        'div-login-form': {

            'display': 'flex',
            'flexDirection': 'column',
            'borderRadius': '3px',
            'background': 'white',
            'padding': '20px 20px 70px 20px'
        },
        'div-h': {
            'background': 'white'
        },
        'form-input': {
            'padding': '10px',
            'fontSize': '20px',
            'margin': '5px',
            'borderRadius': '3px',
            'border': '1px solid grey'

        },
        'button-submit': {
            'padding': '10px',
            'witdh': '100%',
            'margin': '5px',
            'alignItem': 'center',
            'fontSize': '20px',
            'borderRadius': '5px',
            'border': '1px none white',
            'background': '#0077b5',
            'color': 'white'
        }

    }

    const loginSubmit = async (e) => {
        e.preventDefault()
        let userLoginInfo = JSON.stringify({
            "user": document.getElementById('username').value,
            "password": document.getElementById('password').value
        })
        await fetch('/users/login',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: userLoginInfo,
                credentials: "include"
            })

    }




    return (
        <form id='loginForm' onSubmit={loginSubmit}>
            <div className='div-login-form' >
                <div class='welcome-message'>Welcome</div>
                <div className='username'>
                    <input type="text" placeholder='Username' class="form-input" id='username' />
                </div>
                <div>
                    <input type="password" placeholder='Password' class="form-input" id='password'></input>
                </div>
                <div>
                    <button type="submit" class='button-submit'>Login</button>
                </div>
                <div class='additional-links'>
                    <div class='forgot-password'>
                        Forgot password?
                    </div>
                    <div class='register-here'>
                        Register here.
                    </div>
                </div>

            </div>
        </form>

    )
}

export default LoginForm