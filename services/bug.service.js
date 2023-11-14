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

function query(filterBy, sortBy) {
    let bugsToSend = bugs
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugsToSend = bugsToSend.filter(bug => regex.test(bug.title))
    }
    if (filterBy.severity) {
        bugsToSend = bugsToSend.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.labels) {
        bugsToSend = bugsToSend.filter(bug => bug.labels.includes(filterBy.labels))
    }

    if (sortBy.type === 'title') bugsToSend.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.dir)
    else bugsToSend.sort((b1, b2) => (b1[sortBy.type] - b2[sortBy.type]) * sortBy.dir)

    if (filterBy.pageIdx !== undefined) {
        if (filterBy.pageIdx < 0) filterBy.pageIdx = Math.floor(bugsToSend.length / PAGE_SIZE)
        let start = filterBy.pageIdx * PAGE_SIZE // 0 , 3 , 6 , 9
        if (start >= bugsToSend.length) start = 0
        bugsToSend = bugsToSend.slice(start, start + PAGE_SIZE)
    }

    return Promise.resolve(bugsToSend)
}



function save(bug) {
    // console.log('bug:', bug)
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)

}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    console.log('bugId:', bugId)
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    console.log('bugIdx:', bugIdx)
    if (bugIdx !== -1) bugs.splice(bugIdx, 1)

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
            console.log('The file was saved!');
            resolve()
        });
    })
}
