import { LoginSignup } from "../cmps/LoginSignup.jsx";
import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from "../services/user.service.js";

const { useState } = React
const { Link, NavLink } = ReactRouterDOM

export function Home() {
  
  const [user, setUser] = useState(userService.getLoggedinUser())

  function onSetUser(user) {
    setUser(user)
    // navigate('/')
  }

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }


  return (
    <section>
      <h2>Home is Home</h2>

      {user ? (
        < section >

          <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
          <button onClick={onLogout}>Logout</button>
        </ section >
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}

      <img src="assets/img/logo.png" />
    </section>
  )
}
