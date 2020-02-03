import React, {useState, useEffect} from 'react';
import StockGetter from './components/stocks/StockGetter'
import LoginForm from './components/login/LoginForm'


import './App.css';

function App() {
  const [logged, setLogged] = useState(false)
  const [loaded, setLoaded] = useState(false)
  // const [serve, setServe] = useState()
  const [count, setCount] = useState(0);

 


  let initalize = async () => {
    let res = await fetch('/users/loggedin',{
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
  },[])
  
  // useEffect(()=>{
    
  //   if (logged === true) {
  //     setServe(<StockGetter />)   
  //   }else{
  //     setServe(<LoginForm />) 
  //   }
    
  // },[logged])

  
    
  if (loaded === false){
    return(
      
      <div style={{'color':'black'}}>LOADING, PLEASE wait</div>
    )
  }else{
    return (
      <div className="App">
        <header className="App-header">
        <LoginForm />
        <StockGetter />
        <div>
               <p>You clicked {count} times</p>
               <button onClick={() => setCount(count + 1)}>
                  Click me
               </button>
          </div>
        </header>
      </div>
    );
}} 

export default App;
