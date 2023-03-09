export default async function ({ store, redirect }) {
  if (!store.state.userPw.pwd_user_type) {
    await store.dispatch('LoadCurrentUserPw')
  }
  if (store.state.userPw.pwd_user_type === 'enterprise') {
    return redirect(302, '/vault')
  }
}
