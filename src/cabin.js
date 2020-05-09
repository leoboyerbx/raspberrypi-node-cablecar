import config from './config'
import Led from './modules/Led'
import io from 'socket.io-client';
 
const cabinConf = config.cabin

const leds = {
  white: new Led(cabinConf.white),
  red: new Led(cabinConf.red),
  blue: new Led(cabinConf.blue),
  yellow: new Led(cabinConf.yellow),
  green: new Led(cabinConf.green)
}

const cabinNumber = process.argv[1] || 1
console.log("My cabin number is " + cabinNumber)

const socket = io('http://kble-car.cf/cabin' + cabinNumber)

socket.on('on', color => {
  leds[color].on()
})
socket.on('off', color => {
  leds[color].off()
})