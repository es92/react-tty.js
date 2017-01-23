import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import TTY from './TTY.js';

class App extends Component {
  render() {
    return (
      <div className="App" style={{position: 'absolute', 'left': 0, 'right': 0, top: 0, bottom: 0 }}>
        <TTY />
      </div>
    );
  }
}

export default App;
