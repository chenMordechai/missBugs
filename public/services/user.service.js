
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

export const userService = {
    signup,
    login,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
    getById
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(miniUser => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(miniUser))
            return miniUser
        })

}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })

}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

function getById(userId){
    return axios.get(`/api/auth/${userId}`)
    .then(res => res.data)
}