"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _GpioOut = _interopRequireDefault(require("./GpioOut"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BidirectionnalMotor = /*#__PURE__*/function () {
  function BidirectionnalMotor(pin1, pin2) {
    _classCallCheck(this, BidirectionnalMotor);

    this.relays = [new _GpioOut["default"](pin1, true), new _GpioOut["default"](pin2, true)];
    this.currentDirection = 0;
    this.running = false;
    this.off();
  }

  _createClass(BidirectionnalMotor, [{
    key: "on",
    value: function on() {
      this.currentRelay.on();
      this.running = true;
    }
  }, {
    key: "off",
    value: function off() {
      this.relays.map(function (relay) {
        relay.off();
      });
      this.running = false;
    }
  }, {
    key: "setDirection",
    value: function setDirection(direction) {
      var applyImmediately = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.currentDirection = direction;

      if (applyImmediately) {
        this.off();
        this.on();
      }
    }
  }, {
    key: "unExport",
    value: function unExport() {
      _GpioOut["default"].unExportAll();
    }
  }, {
    key: "currentRelay",
    get: function get() {
      return this.relays[this.currentDirection];
    }
  }]);

  return BidirectionnalMotor;
}();

var _default = BidirectionnalMotor;
exports["default"] = _default;