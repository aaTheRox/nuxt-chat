export default function ({ store, redirect }) {
  // If the user is not authenticated
    console.log(store.state)
  if (!store.state.auth) {
    return redirect('/login')
  }
}
