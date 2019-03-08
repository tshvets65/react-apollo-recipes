import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries'
import Error from '../Error'
import Spinner from '../Spinner'

const handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?')
    if (confirmDelete) {
        deleteUserRecipe()
        //.then(({ data }) => console.log(data))
    }
}

const UserRecipes = ({ user }) => (
    <Query query={GET_USER_RECIPES} variables={{ user }}>
        {({ data, loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <Error error={error} />
            return (
                <div className='App'>
                    <h3>Your Recipes</h3>
                    {!data.getUserRecipes.length && <p>You have not added any recipes yet.</p>}
                    <ul>
                        {data.getUserRecipes.map(recipe => (
                            <li key={recipe._id}>
                                <Link to={`/recipe/${recipe._id}`}>
                                    <h4>{recipe.name}</h4>
                                </Link>
                                <p style={{ marginBottom: 0 }}>{recipe.likes} likes</p>
                                <Mutation
                                    mutation={DELETE_USER_RECIPE}
                                    variables={{ id: recipe._id }}
                                    refetchQueries={() => [
                                        { query: GET_ALL_RECIPES },
                                        { query: GET_CURRENT_USER }
                                    ]}
                                    update={(cache, { data: { deleteUserRecipe } }) => {
                                        const { getUserRecipes } = cache.readQuery({
                                            query: GET_USER_RECIPES,
                                            variables: { user }
                                        })
                                        cache.writeQuery({
                                            query: GET_USER_RECIPES,
                                            variables: { user },
                                            data: {
                                                getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
                                            }
                                        })
                                    }
                                    }
                                >
                                    {(deleteUserRecipe, attrs = {}) => (
                                        <p onClick={() => handleDelete(deleteUserRecipe)} className='delete-button'>
                                            {attrs.loding ? 'Deleting...' : 'X'}
                                        </p>
                                    )}
                                </Mutation>
                            </li>

                        ))}
                    </ul>

                </div>
            )
        }}
    </Query>
)

export default UserRecipes