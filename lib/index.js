'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

require('babel-core/register');

require('babel-polyfill');

var _crypto = require('crypto');

var _apisauce = require('apisauce');

var _apisauce2 = _interopRequireDefault(_apisauce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var VTEXID = JSON.parse((0, _fs.readFileSync)('.vtexid', 'utf8'));

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
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(request.data[p]));
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
              params = _extends({
                authenticationToken: authenticationToken
              }, VTEXID);
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
              return _context.abrupt('return', Value);

            case 17:
              _context.prev = 17;
              _context.t0 = _context['catch'](0);
              console.error(_context.t0);
            case 20:
            case 'end':
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

  var _saveTemplate = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var isSub = arguments[1];
      var type = arguments[2];
      var actionForm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Save';
      var authCookie, templateName, templatename, template, templateId, endpoint;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _getAuthCookie();

            case 3:
              authCookie = _context2.sent;
              templateName = data.templateName, templatename = data.templatename, template = data.template, templateId = data.templateId;
              endpoint = type === 'shelf' ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate';

              if (authCookie) {
                _context2.next = 8;
                break;
              }

              throw new Error('You must provide a valid auth cookie!');

            case 8:
              if (!(!templatename && !templateName)) {
                _context2.next = 10;
                break;
              }

              throw new Error('You must provide a name when saving a template!');

            case 10:
              if (template) {
                _context2.next = 12;
                break;
              }

              throw new Error('You must provide content when saving a template!');

            case 12:

              api.setHeader('Cookie', 'VtexIdclientAutCookie=' + authCookie + ';');

              return _context2.abrupt('return', api.post(endpoint, _extends({}, data, {
                isSub: isSub,
                actionForm: actionForm,
                textConfirm: 'sim'
              })));

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2['catch'](0);
              console.error(_context2.t0);
            case 19:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 16]]);
    }));

    return function _saveTemplate() {
      return _ref4.apply(this, arguments);
    };
  }();

  var _parseErrorMessage = function _parseErrorMessage(data, templatename) {
    var x = data.indexOf('<applicationexceptionobject>') + 28;
    var y = data.indexOf('</applicationexceptionobject>');
    var obj = JSON.parse(data.substr(x, y - x));
    return 'Couldn\'t save template (' + templatename + '): ' + obj.message;
  };

  var saveShelfTemplate = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(templateName, HTML, shelfClass) {
      var reqData, _ref6, status, data, errorMsg, _ref7, _status, _data;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              reqData = {
                templateName: templateName,
                templateId: _getTemplateId(templateName),
                template: HTML,
                roundCorners: false,
                templateCssClass: shelfClass
              };
              _context3.next = 4;
              return _saveTemplate(reqData, true, 'shelf');

            case 4:
              _ref6 = _context3.sent;
              status = _ref6.status;
              data = _ref6.data;

              if (!(status.toString().substr(0, 1) !== '2')) {
                _context3.next = 9;
                break;
              }

              throw new Error('Couldn\'t save template (' + templateName + '). Status: ' + status);

            case 9:
              if (!~data.indexOf('originalMessage')) {
                _context3.next = 26;
                break;
              }

              errorMsg = _parseErrorMessage(data, templateName);

              if (!~errorMsg.indexOf('Já existe um template chamado')) {
                _context3.next = 25;
                break;
              }

              _context3.next = 14;
              return _saveTemplate(reqData, true, 'shelf', 'Update');

            case 14:
              _ref7 = _context3.sent;
              _status = _ref7.status;
              _data = _ref7.data;

              if (!(_status.toString().substr(0, 1) !== '2')) {
                _context3.next = 21;
                break;
              }

              throw new Error('Couldn\'t save template (' + templateName + '). Status: ' + _status);

            case 21:
              if (!~_data.indexOf('originalMessage')) {
                _context3.next = 23;
                break;
              }

              throw new Error(_parseErrorMessage(_data, templateName));

            case 23:
              _context3.next = 26;
              break;

            case 25:
              throw new Error(errorMsg);

            case 26:
              return _context3.abrupt('return', 'Shelf template (' + templateName + ') saved!');

            case 29:
              _context3.prev = 29;
              _context3.t0 = _context3['catch'](0);
              console.error(_context3.t0);
            case 32:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 29]]);
    }));

    return function saveShelfTemplate(_x3, _x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  }();

  var saveTemplate = function () {
    var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(templatename, HTML) {
      var isSub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var reqData, _ref9, status, data;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              reqData = {
                templatename: templatename,
                templateId: _getTemplateId(templatename),
                template: HTML
              };
              _context4.next = 4;
              return _saveTemplate(reqData, isSub);

            case 4:
              _ref9 = _context4.sent;
              status = _ref9.status;
              data = _ref9.data;

              if (!(status.toString().substr(0, 1) !== '2')) {
                _context4.next = 11;
                break;
              }

              throw new Error('Couldn\'t save template (' + templatename + '). Status: ' + status);

            case 11:
              if (!~data.indexOf('originalMessage')) {
                _context4.next = 13;
                break;
              }

              throw new Error(_parseErrorMessage(data, templatename));

            case 13:
              return _context4.abrupt('return', 'Template (' + templatename + ') saved!');

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4['catch'](0);
              console.error(_context4.t0);
            case 19:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 16]]);
    }));

    return function saveTemplate(_x7, _x8) {
      return _ref8.apply(this, arguments);
    };
  }();

  // The public API
  return {
    saveTemplate: saveTemplate,
    saveShelfTemplate: saveShelfTemplate
  };
};

module.exports = {
  create: create
};