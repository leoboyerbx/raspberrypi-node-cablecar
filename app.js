const express = require('express')
const Led = require('./modules/led')
const Button = require('./modules/button')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const BidirectionnalMotor = require('./modules/motor')

const controlPanel = require('./modules/controlPanel')

const motor = new BidirectionnalMotor(4, 3)
motor.off()


const port = 3001;
// app.use('/assets', express.static(__dirname + '/assets'))

// app.use('/', express.static(__dirname + '/client/build'));

controlPanel.setStatus('ready')
setTimeout(() => { controlPanel.setStatus('running') }, 5000)
setTimeout(() => { controlPanel.setStatus('error') }, 8000)


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
}); 