import { utilService } from "./util.service.js"
import fs from 'fs'

const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    save,
    getById,
    remove,
    downloadPdf
}

function query() {
    return Promise.resolve(bugs)
}

function save(bug) {
    // console.log('bug:', bug)
    if(bug._id){
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    }else{
        bug._id = utilService.makeId()
        bugs.unshift(bug)
        // console.log('bugs:', bugs)
    }
  return _saveBugsToFile().then(()=> bug)

}

function getById(bugId) {
   const bug = bugs.find(bug => bug._id === bugId)
   return Promise.resolve(bug)
}

function remove(bugId) {
    // console.log('bugId:', bugId)
   const bugIdx = bugs.findIndex(bug => bug._id === bugId)
   bugs.splice(bugId,1)
   
   return _saveBugsToFile() // Promise.resolve()
}

function downloadPdf(){
   return utilService.makePdf(bugs)
}











function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}