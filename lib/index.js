"use strict";

require("@babel/register");

require("@babel/polyfill");

var _readline = _interopRequireDefault(require("readline"));

var _fs = require("fs");

var _crypto = require("crypto");

var _formData = _interopRequireDefault(require("form-data"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _apisauce = _interopRequireDefault(require("apisauce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ask = function ask(question) {
  var r = _readline.default.createInterface({
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
  var api = _apisauce.default.create({
    baseURL: baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 10000
  }); // Transforms JSON request data into x-www-form-urlencoded


  api.addRequestTransform(function (request) {
    var str = [];

    for (var p in request.data) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(request.data[p]));
    }

    request.data = str.join('&');
  });

  var _getAuthCookie =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
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

              return _context.abrupt("return", authCookie);

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8]]);
    }));

    return function _getAuthCookie() {
      return _ref.apply(this, arguments);
    };
  }();

  var _getTemplateId = function _getTemplateId(templatename) {
    return (0, _crypto.createHash)('md5').update(templatename).digest('hex');
  };

  var _getRequestToken =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
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
              api.setHeader('Cookie', "VtexIdclientAutCookie=".concat(authCookie, ";"));
              _context2.next = 7;
              return api.post('/admin/a/PortalManagement/AddFile?fileType=css');

            case 7:
              _ref3 = _context2.sent;
              data = _ref3.data;
              $ = _cheerio.default.load(data);
              requestToken = $('#fileUploadRequestToken').val();

              if (requestToken) {
                _context2.next = 13;
                break;
              }

              throw new Error('Couldn\'t get request token!');

            case 13:
              return _context2.abrupt("return", requestToken);

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](0);
              console.error("Couldn't get request token: ".concat(_context2.t0));

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 16]]);
    }));

    return function _getRequestToken() {
      return _ref2.apply(this, arguments);
    };
  }();

  var _saveTemplate =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var data,
          isSub,
          type,
          actionForm,
          authCookie,
          templateName,
          templatename,
          template,
          templateId,
          endpoint,
          _args3 = arguments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              data = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              isSub = _args3.length > 1 ? _args3[1] : undefined;
              type = _args3.length > 2 ? _args3[2] : undefined;
              actionForm = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 'Save';
              _context3.prev = 4;
              _context3.next = 7;
              return _getAuthCookie();

            case 7:
              authCookie = _context3.sent;
              templateName = data.templateName, templatename = data.templatename, template = data.template, templateId = data.templateId;
              endpoint = type === 'shelf' || type === 'shelfTemplate' ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate';

              if (authCookie) {
                _context3.next = 12;
                break;
              }

              throw new Error('You must provide a valid auth cookie!');

            case 12:
              if (!(!templatename && !templateName)) {
                _context3.next = 14;
                break;
              }

              throw new Error('You must provide a name when saving a template!');

            case 14:
              if (template) {
                _context3.next = 16;
                break;
              }

              throw new Error('You must provide content when saving a template!');

            case 16:
              api.setHeader('Cookie', "VtexIdclientAutCookie=".concat(authCookie, ";"));
              api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
              return _context3.abrupt("return", api.post(endpoint, _objectSpread({}, data, {
                isSub: isSub,
                actionForm: actionForm,
                textConfirm: 'sim'
              })));

            case 21:
              _context3.prev = 21;
              _context3.t0 = _context3["catch"](4);
              console.error(_context3.t0);

            case 24:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[4, 21]]);
    }));

    return function _saveTemplate() {
      return _ref4.apply(this, arguments);
    };
  }();

  var _parseErrorMessage = function _parseErrorMessage(data, templatename) {
    var x = data.indexOf('<applicationexceptionobject>') + 28;
    var y = data.indexOf('</applicationexceptionobject>');
    var obj = JSON.parse(data.substr(x, y - x));
    return "Couldn't save template (".concat(templatename, "): ").concat(obj.message);
  };

  var _getTemplates =
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(type) {
      var isSub,
          key,
          endpoint,
          authCookie,
          _ref6,
          data,
          _args4 = arguments;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              isSub = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : false;
              _context4.prev = 1;
              _getTemplates.cache = _getTemplates.cache || {};
              key = "".concat(type, "-").concat(isSub);
              endpoint = "admin/a/PortalManagement/GetTemplateList?type=".concat(type, "&IsSub=").concat(isSub ? 1 : 0);
              _context4.next = 7;
              return _getAuthCookie();

            case 7:
              authCookie = _context4.sent;
              api.setHeader('Cookie', "VtexIdclientAutCookie=".concat(authCookie, ";"));
              api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

              if (_getTemplates.cache[key]) {
                _context4.next = 16;
                break;
              }

              _context4.next = 13;
              return api.post(endpoint);

            case 13:
              _ref6 = _context4.sent;
              data = _ref6.data;
              _getTemplates.cache[key] = data;

            case 16:
              return _context4.abrupt("return", _getTemplates.cache[key]);

            case 19:
              _context4.prev = 19;
              _context4.t0 = _context4["catch"](1);
              console.error(_context4.t0);

            case 22:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 19]]);
    }));

    return function _getTemplates(_x) {
      return _ref5.apply(this, arguments);
    };
  }();

  var _getLegacyTemplateId =
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(reqData, type) {
      var isSub,
          templatesList,
          name,
          regex,
          matches,
          templateId,
          _args5 = arguments;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              isSub = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : false;
              _context5.prev = 1;
              _context5.next = 4;
              return _getTemplates(type, isSub);

            case 4:
              templatesList = _context5.sent;
              name = reqData.templateName || reqData.templatename;
              regex = new RegExp("(".concat(name, ")([\\s\\S]+?)(templateId=)([\\s\\S]+?(?=\"))"));
              matches = templatesList.match(regex);
              templateId = matches[4];

              if (templateId) {
                _context5.next = 11;
                break;
              }

              throw new Error('template not found!');

            case 11:
              return _context5.abrupt("return", templateId);

            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](1);
              console.error("Couldn't get legacy template id: ".concat(_context5.t0));

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[1, 14]]);
    }));

    return function _getLegacyTemplateId(_x2, _x3) {
      return _ref7.apply(this, arguments);
    };
  }();

  var _saveLegacyTemplate =
  /*#__PURE__*/
  function () {
    var _ref8 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(reqData) {
      var type,
          isSub,
          action,
          _args6 = arguments;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              type = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 'viewTemplate';
              isSub = _args6.length > 2 ? _args6[2] : undefined;
              _context6.prev = 2;
              action = type === 'shelfTemplate' ? 'Update' : 'Save';
              _context6.next = 6;
              return _getLegacyTemplateId(reqData, type, isSub);

            case 6:
              reqData.templateId = _context6.sent;
              return _context6.abrupt("return", _saveTemplate(reqData, isSub, type, action));

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](2);
              console.error(_context6.t0);

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[2, 10]]);
    }));

    return function _saveLegacyTemplate(_x4) {
      return _ref8.apply(this, arguments);
    };
  }();

  var saveShelfTemplate =
  /*#__PURE__*/
  function () {
    var _ref9 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(templateName, HTML, shelfClass) {
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

              throw new Error("Couldn't save template (".concat(templateName, "). Status: ").concat(status));

            case 19:
              if (!~data.indexOf('originalMessage')) {
                _context7.next = 21;
                break;
              }

              throw new Error(_parseErrorMessage(data, templateName));

            case 21:
              return _context7.abrupt("return", "Shelf template (".concat(templateName, ") ").concat(term, "!"));

            case 24:
              _context7.prev = 24;
              _context7.t0 = _context7["catch"](0);
              console.error(_context7.t0);

            case 27:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 24]]);
    }));

    return function saveShelfTemplate(_x5, _x6, _x7) {
      return _ref9.apply(this, arguments);
    };
  }();

  var saveTemplate =
  /*#__PURE__*/
  function () {
    var _ref11 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(templatename, HTML) {
      var isSub,
          reqData,
          _ref12,
          status,
          data,
          res,
          _args8 = arguments;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              isSub = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : false;
              _context8.prev = 1;
              reqData = {
                templatename: templatename,
                templateId: _getTemplateId(templatename),
                template: HTML
              };
              _context8.next = 5;
              return _saveTemplate(reqData, isSub);

            case 5:
              _ref12 = _context8.sent;
              status = _ref12.status;
              data = _ref12.data;

              if (!~data.indexOf('already exists')) {
                _context8.next = 14;
                break;
              }

              _context8.next = 11;
              return _saveLegacyTemplate(reqData, 'viewTemplate', isSub);

            case 11:
              res = _context8.sent;
              status = res.status;
              data = res.data;

            case 14:
              if (!(status.toString().substr(0, 1) !== '2')) {
                _context8.next = 18;
                break;
              }

              throw new Error("Couldn't save template (".concat(templatename, "). Status: ").concat(status));

            case 18:
              if (!~data.indexOf('originalMessage')) {
                _context8.next = 20;
                break;
              }

              throw new Error(_parseErrorMessage(data, templatename));

            case 20:
              return _context8.abrupt("return", "Template (".concat(templatename, ") saved!"));

            case 23:
              _context8.prev = 23;
              _context8.t0 = _context8["catch"](1);
              console.error(_context8.t0);

            case 26:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[1, 23]]);
    }));

    return function saveTemplate(_x8, _x9) {
      return _ref11.apply(this, arguments);
    };
  }();

  var saveFile =
  /*#__PURE__*/
  function () {
    var _ref13 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(filepath) {
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
              form = new _formData.default();
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
                    'Cookie': "VtexIdclientAutCookie=".concat(authCookie, ";"),
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

              throw new Error("Couldn't save file: ".concat(filepath, " (Error: ").concat(statusCode, ")"));

            case 21:
              return _context9.abrupt("return", "File: ".concat(filepath, " saved!"));

            case 24:
              _context9.prev = 24;
              _context9.t0 = _context9["catch"](0);
              console.error(_context9.t0);

            case 27:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 24]]);
    }));

    return function saveFile(_x10) {
      return _ref13.apply(this, arguments);
    };
  }(); // The public API


  return {
    saveTemplate: saveTemplate,
    saveShelfTemplate: saveShelfTemplate,
    saveFile: saveFile
  };
};

module.exports = {
  create: create
};