export default function ({ store, redirect }) {
  // If the user is blocked by payment
  if (store.state.userPw.block_by_source === true) {
    return redirect(302, '/payment')
  }
}
