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

const cabinNumber = process.argv[2] || 1
console.log("My cabin number is " + cabinNumber)

const socket = io.connect('https://kble-car.cf/cabin1')
console.log(socket)
socket.on('on', color => {
  leds[color].on()
})
socket.on('off', color => {
  leds[color].off()
})