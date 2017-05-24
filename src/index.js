import { readFileSync } from 'fs'
import 'babel-core/register'
import 'babel-polyfill'

import { createHash } from 'crypto'
import apisauce from 'apisauce'

const VTEXID = JSON.parse(readFileSync('.vtexid', 'utf8'))

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
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(request.data[p]));
    }
    request.data = str.join('&')
  })

  const _getAuthCookie = async () => {
    try {
      const { data: { authenticationToken } } = await api.get('api/vtexid/pub/authentication/start')
      if (!authenticationToken) throw new Error('Can\'t get an authentication token.')

      const params = {
        authenticationToken,
        ...VTEXID
      }
      const { data: { authCookie: { Value } } } = await api.get('api/vtexid/pub/authentication/classic/validate', params)
      if (!Value) throw new Error('Can\'t get an authentication cookie.')

      return Value
    } catch(err) { console.error(err) }
  }

  const _getTemplateId = (templatename) => createHash('md5').update(templatename).digest('hex')

  const _saveTemplate = async (data = {}, isSub, type, actionForm = 'Save') => {
    try {
      const authCookie = await _getAuthCookie()
      const { templateName, templatename, template, templateId } = data
      const endpoint = (type === 'shelf') ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate'

      if (!authCookie) throw new Error('You must provide a valid auth cookie!')
      if (!templatename && !templateName) throw new Error('You must provide a name when saving a template!')
      if (!template) throw new Error('You must provide content when saving a template!')

      api.setHeader('Cookie', `VtexIdclientAutCookie=${authCookie};`)

      return api.post(endpoint, {
        ...data,
        isSub,
        actionForm,
        textConfirm: 'sim'
      })
    } catch(err) { console.error(err) }
  }

  const _parseErrorMessage = (data, templatename) => {
    const x = data.indexOf('<applicationexceptionobject>') + 28
    const y = data.indexOf('</applicationexceptionobject>')
    const obj = JSON.parse(data.substr(x, y - x))
    return `Couldn't save template (${templatename}): ${obj.message}`
  }

  const saveShelfTemplate = async (templateName, HTML, shelfClass) => {
    try {
      const reqData = {
        templateName,
        templateId: _getTemplateId(templateName),
        template: HTML,
        roundCorners: false,
        templateCssClass: shelfClass
      }
      let { status, data } = await _saveTemplate(reqData, true, 'shelf')

      if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templateName}). Status: ${status}`)
      if (~data.indexOf('originalMessage')) {
        const errorMsg = _parseErrorMessage(data, templateName)

        if (~errorMsg.indexOf('Já existe um template chamado')) {
          let { status, data } = await _saveTemplate(reqData, true, 'shelf', 'Update')

          if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templateName}). Status: ${status}`)
          else if (~data.indexOf('originalMessage')) throw new Error(_parseErrorMessage(data, templateName))

        } else throw new Error(errorMsg)
      }

      return `Shelf template (${templateName}) saved!`
    } catch(err) { console.error(err) }
  }

  const saveTemplate = async (templatename, HTML, isSub = false) => {
    try {
      const reqData = {
        templatename,
        templateId: _getTemplateId(templatename),
        template: HTML
      }
      const { status, data } = await _saveTemplate(reqData, isSub)

      if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templatename}). Status: ${status}`)
      else if (~data.indexOf('originalMessage')) throw new Error(_parseErrorMessage(data, templatename))

      return `Template (${templatename}) saved!`
    } catch(err) { console.error(err) }
  }

  // The public API
  return {
    saveTemplate,
    saveShelfTemplate
  }
}

module.exports = {
  create
}