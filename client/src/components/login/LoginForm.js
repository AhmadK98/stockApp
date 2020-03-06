import React, { useEffect} from 'react'
import './login.scss'
import {
    // BrowserRouter as Route,
    // Redirect,
    useHistory
  } from "react-router-dom";


function LoginForm() {
    let history = useHistory()
    // const [logged, setLogged] = useState(null)

    console.log('Login')
    let initialize = async () => {
        let res = await fetch('/users/loggedin', {
          credentials: "include"
        })
        let data = await res.json()
        
        if (await data === 'true'){
            history.replace('/dash')
        }
      }
    useEffect(()=>{
        initialize()
    },[])

    // const PrivateRoute = ({ component: Component, ...rest }) => (
    //     console.log(logged),
    //     <Route {...rest} render={(props) => (
          
    //       logged === true
    //         ? <Component {...props} />
    //         : <Redirect to='/login' />
    //     )} />
    //   )

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
                // setLogged(data.login === true)
                if (data.login === true){ 
                    setTimeout(()=>{
                        // console.log('hiAgian')
                        history.replace('/dash')
                        
                    },2000) 
                       
                }})
    }
   

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


export default LoginForm