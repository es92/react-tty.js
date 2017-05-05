'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports._getTTY = _getTTY;
exports._initTTY = _initTTY;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ttyWrapped = require('./tty-wrapped.js');

var _ttyWrapped2 = _interopRequireDefault(_ttyWrapped);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path_to_tty = {};

function _getTTY(path) {
  return path_to_tty[path];
}

function _initTTY(path, username, password) {
  var _getTTY2 = (0, _ttyWrapped2.default)(),
      _getTTY3 = _slicedToArray(_getTTY2, 2),
      tty = _getTTY3[0],
      initialTTYOpen = _getTTY3[1];

  path_to_tty[path] = tty;
  initialTTYOpen(path, username, password);
}

var TTY = function (_Component) {
  _inherits(TTY, _Component);

  function TTY() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TTY);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TTY.__proto__ || Object.getPrototypeOf(TTY)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      bg_color: 'white'
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TTY, [{
    key: 'componentDidMount',
    value: function componentDidMount() {

      if (path_to_tty[this.props.config.url] == null) {
        _initTTY(this.props.config.url, this.props.config.username, this.props.config.password);
      }

      this.tty_connection = path_to_tty[this.props.config.url];

      this._mkWindow();

      var s = {};

      var fix_size = false;

      function resize_to_size() {
        this._syncWindowSize();
      }

      function check_resize() {
        if (this.tty.clientWidth !== s.last_width || s.last_height !== this.tty.clientHeight) {
          resize_to_size.bind(this)();
        }

        s.last_width = this.tty.clientWidth;
        s.last_height = this.tty.clientHeight;
      }

      function add_mutation_resize_check(elem) {
        var mo = new MutationObserver(function (mutations) {
          if (mutations.length > 0) {
            check_resize.bind(this)();
          }
        }.bind(this));
        mo.observe(elem, { attributes: true, attributeFilter: ['style'] });
        return mo;
      }

      this.window_resize_listener = check_resize.bind(this);

      this.mutation_resizers = [];
      if (!fix_size) {
        window.addEventListener('resize', this.window_resize_listener);
        var elem = this.tty;
        do {
          var mo = add_mutation_resize_check.bind(this)(elem);
          this.mutation_resizers.push(mo);
          elem = elem.parentNode;
        } while (elem != null);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._closed = true;
      this._win.destroy();
      this.mutation_resizers.forEach(function (m) {
        return m.disconnect();
      });
      window.removeEventListener('resize', this.window_resize_listener);
    }
  }, {
    key: '_syncWindowSize',
    value: function _syncWindowSize() {
      var newHeight = this.tty.clientHeight;
      var newWidth = this.tty.clientWidth;

      var lostHeight = 15 + 10;
      var lostWidth = 10;

      var newCols = Math.floor((newWidth - lostWidth) / this.pix_per_col);
      var newRows = Math.floor((newHeight - lostHeight) / this.pix_per_row);

      this._win.resize(newCols, newRows);
    }
  }, {
    key: 'focus',
    value: function focus() {
      this._win.focused.focus();
      this._win.focused.element.focus();
    }
  }, {
    key: 'keypress',
    value: function keypress(charCode) {
      this._win.focused.keyPress({ charCode: charCode });
    }
  }, {
    key: '_setTTY',
    value: function _setTTY(tty) {
      this.tty = tty;
    }
  }, {
    key: '_mkWindow',
    value: function _mkWindow() {
      var win = new this.tty_connection.Window();
      this._win = win;

      win.element.style.fontFamily = this.props.styleConfig.font.family;
      win.element.querySelector('.terminal').style.fontSize = this.props.styleConfig.font.size;
      win.element.querySelector('.terminal').style.color = this.props.styleConfig.foregroundColor;
      win.element.querySelector('.terminal').style.backgroundColor = this.props.styleConfig.backgroundColor;

      this.setState({ bg_color: win.element.querySelector('.terminal').style.backgroundColor });
      win.element.style.border = 'none';
      win.element.querySelector('.terminal').style.border = 'none';

      win.element.parentNode.removeChild(win.element);

      var grip = win.element.querySelector('.grip');
      grip.parentNode.removeChild(grip);

      var isIPhone = ~navigator.userAgent.indexOf('iPhone');
      if (isIPhone) win.element.classList.add('ios-term');

      this.tty.appendChild(win.element);
      this.pix_per_col = this._win.element.clientWidth / this._win.cols;
      this.pix_per_row = this._win.element.clientHeight / this._win.rows;
      this._syncWindowSize();

      this.tty_connection.on('reset', function () {
        this._mkWindow();
      }.bind(this));

      win.on('close', function () {
        if (!this._closed) this.props.onClose();
      }.bind(this));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('div', { ref: function ref(r) {
          return _this2._setTTY(r);
        }, className: 'tty', style: { position: 'absolute',
          'left': 0,
          'right': 0,
          top: 0,
          bottom: 0,
          backgroundColor: this.state.bg_color } });
    }
  }]);

  return TTY;
}(_react.Component);

exports.default = TTY;

