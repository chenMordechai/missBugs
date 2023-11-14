
const { useState, useEffect } = React

export function BugSort ({ defaultSortBy, onSetSort }){
    const [sortBy, setSortBy] = useState(defaultSortBy)

    useEffect(() => {
        onSetSort(sortBy)
    }, [sortBy])


    function handleChange({ target }) {
        const { name, type } = target
        let { value } = target
        if (type === 'number' ) value = +value
        if (type === 'checkbox') value = target.checked
    
        setSortBy(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="bug-sort">
            <h2>Bug Sort</h2>
        <form>

        <label htmlFor="sort">Sort By</label>
        <select onChange={handleChange} id="sort" name="type">
            <option value=""></option>
            <option value="title">Title</option>
            <option value="severity">Severity</option>
            <option value="createdAt">Created At</option>
        </select>
        <label htmlFor="dir">Desending</label>
                <input onChange={handleChange} type="checkbox" id="des" name="des" />

        </form>
        </section>
    )
}