import React, { useState, useEffect } from 'react';
import Dashboard from './components/stocks/Dashboard'
import LoginForm from './components/login/LoginForm'
import Loading from './components/loading/Loading'
import Navbar from './components/navbar/Navbar'
import Home from './components/home/Home'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  Redirect
} from "react-router-dom";



import './App.css';

function App() {
  const [logged, setLogged] = useState(true)
  const [loaded, setLoaded] = useState(false)
  // const [serve, setServe] = useState()





  let initialize = async () => {
    let res = await fetch('/users/loggedin', {
      credentials: "include"
    })
    let data = await res.json()
    return data
  }

  useEffect(() => {
    console.log('appRerender')
    const interval = setInterval(() => {
      initialize().then((data) => {

        setLogged(data === "true")
        setLoaded(true)
        clearInterval(interval)
      })
    }, 1000)

  }, [])


  // useEffect(()=>{

  //   if (logged === true) {
  //     setServe(<StockGetter />)   
  //   }else{
  //     setServe(<LoginForm />) 
  //   }

  // },[logged])


  const PrivateRoute = ({ component: Component, ...rest }) => (
    initialize().then((data) => setLogged(data === "true")),
    <Route {...rest} render={(props) => (
      logged === true ? <Component {...props} /> : <Redirect to='/login' />
    )} />
  )

  if (loaded === false) {
    return (
      <div className="App">
        <header className="App-header">
          <Loading />
        </header>
      </div>

    )

  } else {
    return (
      <div className="App">

        <header className="App-header">

          <Router>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={LoginForm} />
              <PrivateRoute path="/dash" component={Dashboard} />
            </Switch>
          </Router>
        </header>



      </div>
    );
  }
}

export default App;
