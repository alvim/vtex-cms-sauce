"use strict";

require("babel-core/register");

require("babel-polyfill");

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
              _context.next = 2;
              return api.get('api/vtexid/pub/authentication/start');

            case 2:
              _ref2 = _context.sent;
              authenticationToken = _ref2.data.authenticationToken;
              params = {
                authenticationToken: authenticationToken,
                login: VTEXID_EMAIL,
                password: VTEXID_PASSWORD
              };
              _context.next = 7;
              return api.get('api/vtexid/pub/authentication/classic/validate', params);

            case 7:
              _ref3 = _context.sent;
              Value = _ref3.data.authCookie.Value;

              console.log(Value);

              return _context.abrupt("return", Value);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function _getAuthCookie() {
      return _ref.apply(this, arguments);
    };
  }();

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

  var saveTemplate = function saveTemplate(templateName, HTML) {
    _saveTemplate(authCookie, data);
  };

  // The public API
  return {
    saveTemplate: saveTemplate,
    _getAuthCookie: _getAuthCookie
  };
};

module.exports = {
  create: create
};