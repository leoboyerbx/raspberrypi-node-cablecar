"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _CableCarController = _interopRequireDefault(require("./modules/CableCarController"));

var _config = _interopRequireDefault(require("./config"));

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cableCarController = new _CableCarController["default"](_config["default"]);
var app = (0, _express["default"])();

var http = _http["default"].createServer(app);

var io = (0, _socket["default"])(http);
var port = 3000; // app.use('/assets', express.static(__dirname + '/assets'))

app.use('/', _express["default"]["static"](__dirname + '/../client/'));
io.on('connection', function (socket) {
  console.log('a client connected'); // Ini current state

  socket.emit(cableCarController.isRunning ? 'start' : 'stop');
  socket.emit(cableCarController.isRunning ? 'start' : 'stop');
  socket.emit('set direction', cableCarController.currentDirection); // CLient sent event

  socket.on('start', function () {
    cableCarController.start();
  });
  socket.on('go to middle', function () {
    cableCarController.goToMiddle();
  });
  socket.on('switch direction', function () {
    cableCarController.toggleDirection();
  });
  socket.on('set automatic', function (set) {
    if (cableCarController.isRunning) {
      if (set) {
        cableCarController.enableAutomatic();
      } else {
        cableCarController.disableAutomatic();
      }
    }
  });
  socket.on('stop', function () {
    cableCarController.stop();
  });
});
cableCarController.on('start', function () {
  io.emit('start');
});
cableCarController.on('stop', function () {
  io.emit('stop');
});
cableCarController.on('setDirection', function (direction) {
  io.emit('set direction', direction);
});
cableCarController.on('enableAutomatic', function () {
  io.emit('enable automatic');
});
cableCarController.on('disableAutomatic', function () {
  io.emit('disable automatic');
});
http.listen(port, function () {
  console.log('listening on port ' + port);
  cableCarController.init(function () {
    console.log('controller ready');
  });
});
cableCarController.on('poweroff', function () {
  _child_process["default"].exec("sudo poweroff");
});
process.on('SIGINT', function () {
  process.exit();
});
process.on('exit', function () {
  cableCarController.motor.unExport();
});