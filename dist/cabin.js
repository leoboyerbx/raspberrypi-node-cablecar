"use strict";

var _config = _interopRequireDefault(require("./config"));

var _Led = _interopRequireDefault(require("./modules/Led"));

var _socket = _interopRequireDefault(require("socket.io-client"));

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
console.log("My cabin number is " + cabinNumber);

var socket = _socket["default"].connect('https://kble-car.cf/cabin' + cabinNumber);

socket.on('on', function (color) {
  leds[color].on();
});
socket.on('off', function (color) {
  leds[color].off();
});