import React from 'react'


function LoginForm() {
    
    const loginFormStyles = {
        'div-login-form':{
            
            'display':'flex',
            'flexDirection':'column',
            'borderRadius':'3px',
            'background':'white',
            'padding':'20px 20px 70px 20px'
        },
        'div-h':{
            'background':'white'
        },
        'form-input':{
            'padding':'10px',
            'fontSize':'20px',
            'margin':'5px',
            'borderRadius':'3px',
            'border':'1px solid grey'
            
        },
        'button-submit':{
            'padding':'10px',
            'witdh':'100%',
            'margin':'5px',            
            'alignItem':'center',
            'fontSize':'20px',
            'borderRadius':'5px',
            'border':'1px none white',
            'background':'#0077b5',
            'color':'white'
        }
    }

    const loginSubmit = async (e) => {
        e.preventDefault()
        let userLoginInfo = JSON.stringify({
            "user":document.getElementById('username').value,
            "password":document.getElementById('password').value
        })
        await fetch('/users/login',
        {
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body: userLoginInfo,
            credentials: "include"  
        })
        
    }

    


    return (
        <form id='loginForm' onSubmit={loginSubmit}>
        <div className='login-form' style={loginFormStyles['div-login-form']}>
            
                <div className='username'>
                    <input type="text"  placeholder='Username' style={loginFormStyles['form-input']} id='username' />
                </div>
                <div>
                    <input type="password" placeholder='Password' style={loginFormStyles['form-input']} id='password'></input>
                </div>
                
                <button type="submit" style={loginFormStyles['button-submit']}>Login</button>
             </div>   
            </form>
        
    )
}

export default LoginForm