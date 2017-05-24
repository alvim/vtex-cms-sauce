import apisauce from 'apisauce'

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

  /**
   * @apiName saveTemplate
   * @apiGroup User
   * @apiPermission admin
   * @apiParam {String} access_token User access_token.
   * @apiUse listParams
   * @apiSuccess {Object} users List of users.
   */
  const saveTemplate = (authCookie, data = {}) => {
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

  // The public API
  return {
    saveTemplate
  }
}

module.exports = {
  create
}
