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
                const { _id, name, imageUrl, ingredients, instructions, createdAt, author, likes } = data.getRecipe
                return (
                    <div className={classes.content}>
                        <div className={classes.recipe_header}>
                            <div className={classes.recipe_subheader}>
                                <h1>{name}</h1>
                                <p className={classes.likes}>
                                    Created by&nbsp;<strong>{author.username}&nbsp;</strong> • {moment(new Date(Number(createdAt))).format('MMMM Do YYYY')} • {likes}
                                    <img src='https://icon.now.sh/favorite/20/FF0000' alt='favorite icon' />
                                </p>
                            </div>
                            <div className={classes.icon}>
                                <AddToFavorites recipeId={_id} />
                            </div>
                            <div className={classes.icon} onClick={handlePrint} title='Print Recipe'>
                                <img src='https://icon.now.sh/print/30/1EAEDB' alt='print icon' />
                            </div>
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

                    </div>
                )
            }}
        </Query>
    )
}

export default RecipeDetails