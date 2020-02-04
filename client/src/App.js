import React, { useState, useEffect } from 'react';
import StockGetter from './components/stocks/StockGetter'
import LoginForm from './components/login/LoginForm'
import Loading from './components/loading/Loading'
import Navbar from './components/navbar/Navbar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";



import './App.css';

function App() {
  const [logged, setLogged] = useState(false)
  const [loaded, setLoaded] = useState(false)
  // const [serve, setServe] = useState()
  const [count, setCount] = useState(0);




  let initalize = async () => {
    let res = await fetch('/users/loggedin', {
      credentials: "include"
    })
    let data = await res.json()
    return data
  }

  useEffect(() => {
    initalize().then((data) => {
      setLogged(data === "true")
      setLoaded(true)
    })
  }, [])

  // useEffect(()=>{

  //   if (logged === true) {
  //     setServe(<StockGetter />)   
  //   }else{
  //     setServe(<LoginForm />) 
  //   }

  // },[logged])



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
          <Navbar />
          <Router>
            <Switch>
              {/* <Route path="/" exact component={Home} /> */}
              <Route path="/login" component={LoginForm} />
              <Route path="/dash" component={StockGetter} />
            </Switch>
          </Router>
        </header>



      </div>
    );
  }
}

export default App;
