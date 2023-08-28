export default async function ({ store, redirect }) {
  if (store.state.currentPlan.alias === 'pm_lifetime_premium') {
    return redirect(302, '/vault')
  }
}
