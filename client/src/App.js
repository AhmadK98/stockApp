import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  fetch('/stocks').then(res => res.json()).then(data => console.log(data))
  return (
    <div className="App">
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
