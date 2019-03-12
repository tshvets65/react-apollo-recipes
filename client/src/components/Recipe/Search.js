import React, { useContext } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { SEARCH_RECIPES } from '../../queries'
import SearchContext from '../../context/search-context'
import Spinner from '../Spinner'
import Error from '../Error'

const Search = () => {

    const { searchTerm } = useContext(SearchContext)

    return (
        <Query query={SEARCH_RECIPES} variables={{ searchTerm }}>
            {({ data, loading, error }) => {
                if (loading) return <Spinner />
                if (error) return <Error error={error} />
                return (
                    data && data.searchRecipes && data.searchRecipes.map(recipe => (
                        <Link key={recipe._id} to={`/recipe/${recipe._id}`}>
                            <h4>{recipe.name}</h4>
                        </Link>
                    ))
                )
            }}
        </Query>
    )

}

export default Search