import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import CKEditor from 'react-ckeditor-component'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER, UPDATE_USER_RECIPE } from '../../../queries'
import Error from '../../Error'
import Spinner from '../../Spinner'
import classes from './UserRecipes.module.css'

const initialState = {
    _id: '',
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    ingredients: '',
    instructions: '',
    author: '',
    formIsValid: false,
    image: null,
    preview: null,
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

    handleImageUpload = async () => {
        try {
            const data = new FormData()
            data.append('file', this.state.image)
            data.append('cloud_name', 'tshvets')
            data.append('upload_preset', 'recipes')
            const response = await axios.post(`https://api.cloudinary.com/v1_1/tshvets/image/upload`, data)
            return response.data.url
        } catch (err) {
            console.error('Error uploading image', err)
        }
    }

    validateForm = () => {
        let formIsValid = true
        const { name, category, description, ingredients, instructions } = this.state
        formIsValid = formIsValid && name.trim() !== ''
        formIsValid = formIsValid && category !== ''
        formIsValid = formIsValid && description.trim() !== ''
        formIsValid = formIsValid && ingredients.trim() !== ''
        formIsValid = formIsValid && instructions.trim() !== ''
        this.setState({ formIsValid })
    }

    closeModal = () => this.setState({ modal: false })

    loadRecipe = recipe => {
        this.setState({ ...recipe, modal: true, preview: recipe.imageUrl })
    }

    handleSubmit = async (event, updateUserRecipe) => {
        try {
            event.preventDefault()
            if (this.state.image) {
                const imageUrl = await this.handleImageUpload()
                this.setState({ imageUrl })
            }
            await updateUserRecipe()
            this.clearState()
            this.closeModal()
        } catch (err) {
            console.error('Error submitting form', err)
        }
    }

    handleDrop = (acceptedFiles) => {
        this.setState({ image: acceptedFiles[0], preview: URL.createObjectURL(acceptedFiles[0]) })
    }

    handleEditorChange = (event, name) => {
        const newContent = event.editor.getData()
        this.setState({ [name]: newContent }, () => this.validateForm())
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
                                    handleDrop={this.handleDrop}
                                    {...this.state}
                                />
                            )}
                            <ul className={classes.recipes}>
                                {data.getUserRecipes.map(recipe => (
                                    <li key={recipe._id}>
                                        <Link to={`/recipe/${recipe._id}`}>
                                            {recipe.name}
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
                                                    <span className={classes.icon} onClick={() => this.loadRecipe(recipe)}><img src='https:icon.now.sh/edit/24/1EAEDB' alt='edit icon' /></span>
                                                    <span className={classes.icon} onClick={() => this.handleDelete(deleteUserRecipe)}>
                                                        {attrs.loading ? 'Deleting...' : <img src='https:icon.now.sh/delete/24/FF0000' alt='delete icon' />}
                                                    </span>
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

const EditRecipeModal = ({ closeModal, handleChange, handleEditorChange, handleDrop, handleSubmit, _id, name, imageUrl, preview, category, description, ingredients, instructions, formIsValid }) => (
    <Mutation mutation={UPDATE_USER_RECIPE} variables={{ _id, name, imageUrl, category, description, ingredients, instructions }}>
        {(updateUserRecipe, { data, loading, error }) => {
            if (error) return <Error error={error} />
            const maxSize = 1048576
            return (
                <div className={classes.modal}>
                    <div className={classes.modal_inner}>
                        <div className={classes.modal_content}>
                            <form onSubmit={event => handleSubmit(event, updateUserRecipe)} className={classes.modal_content_inner}>
                                <h4>Edit Recipe</h4>
                                <label htmlFor="name">Recipe Name</label>
                                <input type="text" name='name' value={name} onChange={handleChange} />
                                {/* <label htmlFor="imageUrl">Image URL</label>
                                <input type="text" name='imageUrl' value={imageUrl} onChange={handleChange} /> */}
                                <label htmlFor="image">Recipe Image</label>
                                <div className={classes.dropzone}>
                                    {preview && <img src={preview} alt="preview" />}

                                    <Dropzone
                                        onDrop={handleDrop}
                                        accept="image/*"
                                        multiple={false}
                                        maxSize={maxSize}
                                    >
                                        {({ getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles }) => {
                                            const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
                                            return (
                                                <div {...getRootProps()} className={classes.dropzone_box}>
                                                    <input {...getInputProps()} />
                                                    {!isDragActive && 'Click here or drop a file to upload!'}
                                                    {isDragActive && !isDragReject && "Drop it like it's hot!"}
                                                    {isDragReject && "File type not accepted, sorry!"}
                                                    {isFileTooLarge && "File is too large."}
                                                </div>
                                            )
                                        }
                                        }
                                    </Dropzone>
                                </div>
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
                                <label htmlFor="ingredients">Ingredients</label>
                                <CKEditor
                                    name="ingredients"
                                    id="ingredients"
                                    content={ingredients}
                                    events={{ change: event => handleEditorChange(event, 'ingredients') }}
                                />
                                <label htmlFor="instructions">Instructions</label>
                                <CKEditor
                                    name="instructions"
                                    id="instructions"
                                    content={instructions}
                                    events={{ change: event => handleEditorChange(event, 'instructions') }}
                                />
                                <div className={classes.modal_buttons}>
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