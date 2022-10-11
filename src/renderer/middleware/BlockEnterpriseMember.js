export default function async ({ store, redirect }) {
  if (store.state.userPw.pwd_user_type === 'enterprise') {
    return redirect(302, '/vault')
  }
}
