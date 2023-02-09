export default async function ({ store, redirect }) {
  // On premise == in enterprise
  if (store.state.isOnPremise) {
    return redirect(302, '/vault')
  }
}
