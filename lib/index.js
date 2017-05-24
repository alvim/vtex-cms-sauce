'use strict';

var _apisauce = require('apisauce');

var _apisauce2 = _interopRequireDefault(_apisauce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  api.addRequestTransform(function (request) {
    var str = [];
    for (var p in request.data) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(request.data[p]));
    }
    request.data = str.join('&');
  });

  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  var saveTemplate = function saveTemplate(authCookie) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    try {
      var templatename = data.templatename,
          template = data.template,
          templateId = data.templateId;


      if (!authCookie) throw new Error('You must provide a valid auth cookie!');
      if (!templatename) throw new Error('You must provide a name when saving a template!');
      if (!template) throw new Error('You must provide content when saving a template!');
      if (!templateId) throw new Error('You must provide a Template id when saving a template!');

      api.setHeader('Cookie', 'VtexIdclientAutCookie=' + authCookie + ';');

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

  // const createUser = (email, password) => api.post('users', {email, password})
  // const getMe = (accessToken) => api.post(`users/me?${accessToken}`)
  // const getUser = (userId, accessToken) => api.post(`users/${userId}?${accessToken}`)

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    saveTemplate: saveTemplate
    // createUser
    // getMe,
    // getUser
  };
};

// let's return back our create method as the default.
module.exports = {
  create: create
};