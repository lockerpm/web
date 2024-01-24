export default function ({
  store,
  $axios,
  app,
  isDev,
  redirect,
  route,
  $config,
  env
}) {
  $axios.interceptors.request.use(request => {
    // Get token from auth.js store
    // const token = store.state.auth.accessToken
    const token = app.$cookies.get('cs_locker_token')
    const deviceId = app.$cookies.get('device_id')

    // Update token axios header
    if (token) {
      request.headers.Authorization = 'Bearer ' + token
    }
    if (deviceId) {
      request.headers['device-id'] = deviceId
    }
    if ($config.cloudflare && (env.environment === 'staging' || isDev)) {
      request.headers['CF-Access-Client-Id'] = $config.cloudflare.id
      request.headers['CF-Access-Client-Secret'] = $config.cloudflare.secret
    }

    // Update base api url
    const ON_PREMISE_WHITELIST = [
      '/onpremise/host',
      '/users/exist',
      '/payments/trial/enterprise',
      'sso/users',
      '/payments/lifetime'
    ]
    if (
      store.state.isOnPremise &&
      store.state.onPremiseBaseApi &&
      !ON_PREMISE_WHITELIST.some(path => request.url.endsWith(path))
    ) {
      request.baseURL = store.state.onPremiseBaseApi
    }

    return request
  })

  $axios.onResponse(res => {
    if (res.headers['device-id']) {
      const expiredTime = res.headers['device-expired-time']
        ? app.$moment.unix(res.headers['device-expired-time'])
        : app.$moment().add(365, 'days')
      app.$cookies.set('device_id', res.headers['device-id'], {
        path: '/',
        secure: !isDev,
        expires: expiredTime.toDate(),
        domain: 'locker.io'
      })
      $axios.setHeader('device-id', res.headers['device-id'])
    }
  })

  $axios.onError(err => {
    if (err.response) {
      if (err.response.status === 400) {
        if (err.response.data.code === '1010') {
          store.commit('UPDATE_NOTICE', { showLocked: true })
        }
        if (err.response.data.code === '7002') {
          store.commit('UPDATE_NOTICE', { showPleaseUpgrade: true })
        }
      }
      if (err.response.status === 401) {
        app.$cookies.remove('cs_locker_token')
        app.$cookies.set('intercom-id-hjus3ol6', 0, {
          maxAge: 0,
          domain: '.cystack.net',
          path: '/'
        })
        app.$cookies.set('intercom-session-hjus3ol6', 0, {
          maxAge: 0,
          domain: '.cystack.net',
          path: '/'
        })
        $axios.setToken(false)

        store.commit('UPDATE_IS_LOGGEDIN', false)

        const WHITELIST_PATHS = [
          '/benefits',
          '/contact',
          '/download',
          '/features',
          '/how-it-works',
          '/plans',
          '/pricing',
          '/security',
          '/blog',
          '/terms',
          '/privacy',
          '/whitepaper',
          '/about-us',
          '/master-password',
          '/refer-friend',
          '/affiliate',
          '/business',
          '/private-email',
          '/lifetime',
          '/comparison',
          '/promotion',
          '/crypto',
          '/',
          '/on-premise-create-master-pw'
        ]
        const WHITELIST_ROUTE_NAMES = ['shares-id']

        let currentPath = route.path
        if (currentPath.startsWith('/vi')) {
          currentPath = currentPath.slice(3)
        }
        const paths = currentPath.split('/')
        currentPath = '/' + (paths[1] || '')

        let currentRouteName = route.name
        if (currentRouteName.includes('___')) {
          currentRouteName = currentRouteName.split('___')[0]
        }

        if (
          !WHITELIST_PATHS.includes(currentPath) &&
          !WHITELIST_ROUTE_NAMES.includes(currentRouteName) &&
          currentPath &&
          !route.name.startsWith('all___')
        ) {
          redirect(302, '/login')
        }
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
