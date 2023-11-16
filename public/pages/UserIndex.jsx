
import { userService } from '../services/user.service.js'
import { UserList } from '../cmps/UserList.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React

export function UserIndex() {

    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then((users => {
                setUsers(users)
            }))
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const usersToUpdate = users.filter((user) => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('User removed')
            })
            .catch((err) => {
                showErrorMsg('Cannot remove user')
            })
    }

    return (
        <section className="user-index">
            <h2>User Index</h2>
            <UserList users={users} onRemoveUser={onRemoveUser} />
        </section>
    )
}