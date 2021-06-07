export default ({ store, app }) => {
  // Every time the route changes (fired on initialization too)
  app.router.beforeEach(async (toRoute, fromRoute, next) => {
    if (fromRoute && toRoute && fromRoute.path && toRoute.path && !fromRoute.path.includes('/login') && !toRoute.path.includes('/login') && !fromRoute.path.includes('/lock') && !toRoute.path.includes('/lock') && !fromRoute.path.includes('/set-master-password') && !toRoute.path.includes('/set-master-password')
    ) {
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
