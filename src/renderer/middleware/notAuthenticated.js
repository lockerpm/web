export default ({ store, redirect, route, isDev, app }) => {
  if (!store.state.auth.isLoggedIn) {
    redirect('/login')
  }
}
