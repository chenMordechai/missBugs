
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    exportToPdf,
    getDefaultFilter,
    getDefaultSort,
}


function query(filterBy = {}, sortBy = {}) {
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL, { params: { ...filterBy, ...sortBy } }).then(res => res.data)
    // .then(bugs => {
    //     if (filterBy.title) {
    //         const regex = new RegExp(filterBy.title, 'i')
    //         bugs = bugs.filter(bug => regex.test(bug.title))
    //     }
    //     if (filterBy.severity) {
    //         bugs = bugs.filter(bug => bug.severity === filterBy.severity)
    //     }
    //     // console.log('bugs:', bugs)
    //     return bugs
    // })
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
    // return storageService.get(STORAGE_KEY, bugId)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)

}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
    // return storageService.remove(STORAGE_KEY, bugId)
}

function exportToPdf() {
    return axios.get(BASE_URL + 'export', { responseType: 'blob' }).then((res) => {
        // Create a Blob from the response data
        const blob = new Blob([res.data], { type: 'application/pdf' })

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob)

        // Create a link element to trigger the download
        const a = document.createElement('a')
        a.href = url
        a.download = 'SaveTheBugs.pdf'
        a.click()

        // Release the object URL when done
        window.URL.revokeObjectURL(url)
    })
}

function getDefaultFilter() {
    return { title: '', severity: '', labels: '', pageIdx: 0 }
}

function getDefaultSort() {
    return { type: '', des: '' }
}
