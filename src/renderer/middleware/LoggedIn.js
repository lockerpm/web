export default async ({ store, redirect, route }) => {
  if (!store.state.isLoggedIn) {
    redirect(302, `/login?SERVICE_URL=${encodeURIComponent(route.fullPath)}`)
  }
}
