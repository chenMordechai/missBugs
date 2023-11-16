import { userService } from '../services/user.service.js'

const { Link } = ReactRouterDOM

import { UserPreview } from './UserPreview.jsx'

export function UserList({ users, onRemoveUser }) {

    if (!users) return <div>Loading...</div>
    return (
        <ul className="user-list">
            {users.map((user) => (
                <li className="user-preview" key={user._id}>
                    <UserPreview user={user} />
                    <button onClick={() => onRemoveUser(user._id)}>x</button>
                    <Link to={`/user/${user._id}`}>Details</Link>
                </li>
            ))
            }
        </ul >
    )
}
