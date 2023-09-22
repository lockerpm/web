export default function ({ store, redirect }) {
  const LIFETIME_ALIASES = ['pm_lifetime_premium', 'pm_lifetime_family']
  const _delayCheckPlan = () => {
    setTimeout(() => {
      const alias = store.state.currentPlan?.alias
      if (alias && LIFETIME_ALIASES.includes(alias)) {
        return redirect(302, '/vault')
      }
      _delayCheckPlan()
    }, 1000)
  }
  const alias = store.state.currentPlan?.alias
  if (alias && LIFETIME_ALIASES.includes(alias)) {
    return redirect(302, '/vault')
  }
  _delayCheckPlan()
}
