import config from './config'
import Led from './modules/Led'
import io from 'socket.io-client';
 
const cabinConf = config.cabin

const whiteLed = new Led(cabinConf.white)
const redLed = new Led(cabinConf.red)
const blueLed = new Led(cabinConf.blue)
const yellowLed = new Led(cabinConf.yellow)
const greenLed = new Led(cabinConf.green)

const cabinNumber = process.argv[1] || 1
console.log("My cabin number is " + cabinNumber)

const socket = io('http://kble-car.cf/cabin' + cabinNumber)