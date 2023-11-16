
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = '/api/auth/'
export const userService = {
    signup,
    login,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
    getById,
    query,
    remove
}

function signup({ username, password, fullname }) {
    return axios.post(BASE_URL+'signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
            return user
        })
}

function login({ username, password }) {
    return axios.post(BASE_URL+'login', { username, password })
        .then(res => res.data)
        .then(miniUser => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(miniUser))
            return miniUser
        })

}

function logout() {
    return axios.post(BASE_URL+'logout')
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
    return axios.get(BASE_URL+userId)
    .then(res => res.data)
}

function query(){
    return axios.get(BASE_URL)
    .then(res=>res.data)
}

function remove(userId) {
    console.log('userId:', userId)
    return axios.delete(BASE_URL + userId).then(res => res.data)
}