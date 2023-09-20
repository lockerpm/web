export default function ({ store, redirect }) {
  const FAMILY_ALIASES = ['pm_family', 'pm_lifetime_family']
  const _delayCheckPlan = () => {
    setTimeout(() => {
      const alias = store.state.currentPlan?.alias
      if (alias && !FAMILY_ALIASES.includes(alias)) {
        return redirect(302, '/vault')
      }
      _delayCheckPlan()
    }, 1000)
  }
  const alias = store.state.currentPlan?.alias
  if (alias && !FAMILY_ALIASES.includes(alias)) {
    return redirect(302, '/vault')
  }
  _delayCheckPlan()
}
