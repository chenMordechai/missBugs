
const {useState, useEffect} = React

export function BugFilter ({defaultFilterBy,onSetFilter}){
    const [filterBy, setFilterBy] = useState(defaultFilterBy)
    
    useEffect(()=>{
        // console.log('filterBy:', filterBy)
        onSetFilter(filterBy)
    },[filterBy])

    function handleChange({target}){
        const {name,type} = target
        let {value} = target
        if(type === 'number') value = +value

        setFilterBy(prev=>({...prev , [name]: value}))
    }

    function onSubmitFilter(ev){
        ev.preventDefault()
        onSetFilter(filterBy)
    }
  
    return (
        <section className="bug-filter">
            <h2>Bug Filter</h2>
            <form onSubmit={onSubmitFilter}>

            <label htmlFor="title">Title</label>
            <input onChange={handleChange} type="text" name="title" id="title"/>
            
            <label htmlFor="severity">Severity</label>
            <input onChange={handleChange} type="number" name="severity" id="severity"/>
                <button>Filter</button>
            </form>
        </section>
    )
}