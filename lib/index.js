"use strict";

require("babel-core/register");

require("babel-polyfill");

var _crypto = require("crypto");

var _apisauce = require("apisauce");

var _apisauce2 = _interopRequireDefault(_apisauce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var VTEXID_EMAIL = 'malvimmacedo@gmail.com';
var VTEXID_PASSWORD = 'Wololo1408';

var create = function create(baseURL) {
  // Create and configure an apisauce-based api object.
  var api = _apisauce2.default.create({
    baseURL: baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 10000
  });

  // Transforms JSON request data into x-www-form-urlencoded
  api.addRequestTransform(function (request) {
    var str = [];
    for (var p in request.data) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(request.data[p]));
    }
    request.data = str.join('&');
  });

  var _getAuthCookie = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var _ref2, authenticationToken, params, _ref3, Value;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return api.get('api/vtexid/pub/authentication/start');

            case 3:
              _ref2 = _context.sent;
              authenticationToken = _ref2.data.authenticationToken;

              if (authenticationToken) {
                _context.next = 7;
                break;
              }

              throw new Error('Can\'t get an authentication token.');

            case 7:
              params = {
                authenticationToken: authenticationToken,
                login: VTEXID_EMAIL,
                password: VTEXID_PASSWORD
              };
              _context.next = 10;
              return api.get('api/vtexid/pub/authentication/classic/validate', params);

            case 10:
              _ref3 = _context.sent;
              Value = _ref3.data.authCookie.Value;

              if (Value) {
                _context.next = 14;
                break;
              }

              throw new Error('Can\'t get an authentication cookie.');

            case 14:
              return _context.abrupt("return", Value);

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);
            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 17]]);
    }));

    return function _getAuthCookie() {
      return _ref.apply(this, arguments);
    };
  }();

  var _getTemplateId = function _getTemplateId(templatename) {
    return (0, _crypto.createHash)('md5').update(templatename).digest('hex');
  };

  var _saveTemplate = function _saveTemplate(authCookie) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    try {
      var templatename = data.templatename,
          template = data.template,
          templateId = data.templateId;


      if (!authCookie) throw new Error('You must provide a valid auth cookie!');
      if (!templatename) throw new Error('You must provide a name when saving a template!');
      if (!template) throw new Error('You must provide content when saving a template!');
      if (!templateId) throw new Error('You must provide a Template id when saving a template!');

      api.setHeader('Cookie', "VtexIdclientAutCookie=" + authCookie + ";");

      return api.post('admin/a/PortalManagement/SaveTemplate', {
        templatename: templatename,
        template: template,
        templateId: templateId,
        isSub: 'False',
        actionForm: 'Save',
        textConfirm: 'sim'
      });
    } catch (err) {
      console.error(err);
    }
  };

  var saveTemplate = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(templatename, HTML) {
      var authCookie, reqData, _ref5, status, data, x, y, obj;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _getAuthCookie();

            case 3:
              authCookie = _context2.sent;
              reqData = {
                templatename: templatename,
                templateId: _getTemplateId(templatename),
                template: HTML
              };
              _context2.next = 7;
              return _saveTemplate(authCookie, reqData);

            case 7:
              _ref5 = _context2.sent;
              status = _ref5.status;
              data = _ref5.data;

              console.log(status, status.toString().substr(0, 1));

              if (!(status.toString().substr(0, 1) !== '2')) {
                _context2.next = 13;
                break;
              }

              throw new Error("Couldn't save template (" + templatename + "). Status: " + status);

            case 13:
              if (!~data.indexOf('originalMessage')) {
                _context2.next = 18;
                break;
              }

              x = data.indexOf('<applicationexceptionobject>') + 28;
              y = data.indexOf('</applicationexceptionobject>');
              obj = JSON.parse(data.substr(x, y - x));
              throw new Error("Couldn't save template (" + templatename + "): " + obj.message);

            case 18:
              return _context2.abrupt("return", "Template (" + templatename + ") saved!");

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](0);
              console.error(_context2.t0);
            case 24:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 21]]);
    }));

    return function saveTemplate(_x2, _x3) {
      return _ref4.apply(this, arguments);
    };
  }();

  // The public API
  return {
    saveTemplate: saveTemplate,
    _getAuthCookie: _getAuthCookie,
    _getTemplateId: _getTemplateId
  };
};

module.exports = {
  create: create
};