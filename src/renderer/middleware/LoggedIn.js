export default async ({ store, redirect }) => {
  if (!store.state.isLoggedIn) {
    redirect('/login')
  }
}
