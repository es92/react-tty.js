import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import TTY from './TTY.js';

let config = {
  url: 'https://localhost:8090/',
  username: '',
  password: ''
}

let styleConfig = {
  font: {
    family: '"DejaVu Sans Mono", "Liberation Mono", monospace',
    size: '12px'
  },
  foregroundColor: '#f0f0f0',
  backgroundColor: '#000'
}

class App extends Component {
  render() {
    return (
      <div>
      <div className="App" style={{position: 'absolute', 'left': 0, 'right': 0, top: 0, bottom: '50%' }}>
        <TTY onClose={() => {} } config={config} styleConfig={styleConfig}/>
      </div>
      <div className="App" style={{position: 'absolute', 'left': 0, 'right': 0, top: '50%', bottom: 0 }}>
        <TTY onClose={() => {} } config={config} styleConfig={styleConfig}/>
      </div>
      </div>
    );
  }
}

export default App;
