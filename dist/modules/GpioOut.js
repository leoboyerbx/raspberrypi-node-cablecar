"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _onoff = _interopRequireDefault(require("onoff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Gpio = _onoff["default"].Gpio;

var GpioOut = /*#__PURE__*/function () {
  function GpioOut(pin) {
    var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, GpioOut);

    _defineProperty(this, "state", false);

    this.gpio = new Gpio(pin, 'out');
    this.off();
    GpioOut.instances.push(this);
    this.reverse = reverse;
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  _createClass(GpioOut, [{
    key: "on",
    value: function on() {
      var state = this.reverse ? 0 : 1;
      this.gpio.writeSync(state);
      this.state = state;
    }
  }, {
    key: "off",
    value: function off() {
      var state = this.reverse ? 1 : 0;
      this.gpio.writeSync(state);
      this.state = state;
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.reverse ? !this.state : this.state) {
        this.off();
      } else {
        this.on();
      }
    }
  }, {
    key: "unExport",
    value: function unExport() {
      this.off();
      this.gpio.unexport();
    }
  }], [{
    key: "unExportAll",
    value: function unExportAll() {
      GpioOut.instances.map(function (instance) {
        instance.unExport();
      });
    }
  }, {
    key: "on",
    value: function on() {
      GpioOut.instances.map(function (instance) {
        instance.on();
      });
    }
  }, {
    key: "off",
    value: function off() {
      GpioOut.instances.map(function (instance) {
        instance.off();
      });
    }
  }]);

  return GpioOut;
}();

_defineProperty(GpioOut, "instances", []);

var _default = GpioOut;
exports["default"] = _default;