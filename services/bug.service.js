import fs from 'fs'
import { utilService } from "./util.service.js"
import { loggerService } from './logger.service.js'

const PAGE_SIZE = 3

export const bugService = {
    query,
    save,
    getById,
    remove
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy ={}, sortBy ={}) {
    let bugsToSend = bugs.slice()
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugsToSend = bugsToSend.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    }
    if (filterBy.severity) {
        bugsToSend = bugsToSend.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.labels) {
        bugsToSend = bugsToSend.filter(bug => bug.labels.includes(filterBy.labels))
    }
    if (filterBy.userId) {
        bugsToSend = bugsToSend.filter(b => b.creator._id === filterBy.userId)
    }

    if (sortBy.type === 'title') {
        bugsToSend.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.des)
    } else {
        bugsToSend.sort((b1, b2) => (b1[sortBy.type] - b2[sortBy.type]) * sortBy.des)
    }
    // 14 / 3 =  4.6 => 5
    const pageCount = Math.ceil(bugsToSend.length / PAGE_SIZE)
    if (filterBy.pageIdx !== undefined) {
        let start = filterBy.pageIdx * PAGE_SIZE // 0 , 3 , 6 , 9
        bugsToSend = bugsToSend.slice(start, start + PAGE_SIZE)
    }

    // const data = { bugs: bugsToSend, bugsLength: bugsLength, pageSize: PAGE_SIZE }
    const data = { bugs: bugsToSend, pageCount }
    return Promise.resolve(data)
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (!loggedinUser.isAdmin &&  bugs[bugIdx].creator._id !== loggedinUser._id) return Promise.reject('Not your Bug')
        // bugs[bugIdx] = bug
        bugs[bugIdx].title = bug.title
        bugs[bugIdx].severity = bug.severity
        bugs[bugIdx].description = bug.description

    } else {
        bug._id = utilService.makeId()
        bug.creator = loggedinUser
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)

}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('No Such Bug')

    const bug = bugs[bugIdx]
    if (!loggedinUser.isAdmin &&  bug.creator._id !== loggedinUser._id) return Promise.reject('Not your bug')

    bugs.splice(bugIdx, 1)

    // bugs = bugs.filter(bug => bug._id !== bugId)
    return _saveBugsToFile() // Promise.resolve()
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err);
            }
            resolve()
        });
    })
}
