
export function UserPreview({ user }) {

    return <article>
        <h4>Full Name :{user.fullname}</h4>
        <h1>🐛</h1>
        <h2>{user._id}</h2>
        <p>Is Admin?: <span>{user.isAdmin}</span></p>
        <p>name: <span>{user.name}</span></p>
    </article>
}