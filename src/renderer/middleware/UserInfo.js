export default async ({ store }) => {
  if (store.state.isLoggedIn) {
    // await store.dispatch('LoadCurrentUser')
    await store.dispatch('LoadCurrentUserPw')
    store.dispatch('LoadCurrentIntercom')
  }
}
