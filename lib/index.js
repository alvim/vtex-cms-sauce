'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('babel-core/register');

require('babel-polyfill');

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

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

var ask = function ask(question) {
  var r = _readline2.default.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(function (resolve, reject) {
    r.question(question + '\n', function (answer) {
      r.close();

      if (answer) resolve(answer);else {
        reject('No answer!');
      }
    });
  });
};

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
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var authCookie;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return ask('Insert authentication cookie:');

            case 3:
              authCookie = _context.sent;


              _getAuthCookie = function _getAuthCookie() {
                return authCookie;
              };
              return _context.abrupt('return', authCookie);

            case 8:
              _context.prev = 8;
              _context.t0 = _context['catch'](0);
              console.error(_context.t0);
            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 8]]);
    }));

    return function _getAuthCookie() {
      return _ref.apply(this, arguments);
    };
  }();

  var _getTemplateId = function _getTemplateId(templatename) {
    return (0, _crypto.createHash)('md5').update(templatename).digest('hex');
  };

  var _getRequestToken = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var authCookie, _ref3, data, $, requestToken;

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
              _ref3 = _context2.sent;
              data = _ref3.data;
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
      return _ref2.apply(this, arguments);
    };
  }();

  var _saveTemplate = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
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
              endpoint = type === 'shelf' || type === 'shelfTemplate' ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate';

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
      return _ref4.apply(this, arguments);
    };
  }();

  var _parseErrorMessage = function _parseErrorMessage(data, templatename) {
    var x = data.indexOf('<applicationexceptionobject>') + 28;
    var y = data.indexOf('</applicationexceptionobject>');
    var obj = JSON.parse(data.substr(x, y - x));
    return 'Couldn\'t save template (' + templatename + '): ' + obj.message;
  };

  var _getTemplates = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(type) {
      var isSub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var key, endpoint, authCookie, _ref6, data;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              _getTemplates.cache = _getTemplates.cache || {};
              key = type + '-' + isSub;
              endpoint = 'admin/a/PortalManagement/GetTemplateList?type=' + type + '&IsSub=' + (isSub ? 1 : 0);
              _context4.next = 6;
              return _getAuthCookie();

            case 6:
              authCookie = _context4.sent;


              api.setHeader('Cookie', 'VtexIdclientAutCookie=' + authCookie + ';');
              api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

              if (_getTemplates.cache[key]) {
                _context4.next = 15;
                break;
              }

              _context4.next = 12;
              return api.post(endpoint);

            case 12:
              _ref6 = _context4.sent;
              data = _ref6.data;

              _getTemplates.cache[key] = data;

            case 15:
              return _context4.abrupt('return', _getTemplates.cache[key]);

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4['catch'](0);
              console.error(_context4.t0);
            case 21:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 18]]);
    }));

    return function _getTemplates(_x4) {
      return _ref5.apply(this, arguments);
    };
  }();

  var _getLegacyTemplateId = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(reqData, type) {
      var isSub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var templatesList, name, regex, matches, templateId;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _getTemplates(type, isSub);

            case 3:
              templatesList = _context5.sent;
              name = reqData.templateName || reqData.templatename;
              regex = new RegExp('(' + name + ')([\\s\\S]+?)(templateId=)([\\s\\S]+?(?="))');
              matches = templatesList.match(regex);
              templateId = matches[4];

              if (templateId) {
                _context5.next = 10;
                break;
              }

              throw new Error('template not found!');

            case 10:
              return _context5.abrupt('return', templateId);

            case 13:
              _context5.prev = 13;
              _context5.t0 = _context5['catch'](0);
              console.error('Couldn\'t get legacy template id: ' + _context5.t0);
            case 16:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined, [[0, 13]]);
    }));

    return function _getLegacyTemplateId(_x6, _x7) {
      return _ref7.apply(this, arguments);
    };
  }();

  var _saveLegacyTemplate = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(reqData) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'viewTemplate';
      var isSub = arguments[2];
      var action;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              action = type === 'shelfTemplate' ? 'Update' : 'Save';
              _context6.next = 4;
              return _getLegacyTemplateId(reqData, type, isSub);

            case 4:
              reqData.templateId = _context6.sent;
              return _context6.abrupt('return', _saveTemplate(reqData, isSub, type, action));

            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6['catch'](0);
              console.error(_context6.t0);
            case 11:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined, [[0, 8]]);
    }));

    return function _saveLegacyTemplate(_x9) {
      return _ref8.apply(this, arguments);
    };
  }();

  var saveShelfTemplate = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(templateName, HTML, shelfClass) {
      var reqData, term, _ref10, status, data, res;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              reqData = {
                templateName: templateName,
                templateId: _getTemplateId(templateName),
                template: HTML,
                roundCorners: false,
                templateCssClass: shelfClass
              };
              term = 'saved';
              _context7.next = 5;
              return _saveTemplate(reqData, true, 'shelf');

            case 5:
              _ref10 = _context7.sent;
              status = _ref10.status;
              data = _ref10.data;

              if (!~data.indexOf('already exists')) {
                _context7.next = 15;
                break;
              }

              term = 'updated';
              _context7.next = 12;
              return _saveLegacyTemplate(reqData, 'shelfTemplate', true);

            case 12:
              res = _context7.sent;

              status = res.status;
              data = res.data;

            case 15:
              if (!(status.toString().substr(0, 1) !== '2')) {
                _context7.next = 19;
                break;
              }

              throw new Error('Couldn\'t save template (' + templateName + '). Status: ' + status);

            case 19:
              if (!~data.indexOf('originalMessage')) {
                _context7.next = 21;
                break;
              }

              throw new Error(_parseErrorMessage(data, templateName));

            case 21:
              return _context7.abrupt('return', 'Shelf template (' + templateName + ') ' + term + '!');

            case 24:
              _context7.prev = 24;
              _context7.t0 = _context7['catch'](0);
              console.error(_context7.t0);
            case 27:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, undefined, [[0, 24]]);
    }));

    return function saveShelfTemplate(_x10, _x11, _x12) {
      return _ref9.apply(this, arguments);
    };
  }();

  var saveTemplate = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(templatename, HTML) {
      var isSub = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var reqData, _ref12, status, data, res;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              reqData = {
                templatename: templatename,
                templateId: _getTemplateId(templatename),
                template: HTML
              };
              _context8.next = 4;
              return _saveTemplate(reqData, isSub);

            case 4:
              _ref12 = _context8.sent;
              status = _ref12.status;
              data = _ref12.data;

              if (!~data.indexOf('already exists')) {
                _context8.next = 13;
                break;
              }

              _context8.next = 10;
              return _saveLegacyTemplate(reqData, 'viewTemplate', isSub);

            case 10:
              res = _context8.sent;

              status = res.status;
              data = res.data;

            case 13:
              if (!(status.toString().substr(0, 1) !== '2')) {
                _context8.next = 17;
                break;
              }

              throw new Error('Couldn\'t save template (' + templatename + '). Status: ' + status);

            case 17:
              if (!~data.indexOf('originalMessage')) {
                _context8.next = 19;
                break;
              }

              throw new Error(_parseErrorMessage(data, templatename));

            case 19:
              return _context8.abrupt('return', 'Template (' + templatename + ') saved!');

            case 22:
              _context8.prev = 22;
              _context8.t0 = _context8['catch'](0);
              console.error(_context8.t0);
            case 25:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined, [[0, 22]]);
    }));

    return function saveTemplate(_x14, _x15) {
      return _ref11.apply(this, arguments);
    };
  }();

  var saveFile = function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(filepath) {
      var authCookie, requestToken, host, form, _ref14, statusCode;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return _getAuthCookie();

            case 3:
              authCookie = _context9.sent;
              _context9.next = 6;
              return _getRequestToken();

            case 6:
              requestToken = _context9.sent;
              host = baseURL.replace(/(http:|https:|\/)/g, '');
              form = new _formData2.default();

              form.append('Filename', filepath);
              form.append('fileext', '*.jpg;*.png;*.gif;*.jpeg;*.ico;*.js;*.css');
              form.append('folder', '/uploads');
              form.append('Upload', 'Submit Query');
              form.append('requestToken', requestToken);
              form.append('Filedata', (0, _fs.createReadStream)(filepath));

              _context9.next = 17;
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
              _ref14 = _context9.sent;
              statusCode = _ref14.statusCode;

              if (!(statusCode.toString().substr(0, 1) !== '2')) {
                _context9.next = 21;
                break;
              }

              throw new Error('Couldn\'t save file: ' + filepath + ' (Error: ' + statusCode + ')');

            case 21:
              return _context9.abrupt('return', 'File: ' + filepath + ' saved!');

            case 24:
              _context9.prev = 24;
              _context9.t0 = _context9['catch'](0);
              console.error(_context9.t0);
            case 27:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, undefined, [[0, 24]]);
    }));

    return function saveFile(_x16) {
      return _ref13.apply(this, arguments);
    };
  }();

  // The public API
  return {
    saveTemplate: saveTemplate,
    saveShelfTemplate: saveShelfTemplate,
    saveFile: saveFile
  };
};

module.exports = {
  create: create
};