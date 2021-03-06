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
  console.log('any connected');
});
var cabin1 = io.of('/cabin1').on('connection', function (socket) {
  console.log('Cabin 1 connected');
});
var cabin2 = io.of('/cabin2').on('connection', function (socket) {
  console.log('Cabin 2 connected');
});
var cabins = [cabin1, cabin2];
var controlClients = io.of('/client').on('connection', function (socket) {
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
  socket.on('poweroff', function () {
    _child_process["default"].exec("sudo poweroff");
  });
  socket.on('light', function (action) {
    console.log(action.onoff);
    cabins[action.cabin].emit(action.onoff, action.color);
    controlClients.emit('light', action);
  });
});
cableCarController.on('start', function () {
  controlClients.emit('start');
});
cableCarController.on('stop', function () {
  controlClients.emit('stop');
});
cableCarController.on('setDirection', function (direction) {
  controlClients.emit('set direction', direction);
});
cableCarController.on('enableAutomatic', function () {
  controlClients.emit('enable automatic');
});
cableCarController.on('disableAutomatic', function () {
  controlClients.emit('disable automatic');
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