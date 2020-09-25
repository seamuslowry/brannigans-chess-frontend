import React from 'react';
import logo from './logo.svg';
import './App.css';
import chessService from './services/chessService';

function App() {

  chessService.getGames()
  .then(l => l.data.forEach(console.log))
  .catch(e => console.error(e))

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
