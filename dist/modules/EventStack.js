"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EventStack = /*#__PURE__*/function () {
  function EventStack() {
    var thisContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, EventStack);

    _defineProperty(this, "stack", {});

    this.thisContext = thisContext;
  }

  _createClass(EventStack, [{
    key: "register",
    value: function register(trigger, callback) {
      if (!this.stack[trigger]) {
        this.stack[trigger] = [];
      }

      this.stack[trigger].push(callback);
    }
  }, {
    key: "call",
    value: function call(trigger) {
      var _this = this;

      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (this.stack[trigger] && this.stack[trigger].length > 0) {
        this.stack[trigger].map(function (action) {
          action.apply(_this.thisContext, args);
        });
      }
    }
  }]);

  return EventStack;
}();

var _default = EventStack;
exports["default"] = _default;