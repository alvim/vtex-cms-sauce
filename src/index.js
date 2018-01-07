import 'babel-core/register'
import 'babel-polyfill'
import rl from 'readline'
import { createReadStream } from 'fs'
import { createHash } from 'crypto'
import FormData from 'form-data'
import cheerio from 'cheerio'

import apisauce from 'apisauce'

const ask = (question) => {
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve, reject) => {
    r.question(question + '\n', function(answer) {
      r.close()

      if (answer) resolve(answer)
      else { reject('No answer!') }
    })
  })
}

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

  let _getAuthCookie = async () => {
    try {
      const authCookie = await ask('Insert authentication cookie:')

      _getAuthCookie = () => authCookie
      return authCookie
    } catch(err) { console.error(err) }
  }

  const _getTemplateId = (templatename) => createHash('md5').update(templatename).digest('hex')

  const _getRequestToken = async () => {
    try {
      const authCookie = await _getAuthCookie()
      api.setHeader('Cookie', `VtexIdclientAutCookie=${authCookie};`)

      const { data } = await api.post('/admin/a/PortalManagement/AddFile?fileType=css')
      const $ = cheerio.load(data)
      const requestToken = $('#fileUploadRequestToken').val()
      if (!requestToken) throw new Error('Couldn\'t get request token!')

      return requestToken
    } catch(err) { console.error(`Couldn't get request token: ${err}`) }
  }

  const _saveTemplate = async (data = {}, isSub, type, actionForm = 'Save') => {
    try {
      const authCookie = await _getAuthCookie()
      const { templateName, templatename, template, templateId } = data
      const endpoint = (type === 'shelf' || type === 'shelfTemplate') ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate'

      if (!authCookie) throw new Error('You must provide a valid auth cookie!')
      if (!templatename && !templateName) throw new Error('You must provide a name when saving a template!')
      if (!template) throw new Error('You must provide content when saving a template!')

      api.setHeader('Cookie', `VtexIdclientAutCookie=${authCookie};`)
      api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

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

  let _getTemplates = async (type, isSub = false) => {
    try {
      _getTemplates.cache = _getTemplates.cache || {}
      const key = `${type}-${isSub}`
      const endpoint = `admin/a/PortalManagement/GetTemplateList?type=${type}&IsSub=${isSub ? 1 : 0}`
      const authCookie = await _getAuthCookie()

      api.setHeader('Cookie', `VtexIdclientAutCookie=${authCookie};`)
      api.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

      if (!_getTemplates.cache[key]) {
        const { data } = await api.post(endpoint)
        _getTemplates.cache[key] = data
      }

      return _getTemplates.cache[key]
    } catch(err) { console.error(err) }
  }

  const _getLegacyTemplateId = async (reqData, type, isSub = false) => {
    try {
      const templatesList = await _getTemplates(type, isSub)

      const name = reqData.templateName || reqData.templatename
      const regex = new RegExp(`(${name})([\\s\\S]+?)(templateId=)([\\s\\S]+?(?="))`)
      const matches = templatesList.match(regex)
      const templateId = matches[4]
      if (!templateId) throw new Error('template not found!')

      return templateId
    } catch(err) { console.error(`Couldn't get legacy template id: ${err}`) }
  }

  const _saveLegacyTemplate = async (reqData, type = 'viewTemplate', isSub) => {
    try {
      const action = type === 'shelfTemplate' ? 'Update' : 'Save'
      reqData.templateId = await _getLegacyTemplateId(reqData, type, isSub)

      return _saveTemplate(reqData, isSub, type, action)
    } catch(err) { console.error(err) }
  }

  const saveShelfTemplate = async (templateName, HTML, shelfClass) => {
    try {
      const reqData = {
        templateName,
        templateId: _getTemplateId(templateName),
        template: HTML,
        roundCorners: false,
        templateCssClass: shelfClass,
      }
      let term = 'saved'
      let { status, data } = await _saveTemplate(reqData, true, 'shelf')
      if (~data.indexOf('already exists')) {
        term = 'updated'
        const res = await _saveLegacyTemplate(reqData, 'shelfTemplate', true)
        status = res.status
        data = res.data
      }

      if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templateName}). Status: ${status}`)
      else if (~data.indexOf('originalMessage')) throw new Error(_parseErrorMessage(data, templateName))

      return `Shelf template (${templateName}) ${term}!`
    } catch(err) { console.error(err) }
  }

  const saveTemplate = async (templatename, HTML, isSub = false) => {
    try {
      const reqData = {
        templatename,
        templateId: _getTemplateId(templatename),
        template: HTML
      }
      let { status, data } = await _saveTemplate(reqData, isSub)
      if (~data.indexOf('already exists')) {
        const res = await _saveLegacyTemplate(reqData, 'viewTemplate', isSub)
        status = res.status
        data = res.data
      }

      if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templatename}). Status: ${status}`)
      else if (~data.indexOf('originalMessage')) throw new Error(_parseErrorMessage(data, templatename))

      return `Template (${templatename}) saved!`
    } catch(err) { console.error(err) }
  }

  const saveFile = async (filepath) => {
    try {
      const authCookie = await _getAuthCookie()
      const requestToken = await _getRequestToken()
      const host = baseURL.replace(/(http:|https:|\/)/g, '')

      const form = new FormData()
      form.append('Filename', filepath)
      form.append('fileext', '*.jpg;*.png;*.gif;*.jpeg;*.ico;*.js;*.css')
      form.append('folder', '/uploads')
      form.append('Upload', 'Submit Query')
      form.append('requestToken', requestToken)
      form.append('Filedata', createReadStream(filepath))

      const { statusCode } = await new Promise((resolve, reject) => {
        form.submit({
          host,
          'path': '/admin/a/FilePicker/UploadFile',
          'headers': {
            'Cookie': `VtexIdclientAutCookie=${authCookie};`,
            'Content-Type': form.getHeaders()['content-type']
          }
        }, (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      })

      if (statusCode.toString().substr(0, 1) !== '2') throw new Error(`Couldn\'t save file: ${filepath} (Error: ${statusCode})`)

      return `File: ${filepath} saved!`
    } catch(err) { console.error(err) }
  }

  // The public API
  return {
    saveTemplate,
    saveShelfTemplate,
    saveFile
  }
}

module.exports = {
  create
}
