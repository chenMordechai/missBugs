import fs from 'fs'
import { utilService } from "./util.service.js"
import { loggerService } from './logger.service.js'

import Cryptr from 'cryptr'
const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')


export const userService = {
    signup,
    checkLogin,
    getLoginToken,
    validateToken,
    getById
}

const users = utilService.readJsonFile('data/user.json')

function signup({ fullname, username, password }) {
    console.log('signup')
    const user = {
        _id: utilService.makeId(),
        fullname,
        username,
        password,
    }

    users.unshift(user)
    return _saveUsersToFile().then(() => user)
}

function checkLogin({ username, password }) {
    let user = users.find(u => u.username === username && u.password === password)
    // mini user
    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname,
        }
    }
    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken){
    if (!loginToken) return null
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to users file', err)
                return reject(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

function getById(userId){
    let user =  users.find(u=>u._id === userId)
    // mini user
    if(user){
        user = {
            _id: user._id,
            fullname: user.fullname,
        }
    }
    return Promise.resolve(user)
}
