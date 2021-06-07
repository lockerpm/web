export default async ({ store, redirect }) => {
  if (!store.state.isLoggedIn) {
    redirect(302, '/login')
  }
}
