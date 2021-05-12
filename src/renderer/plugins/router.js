export default ({ store, app }) => {
  // Every time the route changes (fired on initialization too)
  app.router.beforeEach(async (toRoute, fromRoute, next) => {
    if (fromRoute.name !== 'login' && toRoute.name !== 'login') {
      store.commit('UPDATE_PATH', toRoute.fullPath)
      store.commit('UPDATE_PREVIOUS_PATH', fromRoute.fullPath)
    }
    // if (store.state.isLoggedIn) {
    //   await store.dispatch('LoadCurrentUser')
    //   await store.dispatch('LoadCurrentUserPw')
    // }
    next()
  })
}
