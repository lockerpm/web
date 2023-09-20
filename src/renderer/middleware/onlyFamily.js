export default function ({ store, redirect }) {
  const _delayCheckPlan = () => {
    setTimeout(() => {
      const isFamily = store.state.currentPlan?.is_family
      if (isFamily !== undefined && !isFamily) {
        return redirect(302, '/vault')
      }
      _delayCheckPlan()
    }, 1000)
  }
  const isFamily = store.state.currentPlan?.is_family
  if (isFamily !== undefined && !isFamily) {
    return redirect(302, '/vault')
  }
  _delayCheckPlan()
}
