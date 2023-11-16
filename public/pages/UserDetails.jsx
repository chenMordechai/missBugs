
import {userService} from '../services/user.service.js'

const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState(null)
    const { userId } = useParams()

    useEffect(()=>{
        userService.getById(userId)
        .then(user=>{
            setUser(user)
        })
       
    },[])

    if(!user) return <section>Loding...</section>
    return (
        <section className="user-details">
            <h2>User Details</h2>
            <h2>{user.fullname}</h2>
            <h3>{user._id}</h3>
            {console.log(userBugs)}
        </section>
    )
}