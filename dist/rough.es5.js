"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rough = function () {
  'use strict';

  function RoughSegmentRelation() {
    return {
      LEFT: 0,
      RIGHT: 1,
      INTERSECTS: 2,
      AHEAD: 3,
      BEHIND: 4,
      SEPARATE: 5,
      UNDEFINED: 6
    };
  }

  var RoughSegment = function () {
    function RoughSegment(px1, py1, px2, py2) {
      _classCallCheck(this, RoughSegment);

      this.RoughSegmentRelationConst = RoughSegmentRelation();
      this.px1 = px1;
      this.py1 = py1;
      this.px2 = px2;
      this.py2 = py2;
      this.xi = Number.MAX_VALUE;
      this.yi = Number.MAX_VALUE;
      this.a = py2 - py1;
      this.b = px1 - px2;
      this.c = px2 * py1 - px1 * py2;
      this._undefined = this.a == 0 && this.b == 0 && this.c == 0;
    }

    _createClass(RoughSegment, [{
      key: "isUndefined",
      value: function isUndefined() {
        return this._undefined;
      }
    }, {
      key: "compare",
      value: function compare(otherSegment) {
        if (this.isUndefined() || otherSegment.isUndefined()) {
          return this.RoughSegmentRelationConst.UNDEFINED;
        }
        var grad1 = Number.MAX_VALUE;
        var grad2 = Number.MAX_VALUE;
        var int1 = 0,
            int2 = 0;
        var a = this.a,
            b = this.b,
            c = this.c;

        if (Math.abs(b) > 0.00001) {
          grad1 = -a / b;
          int1 = -c / b;
        }
        if (Math.abs(otherSegment.b) > 0.00001) {
          grad2 = -otherSegment.a / otherSegment.b;
          int2 = -otherSegment.c / otherSegment.b;
        }

        if (grad1 == Number.MAX_VALUE) {
          if (grad2 == Number.MAX_VALUE) {
            if (-c / a != -otherSegment.c / otherSegment.a) {
              return this.RoughSegmentRelationConst.SEPARATE;
            }
            if (this.py1 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
              this.xi = this.px1;
              this.yi = this.py1;
              return this.RoughSegmentRelationConst.INTERSECTS;
            }
            if (this.py2 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py2 <= Math.max(otherSegment.py1, otherSegment.py2)) {
              this.xi = this.px2;
              this.yi = this.py2;
              return this.RoughSegmentRelationConst.INTERSECTS;
            }
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          this.xi = this.px1;
          this.yi = grad2 * this.xi + int2;
          if ((this.py1 - this.yi) * (this.yi - this.py2) < -0.00001 || (otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          if (Math.abs(otherSegment.a) < 0.00001) {
            if ((otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
              return this.RoughSegmentRelationConst.SEPARATE;
            }
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          return this.RoughSegmentRelationConst.INTERSECTS;
        }

        if (grad2 == Number.MAX_VALUE) {
          this.xi = otherSegment.px1;
          this.yi = grad1 * this.xi + int1;
          if ((otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001 || (this.py1 - this.yi) * (this.yi - this.py2) < -0.00001) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          if (Math.abs(a) < 0.00001) {
            if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001) {
              return this.RoughSegmentRelationConst.SEPARATE;
            }
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          return this.RoughSegmentRelationConst.INTERSECTS;
        }

        if (grad1 == grad2) {
          if (int1 != int2) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          if (this.px1 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
            this.xi = this.px1;
            this.yi = this.py1;
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          if (this.px2 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px2 <= Math.max(otherSegment.px1, otherSegment.px2)) {
            this.xi = this.px2;
            this.yi = this.py2;
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          return this.RoughSegmentRelationConst.SEPARATE;
        }

        this.xi = (int2 - int1) / (grad1 - grad2);
        this.yi = grad1 * this.xi + int1;

        if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001 || (otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        return this.RoughSegmentRelationConst.INTERSECTS;
      }
    }, {
      key: "getLength",
      value: function getLength() {
        return this._getLength(this.px1, this.py1, this.px2, this.py2);
      }
    }, {
      key: "_getLength",
      value: function _getLength(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
      }
    }]);

    return RoughSegment;
  }();

  var RoughHachureIterator = function () {
    function RoughHachureIterator(top, bottom, left, right, gap, sinAngle, cosAngle, tanAngle) {
      _classCallCheck(this, RoughHachureIterator);

      this.top = top;
      this.bottom = bottom;
      this.left = left;
      this.right = right;
      this.gap = gap;
      this.sinAngle = sinAngle;
      this.tanAngle = tanAngle;

      if (Math.abs(sinAngle) < 0.0001) {
        this.pos = left + gap;
      } else if (Math.abs(sinAngle) > 0.9999) {
        this.pos = top + gap;
      } else {
        this.deltaX = (bottom - top) * Math.abs(tanAngle);
        this.pos = left - Math.abs(this.deltaX);
        this.hGap = Math.abs(gap / cosAngle);
        this.sLeft = new RoughSegment(left, bottom, left, top);
        this.sRight = new RoughSegment(right, bottom, right, top);
      }
    }

    _createClass(RoughHachureIterator, [{
      key: "getNextLine",
      value: function getNextLine() {
        if (Math.abs(this.sinAngle) < 0.0001) {
          if (this.pos < this.right) {
            var line = [this.pos, this.top, this.pos, this.bottom];
            this.pos += this.gap;
            return line;
          }
        } else if (Math.abs(this.sinAngle) > 0.9999) {
          if (this.pos < this.bottom) {
            var _line = [this.left, this.pos, this.right, this.pos];
            this.pos += this.gap;
            return _line;
          }
        } else {
          var xLower = this.pos - this.deltaX / 2;
          var xUpper = this.pos + this.deltaX / 2;
          var yLower = this.bottom;
          var yUpper = this.top;
          if (this.pos < this.right + this.deltaX) {
            while (xLower < this.left && xUpper < this.left || xLower > this.right && xUpper > this.right) {
              this.pos += this.hGap;
              xLower = this.pos - this.deltaX / 2;
              xUpper = this.pos + this.deltaX / 2;
              if (this.pos > this.right + this.deltaX) {
                return null;
              }
            }
            var s = new RoughSegment(xLower, yLower, xUpper, yUpper);
            if (s.compare(this.sLeft) == RoughSegmentRelation().INTERSECTS) {
              xLower = s.xi;
              yLower = s.yi;
            }
            if (s.compare(this.sRight) == RoughSegmentRelation().INTERSECTS) {
              xUpper = s.xi;
              yUpper = s.yi;
            }
            if (this.tanAngle > 0) {
              xLower = this.right - (xLower - this.left);
              xUpper = this.right - (xUpper - this.left);
            }
            var _line2 = [xLower, yLower, xUpper, yUpper];
            this.pos += this.hGap;
            return _line2;
          }
        }
        return null;
      }
    }]);

    return RoughHachureIterator;
  }();

  var PathToken = function () {
    function PathToken(type, text) {
      _classCallCheck(this, PathToken);

      this.type = type;
      this.text = text;
    }

    _createClass(PathToken, [{
      key: "isType",
      value: function isType(type) {
        return this.type === type;
      }
    }]);

    return PathToken;
  }();

  var ParsedPath = function () {
    function ParsedPath(d) {
      _classCallCheck(this, ParsedPath);

      this.PARAMS = {
        A: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
        a: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
        C: ["x1", "y1", "x2", "y2", "x", "y"],
        c: ["x1", "y1", "x2", "y2", "x", "y"],
        H: ["x"],
        h: ["x"],
        L: ["x", "y"],
        l: ["x", "y"],
        M: ["x", "y"],
        m: ["x", "y"],
        Q: ["x1", "y1", "x", "y"],
        q: ["x1", "y1", "x", "y"],
        S: ["x2", "y2", "x", "y"],
        s: ["x2", "y2", "x", "y"],
        T: ["x", "y"],
        t: ["x", "y"],
        V: ["y"],
        v: ["y"],
        Z: [],
        z: []
      };
      this.COMMAND = 0;
      this.NUMBER = 1;
      this.EOD = 2;
      this.segments = [];
      this.d = d || "";
      this.parseData(d);
      this.processPoints();
    }

    _createClass(ParsedPath, [{
      key: "loadFromSegments",
      value: function loadFromSegments(segments) {
        this.segments = segments;
        this.processPoints();
      }
    }, {
      key: "processPoints",
      value: function processPoints() {
        var first = null,
            currentPoint = [0, 0];
        for (var i = 0; i < this.segments.length; i++) {
          var s = this.segments[i];
          switch (s.key) {
            case 'M':
            case 'L':
            case 'T':
              s.point = [s.data[0], s.data[1]];
              break;
            case 'm':
            case 'l':
            case 't':
              s.point = [s.data[0] + currentPoint[0], s.data[1] + currentPoint[1]];
              break;
            case 'H':
              s.point = [s.data[0], currentPoint[1]];
              break;
            case 'h':
              s.point = [s.data[0] + currentPoint[0], currentPoint[1]];
              break;
            case 'V':
              s.point = [currentPoint[0], s.data[0]];
              break;
            case 'v':
              s.point = [currentPoint[0], s.data[0] + currentPoint[1]];
              break;
            case 'z':
            case 'Z':
              if (first) {
                s.point = [first[0], first[1]];
              }
              break;
            case 'C':
              s.point = [s.data[4], s.data[5]];
              break;
            case 'c':
              s.point = [s.data[4] + currentPoint[0], s.data[5] + currentPoint[1]];
              break;
            case 'S':
              s.point = [s.data[2], s.data[3]];
              break;
            case 's':
              s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
              break;
            case 'Q':
              s.point = [s.data[2], s.data[3]];
              break;
            case 'q':
              s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
              break;
            case 'A':
              s.point = [s.data[5], s.data[6]];
              break;
            case 'a':
              s.point = [s.data[5] + currentPoint[0], s.data[6] + currentPoint[1]];
              break;
          }
          if (s.key === 'm' || s.key === 'M') {
            first = null;
          }
          if (s.point) {
            currentPoint = s.point;
            if (!first) {
              first = s.point;
            }
          }
          if (s.key === 'z' || s.key === 'Z') {
            first = null;
          }
        }
      }
    }, {
      key: "parseData",
      value: function parseData(d) {
        var tokens = this.tokenize(d);
        var index = 0;
        var token = tokens[index];
        var mode = "BOD";
        this.segments = new Array();
        while (!token.isType(this.EOD)) {
          var param_length;
          var params = new Array();
          if (mode == "BOD") {
            if (token.text == "M" || token.text == "m") {
              index++;
              param_length = this.PARAMS[token.text].length;
              mode = token.text;
            } else {
              return this.parseData('M0,0' + d);
            }
          } else {
            if (token.isType(this.NUMBER)) {
              param_length = this.PARAMS[mode].length;
            } else {
              index++;
              param_length = this.PARAMS[token.text].length;
              mode = token.text;
            }
          }

          if (index + param_length < tokens.length) {
            for (var i = index; i < index + param_length; i++) {
              var number = tokens[i];
              if (number.isType(this.NUMBER)) {
                params[params.length] = number.text;
              } else {
                console.error("Parameter type is not a number: " + mode + "," + number.text);
                return;
              }
            }
            var segment;
            if (this.PARAMS[mode]) {
              segment = { key: mode, data: params };
            } else {
              console.error("Unsupported segment type: " + mode);
              return;
            }
            this.segments.push(segment);
            index += param_length;
            token = tokens[index];
            if (mode == "M") mode = "L";
            if (mode == "m") mode = "l";
          } else {
            console.error("Path data ended before all parameters were found");
          }
        }
      }
    }, {
      key: "tokenize",
      value: function tokenize(d) {
        var tokens = new Array();
        while (d != "") {
          if (d.match(/^([ \t\r\n,]+)/)) {
            d = d.substr(RegExp.$1.length);
          } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
            tokens[tokens.length] = new PathToken(this.COMMAND, RegExp.$1);
            d = d.substr(RegExp.$1.length);
          } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
            tokens[tokens.length] = new PathToken(this.NUMBER, parseFloat(RegExp.$1));
            d = d.substr(RegExp.$1.length);
          } else {
            console.error("Unrecognized segment command: " + d);
            return null;
          }
        }
        tokens[tokens.length] = new PathToken(this.EOD, null);
        return tokens;
      }
    }, {
      key: "closed",
      get: function get() {
        if (typeof this._closed === 'undefined') {
          this._closed = false;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.segments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var s = _step.value;

              if (s.key.toLowerCase() === 'z') {
                this._closed = true;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        return this._closed;
      }
    }]);

    return ParsedPath;
  }();

  var RoughPath = function () {
    function RoughPath(d) {
      _classCallCheck(this, RoughPath);

      this.d = d;
      this.parsed = new ParsedPath(d);
      this._position = [0, 0];
      this.bezierReflectionPoint = null;
      this.quadReflectionPoint = null;
      this._first = null;
    }

    _createClass(RoughPath, [{
      key: "setPosition",
      value: function setPosition(x, y) {
        this._position = [x, y];
        if (!this._first) {
          this._first = [x, y];
        }
      }
    }, {
      key: "segments",
      get: function get() {
        return this.parsed.segments;
      }
    }, {
      key: "closed",
      get: function get() {
        return this.parsed.closed;
      }
    }, {
      key: "linearPoints",
      get: function get() {
        if (!this._linearPoints) {
          var lp = [];
          var points = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.parsed.segments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var s = _step2.value;

              var key = s.key.toLowerCase();
              if (key === 'm' || key === 'z') {
                if (points.length) {
                  lp.push(points);
                  points = [];
                }
                if (key === 'z') {
                  continue;
                }
              }
              if (s.point) {
                points.push(s.point);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          if (points.length) {
            lp.push(points);
            points = [];
          }
          this._linearPoints = lp;
        }
        return this._linearPoints;
      }
    }, {
      key: "first",
      get: function get() {
        return this._first;
      },
      set: function set(v) {
        this._first = v;
      }
    }, {
      key: "position",
      get: function get() {
        return this._position;
      }
    }, {
      key: "x",
      get: function get() {
        return this._position[0];
      }
    }, {
      key: "y",
      get: function get() {
        return this._position[1];
      }
    }]);

    return RoughPath;
  }();

  var RoughArcConverter = function () {
    // Algorithm as described in https://www.w3.org/TR/SVG/implnote.html
    // Code adapted from nsSVGPathDataParser.cpp in Mozilla 
    // https://hg.mozilla.org/mozilla-central/file/17156fbebbc8/content/svg/content/src/nsSVGPathDataParser.cpp#l887
    function RoughArcConverter(from, to, radii, angle, largeArcFlag, sweepFlag) {
      _classCallCheck(this, RoughArcConverter);

      var radPerDeg = Math.PI / 180;
      this._segIndex = 0;
      this._numSegs = 0;
      if (from[0] == to[0] && from[1] == to[1]) {
        return;
      }
      this._rx = Math.abs(radii[0]);
      this._ry = Math.abs(radii[1]);
      this._sinPhi = Math.sin(angle * radPerDeg);
      this._cosPhi = Math.cos(angle * radPerDeg);
      var x1dash = this._cosPhi * (from[0] - to[0]) / 2.0 + this._sinPhi * (from[1] - to[1]) / 2.0;
      var y1dash = -this._sinPhi * (from[0] - to[0]) / 2.0 + this._cosPhi * (from[1] - to[1]) / 2.0;
      var root;
      var numerator = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * y1dash * y1dash - this._ry * this._ry * x1dash * x1dash;
      if (numerator < 0) {
        var s = Math.sqrt(1 - numerator / (this._rx * this._rx * this._ry * this._ry));
        this._rx = s;
        this._ry = s;
        root = 0;
      } else {
        root = (largeArcFlag == sweepFlag ? -1.0 : 1.0) * Math.sqrt(numerator / (this._rx * this._rx * y1dash * y1dash + this._ry * this._ry * x1dash * x1dash));
      }
      var cxdash = root * this._rx * y1dash / this._ry;
      var cydash = -root * this._ry * x1dash / this._rx;
      this._C = [0, 0];
      this._C[0] = this._cosPhi * cxdash - this._sinPhi * cydash + (from[0] + to[0]) / 2.0;
      this._C[1] = this._sinPhi * cxdash + this._cosPhi * cydash + (from[1] + to[1]) / 2.0;
      this._theta = this.calculateVectorAngle(1.0, 0.0, (x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry);
      var dtheta = this.calculateVectorAngle((x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry, (-x1dash - cxdash) / this._rx, (-y1dash - cydash) / this._ry);
      if (!sweepFlag && dtheta > 0) {
        dtheta -= 2 * Math.PI;
      } else if (sweepFlag && dtheta < 0) {
        dtheta += 2 * Math.PI;
      }
      this._numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
      this._delta = dtheta / this._numSegs;
      this._T = 8 / 3 * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2);
      this._from = from;
    }

    _createClass(RoughArcConverter, [{
      key: "getNextSegment",
      value: function getNextSegment() {
        var cp1, cp2, to;
        if (this._segIndex == this._numSegs) {
          return null;
        }
        var cosTheta1 = Math.cos(this._theta);
        var sinTheta1 = Math.sin(this._theta);
        var theta2 = this._theta + this._delta;
        var cosTheta2 = Math.cos(theta2);
        var sinTheta2 = Math.sin(theta2);

        to = [this._cosPhi * this._rx * cosTheta2 - this._sinPhi * this._ry * sinTheta2 + this._C[0], this._sinPhi * this._rx * cosTheta2 + this._cosPhi * this._ry * sinTheta2 + this._C[1]];
        cp1 = [this._from[0] + this._T * (-this._cosPhi * this._rx * sinTheta1 - this._sinPhi * this._ry * cosTheta1), this._from[1] + this._T * (-this._sinPhi * this._rx * sinTheta1 + this._cosPhi * this._ry * cosTheta1)];
        cp2 = [to[0] + this._T * (this._cosPhi * this._rx * sinTheta2 + this._sinPhi * this._ry * cosTheta2), to[1] + this._T * (this._sinPhi * this._rx * sinTheta2 - this._cosPhi * this._ry * cosTheta2)];

        this._theta = theta2;
        this._from = [to[0], to[1]];
        this._segIndex++;

        return {
          cp1: cp1,
          cp2: cp2,
          to: to
        };
      }
    }, {
      key: "calculateVectorAngle",
      value: function calculateVectorAngle(ux, uy, vx, vy) {
        var ta = Math.atan2(uy, ux);
        var tb = Math.atan2(vy, vx);
        if (tb >= ta) return tb - ta;
        return 2 * Math.PI - (ta - tb);
      }
    }]);

    return RoughArcConverter;
  }();

  var PathFitter = function () {
    function PathFitter(sets, closed) {
      _classCallCheck(this, PathFitter);

      this.sets = sets;
      this.closed = closed;
    }

    _createClass(PathFitter, [{
      key: "fit",
      value: function fit(simplification) {
        var outSets = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.sets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var set = _step3.value;

            var length = set.length;
            var estLength = Math.floor(simplification * length);
            if (estLength < 5) {
              if (length <= 5) {
                continue;
              }
              estLength = 5;
            }
            outSets.push(this.reduce(set, estLength));
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var d = '';
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = outSets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _set = _step4.value;

            for (var i = 0; i < _set.length; i++) {
              var point = _set[i];
              if (i === 0) {
                d += 'M' + point[0] + "," + point[1];
              } else {
                d += 'L' + point[0] + "," + point[1];
              }
            }
            if (this.closed) {
              d += 'z ';
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return d;
      }
    }, {
      key: "distance",
      value: function distance(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
      }
    }, {
      key: "reduce",
      value: function reduce(set, count) {
        if (set.length <= count) {
          return set;
        }
        var points = set.slice(0);
        while (points.length > count) {
          var minArea = -1;
          var minIndex = -1;
          for (var i = 1; i < points.length - 1; i++) {
            var a = this.distance(points[i - 1], points[i]);
            var b = this.distance(points[i], points[i + 1]);
            var c = this.distance(points[i - 1], points[i + 1]);
            var s = (a + b + c) / 2.0;
            var area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            if (minArea < 0 || area < minArea) {
              minArea = area;
              minIndex = i;
            }
          }
          if (minIndex > 0) {
            points.splice(minIndex, 1);
          } else {
            break;
          }
        }
        return points;
      }
    }]);

    return PathFitter;
  }();

  var RoughRenderer = function () {
    function RoughRenderer() {
      _classCallCheck(this, RoughRenderer);
    }

    _createClass(RoughRenderer, [{
      key: "line",
      value: function line(x1, y1, x2, y2, o) {
        var ops = this._doubleLine(x1, y1, x2, y2, o);
        return { type: 'path', ops: ops };
      }
    }, {
      key: "linearPath",
      value: function linearPath(points, close, o) {
        var len = (points || []).length;
        if (len > 2) {
          var ops = [];
          for (var i = 0; i < len - 1; i++) {
            ops = ops.concat(this._doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
          }
          if (close) {
            ops = ops.concat(this._doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
          }
          return { type: 'path', ops: ops };
        } else if (len === 2) {
          return this.line(points[0][0], points[0][1], points[1][0], points[1][1], o);
        }
      }
    }, {
      key: "polygon",
      value: function polygon(points, o) {
        return this.linearPath(points, true, o);
      }
    }, {
      key: "rectangle",
      value: function rectangle(x, y, width, height, o) {
        var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
        return this.polygon(points, o);
      }
    }, {
      key: "curve",
      value: function curve(points, o) {
        var o1 = this._curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
        var o2 = this._curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
        return { type: 'path', ops: o1.concat(o2) };
      }
    }, {
      key: "ellipse",
      value: function ellipse(x, y, width, height, o) {
        var increment = Math.PI * 2 / o.curveStepCount;
        var rx = Math.abs(width / 2);
        var ry = Math.abs(height / 2);
        rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
        ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
        var o1 = this._ellipse(increment, x, y, rx, ry, 1, increment * this._getOffset(0.1, this._getOffset(0.4, 1, o), o), o);
        var o2 = this._ellipse(increment, x, y, rx, ry, 1.5, 0, o);
        return { type: 'path', ops: o1.concat(o2) };
      }
    }, {
      key: "arc",
      value: function arc(x, y, width, height, start, stop, closed, roughClosure, o) {
        var cx = x;
        var cy = y;
        var rx = Math.abs(width / 2);
        var ry = Math.abs(height / 2);
        rx += this._getOffset(-rx * 0.01, rx * 0.01, o);
        ry += this._getOffset(-ry * 0.01, ry * 0.01, o);
        var strt = start;
        var stp = stop;
        while (strt < 0) {
          strt += Math.PI * 2;
          stp += Math.PI * 2;
        }
        if (stp - strt > Math.PI * 2) {
          strt = 0;
          stp = Math.PI * 2;
        }
        var ellipseInc = Math.PI * 2 / o.curveStepCount;
        var arcInc = Math.min(ellipseInc / 2, (stp - strt) / 2);
        var o1 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1, o);
        var o2 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1.5, o);
        var ops = o1.concat(o2);
        if (closed) {
          if (roughClosure) {
            ops = ops.concat(this._doubleLine(cx, cy, cx + rx * Math.cos(strt), cy + ry * Math.sin(strt), o));
            ops = ops.concat(this._doubleLine(cx, cy, cx + rx * Math.cos(stp), cy + ry * Math.sin(stp), o));
          } else {
            ops.push({ op: 'lineTo', data: [cx, cy] });
            ops.push({ op: 'lineTo', data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)] });
          }
        }
        return { type: 'path', ops: ops };
      }
    }, {
      key: "hachureFillArc",
      value: function hachureFillArc(x, y, width, height, start, stop, o) {
        var cx = x;
        var cy = y;
        var rx = Math.abs(width / 2);
        var ry = Math.abs(height / 2);
        rx += this._getOffset(-rx * 0.01, rx * 0.01, o);
        ry += this._getOffset(-ry * 0.01, ry * 0.01, o);
        var strt = start;
        var stp = stop;
        while (strt < 0) {
          strt += Math.PI * 2;
          stp += Math.PI * 2;
        }
        if (stp - strt > Math.PI * 2) {
          strt = 0;
          stp = Math.PI * 2;
        }
        var increment = (stp - strt) / o.curveStepCount;
        var xc = [],
            yc = [];
        for (var angle = strt; angle <= stp; angle = angle + increment) {
          xc.push(cx + rx * Math.cos(angle));
          yc.push(cy + ry * Math.sin(angle));
        }
        xc.push(cx + rx * Math.cos(stp));
        yc.push(cy + ry * Math.sin(stp));
        xc.push(cx);
        yc.push(cy);
        return this.hachureFillShape(xc, yc, o);
      }
    }, {
      key: "solidFillShape",
      value: function solidFillShape(xCoords, yCoords, o) {
        var ops = [];
        if (xCoords && yCoords && xCoords.length && yCoords.length && xCoords.length === yCoords.length) {
          var offset = o.maxRandomnessOffset || 0;
          var len = xCoords.length;
          if (len > 2) {
            ops.push({ op: 'move', data: [xCoords[0] + this._getOffset(-offset, offset, o), yCoords[0] + this._getOffset(-offset, offset, o)] });
            for (var i = 1; i < len; i++) {
              ops.push({ op: 'lineTo', data: [xCoords[i] + this._getOffset(-offset, offset, o), yCoords[i] + this._getOffset(-offset, offset, o)] });
            }
          }
        }
        return { type: 'fillPath', ops: ops };
      }
    }, {
      key: "hachureFillShape",
      value: function hachureFillShape(xCoords, yCoords, o) {
        var ops = [];
        if (xCoords && yCoords && xCoords.length && yCoords.length) {
          var left = xCoords[0];
          var right = xCoords[0];
          var top = yCoords[0];
          var bottom = yCoords[0];
          for (var i = 1; i < xCoords.length; i++) {
            left = Math.min(left, xCoords[i]);
            right = Math.max(right, xCoords[i]);
            top = Math.min(top, yCoords[i]);
            bottom = Math.max(bottom, yCoords[i]);
          }
          var angle = o.hachureAngle;
          var gap = o.hachureGap;
          if (gap < 0) {
            gap = o.strokeWidth * 4;
          }
          gap = Math.max(gap, 0.1);

          var radPerDeg = Math.PI / 180;
          var hachureAngle = angle % 180 * radPerDeg;
          var cosAngle = Math.cos(hachureAngle);
          var sinAngle = Math.sin(hachureAngle);
          var tanAngle = Math.tan(hachureAngle);

          var it = new RoughHachureIterator(top - 1, bottom + 1, left - 1, right + 1, gap, sinAngle, cosAngle, tanAngle);
          var rectCoords = void 0;
          while ((rectCoords = it.getNextLine()) != null) {
            var lines = this._getIntersectingLines(rectCoords, xCoords, yCoords);
            for (var _i = 0; _i < lines.length; _i++) {
              if (_i < lines.length - 1) {
                var p1 = lines[_i];
                var p2 = lines[_i + 1];
                ops = ops.concat(this._doubleLine(p1[0], p1[1], p2[0], p2[1], o));
              }
            }
          }
        }
        return { type: 'fillSketch', ops: ops };
      }
    }, {
      key: "hachureFillEllipse",
      value: function hachureFillEllipse(cx, cy, width, height, o) {
        var ops = [];
        var rx = Math.abs(width / 2);
        var ry = Math.abs(height / 2);
        rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
        ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
        var angle = o.hachureAngle;
        var gap = o.hachureGap;
        if (gap <= 0) {
          gap = o.strokeWidth * 4;
        }
        var fweight = o.fillWeight;
        if (fweight < 0) {
          fweight = o.strokeWidth / 2;
        }
        var radPerDeg = Math.PI / 180;
        var hachureAngle = angle % 180 * radPerDeg;
        var tanAngle = Math.tan(hachureAngle);
        var aspectRatio = ry / rx;
        var hyp = Math.sqrt(aspectRatio * tanAngle * aspectRatio * tanAngle + 1);
        var sinAnglePrime = aspectRatio * tanAngle / hyp;
        var cosAnglePrime = 1 / hyp;
        var gapPrime = gap / (rx * ry / Math.sqrt(ry * cosAnglePrime * (ry * cosAnglePrime) + rx * sinAnglePrime * (rx * sinAnglePrime)) / rx);
        var halfLen = Math.sqrt(rx * rx - (cx - rx + gapPrime) * (cx - rx + gapPrime));
        for (var xPos = cx - rx + gapPrime; xPos < cx + rx; xPos += gapPrime) {
          halfLen = Math.sqrt(rx * rx - (cx - xPos) * (cx - xPos));
          var p1 = this._affine(xPos, cy - halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
          var p2 = this._affine(xPos, cy + halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
          ops = ops.concat(this._doubleLine(p1[0], p1[1], p2[0], p2[1], o));
        }
        return { type: 'fillSketch', ops: ops };
      }
    }, {
      key: "svgPath",
      value: function svgPath(path, o) {
        path = (path || '').replace(/\n/g, " ").replace(/(-)/g, " -").replace(/(-\s)/g, "-").replace("/(\s\s)/g", " ");
        var p = new RoughPath(path);
        if (o.simplification) {
          var fitter = new PathFitter(p.linearPoints, p.closed);
          var d = fitter.fit(o.simplification);
          p = new RoughPath(d);
        }
        var ops = [];
        var segments = p.segments || [];
        for (var i = 0; i < segments.length; i++) {
          var s = segments[i];
          var prev = i > 0 ? segments[i - 1] : null;
          var opList = this._processSegment(p, s, prev, o);
          if (opList && opList.length) {
            ops = ops.concat(opList);
          }
        }
        return { type: 'path', ops: ops };
      }

      // privates

    }, {
      key: "_bezierTo",
      value: function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
        var ops = [];
        var ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
        var f = null;
        for (var i = 0; i < 2; i++) {
          if (i === 0) {
            ops.push({ op: 'move', data: [path.x, path.y] });
          } else {
            ops.push({ op: 'move', data: [path.x + this._getOffset(-ros[0], ros[0], o), path.y + this._getOffset(-ros[0], ros[0], o)] });
          }
          f = [x + this._getOffset(-ros[i], ros[i], o), y + this._getOffset(-ros[i], ros[i], o)];
          ops.push({
            op: 'bcurveTo', data: [x1 + this._getOffset(-ros[i], ros[i], o), y1 + this._getOffset(-ros[i], ros[i], o), x2 + this._getOffset(-ros[i], ros[i], o), y2 + this._getOffset(-ros[i], ros[i], o), f[0], f[1]]
          });
        }
        path.setPosition(f[0], f[1]);
        return ops;
      }
    }, {
      key: "_processSegment",
      value: function _processSegment(path, seg, prevSeg, o) {
        var ops = [];
        switch (seg.key) {
          case 'M':
          case 'm':
            {
              var delta = seg.key === 'm';
              if (seg.data.length >= 2) {
                var x = +seg.data[0];
                var y = +seg.data[1];
                if (delta) {
                  x += path.x;
                  y += path.y;
                }
                var ro = 1 * (o.maxRandomnessOffset || 0);
                x = x + this._getOffset(-ro, ro, o);
                y = y + this._getOffset(-ro, ro, o);
                path.setPosition(x, y);
                ops.push({ op: 'move', data: [x, y] });
              }
              break;
            }
          case 'L':
          case 'l':
            {
              var _delta = seg.key === 'l';
              if (seg.data.length >= 2) {
                var _x = +seg.data[0];
                var _y = +seg.data[1];
                if (_delta) {
                  _x += path.x;
                  _y += path.y;
                }
                ops = ops.concat(this._doubleLine(path.x, path.y, _x, _y, o));
                path.setPosition(_x, _y);
              }
              break;
            }
          case 'H':
          case 'h':
            {
              var _delta2 = seg.key === 'h';
              if (seg.data.length) {
                var _x2 = +seg.data[0];
                if (_delta2) {
                  _x2 += path.x;
                }
                ops = ops.concat(this._doubleLine(path.x, path.y, _x2, path.y, o));
                path.setPosition(_x2, path.y);
              }
              break;
            }
          case 'V':
          case 'v':
            {
              var _delta3 = seg.key === 'v';
              if (seg.data.length) {
                var _y2 = +seg.data[0];
                if (_delta3) {
                  _y2 += path.y;
                }
                ops = ops.concat(this._doubleLine(path.x, path.y, path.x, _y2, o));
                path.setPosition(path.x, _y2);
              }
              break;
            }
          case 'Z':
          case 'z':
            {
              if (path.first) {
                ops = ops.concat(this._doubleLine(path.x, path.y, path.first[0], path.first[1], o));
                path.setPosition(path.first[0], path.first[1]);
                path.first = null;
              }
              break;
            }
          case 'C':
          case 'c':
            {
              var _delta4 = seg.key === 'c';
              if (seg.data.length >= 6) {
                var x1 = +seg.data[0];
                var y1 = +seg.data[1];
                var x2 = +seg.data[2];
                var y2 = +seg.data[3];
                var _x3 = +seg.data[4];
                var _y3 = +seg.data[5];
                if (_delta4) {
                  x1 += path.x;
                  x2 += path.x;
                  _x3 += path.x;
                  y1 += path.y;
                  y2 += path.y;
                  _y3 += path.y;
                }
                var ob = this._bezierTo(x1, y1, x2, y2, _x3, _y3, path, o);
                ops = ops.concat(ob);
                path.bezierReflectionPoint = [_x3 + (_x3 - x2), _y3 + (_y3 - y2)];
              }
              break;
            }
          case 'S':
          case 's':
            {
              var _delta5 = seg.key === 's';
              if (seg.data.length >= 4) {
                var _x4 = +seg.data[0];
                var _y4 = +seg.data[1];
                var _x5 = +seg.data[2];
                var _y5 = +seg.data[3];
                if (_delta5) {
                  _x4 += path.x;
                  _x5 += path.x;
                  _y4 += path.y;
                  _y5 += path.y;
                }
                var _x6 = _x4;
                var _y6 = _y4;
                var prevKey = prevSeg ? prevSeg.key : "";
                var ref = null;
                if (prevKey == 'c' || prevKey == 'C' || prevKey == 's' || prevKey == 'S') {
                  ref = path.bezierReflectionPoint;
                }
                if (ref) {
                  _x6 = ref[0];
                  _y6 = ref[1];
                }
                var _ob = this._bezierTo(_x6, _y6, _x4, _y4, _x5, _y5, path, o);
                ops = ops.concat(_ob);
                path.bezierReflectionPoint = [_x5 + (_x5 - _x4), _y5 + (_y5 - _y4)];
              }
              break;
            }
          case 'Q':
          case 'q':
            {
              var _delta6 = seg.key === 'q';
              if (seg.data.length >= 4) {
                var _x7 = +seg.data[0];
                var _y7 = +seg.data[1];
                var _x8 = +seg.data[2];
                var _y8 = +seg.data[3];
                if (_delta6) {
                  _x7 += path.x;
                  _x8 += path.x;
                  _y7 += path.y;
                  _y8 += path.y;
                }
                var offset1 = 1 * (1 + o.roughness * 0.2);
                var offset2 = 1.5 * (1 + o.roughness * 0.22);
                ops.push({ op: 'move', data: [path.x + this._getOffset(-offset1, offset1, o), path.y + this._getOffset(-offset1, offset1, o)] });
                var f = [_x8 + this._getOffset(-offset1, offset1, o), _y8 + this._getOffset(-offset1, offset1, o)];
                ops.push({
                  op: 'qcurveTo', data: [_x7 + this._getOffset(-offset1, offset1, o), _y7 + this._getOffset(-offset1, offset1, o), f[0], f[1]]
                });
                ops.push({ op: 'move', data: [path.x + this._getOffset(-offset2, offset2, o), path.y + this._getOffset(-offset2, offset2, o)] });
                f = [_x8 + this._getOffset(-offset2, offset2, o), _y8 + this._getOffset(-offset2, offset2, o)];
                ops.push({
                  op: 'qcurveTo', data: [_x7 + this._getOffset(-offset2, offset2, o), _y7 + this._getOffset(-offset2, offset2, o), f[0], f[1]]
                });
                path.setPosition(f[0], f[1]);
                path.quadReflectionPoint = [_x8 + (_x8 - _x7), _y8 + (_y8 - _y7)];
              }
              break;
            }
          case 'T':
          case 't':
            {
              var _delta7 = seg.key === 't';
              if (seg.data.length >= 2) {
                var _x9 = +seg.data[0];
                var _y9 = +seg.data[1];
                if (_delta7) {
                  _x9 += path.x;
                  _y9 += path.y;
                }
                var _x10 = _x9;
                var _y10 = _y9;
                var _prevKey = prevSeg ? prevSeg.key : "";
                var ref = null;
                if (_prevKey == 'q' || _prevKey == 'Q' || _prevKey == 't' || _prevKey == 'T') {
                  ref = path.quadReflectionPoint;
                }
                if (ref) {
                  _x10 = ref[0];
                  _y10 = ref[1];
                }
                var _offset = 1 * (1 + o.roughness * 0.2);
                var _offset2 = 1.5 * (1 + o.roughness * 0.22);
                ops.push({ op: 'move', data: [path.x + this._getOffset(-_offset, _offset, o), path.y + this._getOffset(-_offset, _offset, o)] });
                var _f = [_x9 + this._getOffset(-_offset, _offset, o), _y9 + this._getOffset(-_offset, _offset, o)];
                ops.push({
                  op: 'qcurveTo', data: [_x10 + this._getOffset(-_offset, _offset, o), _y10 + this._getOffset(-_offset, _offset, o), _f[0], _f[1]]
                });
                ops.push({ op: 'move', data: [path.x + this._getOffset(-_offset2, _offset2, o), path.y + this._getOffset(-_offset2, _offset2, o)] });
                _f = [_x9 + this._getOffset(-_offset2, _offset2, o), _y9 + this._getOffset(-_offset2, _offset2, o)];
                ops.push({
                  op: 'qcurveTo', data: [_x10 + this._getOffset(-_offset2, _offset2, o), _y10 + this._getOffset(-_offset2, _offset2, o), _f[0], _f[1]]
                });
                path.setPosition(_f[0], _f[1]);
                path.quadReflectionPoint = [_x9 + (_x9 - _x10), _y9 + (_y9 - _y10)];
              }
              break;
            }
          case 'A':
          case 'a':
            {
              var _delta8 = seg.key === 'a';
              if (seg.data.length >= 7) {
                var rx = +seg.data[0];
                var ry = +seg.data[1];
                var angle = +seg.data[2];
                var largeArcFlag = +seg.data[3];
                var sweepFlag = +seg.data[4];
                var _x11 = +seg.data[5];
                var _y11 = +seg.data[6];
                if (_delta8) {
                  _x11 += path.x;
                  _y11 += path.y;
                }
                if (_x11 == path.x && _y11 == path.y) {
                  break;
                }
                if (rx == 0 || ry == 0) {
                  ops = ops.concat(this._doubleLine(path.x, path.y, _x11, _y11, o));
                  path.setPosition(_x11, _y11);
                } else {
                  var _ro = o.maxRandomnessOffset || 0;
                  for (var i = 0; i < 1; i++) {
                    var arcConverter = new RoughArcConverter([path.x, path.y], [_x11, _y11], [rx, ry], angle, largeArcFlag ? true : false, sweepFlag ? true : false);
                    var segment = arcConverter.getNextSegment();
                    while (segment) {
                      var _ob2 = this._bezierTo(segment.cp1[0], segment.cp1[1], segment.cp2[0], segment.cp2[1], segment.to[0], segment.to[1], path, o);
                      ops = ops.concat(_ob2);
                      segment = arcConverter.getNextSegment();
                    }
                  }
                }
              }
              break;
            }
          default:
            break;
        }
        return ops;
      }
    }, {
      key: "_getOffset",
      value: function _getOffset(min, max, ops) {
        return ops.roughness * (Math.random() * (max - min) + min);
      }
    }, {
      key: "_affine",
      value: function _affine(x, y, cx, cy, sinAnglePrime, cosAnglePrime, R) {
        var A = -cx * cosAnglePrime - cy * sinAnglePrime + cx;
        var B = R * (cx * sinAnglePrime - cy * cosAnglePrime) + cy;
        var C = cosAnglePrime;
        var D = sinAnglePrime;
        var E = -R * sinAnglePrime;
        var F = R * cosAnglePrime;
        return [A + C * x + D * y, B + E * x + F * y];
      }
    }, {
      key: "_doubleLine",
      value: function _doubleLine(x1, y1, x2, y2, o) {
        var o1 = this._line(x1, y1, x2, y2, o, true, false);
        var o2 = this._line(x1, y1, x2, y2, o, true, true);
        return o1.concat(o2);
      }
    }, {
      key: "_line",
      value: function _line(x1, y1, x2, y2, o, move, overlay) {
        var lengthSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
        var offset = o.maxRandomnessOffset || 0;
        if (offset * offset * 100 > lengthSq) {
          offset = Math.sqrt(lengthSq) / 10;
        }
        var halfOffset = offset / 2;
        var divergePoint = 0.2 + Math.random() * 0.2;
        var midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
        var midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
        midDispX = this._getOffset(-midDispX, midDispX, o);
        midDispY = this._getOffset(-midDispY, midDispY, o);
        var ops = [];
        if (move) {
          if (overlay) {
            ops.push({
              op: 'move', data: [x1 + this._getOffset(-halfOffset, halfOffset, o), y1 + this._getOffset(-halfOffset, halfOffset, o)]
            });
          } else {
            ops.push({
              op: 'move', data: [x1 + this._getOffset(-offset, offset, o), y1 + this._getOffset(-offset, offset, o)]
            });
          }
        }
        if (overlay) {
          ops.push({
            op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), x2 + this._getOffset(-halfOffset, halfOffset, o), y2 + this._getOffset(-halfOffset, halfOffset, o)]
          });
        } else {
          ops.push({
            op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), x2 + this._getOffset(-offset, offset, o), y2 + this._getOffset(-offset, offset, o)]
          });
        }
        return ops;
      }
    }, {
      key: "_curve",
      value: function _curve(points, closePoint, o) {
        var len = points.length;
        var ops = [];
        if (len > 3) {
          var b = [];
          var s = 1 - o.curveTightness;
          ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
          for (var i = 1; i + 2 < len; i++) {
            var cachedVertArray = points[i];
            b[0] = [cachedVertArray[0], cachedVertArray[1]];
            b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
            b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
            b[3] = [points[i + 1][0], points[i + 1][1]];
            ops.push({ op: 'bcurveTo', data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
          }
          if (closePoint && closePoint.length === 2) {
            var ro = o.maxRandomnessOffset;
            // TODO: more roughness here?
            ops.push({ ops: 'lineTo', data: [closePoint[0] + this._getOffset(-ro, ro, o), closePoint[1] + +this._getOffset(-ro, ro, o)] });
          }
        } else if (len === 3) {
          ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
          ops.push({
            op: 'bcurveTo', data: [points[1][0], points[1][1], points[2][0], points[2][1], points[2][0], points[2][1]]
          });
        } else if (len === 2) {
          ops = ops.concat(this._doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
        }
        return ops;
      }
    }, {
      key: "_ellipse",
      value: function _ellipse(increment, cx, cy, rx, ry, offset, overlap, o) {
        var radOffset = this._getOffset(-0.5, 0.5, o) - Math.PI / 2;
        var points = [];
        points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
        for (var angle = radOffset; angle < Math.PI * 2 + radOffset - 0.01; angle = angle + increment) {
          points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
        }
        points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)]);
        points.push([this._getOffset(-offset, offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap), this._getOffset(-offset, offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)]);
        points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)]);
        return this._curve(points, null, o);
      }
    }, {
      key: "_curveWithOffset",
      value: function _curveWithOffset(points, offset, o) {
        var ps = [];
        ps.push([points[0][0] + this._getOffset(-offset, offset, o), points[0][1] + this._getOffset(-offset, offset, o)]);
        ps.push([points[0][0] + this._getOffset(-offset, offset, o), points[0][1] + this._getOffset(-offset, offset, o)]);
        for (var i = 1; i < points.length; i++) {
          ps.push([points[i][0] + this._getOffset(-offset, offset, o), points[i][1] + this._getOffset(-offset, offset, o)]);
          if (i === points.length - 1) {
            ps.push([points[i][0] + this._getOffset(-offset, offset, o), points[i][1] + this._getOffset(-offset, offset, o)]);
          }
        }
        return this._curve(ps, null, o);
      }
    }, {
      key: "_arc",
      value: function _arc(increment, cx, cy, rx, ry, strt, stp, offset, o) {
        var radOffset = strt + this._getOffset(-0.1, 0.1, o);
        var points = [];
        points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
        for (var angle = radOffset; angle <= stp; angle = angle + increment) {
          points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
        }
        points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
        points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
        return this._curve(points, null, o);
      }
    }, {
      key: "_getIntersectingLines",
      value: function _getIntersectingLines(lineCoords, xCoords, yCoords) {
        var intersections = [];
        var s1 = new RoughSegment(lineCoords[0], lineCoords[1], lineCoords[2], lineCoords[3]);
        for (var i = 0; i < xCoords.length; i++) {
          var s2 = new RoughSegment(xCoords[i], yCoords[i], xCoords[(i + 1) % xCoords.length], yCoords[(i + 1) % xCoords.length]);
          if (s1.compare(s2) == RoughSegmentRelation().INTERSECTS) {
            intersections.push([s1.xi, s1.yi]);
          }
        }
        return intersections;
      }
    }]);

    return RoughRenderer;
  }();

  self._roughScript = self.document && self.document.currentScript && self.document.currentScript.src;

  var RoughGenerator = function () {
    function RoughGenerator(config, canvas) {
      _classCallCheck(this, RoughGenerator);

      this.config = config || {};
      this.canvas = canvas;
      this.defaultOptions = {
        maxRandomnessOffset: 2,
        roughness: 1,
        bowing: 1,
        stroke: '#000',
        strokeWidth: 1,
        curveTightness: 0,
        curveStepCount: 9,
        fill: null,
        fillStyle: 'hachure',
        fillWeight: -1,
        hachureAngle: -41,
        hachureGap: -1
      };
      if (this.config.options) {
        this.defaultOptions = this._options(this.config.options);
      }
    }

    _createClass(RoughGenerator, [{
      key: "_options",
      value: function _options(options) {
        return options ? Object.assign({}, this.defaultOptions, options) : this.defaultOptions;
      }
    }, {
      key: "_drawable",
      value: function _drawable(shape, sets, options) {
        return { shape: shape, sets: sets || [], options: options || this.defaultOptions };
      }
    }, {
      key: "line",
      value: function line(x1, y1, x2, y2, options) {
        var o = this._options(options);
        return this._drawable('line', [this.lib.line(x1, y1, x2, y2, o)], o);
      }
    }, {
      key: "rectangle",
      value: function rectangle(x, y, width, height, options) {
        var o = this._options(options);
        var paths = [];
        if (o.fill) {
          var xc = [x, x + width, x + width, x];
          var yc = [y, y, y + height, y + height];
          if (o.fillStyle === 'solid') {
            paths.push(this.lib.solidFillShape(xc, yc, o));
          } else {
            paths.push(this.lib.hachureFillShape(xc, yc, o));
          }
        }
        paths.push(this.lib.rectangle(x, y, width, height, o));
        return this._drawable('rectangle', paths, o);
      }
    }, {
      key: "ellipse",
      value: function ellipse(x, y, width, height, options) {
        var o = this._options(options);
        var paths = [];
        if (o.fill) {
          if (o.fillStyle === 'solid') {
            var shape = this.lib.ellipse(x, y, width, height, o);
            shape.type = 'fillPath';
            paths.push(shape);
          } else {
            paths.push(this.lib.hachureFillEllipse(x, y, width, height, o));
          }
        }
        paths.push(this.lib.ellipse(x, y, width, height, o));
        return this._drawable('ellipse', paths, o);
      }
    }, {
      key: "circle",
      value: function circle(x, y, diameter, options) {
        var ret = this.ellipse(x, y, diameter, diameter, options);
        ret.shape = 'circle';
        return ret;
      }
    }, {
      key: "linearPath",
      value: function linearPath(points, options) {
        var o = this._options(options);
        return this._drawable('linearPath', [this.lib.linearPath(points, false, o)], o);
      }
    }, {
      key: "polygon",
      value: function polygon(points, options) {
        var o = this._options(options);
        var paths = [];
        if (o.fill) {
          var xc = [],
              yc = [];
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = points[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var p = _step5.value;

              xc.push(p[0]);
              yc.push(p[1]);
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          if (o.fillStyle === 'solid') {
            paths.push(this.lib.solidFillShape(xc, yc, o));
          } else {
            paths.push(this.lib.hachureFillShape(xc, yc, o));
          }
        }
        paths.push(this.lib.linearPath(points, true, o));
        return this._drawable('polygon', paths, o);
      }
    }, {
      key: "arc",
      value: function arc(x, y, width, height, start, stop, closed, options) {
        var o = this._options(options);
        var paths = [];
        if (closed && o.fill) {
          if (o.fillStyle === 'solid') {
            var shape = this.lib.arc(x, y, width, height, start, stop, true, false, o);
            shape.type = 'fillPath';
            paths.push(shape);
          } else {
            paths.push(this.lib.hachureFillArc(x, y, width, height, start, stop, o));
          }
        }
        paths.push(this.lib.arc(x, y, width, height, start, stop, closed, true, o));
        return this._drawable('arc', paths, o);
      }
    }, {
      key: "curve",
      value: function curve(points, options) {
        var o = this._options(options);
        return this._drawable('curve', [this.lib.curve(points, o)], o);
      }
    }, {
      key: "path",
      value: function path(d, options) {
        var o = this._options(options);
        var paths = [];
        if (!d) {
          return this._drawable('path', paths, o);
        }
        if (o.fill) {
          if (o.fillStyle === 'solid') {
            var shape = { type: 'path2Dfill', path: d };
            paths.push(shape);
          } else {
            var size = this._computePathSize(d);
            var xc = [0, size[0], size[0], 0];
            var yc = [0, 0, size[1], size[1]];
            var _shape = this.lib.hachureFillShape(xc, yc, o);
            _shape.type = 'path2Dpattern';
            _shape.size = size;
            _shape.path = d;
            paths.push(_shape);
          }
        }
        paths.push(this.lib.svgPath(d, o));
        return this._drawable('path', paths, o);
      }
    }, {
      key: "_computePathSize",
      value: function _computePathSize(d) {
        var size = [0, 0];
        if (self.document) {
          try {
            var ns = "http://www.w3.org/2000/svg";
            var svg = self.document.createElementNS(ns, "svg");
            svg.setAttribute("width", "0");
            svg.setAttribute("height", "0");
            var pathNode = self.document.createElementNS(ns, "path");
            pathNode.setAttribute('d', d);
            svg.appendChild(pathNode);
            self.document.body.appendChild(svg);
            var bb = pathNode.getBBox();
            if (bb) {
              size[0] = bb.width || 0;
              size[1] = bb.height || 0;
            }
            self.document.body.removeChild(svg);
          } catch (err) {}
        }
        if (!(size[0] * size[1])) {
          size = [this.canvas.width || 100, this.canvas.height || 100];
        }
        size[0] = Math.min(size[0] * 4, this.canvas.width);
        size[1] = Math.min(size[1] * 4, this.canvas.height);
        return size;
      }
    }, {
      key: "lib",
      get: function get() {
        if (!this._renderer) {
          if (self && self.workly && this.config.async && !this.config.noWorker) {
            var tos = Function.prototype.toString;
            var worklySource = this.config.worklyURL || 'https://cdn.jsdelivr.net/gh/pshihn/workly/dist/workly.min.js';
            var rendererSource = this.config.roughURL || self._roughScript;
            if (rendererSource && worklySource) {
              var code = "importScripts('" + worklySource + "', '" + rendererSource + "');\nworkly.expose(self.rough.createRenderer());";
              var ourl = URL.createObjectURL(new Blob([code]));
              this._renderer = workly.proxy(ourl);
            } else {
              this._renderer = new RoughRenderer();
            }
          } else {
            this._renderer = new RoughRenderer();
          }
        }
        return this._renderer;
      }
    }]);

    return RoughGenerator;
  }();

  var RoughGeneratorAsync = function (_RoughGenerator) {
    _inherits(RoughGeneratorAsync, _RoughGenerator);

    function RoughGeneratorAsync() {
      _classCallCheck(this, RoughGeneratorAsync);

      return _possibleConstructorReturn(this, (RoughGeneratorAsync.__proto__ || Object.getPrototypeOf(RoughGeneratorAsync)).apply(this, arguments));
    }

    _createClass(RoughGeneratorAsync, [{
      key: "line",
      value: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(x1, y1, x2, y2, options) {
          var o;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  o = this._options(options);
                  _context.t0 = this;
                  _context.next = 4;
                  return this.lib.line(x1, y1, x2, y2, o);

                case 4:
                  _context.t1 = _context.sent;
                  _context.t2 = [_context.t1];
                  _context.t3 = o;
                  return _context.abrupt("return", _context.t0._drawable.call(_context.t0, 'line', _context.t2, _context.t3));

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function line(_x12, _x13, _x14, _x15, _x16) {
          return _ref.apply(this, arguments);
        }

        return line;
      }()
    }, {
      key: "rectangle",
      value: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(x, y, width, height, options) {
          var o, paths, xc, yc;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  o = this._options(options);
                  paths = [];

                  if (!o.fill) {
                    _context2.next = 18;
                    break;
                  }

                  xc = [x, x + width, x + width, x];
                  yc = [y, y, y + height, y + height];

                  if (!(o.fillStyle === 'solid')) {
                    _context2.next = 13;
                    break;
                  }

                  _context2.t0 = paths;
                  _context2.next = 9;
                  return this.lib.solidFillShape(xc, yc, o);

                case 9:
                  _context2.t1 = _context2.sent;

                  _context2.t0.push.call(_context2.t0, _context2.t1);

                  _context2.next = 18;
                  break;

                case 13:
                  _context2.t2 = paths;
                  _context2.next = 16;
                  return this.lib.hachureFillShape(xc, yc, o);

                case 16:
                  _context2.t3 = _context2.sent;

                  _context2.t2.push.call(_context2.t2, _context2.t3);

                case 18:
                  _context2.t4 = paths;
                  _context2.next = 21;
                  return this.lib.rectangle(x, y, width, height, o);

                case 21:
                  _context2.t5 = _context2.sent;

                  _context2.t4.push.call(_context2.t4, _context2.t5);

                  return _context2.abrupt("return", this._drawable('rectangle', paths, o));

                case 24:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function rectangle(_x17, _x18, _x19, _x20, _x21) {
          return _ref2.apply(this, arguments);
        }

        return rectangle;
      }()
    }, {
      key: "ellipse",
      value: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(x, y, width, height, options) {
          var o, paths, shape;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  o = this._options(options);
                  paths = [];

                  if (!o.fill) {
                    _context3.next = 16;
                    break;
                  }

                  if (!(o.fillStyle === 'solid')) {
                    _context3.next = 11;
                    break;
                  }

                  _context3.next = 6;
                  return this.lib.ellipse(x, y, width, height, o);

                case 6:
                  shape = _context3.sent;

                  shape.type = 'fillPath';
                  paths.push(shape);
                  _context3.next = 16;
                  break;

                case 11:
                  _context3.t0 = paths;
                  _context3.next = 14;
                  return this.lib.hachureFillEllipse(x, y, width, height, o);

                case 14:
                  _context3.t1 = _context3.sent;

                  _context3.t0.push.call(_context3.t0, _context3.t1);

                case 16:
                  _context3.t2 = paths;
                  _context3.next = 19;
                  return this.lib.ellipse(x, y, width, height, o);

                case 19:
                  _context3.t3 = _context3.sent;

                  _context3.t2.push.call(_context3.t2, _context3.t3);

                  return _context3.abrupt("return", this._drawable('ellipse', paths, o));

                case 22:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function ellipse(_x22, _x23, _x24, _x25, _x26) {
          return _ref3.apply(this, arguments);
        }

        return ellipse;
      }()
    }, {
      key: "circle",
      value: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(x, y, diameter, options) {
          var ret;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this.ellipse(x, y, diameter, diameter, options);

                case 2:
                  ret = _context4.sent;

                  ret.shape = 'circle';
                  return _context4.abrupt("return", ret);

                case 5:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function circle(_x27, _x28, _x29, _x30) {
          return _ref4.apply(this, arguments);
        }

        return circle;
      }()
    }, {
      key: "linearPath",
      value: function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(points, options) {
          var o;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  o = this._options(options);
                  _context5.t0 = this;
                  _context5.next = 4;
                  return this.lib.linearPath(points, false, o);

                case 4:
                  _context5.t1 = _context5.sent;
                  _context5.t2 = [_context5.t1];
                  _context5.t3 = o;
                  return _context5.abrupt("return", _context5.t0._drawable.call(_context5.t0, 'linearPath', _context5.t2, _context5.t3));

                case 8:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function linearPath(_x31, _x32) {
          return _ref5.apply(this, arguments);
        }

        return linearPath;
      }()
    }, {
      key: "polygon",
      value: function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(points, options) {
          var o, paths, xc, yc, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, p;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  o = this._options(options);
                  paths = [];

                  if (!o.fill) {
                    _context6.next = 36;
                    break;
                  }

                  xc = [], yc = [];
                  _iteratorNormalCompletion6 = true;
                  _didIteratorError6 = false;
                  _iteratorError6 = undefined;
                  _context6.prev = 7;

                  for (_iterator6 = points[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    p = _step6.value;

                    xc.push(p[0]);
                    yc.push(p[1]);
                  }
                  _context6.next = 15;
                  break;

                case 11:
                  _context6.prev = 11;
                  _context6.t0 = _context6["catch"](7);
                  _didIteratorError6 = true;
                  _iteratorError6 = _context6.t0;

                case 15:
                  _context6.prev = 15;
                  _context6.prev = 16;

                  if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                  }

                case 18:
                  _context6.prev = 18;

                  if (!_didIteratorError6) {
                    _context6.next = 21;
                    break;
                  }

                  throw _iteratorError6;

                case 21:
                  return _context6.finish(18);

                case 22:
                  return _context6.finish(15);

                case 23:
                  if (!(o.fillStyle === 'solid')) {
                    _context6.next = 31;
                    break;
                  }

                  _context6.t1 = paths;
                  _context6.next = 27;
                  return this.lib.solidFillShape(xc, yc, o);

                case 27:
                  _context6.t2 = _context6.sent;

                  _context6.t1.push.call(_context6.t1, _context6.t2);

                  _context6.next = 36;
                  break;

                case 31:
                  _context6.t3 = paths;
                  _context6.next = 34;
                  return this.lib.hachureFillShape(xc, yc, o);

                case 34:
                  _context6.t4 = _context6.sent;

                  _context6.t3.push.call(_context6.t3, _context6.t4);

                case 36:
                  _context6.t5 = paths;
                  _context6.next = 39;
                  return this.lib.linearPath(points, true, o);

                case 39:
                  _context6.t6 = _context6.sent;

                  _context6.t5.push.call(_context6.t5, _context6.t6);

                  return _context6.abrupt("return", this._drawable('polygon', paths, o));

                case 42:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this, [[7, 11, 15, 23], [16,, 18, 22]]);
        }));

        function polygon(_x33, _x34) {
          return _ref6.apply(this, arguments);
        }

        return polygon;
      }()
    }, {
      key: "arc",
      value: function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(x, y, width, height, start, stop, closed, options) {
          var o, paths, shape;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  o = this._options(options);
                  paths = [];

                  if (!(closed && o.fill)) {
                    _context7.next = 16;
                    break;
                  }

                  if (!(o.fillStyle === 'solid')) {
                    _context7.next = 11;
                    break;
                  }

                  _context7.next = 6;
                  return this.lib.arc(x, y, width, height, start, stop, true, false, o);

                case 6:
                  shape = _context7.sent;

                  shape.type = 'fillPath';
                  paths.push(shape);
                  _context7.next = 16;
                  break;

                case 11:
                  _context7.t0 = paths;
                  _context7.next = 14;
                  return this.lib.hachureFillArc(x, y, width, height, start, stop, o);

                case 14:
                  _context7.t1 = _context7.sent;

                  _context7.t0.push.call(_context7.t0, _context7.t1);

                case 16:
                  _context7.t2 = paths;
                  _context7.next = 19;
                  return this.lib.arc(x, y, width, height, start, stop, closed, true, o);

                case 19:
                  _context7.t3 = _context7.sent;

                  _context7.t2.push.call(_context7.t2, _context7.t3);

                  return _context7.abrupt("return", this._drawable('arc', paths, o));

                case 22:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function arc(_x35, _x36, _x37, _x38, _x39, _x40, _x41, _x42) {
          return _ref7.apply(this, arguments);
        }

        return arc;
      }()
    }, {
      key: "curve",
      value: function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(points, options) {
          var o;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  o = this._options(options);
                  _context8.t0 = this;
                  _context8.next = 4;
                  return this.lib.curve(points, o);

                case 4:
                  _context8.t1 = _context8.sent;
                  _context8.t2 = [_context8.t1];
                  _context8.t3 = o;
                  return _context8.abrupt("return", _context8.t0._drawable.call(_context8.t0, 'curve', _context8.t2, _context8.t3));

                case 8:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function curve(_x43, _x44) {
          return _ref8.apply(this, arguments);
        }

        return curve;
      }()
    }, {
      key: "path",
      value: function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(d, options) {
          var o, paths, shape, size, xc, yc, _shape2;

          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  o = this._options(options);
                  paths = [];

                  if (d) {
                    _context9.next = 4;
                    break;
                  }

                  return _context9.abrupt("return", this._drawable('path', paths, o));

                case 4:
                  if (!o.fill) {
                    _context9.next = 20;
                    break;
                  }

                  if (!(o.fillStyle === 'solid')) {
                    _context9.next = 10;
                    break;
                  }

                  shape = { type: 'path2Dfill', path: d };

                  paths.push(shape);
                  _context9.next = 20;
                  break;

                case 10:
                  size = this._computePathSize(d);
                  xc = [0, size[0], size[0], 0];
                  yc = [0, 0, size[1], size[1]];
                  _context9.next = 15;
                  return this.lib.hachureFillShape(xc, yc, o);

                case 15:
                  _shape2 = _context9.sent;

                  _shape2.type = 'path2Dpattern';
                  _shape2.size = size;
                  _shape2.path = d;
                  paths.push(_shape2);

                case 20:
                  _context9.t0 = paths;
                  _context9.next = 23;
                  return this.lib.svgPath(d, o);

                case 23:
                  _context9.t1 = _context9.sent;

                  _context9.t0.push.call(_context9.t0, _context9.t1);

                  return _context9.abrupt("return", this._drawable('path', paths, o));

                case 26:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function path(_x45, _x46) {
          return _ref9.apply(this, arguments);
        }

        return path;
      }()
    }]);

    return RoughGeneratorAsync;
  }(RoughGenerator);

  var RoughCanvas = function () {
    function RoughCanvas(canvas, config) {
      _classCallCheck(this, RoughCanvas);

      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this._init(config);
    }

    _createClass(RoughCanvas, [{
      key: "_init",
      value: function _init(config) {
        this.gen = new RoughGenerator(config, this.canvas);
      }
    }, {
      key: "line",
      value: function line(x1, y1, x2, y2, options) {
        var d = this.gen.line(x1, y1, x2, y2, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "rectangle",
      value: function rectangle(x, y, width, height, options) {
        var d = this.gen.rectangle(x, y, width, height, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "ellipse",
      value: function ellipse(x, y, width, height, options) {
        var d = this.gen.ellipse(x, y, width, height, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "circle",
      value: function circle(x, y, diameter, options) {
        var d = this.gen.circle(x, y, diameter, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "linearPath",
      value: function linearPath(points, options) {
        var d = this.gen.linearPath(points, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "polygon",
      value: function polygon(points, options) {
        var d = this.gen.polygon(points, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "arc",
      value: function arc(x, y, width, height, start, stop, closed, options) {
        var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "curve",
      value: function curve(points, options) {
        var d = this.gen.curve(points, options);
        this.draw(d);
        return d;
      }
    }, {
      key: "path",
      value: function path(d, options) {
        var drawing = this.gen.path(d, options);
        this.draw(drawing);
        return drawing;
      }
    }, {
      key: "draw",
      value: function draw(drawable) {
        var sets = drawable.sets || [];
        var o = drawable.options || this.gen.defaultOptions;
        var ctx = this.ctx;
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = sets[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var drawing = _step7.value;

            switch (drawing.type) {
              case 'path':
                ctx.save();
                ctx.strokeStyle = o.stroke;
                ctx.lineWidth = o.strokeWidth;
                this._drawToContext(ctx, drawing);
                ctx.restore();
                break;
              case 'fillPath':
                ctx.save();
                ctx.fillStyle = o.fill;
                this._drawToContext(ctx, drawing, o);
                ctx.restore();
                break;
              case 'fillSketch':
                this._fillSketch(ctx, drawing, o);
                break;
              case 'path2Dfill':
                {
                  this.ctx.save();
                  this.ctx.fillStyle = o.fill;
                  var p2d = new Path2D(drawing.path);
                  this.ctx.fill(p2d);
                  this.ctx.restore();
                  break;
                }
              case 'path2Dpattern':
                {
                  var size = drawing.size;
                  var hcanvas = document.createElement('canvas');
                  hcanvas.width = size[0];
                  hcanvas.height = size[1];
                  this._fillSketch(hcanvas.getContext("2d"), drawing, o);
                  this.ctx.save();
                  this.ctx.fillStyle = this.ctx.createPattern(hcanvas, 'repeat');
                  var _p2d = new Path2D(drawing.path);
                  this.ctx.fill(_p2d);
                  this.ctx.restore();
                  break;
                }
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    }, {
      key: "_fillSketch",
      value: function _fillSketch(ctx, drawing, o) {
        var fweight = o.fillWeight;
        if (fweight < 0) {
          fweight = o.strokeWidth / 2;
        }
        ctx.save();
        ctx.strokeStyle = o.fill;
        ctx.lineWidth = fweight;
        this._drawToContext(ctx, drawing);
        ctx.restore();
      }
    }, {
      key: "_drawToContext",
      value: function _drawToContext(ctx, drawing) {
        ctx.beginPath();
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = drawing.ops[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var item = _step8.value;

            var data = item.data;
            switch (item.op) {
              case 'move':
                ctx.moveTo(data[0], data[1]);
                break;
              case 'bcurveTo':
                ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
                break;
              case 'qcurveTo':
                ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
                break;
              case 'lineTo':
                ctx.lineTo(data[0], data[1]);
                break;
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        if (drawing.type === 'fillPath') {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }, {
      key: "generator",
      get: function get() {
        return this.gen;
      }
    }], [{
      key: "createRenderer",
      value: function createRenderer() {
        return new RoughRenderer();
      }
    }]);

    return RoughCanvas;
  }();

  var RoughCanvasAsync = function (_RoughCanvas) {
    _inherits(RoughCanvasAsync, _RoughCanvas);

    function RoughCanvasAsync() {
      _classCallCheck(this, RoughCanvasAsync);

      return _possibleConstructorReturn(this, (RoughCanvasAsync.__proto__ || Object.getPrototypeOf(RoughCanvasAsync)).apply(this, arguments));
    }

    _createClass(RoughCanvasAsync, [{
      key: "_init",
      value: function _init(config) {
        this.gen = new RoughGeneratorAsync(config, this.canvas);
      }
    }, {
      key: "line",
      value: function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(x1, y1, x2, y2, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _context10.next = 2;
                  return this.gen.line(x1, y1, x2, y2, options);

                case 2:
                  d = _context10.sent;

                  this.draw(d);
                  return _context10.abrupt("return", d);

                case 5:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function line(_x47, _x48, _x49, _x50, _x51) {
          return _ref10.apply(this, arguments);
        }

        return line;
      }()
    }, {
      key: "rectangle",
      value: function () {
        var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(x, y, width, height, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return this.gen.rectangle(x, y, width, height, options);

                case 2:
                  d = _context11.sent;

                  this.draw(d);
                  return _context11.abrupt("return", d);

                case 5:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function rectangle(_x52, _x53, _x54, _x55, _x56) {
          return _ref11.apply(this, arguments);
        }

        return rectangle;
      }()
    }, {
      key: "ellipse",
      value: function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(x, y, width, height, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return this.gen.ellipse(x, y, width, height, options);

                case 2:
                  d = _context12.sent;

                  this.draw(d);
                  return _context12.abrupt("return", d);

                case 5:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function ellipse(_x57, _x58, _x59, _x60, _x61) {
          return _ref12.apply(this, arguments);
        }

        return ellipse;
      }()
    }, {
      key: "circle",
      value: function () {
        var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(x, y, diameter, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  _context13.next = 2;
                  return this.gen.circle(x, y, diameter, options);

                case 2:
                  d = _context13.sent;

                  this.draw(d);
                  return _context13.abrupt("return", d);

                case 5:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        }));

        function circle(_x62, _x63, _x64, _x65) {
          return _ref13.apply(this, arguments);
        }

        return circle;
      }()
    }, {
      key: "linearPath",
      value: function () {
        var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(points, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  _context14.next = 2;
                  return this.gen.linearPath(points, options);

                case 2:
                  d = _context14.sent;

                  this.draw(d);
                  return _context14.abrupt("return", d);

                case 5:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function linearPath(_x66, _x67) {
          return _ref14.apply(this, arguments);
        }

        return linearPath;
      }()
    }, {
      key: "polygon",
      value: function () {
        var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(points, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.next = 2;
                  return this.gen.polygon(points, options);

                case 2:
                  d = _context15.sent;

                  this.draw(d);
                  return _context15.abrupt("return", d);

                case 5:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function polygon(_x68, _x69) {
          return _ref15.apply(this, arguments);
        }

        return polygon;
      }()
    }, {
      key: "arc",
      value: function () {
        var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(x, y, width, height, start, stop, closed, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  _context16.next = 2;
                  return this.gen.arc(x, y, width, height, start, stop, closed, options);

                case 2:
                  d = _context16.sent;

                  this.draw(d);
                  return _context16.abrupt("return", d);

                case 5:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));

        function arc(_x70, _x71, _x72, _x73, _x74, _x75, _x76, _x77) {
          return _ref16.apply(this, arguments);
        }

        return arc;
      }()
    }, {
      key: "curve",
      value: function () {
        var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(points, options) {
          var d;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return this.gen.curve(points, options);

                case 2:
                  d = _context17.sent;

                  this.draw(d);
                  return _context17.abrupt("return", d);

                case 5:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17, this);
        }));

        function curve(_x78, _x79) {
          return _ref17.apply(this, arguments);
        }

        return curve;
      }()
    }, {
      key: "path",
      value: function () {
        var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(d, options) {
          var drawing;
          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _context18.next = 2;
                  return this.gen.path(d, options);

                case 2:
                  drawing = _context18.sent;

                  this.draw(drawing);
                  return _context18.abrupt("return", drawing);

                case 5:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this);
        }));

        function path(_x80, _x81) {
          return _ref18.apply(this, arguments);
        }

        return path;
      }()
    }]);

    return RoughCanvasAsync;
  }(RoughCanvas);

  var index = {
    canvas: function canvas(_canvas, config) {
      if (config && config.async) {
        return new RoughCanvasAsync(_canvas, config);
      }
      return new RoughCanvas(_canvas, config);
    },
    createRenderer: function createRenderer() {
      return RoughCanvas.createRenderer();
    },
    generator: function generator(config, size) {
      if (config && config.async) {
        return new RoughGeneratorAsync(config, size);
      }
      return new RoughGenerator(config, size);
    }
  };

  return index;
}();
