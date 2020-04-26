import express from 'express'
import httpLib from 'http'
import socketIo from 'socket.io'
import CableCarController from './modules/CableCarController';
import config from './config'
import childProcess from 'child_process'

const cableCarController = new CableCarController(config)

const app = express();
const http = httpLib.createServer(app);
const io = socketIo(http);

const port = 3000;
// app.use('/assets', express.static(__dirname + '/assets'))

app.use('/', express.static(__dirname + '/../client/'));

io.on('connection', function(socket){
    console.log('a client connected')
    // Ini current state
    socket.emit(cableCarController.isRunning ? 'start' : 'stop')
    socket.emit(cableCarController.isRunning ? 'start' : 'stop')
    socket.emit('set direction', cableCarController.currentDirection)

    // CLient sent event
    socket.on('start', () => {
      cableCarController.start()
    })

    socket.on('go to middle', () => {
      cableCarController.goToMiddle()
    })
    
    socket.on('switch direction', () => {
      cableCarController.toggleDirection()
    })

    socket.on('set automatic', set => {
      if (cableCarController.isRunning) {
        if (set) {
          cableCarController.enableAutomatic()
        } else {
          cableCarController.disableAutomatic()
        }
      }
    })

    socket.on('stop', () => {
      cableCarController.stop()
    })
});

cableCarController.on('start', () => {
  io.emit('start')
})
cableCarController.on('stop', () => {
  io.emit('stop')
})
cableCarController.on('setDirection', direction => {
  io.emit('set direction', direction)
})
cableCarController.on('enableAutomatic', () => {
  io.emit('enable automatic')
})
cableCarController.on('disableAutomatic', () => {
  io.emit('disable automatic')
})

http.listen(port, function(){
  console.log('listening on port ' + port);
  cableCarController.init(() => {console.log('controller ready')})

});
cableCarController.on('poweroff', () => {
  childProcess.exec("sudo poweroff")
})

process.on('SIGINT', () => {
  process.exit()
})

process.on('exit', () => {
  cableCarController.motor.unExport()
}); 