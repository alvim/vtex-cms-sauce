import apisauce from 'apisauce'

const create = (baseURL) => {
  // Create and configure an apisauce-based api object.
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache'
      'Accept': '*/*'
    },
    timeout: 10000
  })

  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  const saveTemplate = (authCookie, data) => {
    try {
      const { templatename, template, templateId } = data

      if (!authCookie) throw new Error('You must provide a valid auth cookie!')
      if (!templatename) throw new Error('You must provide a name when saving a template!')
      if (!template) throw new Error('You must provide content when saving a template!')
      if (!templateId) throw new Error('You must provide a Template id when saving a template!')

      api.setHeader('Cookie', `VtexIdclientAutCookie=${authCookie}`)

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
    login
    // createUser
    // getMe,
    // getUser
  }
}

// let's return back our create method as the default.
export default {
  create
}
