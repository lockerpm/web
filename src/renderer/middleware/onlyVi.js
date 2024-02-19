export default function ({ route, redirect }) {
  if (!route.fullPath.startsWith('/vi')) {
    return redirect(302, '/vi' + route.fullPath)
  }
}
