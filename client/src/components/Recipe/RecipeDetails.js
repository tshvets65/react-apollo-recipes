import React from 'react'
import { Query } from 'react-apollo'
import moment from 'moment'
import { GET_RECIPE } from '../../queries'
import { categories } from './categories'

const RecipeDetails = ({ match }) => {
    const id = match.params.id
    return (
        <Query query={GET_RECIPE} variables={{ id }}>
            {({ data, loading, error }) => {
                if (loading) return <div>Loading...</div>
                if (error) return <div>Error</div>
                const { name, category, description, instructions, likes, createdAt, author } = data.getRecipe
                return (
                    <div className='App'>
                        <h4>{name}</h4>
                        <p>Category: {categories[category]}</p>
                        <p>Description: {description}</p>
                        <p>Instructions: {instructions}</p>
                        <p>Likes: {likes}</p>
                        <p>Autor: {author.username}</p>
                        <p>Created {moment(new Date(Number(createdAt))).format('MMMM Do YYYY')}</p>
                        <button>Like</button>
                    </div>

                )
            }}
        </Query>
    )
}

export default RecipeDetails