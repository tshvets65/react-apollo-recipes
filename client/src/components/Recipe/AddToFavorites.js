import React, { useContext, useState, useEffect } from 'react'
import { Mutation } from 'react-apollo'
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES, GET_RECIPE } from '../../queries'
import AuthContext from '../../context/auth-context'

const AddToFavorites = ({ recipeId }) => {
    const [isFavorite, setIsFavorite] = useState(false)
    const [userId, setUserId] = useState(null)

    const { refetch, session } = useContext(AuthContext)

    useEffect(() => {
        if (session.getCurrentUser) {
            setUserId(session.getCurrentUser._id)
            const favorites = session.getCurrentUser.favorites
            const prevFav = favorites.findIndex(favorite => favorite._id === recipeId) > -1
            setIsFavorite(prevFav)
        }
    }, [])



    const handleFavorites = (addRecipeToFavorites, removeRecipeFromFavorites) => {
        if (isFavorite) {
            removeRecipeFromFavorites().then(async ({ data }) => {
                await refetch()
            })
        } else {
            addRecipeToFavorites().then(async ({ data }) => {
                await refetch()
            })
        }
    }

    const handleClick = (addRecipeToFavorites, removeRecipeFromFavorites) => {
        handleFavorites(addRecipeToFavorites, removeRecipeFromFavorites)
        setIsFavorite(isFav => !isFav)
    }

    const updateAddFavorite = (cache, { data: { addRecipeToFavorites } }) => {
        const { getRecipe } = cache.readQuery({ query: GET_RECIPE, variables: { id: recipeId } })
        cache.writeQuery({
            query: GET_RECIPE,
            variables: { id: recipeId },
            data: {
                getRecipe: { ...getRecipe, likes: addRecipeToFavorites.likes + 1 }
            }
        })
    }

    const updateRemoveFavorite = (cache, { data: { removeRecipeFromFavorites } }) => {
        const { getRecipe } = cache.readQuery({ query: GET_RECIPE, variables: { id: recipeId } })
        cache.writeQuery({
            query: GET_RECIPE,
            variables: { id: recipeId },
            data: {
                getRecipe: { ...getRecipe, likes: removeRecipeFromFavorites.likes - 1 }
            }
        })
    }


    return (
        <Mutation
            mutation={REMOVE_FROM_FAVORITES}
            variables={{ recipeId, userId }}
            update={updateRemoveFavorite}
        >
            {removeRecipeFromFavorites => (
                <Mutation
                    mutation={ADD_TO_FAVORITES}
                    variables={{ recipeId, userId }}
                    update={updateAddFavorite}
                >
                    {
                        addRecipeToFavorites => (
                            userId ? (
                                <div
                                    onClick={() => handleClick(addRecipeToFavorites, removeRecipeFromFavorites)}
                                    title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                >
                                    <img src={`https:icon.now.sh/${isFavorite ? 'favorite/30/FF0000' : 'favorite_border/30/CCCCCC'}`} alt='favorite icon' />
                                </div>
                            )
                                : null
                        )
                    }
                </Mutation>
            )}
        </Mutation>
    )
}

export default AddToFavorites
