"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ControlPanel = _interopRequireDefault(require("./ControlPanel"));

var _BidirectionnalMotor = _interopRequireDefault(require("./BidirectionnalMotor"));

var _EventStack = _interopRequireDefault(require("./EventStack"));

var _Button = _interopRequireDefault(require("./Button"));

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

var CableCarController = /*#__PURE__*/function () {
  function CableCarController(config) {
    _classCallCheck(this, CableCarController);

    this.controlPanel = new _ControlPanel["default"](config.pins);
    this.motor = _construct(_BidirectionnalMotor["default"], _toConsumableArray(config.motor.pins));
    this.endRunButton = _construct(_Button["default"], _toConsumableArray(config.pins.endRunButton));
    this.config = config;
    this.justSwitchedDirection = false;
    this.isEndRun = false;
    this.automatic = false;
    this.eventStack = new _EventStack["default"](this);
  }

  _createClass(CableCarController, [{
    key: "init",
    value: function init() {
      var _this = this;

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        return null;
      };
      this.motor.setDirection(0);
      this.controlPanel.setDirectionStatus(0);
      this.controlPanel.setRunningStatus('ready');
      this.controlPanel.onStartButton('push', function () {
        console.log('startButton');

        _this.start();
      });
      this.controlPanel.onStopButton('push', function () {
        console.log('stopButton');

        _this.disableAutomatic();

        _this.stop();
      });
      this.controlPanel.onToggleButton('release', function () {
        console.log('toggle');

        _this.toggleDirection();
      });
      this.endRunButton.on('push', function () {
        console.log('endRun');

        _this.endRun();
      });
      this.controlPanel.onEnableAutomatic(function () {
        console.log('enable automatic');

        _this.enableAutomatic();
      });
      this.controlPanel.onPowerOff(function () {
        _this.eventStack.call('poweroff');
      });
      if (callback) callback();
      this.eventStack.call('init');
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      if (!this.isEndRun) {
        this.motor.on();
        this.controlPanel.setRunningStatus('running');
        this.eventStack.call('start');
        this.controlPanel.setEndRun(false);
        setTimeout(function () {
          _this2.justSwitchedDirection = false;
        }, 500);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.motor.off();
      this.controlPanel.setRunningStatus('ready');
      this.eventStack.call('stop');
    }
  }, {
    key: "enableAutomatic",
    value: function enableAutomatic() {
      this.automatic = true;
      this.controlPanel.setAutomaticMode(true);
    }
  }, {
    key: "disableAutomatic",
    value: function disableAutomatic() {
      this.automatic = false;
      this.controlPanel.setAutomaticMode(false);

      if (this.automaticTimeout) {
        clearTimeout(this.automaticTimeout);
        this.automaticTimeout = null;
      }
    }
  }, {
    key: "autoReverse",
    value: function autoReverse() {
      this.toggleDirection();
      this.start();
    }
  }, {
    key: "endRun",
    value: function endRun() {
      var _this3 = this;

      if (this.isRunning && !this.justSwitchedDirection) {
        this.isEndRun = true;
        this.stop();
        this.eventStack.call('endRun');
        this.controlPanel.setEndRun(true);

        if (this.automatic) {
          this.automaticTimeout = setTimeout(function () {
            _this3.autoReverse();
          }, this.config.automaticModeDelay * 1000);
        }
      }
    }
  }, {
    key: "setDirection",
    value: function setDirection(direction) {
      if (!this.isRunning) {
        if (this.motor.currentDirection !== direction) {
          this.justSwitchedDirection = true;
          this.isEndRun = false;
        }

        this.motor.setDirection(direction);
        this.controlPanel.setDirectionStatus(direction);
        this.eventStack.call('setDirection');
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "toggleDirection",
    value: function toggleDirection() {
      this.setDirection(1 - this.motor.currentDirection);
      this.controlPanel.setEndRun(false);
    }
  }, {
    key: "on",
    value: function on(trigger, callback) {
      this.eventStack.register(trigger, callback);
    }
  }, {
    key: "isRunning",
    get: function get() {
      return this.motor.running;
    }
  }]);

  return CableCarController;
}();

var _default = CableCarController;
exports["default"] = _default;