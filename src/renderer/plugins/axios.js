// const Cookie = process.client ? require('js-cookie') : undefined

export default function ({ store, $axios, app, isDev }) {
  const environment = isDev ? 'dev' : process.env.environment
  $axios.interceptors.request.use(request => {
    // Get token from auth.js store
    // const token = store.state.auth.accessToken
    const token = app.$cookies.get('cs_locker_token', { path: '/', ...environment === '' ? { secure: true } : { secure: false } })

    // Update token axios header
    if (token) {
      request.headers.common.Authorization = 'Bearer ' + token
    }
    return request
  })
  $axios.onError(err => {
    if (err.response) {
      if (err.response.status === 401) {
        app.$cookies.remove('cs_locker_token')
        $axios.setToken(false)
        store.commit('UPDATE_IS_LOGGEDIN', false)
      }
      if (err.response.status === 403) {
        // app.$cookies.remove('cloud_token')
        // $axios.setToken(false)
        // store.commit('SET_AUTH', { accessToken: '', isLoggedIn: false })
      }
      // if (err.response.data.code === '2009') {
      //   if (process.client) {
      //     Notification({
      //       title: app.i18n.t(`common.warning`),
      //       message: app.i18n.t(`data.target.need_upgrade`),
      //       type: 'warning',
      //       duration: 0,
      //       dangerouslyUseHTMLString: true
      //     })
      //   }
      // }
    } else if (err.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // if(process.server) {
      //   console.log(err.request);
      // }
    } else {
      // Something happened in setting up the request that triggered an Error
      // if(process.server) {
      //   console.log('Error', err.message);
      // }
    }
  })
}
