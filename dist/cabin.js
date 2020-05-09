"use strict";

var _socket = _interopRequireDefault(require("./client/socket.io"));

var _config = _interopRequireDefault(require("./config"));

var _Led = _interopRequireDefault(require("./modules/Led"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cabinConf = _config["default"].cabin;
var leds = {
  white: new _Led["default"](cabinConf.white),
  red: new _Led["default"](cabinConf.red),
  blue: new _Led["default"](cabinConf.blue),
  yellow: new _Led["default"](cabinConf.yellow),
  green: new _Led["default"](cabinConf.green)
};
var cabinNumber = process.argv[2] || 1;
console.log("My cabin number is " + cabinNumber + ', url: http://kble-car.cf/cabin' + cabinNumber);
var socket = (0, _socket["default"])('https://kble-car.cf/client');
console.log(socket);
socket.on('on', function (color) {
  leds[color].on();
});
socket.on('off', function (color) {
  leds[color].off();
});