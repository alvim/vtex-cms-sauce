'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('babel-core/register');

require('babel-polyfill');

var _fs = require('fs');

var _crypto = require('crypto');

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

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

              api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
              params = _extends({
                authenticationToken: authenticationToken
              }, VTEXID);
              _context.next = 11;
              return api.get('api/vtexid/pub/authentication/classic/validate', params);

            case 11:
              _ref3 = _context.sent;
              Value = _ref3.data.authCookie.Value;

              if (Value) {
                _context.next = 15;
                break;
              }

              throw new Error('Can\'t get an authentication cookie.');

            case 15:
              return _context.abrupt('return', Value);

            case 18:
              _context.prev = 18;
              _context.t0 = _context['catch'](0);
              console.error(_context.t0);
            case 21:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 18]]);
    }));

    return function _getAuthCookie() {
      return _ref.apply(this, arguments);
    };
  }();

  var _getTemplateId = function _getTemplateId(templatename) {
    return (0, _crypto.createHash)('md5').update(templatename).digest('hex');
  };

  var _getRequestToken = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var authCookie, _ref5, data, $, requestToken;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _getAuthCookie();

            case 3:
              authCookie = _context2.sent;

              api.setHeader('Cookie', 'VtexIdclientAutCookie=' + authCookie + ';');

              _context2.next = 7;
              return api.post('/admin/a/PortalManagement/AddFile?fileType=css');

            case 7:
              _ref5 = _context2.sent;
              data = _ref5.data;
              $ = _cheerio2.default.load(data);
              requestToken = $('#fileUploadRequestToken').val();

              if (requestToken) {
                _context2.next = 13;
                break;
              }

              throw new Error('Couldn\'t get request token!');

            case 13:
              return _context2.abrupt('return', requestToken);

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2['catch'](0);
              console.error('Couldn\'t get request token: ' + _context2.t0);
            case 19:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 16]]);
    }));

    return function _getRequestToken() {
      return _ref4.apply(this, arguments);
    };
  }();

  var _saveTemplate = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var isSub = arguments[1];
      var type = arguments[2];
      var actionForm = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Save';
      var authCookie, templateName, templatename, template, templateId, endpoint;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _getAuthCookie();

            case 3:
              authCookie = _context3.sent;
              templateName = data.templateName, templatename = data.templatename, template = data.template, templateId = data.templateId;
              endpoint = type === 'shelf' ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate';

              if (authCookie) {
                _context3.next = 8;
                break;
              }

              throw new Error('You must provide a valid auth cookie!');

            case 8:
              if (!(!templatename && !templateName)) {
                _context3.next = 10;
                break;
              }

              throw new Error('You must provide a name when saving a template!');

            case 10:
              if (template) {
                _context3.next = 12;
                break;
              }

              throw new Error('You must provide content when saving a template!');

            case 12:

              api.setHeader('Cookie', 'VtexIdclientAutCookie=' + authCookie + ';');
              api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

              return _context3.abrupt('return', api.post(endpoint, _extends({}, data, {
                isSub: isSub,
                actionForm: actionForm,
                textConfirm: 'sim'
              })));

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3['catch'](0);
              console.error(_context3.t0);
            case 20:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 17]]);
    }));

    return function _saveTemplate() {
      return _ref6.apply(this, arguments);
    };
  }();

  var _parseErrorMessage = function _parseErrorMessage(data, templatename) {
    var x = data.indexOf('<applicationexceptionobject>') + 28;
    var y = data.indexOf('</applicationexceptionobject>');
    var obj = JSON.parse(data.substr(x, y - x));
    return 'Couldn\'t save template (' + templatename + '): ' + obj.message;
  };

  var saveShelfTemplate = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(templateName, HTML, shelfClass) {
      var reqData, _ref8, status, data, errorMsg, _ref9, _status, _data;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              reqData = {
                templateName: templateName,
                templateId: _getTemplateId(templateName),
                template: HTML,
                roundCorners: false,
                templateCssClass: shelfClass
              };
              _context4.next = 4;
              return _saveTemplate(reqData, true, 'shelf');

            case 4:
              _ref8 = _context4.sent;
              status = _ref8.status;
              data = _ref8.data;

              if (!(status.toString().substr(0, 1) !== '2')) {
                _context4.next = 9;
                break;
              }

              throw new Error('Couldn\'t save template (' + templateName + '). Status: ' + status);

            case 9:
              if (!~data.indexOf('originalMessage')) {
                _context4.next = 26;
                break;
              }

              errorMsg = _parseErrorMessage(data, templateName);

              if (!~errorMsg.indexOf('Já existe um template chamado')) {
                _context4.next = 25;
                break;
              }

              _context4.next = 14;
              return _saveTemplate(reqData, true, 'shelf', 'Update');

            case 14:
              _ref9 = _context4.sent;
              _status = _ref9.status;
              _data = _ref9.data;

              if (!(_status.toString().substr(0, 1) !== '2')) {
                _context4.next = 21;
                break;
              }

              throw new Error('Couldn\'t save template (' + templateName + '). Status: ' + _status);

            case 21:
              if (!~_data.indexOf('originalMessage')) {
                _context4.next = 23;
                break;
              }

              throw new Error(_parseErrorMessage(_data, templateName));

            case 23:
              _context4.next = 26;
              break;

            case 25:
              throw new Error(errorMsg);

            case 26:
              return _context4.abrupt('return', 'Shelf template (' + templateName + ') saved!');

            case 29:
              _context4.prev = 29;
              _context4.t0 = _context4['catch'](0);
              console.error(_context4.t0);
            case 32:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 29]]);
    }));

    return function saveShelfTemplate(_x3, _x4, _x5) {
      return _ref7.apply(this, arguments);
    };
  }();

  var saveTemplate = function () {
    var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(templatename, HTML) {
      var isSub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var reqData, _ref11, status, data;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              reqData = {
                templatename: templatename,
                templateId: _getTemplateId(templatename),
                template: HTML
              };
              _context5.next = 4;
              return _saveTemplate(reqData, isSub);

            case 4:
              _ref11 = _context5.sent;
              status = _ref11.status;
              data = _ref11.data;

              if (!(status.toString().substr(0, 1) !== '2')) {
                _context5.next = 11;
                break;
              }

              throw new Error('Couldn\'t save template (' + templatename + '). Status: ' + status);

            case 11:
              if (!~data.indexOf('originalMessage')) {
                _context5.next = 13;
                break;
              }

              throw new Error(_parseErrorMessage(data, templatename));

            case 13:
              return _context5.abrupt('return', 'Template (' + templatename + ') saved!');

            case 16:
              _context5.prev = 16;
              _context5.t0 = _context5['catch'](0);
              console.error(_context5.t0);
            case 19:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 16]]);
    }));

    return function saveTemplate(_x7, _x8) {
      return _ref10.apply(this, arguments);
    };
  }();

  var fileUpload = function () {
    var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(filepath) {
      var authCookie, requestToken, host, form, _ref13, statusCode;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _getAuthCookie();

            case 3:
              authCookie = _context6.sent;
              _context6.next = 6;
              return _getRequestToken();

            case 6:
              requestToken = _context6.sent;
              host = baseURL.replace(/(http:|https:|\/)/g, '');
              form = new _formData2.default();

              form.append('Filename', filepath);
              form.append('fileext', '*.jpg;*.png;*.gif;*.jpeg;*.ico;*.js;*.css');
              form.append('folder', '/uploads');
              form.append('Upload', 'Submit Query');
              form.append('requestToken', requestToken);
              form.append('Filedata', (0, _fs.createReadStream)(filepath));

              _context6.next = 17;
              return new Promise(function (resolve, reject) {
                form.submit({
                  host: host,
                  'path': '/admin/a/FilePicker/UploadFile',
                  'headers': {
                    'Cookie': 'VtexIdclientAutCookie=' + authCookie + ';',
                    'Content-Type': form.getHeaders()['content-type']
                  }
                }, function (err, res) {
                  if (err) reject(err);
                  resolve(res);
                });
              });

            case 17:
              _ref13 = _context6.sent;
              statusCode = _ref13.statusCode;

              if (!(statusCode.toString().substr(0, 1) !== '2')) {
                _context6.next = 21;
                break;
              }

              throw new Error('Couldn\'t save file: ' + filepath + ' (Error: ' + statusCode + ')');

            case 21:
              return _context6.abrupt('return', 'File: ' + filepath + ' saved!');

            case 24:
              _context6.prev = 24;
              _context6.t0 = _context6['catch'](0);
              console.error(_context6.t0);
            case 27:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[0, 24]]);
    }));

    return function fileUpload(_x9) {
      return _ref12.apply(this, arguments);
    };
  }();

  // The public API
  return {
    saveTemplate: saveTemplate,
    saveShelfTemplate: saveShelfTemplate,
    fileUpload: fileUpload
  };
};

module.exports = {
  create: create
};