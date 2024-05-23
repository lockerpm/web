export default ({ store, app, i18n }) => {
  // Every time the route changes (fired on initialization too)
  app.router.beforeEach(async (toRoute, fromRoute, next) => {
    if (toRoute.path.startsWith('/vi')) {
      if (app.$cookies.get('i18n_redirected') !== 'vi') {
        i18n.setLocale('vi')
      }
    } else if (toRoute.path.startsWith('/zh')) {
      if (app.$cookies.get('i18n_redirected') !== 'zh') {
        i18n.setLocale('zh')
      }
    }

    // Save previous path to redirect back after unlock vault
    // Ignore some authenticate routes
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

    next()
  })
}
