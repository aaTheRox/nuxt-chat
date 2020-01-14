export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
      console.log(store.state)

  if (store.state.auth) {
    return redirect('/')
  }
}
