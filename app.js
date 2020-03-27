import express from 'express'
import controlPanel from './modules/ControlPanel'
import httpLib from 'http'
import socketIo from 'socket.io'

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
});


process.on('SIGINT', () => {
  motor.unExport()
}); 