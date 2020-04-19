"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Led = _interopRequireDefault(require("./Led"));

var _Button = _interopRequireDefault(require("./Button"));

var _EventStack = _interopRequireDefault(require("./EventStack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ControlPanel = /*#__PURE__*/function () {
  function ControlPanel(pins) {
    _classCallCheck(this, ControlPanel);

    this.leds = {
      ready: new _Led["default"](pins.readyLed),
      running: new _Led["default"](pins.runningLed),
      error: new _Led["default"](pins.errorLed),
      directionUp: new _Led["default"](pins.upLed),
      directionDown: new _Led["default"](pins.downLed),
      endRun: new _Led["default"](pins.endRunLed),
      power: new _Led["default"](pins.powerLed)
    };
    this.buttons = {
      start: _construct(_Button["default"], _toConsumableArray(pins.startButton)),
      stop: _construct(_Button["default"], _toConsumableArray(pins.stopButton).concat([true])),
      toggleDirection: _construct(_Button["default"], _toConsumableArray(pins.toggleDirectionButton).concat([true])),
      power: _construct(_Button["default"], _toConsumableArray(pins.powerButton))
    };
    this.eventStack = new _EventStack["default"](this);
    this.automatic = false;
    this.runningStatus = "";
    this.initPowerButton();
    this.initStartButton();
  }

  _createClass(ControlPanel, [{
    key: "setAutomaticMode",
    value: function setAutomaticMode(set) {
      this.automatic = set;
      this.refreshRunningStatus();
    }
  }, {
    key: "initPowerButton",
    value: function initPowerButton() {
      var _this = this;

      this.power = {
        powerButtonPressed: false,
        timeout: null,
        handleEndTimeout: function handleEndTimeout() {
          _this.leds.power.off();

          _this.leds.power.blink(100);

          _this.power.powerButtonPressed = false;
          setTimeout(function () {
            _this.leds.power.off();

            _this.eventStack.call('poweroff');
          }, 2000);
        }
      };
      this.buttons.power.on('push', function () {
        if (!_this.power.powerButtonPressed) {
          _this.power.powerButtonPressed = true;
          _this.power.timeout = setTimeout(_this.power.handleEndTimeout, 5000);

          _this.leds.power.blink(500);
        }
      });
      this.buttons.power.on('release', function () {
        if (_this.power.powerButtonPressed) {
          _this.power.powerButtonPressed = false;
          clearTimeout(_this.power.timeout);

          _this.leds.power.off();
        }
      });
    }
  }, {
    key: "initStartButton",
    value: function initStartButton() {
      var _this2 = this;

      this.startButton = {
        startButtonPressed: false,
        timeout: null,
        handleEndTimeout: function handleEndTimeout() {
          _this2.eventStack.call('enableAutomatic');
        }
      };
      this.buttons.start.on('push', function () {
        if (!_this2.startButton.startButtonPressed) {
          _this2.startButton.startButtonPressed = true;
          _this2.startButton.timeout = setTimeout(_this2.startButton.handleEndTimeout, 2000);
        }
      });
      this.buttons.start.on('release', function () {
        if (_this2.startButton.startButtonPressed) {
          _this2.startButton.startButtonPressed = false;
          clearTimeout(_this2.startButton.timeout);
        }
      });
    }
  }, {
    key: "refreshRunningStatus",
    value: function refreshRunningStatus() {
      this.setRunningStatus(this.runningStatus);
    }
  }, {
    key: "setRunningStatus",
    value: function setRunningStatus(status) {
      switch (status) {
        case 'ready':
          if (this.automatic) {
            this.leds.ready.blink(500);
          } else {
            this.leds.ready.on();
          }

          this.leds.running.off();
          this.leds.error.off();
          break;

        case 'running':
          if (this.automatic) {
            this.leds.ready.blink(200);
          } else {
            this.leds.ready.off();
          }

          this.leds.running.blink(200);
          this.leds.error.off();
          break;

        case 'error':
          this.leds.ready.off();
          this.leds.running.off();
          this.leds.error.on();

        default:
          break;
      }

      this.runningStatus = status;
    }
  }, {
    key: "setDirectionStatus",
    value: function setDirectionStatus(direction) {
      switch (direction) {
        case 0:
          this.leds.directionUp.on();
          this.leds.directionDown.off();
          break;

        case 1:
          this.leds.directionUp.off();
          this.leds.directionDown.on();
          break;

        default:
          break;
      }
    }
  }, {
    key: "setEndRun",
    value: function setEndRun(val) {
      if (val) {
        this.leds.endRun.on();
      } else {
        this.leds.endRun.off();
      }
    }
  }, {
    key: "onStartButton",
    value: function onStartButton(trigger, callback) {
      this.buttons.start.on(trigger, callback);
    }
  }, {
    key: "onStopButton",
    value: function onStopButton(trigger, callback) {
      this.buttons.stop.on(trigger, callback);
    }
  }, {
    key: "onToggleButton",
    value: function onToggleButton(trigger, callback) {
      this.buttons.toggleDirection.on(trigger, callback);
    }
  }, {
    key: "onPowerOff",
    value: function onPowerOff(callback) {
      this.eventStack.register('poweroff', callback);
    }
  }, {
    key: "onEnableAutomatic",
    value: function onEnableAutomatic(callback) {
      this.eventStack.register('enableAutomatic', callback);
    }
  }]);

  return ControlPanel;
}();

process.on('exit', function () {
  _Button["default"].unExportAll();

  _Led["default"].unExportAll();
});
var _default = ControlPanel;
exports["default"] = _default;