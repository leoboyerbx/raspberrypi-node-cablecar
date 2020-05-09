"use strict";

var _config = _interopRequireDefault(require("./config"));

var _Led = _interopRequireDefault(require("./modules/Led"));

var _socket = _interopRequireDefault(require("socket.io-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cabinConf = _config["default"].cabin;
var whiteLed = new _Led["default"](cabinConf.white);
var redLed = new _Led["default"](cabinConf.red);
var blueLed = new _Led["default"](cabinConf.blue);
var yellowLed = new _Led["default"](cabinConf.yellow);
var greenLed = new _Led["default"](cabinConf.green);
var cabinNumber = process.argv[1] || 1;
console.log("My cabin number is " + cabinNumber);
var socket = (0, _socket["default"])('http://kble-car.cf/cabin' + cabinNumber);