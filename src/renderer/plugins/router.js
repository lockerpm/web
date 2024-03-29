let isLanguageLoaded = false

export default ({ store, app, i18n }) => {
  // Every time the route changes (fired on initialization too)
  app.router.beforeEach(async (toRoute, fromRoute, next) => {
    if (toRoute.path.startsWith('/vi')) {
      if (app.$cookies.get('i18n_redirected') !== 'vi') {
        i18n.setLocale('vi')
      }
    }

    if (
      fromRoute &&
      toRoute &&
      fromRoute.path &&
      toRoute.path &&
      !fromRoute.path.includes('/login') &&
      !toRoute.path.includes('/login') &&
      !fromRoute.path.includes('/lock') &&
      !toRoute.path.includes('/lock') &&
      !fromRoute.path.includes('/set-master-password') &&
      !toRoute.path.includes('/set-master-password')
    ) {
      store.commit('UPDATE_PATH', toRoute.fullPath)
      store.commit('UPDATE_PREVIOUS_PATH', fromRoute.fullPath)
    }
    if (store.state.isLoggedIn && !isLanguageLoaded) {
      store.dispatch('LoadCurrentUser').then(res => {
        i18n.setLocale(res.language)
        isLanguageLoaded = true
      })
    }
    next()
  })
}
