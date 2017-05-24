import "babel-core/register"
import "babel-polyfill"

import apisauce from 'apisauce'

const VTEXID_EMAIL = 'malvimmacedo@gmail.com'
const VTEXID_PASSWORD = 'Wololo1408'

const create = (baseURL) => {
  // Create and configure an apisauce-based api object.
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 10000
  })

  // Transforms JSON request data into x-www-form-urlencoded
  api.addRequestTransform(request => {
    let str = []
    for (const p in request.data) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(request.data[p]));
    }
    request.data = str.join('&')
  })

  const _getAuthCookie = async () => {
    try {
      const { data: { authenticationToken } } = await api.get('api/vtexid/pub/authentication/start')
      if (!authenticationToken) throw new Error('Can\'t get an authentication token.')

      const params = {
        authenticationToken,
        login: VTEXID_EMAIL,
        password: VTEXID_PASSWORD
      }
      const { data: { authCookie: { Value } } } = await api.get('api/vtexid/pub/authentication/classic/validate', params)
      if (!Value) throw new Error('Can\'t get an authentication cookie.')

      return Value
    } catch(err) { console.error(err) }
  }

  const _saveTemplate = (authCookie, data = {}) => {
    try {
      const { templatename, template, templateId } = data

      if (!authCookie) throw new Error('You must provide a valid auth cookie!')
      if (!templatename) throw new Error('You must provide a name when saving a template!')
      if (!template) throw new Error('You must provide content when saving a template!')
      if (!templateId) throw new Error('You must provide a Template id when saving a template!')

      api.setHeader('Cookie', `VtexIdclientAutCookie=${authCookie};`)

      return api.post('admin/a/PortalManagement/SaveTemplate', {
        templatename,
        template,
        templateId,
        isSub: 'False',
        actionForm: 'Save',
        textConfirm: 'sim'
      })
    } catch(err) { console.error(err) }
  }

  const saveTemplate = async (templatename, HTML) => {
    const authCookie = await _getAuthCookie()
    const data = {
      templatename,
      template: HTML
    }

    return _saveTemplate(authCookie, data)
  }

  // The public API
  return {
    saveTemplate,
    _getAuthCookie
  }
}

module.exports = {
  create
}
