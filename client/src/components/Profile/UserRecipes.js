import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import CKEditor from 'react-ckeditor-component'
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER, UPDATE_USER_RECIPE } from '../../queries'
import Error from '../Error'
import Spinner from '../Spinner'

const initialState = {
    _id: '',
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    instructions: '',
    formIsValid: true,
    modal: false
}

class UserRecipes extends Component {
    state = { ...initialState }

    clearState = () => {
        this.setState({ ...initialState })
    }

    handleDelete = deleteUserRecipe => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?')
        if (confirmDelete) {
            deleteUserRecipe()
            //.then(({ data }) => console.log(data))
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value }, () => this.validateForm())
    }

    validateForm = () => {
        let formIsValid = true
        const { name, imageUrl, category, description, instructions } = this.state
        formIsValid = formIsValid && name.trim() !== ''
        formIsValid = formIsValid && imageUrl.trim() !== ''
        formIsValid = formIsValid && category !== ''
        formIsValid = formIsValid && description.trim() !== ''
        formIsValid = formIsValid && instructions.trim() !== ''
        this.setState({ formIsValid })
    }

    closeModal = () => this.setState({ modal: false })

    loadRecipe = recipe => {
        this.setState({ ...recipe, modal: true })
    }

    handleSubmit = (event, updateUserRecipe) => {
        event.preventDefault()
        updateUserRecipe().then(({ data }) => {
            this.clearState()
            this.closeModal()
        }).catch(err => console.error(err))
    }

    handleEditorChange = event => {
        const newContent = event.editor.getData()
        this.setState({ instructions: newContent })
    }

    render() {
        const { user } = this.props
        const { modal } = this.state
        return (
            <Query query={GET_USER_RECIPES} variables={{ user }}>
                {({ data, loading, error }) => {
                    if (loading) return <Spinner />
                    if (error) return <Error error={error} />
                    return (
                        <div className='App'>
                            <h3>Your Recipes</h3>
                            {!data.getUserRecipes.length && <p>You have not added any recipes yet.</p>}
                            {modal && (
                                <EditRecipeModal
                                    handleSubmit={this.handleSubmit}
                                    closeModal={this.closeModal}
                                    handleChange={this.handleChange}
                                    handleEditorChange={this.handleEditorChange}
                                    {...this.state}
                                />
                            )}
                            <ul>
                                {data.getUserRecipes.map(recipe => (
                                    <li key={recipe._id}>
                                        <Link to={`/recipe/${recipe._id}`}>
                                            <h4>{recipe.name}</h4>
                                        </Link>
                                        <p style={{ marginBottom: 0 }}>{recipe.likes} <span role='img' aria-label='heart'>❤️</span></p>
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
                                                <div>
                                                    <button className='button-primary' onClick={() => this.loadRecipe(recipe)}>Update</button>
                                                    <button onClick={() => this.handleDelete(deleteUserRecipe)} className='delete-button'>
                                                        {attrs.loading ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </div>

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
    }
}

const EditRecipeModal = ({ closeModal, handleChange, handleEditorChange, handleSubmit, _id, name, imageUrl, category, description, instructions, formIsValid }) => (
    <Mutation mutation={UPDATE_USER_RECIPE} variables={{ _id, name, imageUrl, category, description, instructions }}>
        {(updateUserRecipe, { data, loading, error }) => {
            if (error) return <Error error={error} />
            return (
                <div className="modal modal-open">
                    <div className="modal-inner">
                        <div className="modal-content">
                            <form onSubmit={event => handleSubmit(event, updateUserRecipe)} className="modal-content-inner">
                                <h4>Edit Recipe</h4>
                                <label htmlFor="name">Recipe Name</label>
                                <input type="text" name='name' value={name} onChange={handleChange} />
                                <label htmlFor="imageUrl">Image URL</label>
                                <input type="text" name='imageUrl' value={imageUrl} onChange={handleChange} />
                                <label htmlFor="category">Category</label>
                                <select name='category' value={category} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="main">Main Dishes</option>
                                    <option value="side">Side Dishes</option>
                                    <option value="breakfasts">Breakfasts</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="snacks">Snacks</option>
                                </select>
                                <label htmlFor="description">Description</label>
                                <input type="text" name='description' value={description} onChange={handleChange} />
                                <label htmlFor="instructions">Instructions</label>
                                <CKEditor name="instructions" content={instructions} events={{ change: handleEditorChange }} />

                                {/* <textarea name="instructions" cols="30" rows="10" value={instructions} onChange={handleChange} ></textarea> */}
                                <div className="modal-buttons">
                                    <button onClick={closeModal}>Cancel</button>
                                    <button disabled={loading || !formIsValid} className={loading || !formIsValid ? '' : 'button-primary'}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }}
    </Mutation>

)

export default UserRecipes