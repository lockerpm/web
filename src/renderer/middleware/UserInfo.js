export default async ({ store, route }) => {
  if (store.state.isLoggedIn) {
    console.log(route.name)
    await store.dispatch('LoadCurrentUser')
    await store.dispatch('LoadCurrentUserPw')
  }
}
