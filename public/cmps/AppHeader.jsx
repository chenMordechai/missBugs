import { eventBusService } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

const { NavLink } = ReactRouterDOM
const { useEffect, useState } = React

import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser())

  // useEffect(() => {
  //   // component did mount when dependancy array is empty
  // }, [])

  useEffect(() => {
    const unsubscribe = eventBusService.on('login-logout', (msg) => {
      if (msg.txt === 'login') {
        setUser(userService.getLoggedinUser())
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  return (
    <header>
      <UserMsg />
      <nav>
        <NavLink to="/">Home</NavLink> |
        <NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>|
        {user && <NavLink to={`/user/${user._id}`}>User Details</NavLink>}
      </nav>
      <h1>Bugs are Forever</h1>
    </header>
  )
}
