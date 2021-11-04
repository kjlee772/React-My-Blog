import React, { Component } from 'react';
import './App.css';
import { Head } from './inc'
import { Main } from './page/index.js'

class App extends Component {
  render() {
    return (
      <div style={{ height: '100%', fontFamily: 'retro' }}>
        <div>
          <Head />
        </div>

        <div style={{ height: '100%' }}>
          <Main />
        </div>
      </div>
    )
  }
}

export default App;