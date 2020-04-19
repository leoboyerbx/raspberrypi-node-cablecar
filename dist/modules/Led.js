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

var Led = /*#__PURE__*/function () {
  function Led(pin) {
    _classCallCheck(this, Led);

    _defineProperty(this, "state", false);

    _defineProperty(this, "blinkInterval", null);

    this.gpio = new Gpio(pin, 'out');
    this.off();
    Led.instances.push(this);
    this.isBlinking = false;
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.blink = this.blink.bind(this);
    this.toggle = this.toggle.bind(this);
    this.stopBlink = this.stopBlink.bind(this);
    this.toggleForBlink = this.toggleForBlink.bind(this);
  }

  _createClass(Led, [{
    key: "on",
    value: function on() {
      var stopBlink = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (stopBlink) this.stopBlink();
      this.gpio.writeSync(1);
      this.state = 1;
    }
  }, {
    key: "off",
    value: function off() {
      var stopBlink = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (stopBlink) this.stopBlink();
      this.gpio.writeSync(0);
      this.state = 0;
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.stopBlink();

      if (this.state) {
        this.off();
      } else {
        this.on();
      }
    }
  }, {
    key: "toggleForBlink",
    value: function toggleForBlink() {
      if (this.state) {
        this.off(false);
      } else {
        this.on(false);
      }
    }
  }, {
    key: "blink",
    value: function blink(interval) {
      if (!this.isBlinking || interval !== this.blinkInterval) {
        this.off();
        this.isBlinking = true;
        this.blinkInterval = setInterval(this.toggleForBlink, interval);
      }
    }
  }, {
    key: "stopBlink",
    value: function stopBlink() {
      if (this.blinkInterval) {
        this.isBlinking = false;
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
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
      Led.instances.map(function (instance) {
        instance.unExport();
      });
    }
  }, {
    key: "on",
    value: function on() {
      Led.instances.map(function (instance) {
        instance.on();
      });
    }
  }, {
    key: "off",
    value: function off() {
      Led.instances.map(function (instance) {
        instance.off();
      });
    }
  }]);

  return Led;
}();

_defineProperty(Led, "instances", []);

var _default = Led;
exports["default"] = _default;