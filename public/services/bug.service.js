
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'

// _createBugs()

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    downloadPdf,
    getDefaultFilter
}


function query(filterBy = {}) {
    console.log('filterBy:', filterBy)
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL).then(res => res.data)
    .then(bugs =>{
        if(filterBy.title){
            const regex = new RegExp(filterBy.title , 'i')
            bugs = bugs.filter(bug=>regex.test(bug.title))
        }
        if(filterBy.severity){
            bugs = bugs.filter(bug=>bug.severity === filterBy.severity)
        }
        console.log('bugs:', bugs)
        return bugs
    })
}
function getById(bugId) {
    return axios.get(BASE_URL +bugId).then(res=>res.data)
    // return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return axios.get(BASE_URL +bugId +'/remove').then(res=>res.data)
    // return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    let queryParams =`?title=${bug.title}&description=${bug.description}&severity=${bug.severity}`
    if (bug._id)  queryParams +=`&_id=${bug._id}`
    console.log('queryParams:', queryParams)
    return axios.get(BASE_URL + 'save'+ queryParams).then(res=>res.data)
}

function downloadPdf() {
    return axios.get(BASE_URL +'pdf').then(res=>res.data)
    // return storageService.remove(STORAGE_KEY, bugId)
}

function getDefaultFilter() {
    return { title: '', severity: '' }
}


// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = [
//             {
//                 title: "Infinite Loop Detected",
//                 severity: 4,
//                 _id: "1NF1N1T3",
//                 description: "problem when clicking Add"
//             },
//             {
//                 title: "Keyboard Not Found",
//                 severity: 3,
//                 _id: "K3YB0RD",
//                 description: "problem when clicking Add"
//             },
//             {
//                 title: "404 Coffee Not Found",
//                 severity: 2,
//                 _id: "C0FF33",
//                 description: "problem when clicking Add"
//             },
//             {
//                 title: "Unexpected Response",
//                 severity: 1,
//                 _id: "G0053",
//                 description: "problem when clicking Add"
//             }
//         ]
//         utilService.saveToStorage(STORAGE_KEY, bugs)
//     }



// }
