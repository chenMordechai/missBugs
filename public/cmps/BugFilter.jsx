
const { useState, useEffect } = React

export function BugFilter({ defaultFilterBy, onSetFilter }) {
    const [filterBy, setFilterBy] = useState(defaultFilterBy)

    useEffect(() => {
        onSetFilter(filterBy)
    }, [filterBy])

    function handleChange({ target }) {
        const { name, type } = target
        let { value } = target
        if (type === 'number' ) value = +value
        if (type === 'checkbox') value = target.checked
    
        setFilterBy(prev => ({ ...prev, [name]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterBy)
    }

    return (
        <section className="bug-filter">
            <h2>Bug Filter</h2>
            <form onSubmit={onSubmitFilter}>

                <label htmlFor="title">Title</label>
                <input onChange={handleChange} type="text" name="title" id="title" />

                <br />
                <label htmlFor="severity">Severity</label>
                <input onChange={handleChange} type="number" name="severity" id="severity" />

                <br />
                <label htmlFor="labels">Labels</label>
                <select onChange={handleChange} id="labels" name="labels" >
                    <option value=""></option>
                    <option value="need-CR">Need-CR</option>
                    <option value="dev-branch">Dev-branch</option>
                    <option value="critical">Critical</option>
                </select>

                <br />
                <button>Filter</button>
            </form>
        </section>
    )
}