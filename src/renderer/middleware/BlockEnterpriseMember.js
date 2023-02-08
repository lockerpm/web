export default async function ({ store, redirect }) {
  // On premise == in enterprise
  if (store.state.isOnPremise) {
    return redirect(302, '/vault')
  }

  if (!store.state.userPw.pwd_user_type) {
    await store.dispatch('LoadCurrentUserPw')
  }

  // Else check user type
  if (store.state.userPw.pwd_user_type === 'enterprise') {
    return redirect(302, '/vault')
  }
}
