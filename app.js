import express from 'express'
import httpLib from 'http'
import socketIo from 'socket.io'
import CableCarController from './modules/CableCarController';
import config from './config';

const cableCarController = new CableCarController(config)

const app = express();
const http = httpLib.createServer(app);
const io = socketIo(http);


const port = 3001;
// app.use('/assets', express.static(__dirname + '/assets'))

// app.use('/', express.static(__dirname + '/client/build'));

io.on('connection', function(socket){
    socket.emit('switch', motor.currentState)
    socket.on('switch', value => {
        switchMotorState(value)
    })
  });

http.listen(port, function(){
  console.log('listening on port ' + port);
  cableCarController.init(() => {console.log('controller ready')})

});
cableCarController.on('poweroff', process.exit)

process.on('SIGINT', () => {
  process.exit()
})

process.on('exit', () => {
  cableCarController.motor.unExport()
}); 