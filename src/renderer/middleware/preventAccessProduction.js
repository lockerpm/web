export default function ({ isDev, redirect }) {
  // If the user is not authenticated
  if (!isDev) {
    redirect(302, '/')
  }
}
