"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _onoff = _interopRequireDefault(require("onoff"));

var _EventStack = _interopRequireDefault(require("./EventStack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Gpio = _onoff["default"].Gpio;

var Button = /*#__PURE__*/function () {
  function Button(pin) {
    var _this = this;

    var invert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var throttle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Button);

    this.gpio = new Gpio(pin, 'in', 'both', throttle ? {
      debounceTimeout: throttle
    } : null);
    Button.instances.push(this);
    this.eventStack = new _EventStack["default"]();
    this.invert = invert;
    this.highValue = this.invert ? 0 : 1;
    this.lowValue = 1 - this.highValue;
    this.gpio.watch(function (err, value) {
      if (err) {
        //if an error
        console.error('There was an error', err); //output error message to console

        return;
      }

      if (value === _this.highValue) {
        _this.eventStack.call('push');
      }

      if (value === _this.lowValue) {
        _this.eventStack.call('release');
      }
    });
  }

  _createClass(Button, [{
    key: "on",
    value: function on(trigger, callback) {
      this.eventStack.register(trigger, callback);
    }
  }, {
    key: "unExport",
    value: function unExport() {
      this.gpio.unexport();
    }
  }], [{
    key: "unExportAll",
    value: function unExportAll() {
      Button.instances.map(function (instance) {
        instance.unExport();
      });
    }
  }]);

  return Button;
}();

_defineProperty(Button, "instances", []);

var _default = Button;
exports["default"] = _default;