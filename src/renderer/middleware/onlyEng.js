export default function ({ route, redirect }) {
  if (route.fullPath.startsWith('/vi')) {
    return redirect(302, route.fullPath.slice(3))
  }
}
