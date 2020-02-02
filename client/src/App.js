import React, {useState, useEffect} from 'react';
import StockGetter from './components/stocks/StockGetter'
import LoginForm from './components/login/LoginForm'

import './App.css';

function App() {
  const [logged, setLogged] = useState()
  const [loaded, setLoaded] = useState(false)
  


  let initalize = async () => {
    let res = await fetch('/users/loggedin',{
      credentials: "include"
    })
    let data =await res.json()
    setLogged(data)
    
    
    
  }
  
  useEffect(() => {
    initalize()
    .then(() =>setLoaded(true))
  
  },[])
  
  
    
  if (loaded === false){
    return(
      
      <div style={{'color':'black'}}>LOADING, PLEASE wait</div>
    )
  }else{
    return (
      <div className="App">
        <header className="App-header">

          {logged=== true && 
          <StockGetter />}
          
          
        </header>
      </div>
    );
}} 

export default App;
