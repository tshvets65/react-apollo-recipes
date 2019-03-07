import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES, GET_RECIPE } from '../../queries'
import withSession from '../withSession'

class AddToFavorites extends Component {
    state = {
        userId: null,
        isFavorite: false
    }

    componentDidMount() {
        if (this.props.session.getCurrentUser) {
            const { _id, favorites } = this.props.session.getCurrentUser
            const prevFav = favorites.findIndex(favorite => favorite._id === this.props.recipeId) > -1
            this.setState({ userId: _id, isFavorite: prevFav })
        }
    }

    handleFavorites = (addRecipeToFavorites, removeRecipeFromFavorites) => {
        if (this.state.isFavorite) {
            addRecipeToFavorites().then(async ({ data }) => {
                await this.props.refetch()
            })
        } else {
            removeRecipeFromFavorites().then(async ({ data }) => {
                await this.props.refetch()
            })
        }
    }

    handleClick = (addRecipeToFavorites, removeRecipeFromFavorites) => {
        this.setState(prevState => ({
            isFavorite: !prevState.isFavorite
        }), () => this.handleFavorites(addRecipeToFavorites, removeRecipeFromFavorites))
    }

    updateAddFavorite = (cache, { data: { addRecipeToFavorites } }) => {
        const { recipeId } = this.props
        const { getRecipe } = cache.readQuery({ query: GET_RECIPE, variables: { id: recipeId } })
        cache.writeQuery({
            query: GET_RECIPE,
            variables: { id: recipeId },
            data: {
                getRecipe: { ...getRecipe, likes: addRecipeToFavorites.likes + 1 }
            }
        })
    }

    updateRemoveFavorite = (cache, { data: { removeRecipeFromFavorites } }) => {
        const { recipeId } = this.props
        const { getRecipe } = cache.readQuery({ query: GET_RECIPE, variables: { id: recipeId } })
        cache.writeQuery({
            query: GET_RECIPE,
            variables: { id: recipeId },
            data: {
                getRecipe: { ...getRecipe, likes: removeRecipeFromFavorites.likes - 1 }
            }
        })
    }

    render() {
        const { userId, isFavorite } = this.state
        const { recipeId } = this.props
        return (
            <Mutation
                mutation={REMOVE_FROM_FAVORITES}
                variables={{ recipeId, userId }}
                update={this.updateRemoveFavorite}
            >
                {removeRecipeFromFavorites => (
                    <Mutation
                        mutation={ADD_TO_FAVORITES}
                        variables={{ recipeId, userId }}
                        update={this.updateAddFavorite}
                    >
                        {
                            addRecipeToFavorites => (
                                userId ? <button onClick={() => this.handleClick(addRecipeToFavorites, removeRecipeFromFavorites)}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button> : null
                            )
                        }
                    </Mutation>
                )}

            </Mutation>

        )
    }
}

export default withSession(AddToFavorites)
