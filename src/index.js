import 'babel-core/register'
import 'babel-polyfill'
import rl from 'readline'
import { readFileSync, createReadStream } from 'fs'
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
      const endpoint = (type === 'shelf') ? 'admin/a/PortalManagement/SaveShelfTemplate' : 'admin/a/PortalManagement/SaveTemplate'

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
      let term = 'saved'

      if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templateName}). Status: ${status}`)
      if (~data.indexOf('originalMessage')) {
        const errorMsg = _parseErrorMessage(data, templateName)

        if (~errorMsg.indexOf('Já existe um template chamado') || ~errorMsg.indexOf('Template already exists')) {
          let { status, data } = await _saveTemplate(reqData, true, 'shelf', 'Update')

          if (status.toString().substr(0, 1) !== '2') throw new Error(`Couldn't save template (${templateName}). Status: ${status}`)
          else if (~data.indexOf('originalMessage')) throw new Error(_parseErrorMessage(data, templateName))

          term = 'updated'
        } else throw new Error(errorMsg)
      }

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
      const { status, data } = await _saveTemplate(reqData, isSub)

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
