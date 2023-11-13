import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filter, setFilter] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filter])

    function loadBugs() {
        console.log('Load bugs')
        bugService.query(filter).then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                // console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                // showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?')
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                // console.log('Added Bug', savedBug)
                setBugs([savedBug,...bugs])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                // console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onDownloadBugs(){
        bugService.downloadPdf()
        .then(()=>{
            console.log('SUCCESSFUL DOWNLOADS')
        })
    }

    function onSetFilter(filter){
        setFilter(prev => ({...prev , ...filter}))
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <BugFilter defaultFilterBy={filter} onSetFilter={onSetFilter}/>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <button onClick={onDownloadBugs}>Downloads Bugs </button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
