import React from 'react'
import { Query } from 'react-apollo'
import moment from 'moment'
import { GET_RECIPE } from '../../queries'
import { categories } from './categories'
import AddToFavorites from './AddToFavorites'
import Error from '../Error'
import Spinner from '../Spinner'

const RecipeDetails = ({ match }) => {
    const id = match.params.id
    return (
        <Query query={GET_RECIPE} variables={{ id }}>
            {({ data, loading, error }) => {
                if (loading) return <Spinner />
                if (error) return <Error error={error} />
                const { _id, name, imageUrl, category, description, ingredients, instructions, likes, createdAt, author } = data.getRecipe
                return (
                    <div className='App'>
                        <div className="recipe-image" style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}></div>
                        <div className="recipe">
                            <div className="recipe-header">
                                <h2 className='recipe-name'>{name}</h2>
                                <h5>{categories[category]}</h5>
                                <p>Created by <strong>{author.username}</strong> on {moment(new Date(Number(createdAt))).format('MMMM Do YYYY')}</p>
                                <p>{likes} <span role='img' aria-label='heart'>❤️</span></p>
                            </div>
                            <blockquote className="recipe-description">{description}</blockquote>
                            <h3 className="recipe-instructions__title">Ingredients</h3>
                            <div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: ingredients }}></div>
                            <h3 className="recipe-instructions__title">Instructions</h3>
                            <div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: instructions }}></div>
                        </div>
                        <AddToFavorites recipeId={_id} />

                    </div>
                )
            }}
        </Query>
    )
}

export default RecipeDetails