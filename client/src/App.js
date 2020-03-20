import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client'
import Switch from './components/Switch/Switch';

const endpoint = '/'
const socket = io(endpoint)

const App = () => {

  const [ motorState, setMotorState ] = useState(false)

  socket.on('switch', state => {
    setMotorState(state)
  })

  const onChange = () => {
    socket.emit('switch', !motorState)
    // setMotorState(!motorState)
  }

  return (
    <div style={styles.center}>
      <Switch onClick={onChange} checked={motorState}></Switch>
    </div>
  );
}

const styles = {
  center: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

export default App;
