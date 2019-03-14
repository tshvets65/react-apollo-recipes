import React from 'react'
import { Query } from 'react-apollo'
import moment from 'moment'
import { GET_RECIPE } from '../../../queries'
import AddToFavorites from '../AddToFavorites'
import Error from '../../Error'
import Spinner from '../../Spinner'
import classes from './RecipeDetails.module.css'

const RecipeDetails = ({ match }) => {
    const id = match.params.id

    const handlePrint = () => window.print()

    return (
        <Query query={GET_RECIPE} variables={{ id }}>
            {({ data, loading, error }) => {
                if (loading) return <Spinner />
                if (error) return <Error error={error} />
                const { _id, name, imageUrl, ingredients, instructions, createdAt, author } = data.getRecipe
                return (
                    <div className={classes.content}>
                        <div className={classes.recipe_header}>
                            <div className={classes.recipe_subheader}>
                                <h2>{name}</h2>
                                <p>Created by <strong>{author.username}</strong> on {moment(new Date(Number(createdAt))).format('MMMM Do YYYY')}</p>
                            </div>
                            <div className={classes.icon} onClick={handlePrint}><img src='https:icon.now.sh/print/30/1EAEDB' alt='print icon' /></div>
                            <div className={classes.cardimage} style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}></div>
                        </div>
                        <div className={classes.cardbody}>
                            <div className={classes.left}>
                                <h3>Ingredients</h3>
                                <div dangerouslySetInnerHTML={{ __html: ingredients }}></div>
                            </div>
                            <div className={classes.right}>
                                <h3>Instructions</h3>
                                <div dangerouslySetInnerHTML={{ __html: instructions }}></div>
                            </div>
                        </div>
                        <div className={classes.button}>
                            <AddToFavorites recipeId={_id} />
                        </div>
                    </div>
                )
            }}
        </Query>
    )
}

export default RecipeDetails