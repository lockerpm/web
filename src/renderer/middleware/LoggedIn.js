export default async ({ store, redirect, route }) => {
  if (!store.state.isLoggedIn) {
    const baseUrl = 'https://locker.io'
    const urlObj = new URL(`${baseUrl}/login`)
    urlObj.searchParams.append('SERVICE_URL', encodeURIComponent(route.fullPath))
    if (route.query) {
      Object.keys(route.query).forEach(k => {
        urlObj.searchParams.append(k, route.query[k])
      })
    }
    const url = urlObj.toString().split(baseUrl)[1]
    redirect(302, url)
  }
}
