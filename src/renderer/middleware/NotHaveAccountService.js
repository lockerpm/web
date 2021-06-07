export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (store.state.userPw.is_pwd_manager === false) {
    return redirect(302, '/set-master-password')
  }
}
