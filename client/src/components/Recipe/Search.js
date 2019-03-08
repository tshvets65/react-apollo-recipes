import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { SEARCH_RECIPES } from '../../queries'
import RecipeItem from './RecipeItem'

class Search extends Component {
    state = {
        data: null
    }

    handleChange = async (event, client) => {
        event.persist()
        const { data } = await client.query({
            query: SEARCH_RECIPES,
            variables: { searchTerm: event.target.value }
        })
        this.setState({ data })
    }

    render() {
        return (
            <ApolloConsumer>
                {client => {
                    const { data } = this.state
                    return (
                        <div className='App'>
                            <input type="search" name='searchTerm' className='search' placeholder='Search Recipes' onChange={event => this.handleChange(event, client)} />
                            <ul>
                                {data && data.searchRecipes && data.searchRecipes.map(recipe => (
                                    <RecipeItem key={recipe._id} {...recipe} />
                                ))}
                            </ul>
                        </div>
                    )
                }}
            </ApolloConsumer>
        )
    }
}

export default Search