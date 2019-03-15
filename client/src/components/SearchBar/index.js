import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import SearchContext from '../../context/search-context'
import classes from './SearchBar.module.css'

const SearchBar = props => {
    const { searchTerm, setSearchTerm } = useContext(SearchContext)

    const handleSubmit = event => {
        event.preventDefault()
        if (searchTerm.trim() !== '') {
            props.history.push('/search')
        }
    }

    return (
        <form onSubmit={handleSubmit} className={classes.search_form}>
            <input
                type="search"
                name='search'
                onChange={event => setSearchTerm(event.target.value)}
                value={searchTerm}
                className={classes.search_input}
                placeholder='Search recipes'
                size={20}
                maxLength={100}
            />
            <button type='submit' className={classes.icon}><img src='https://icon.now.sh/search/30/1EAEDB' alt='search icon' /></button>
        </form>
    )
}

export default withRouter(SearchBar)