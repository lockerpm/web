export default function async ({ store, redirect }) {
  if (store.state.userPw.is_pwd_manager === true) {
    return redirect(302, '/dashboard')
  }
}
