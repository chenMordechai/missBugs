
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState(null)
    const { userId } = useParams()

    useEffect(() => {
        userService.getById(userId)
            .then(user => {
                setUser(user)
            })

        bugService.query({ userId })
            .then(data => {
                setUserBugs(data.bugs)
            })

    }, [])

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = userBugs.filter((bug) => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                // showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then((savedBug) => {
                const bugsToUpdate = userBugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                showErrorMsg('Cannot update bug')
            })
    }

    if (!user) return <section>Loding...</section>
    return (
        <section className="user-details">
            <h2>User Details</h2>
            <h2>{user.fullname}</h2>
            <h3>{user._id}</h3>
            {userBugs && <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />}
        </section>
    )
}