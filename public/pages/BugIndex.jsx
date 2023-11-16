import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filter, setFilter] = useState(bugService.getDefaultFilter())
    const [sort, setSort] = useState(bugService.getDefaultSort())
    const [pageCount, setPageCount] = useState()


    const debouncedOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))

    useEffect(() => {
        loadBugs()
    }, [filter, sort])

    function loadBugs() {
        bugService.query(filter, sort)
            .then((data => {
                setBugs(data.bugs)
                // setBugsLength(data.bugsLength)
                setPageCount(data.pageCount)
            }))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                // showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?')
        }
        bugService.save(bug)
            .then((savedBug) => {
                setBugs([savedBug, ...bugs])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                showErrorMsg('Cannot update bug')
            })
    }

    function onDownloadPdf() {
        bugService.exportToPdf()
    }

    function onSetFilter(filter) {
        setFilter(prev => ({ ...prev, ...filter }))
    }

    function onSetSort(sort) {
        setSort(prev => ({ ...prev, ...sort }))
    }

    function onChangePage(diff) {
        setFilter(prevFilter => {
            let newPageIdx = prevFilter.pageIdx + diff

            if (newPageIdx < 0) newPageIdx = pageCount - 1
            if (newPageIdx >= pageCount) newPageIdx = 0
            return { ...prevFilter, pageIdx: newPageIdx }
        })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <BugFilter defaultFilterBy={filter} onSetFilter={debouncedOnSetFilter.current} />
                <BugSort defaultSortBy={sort} onSetSort={onSetSort} />
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <button onClick={onDownloadPdf}>Downloads Bugs </button>
                <br />
                <button onClick={() => onChangePage(1)}>+</button>
                {filter.pageIdx + 1}
                <button onClick={() => onChangePage(-1)}>-</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
