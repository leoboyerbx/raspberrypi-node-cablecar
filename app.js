const express = require('express')
const Led = require('./modules/led')
const Button = require('./modules/button')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const BidirectionnalMotor = require('./modules/motor')


const motor = new BidirectionnalMotor(4, 3)
motor.off()


const port = 3001;
// app.use('/assets', express.static(__dirname + '/assets'))

// app.use('/', express.static(__dirname + '/client/build'));

const redLed = new Led(22)
const blueLed = new Led(27)
const greenLed = new Led(17)
blueLed.on()

const greenButton = new Button(24)
const blackButton = new Button(25)

const startMotor = () => {
  motor.on()
  redLed.off()
  blueLed.off()
  greenLed.blink(200)
  io.emit('switch', true)
}
const stopMotor = () => {
  motor.off()
  redLed.off()
  blueLed.on()
  greenLed.off()
  io.emit('switch', false)
}


const switchMotorState = state => {
  if (state) { startMotor() }
  else { stopMotor() }
}

const handleButton = direction => {
  if (motor.running) {
    stopMotor()
  } else {
    motor.setDirection(direction)
    startMotor()
  }
}

greenButton.on('release', () => { handleButton(0) })
blackButton.on('push', () => { handleButton(1) })

io.on('connection', function(socket){
    socket.emit('switch', motor.currentState)
    socket.on('switch', value => {
        switchMotorState(value)
    })
  });

http.listen(port, function(){
  console.log('listening on port ' + port);
});


process.on('SIGINT', () => {
  motor.unExport()
  Led.unExportAll()
}); 