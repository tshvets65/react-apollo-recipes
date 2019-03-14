import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../../queries'
import Error from '../../Error'
import withAuth from '../../../hoc/withAuth'
import classes from './AddRecipe.module.css'

const initialState = {
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    ingredients: '',
    instructions: '',
    author: '',
    formIsValid: false,
    image: null,
    preview: null
}

class AddRecipe extends Component {
    state = { ...initialState }

    componentDidMount() {
        if (this.props.session.getCurrentUser) {
            this.setState({ author: this.props.session.getCurrentUser._id })
        }
    }

    clearState = () => {
        this.setState({ ...initialState })
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

    handleSubmit = async (event, addRecipe) => {
        try {
            event.preventDefault()
            const imageUrl = await this.handleImageUpload()
            this.setState({ imageUrl })
            await addRecipe()
            this.clearState()
            this.props.history.push('/')
        } catch (err) {
            console.error('Error submitting form', err)
        }
    }

    validateForm = () => {
        let formIsValid = true
        const { name, image, category, description, ingredients, instructions } = this.state
        formIsValid = formIsValid && name.trim() !== ''
        formIsValid = formIsValid && image
        formIsValid = formIsValid && category !== ''
        formIsValid = formIsValid && description.trim() !== ''
        formIsValid = formIsValid && ingredients.trim() !== ''
        formIsValid = formIsValid && instructions.trim() !== ''
        this.setState({ formIsValid })
    }

    updateCache = (cache, { data: { addRecipe } }) => {
        const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })
        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
                getAllRecipes: [addRecipe, ...getAllRecipes]
            }
        })
    }

    handleEditorChange = (event, name) => {
        const newContent = event.editor.getData()
        this.setState({ [name]: newContent }, () => this.validateForm())
    }

    handleDrop = (acceptedFiles) => {
        this.setState({ image: acceptedFiles[0], preview: URL.createObjectURL(acceptedFiles[0]) })
    }

    render() {
        const { name, imageUrl, category, description, ingredients, instructions, author, formIsValid, preview } = this.state
        const maxSize = 1048576
        return (
            <div className={classes.centered}>
                <h2>Add Recipe</h2>
                <Mutation
                    mutation={ADD_RECIPE}
                    variables={{ name, imageUrl, category, description, ingredients, instructions, author }}
                    refetchQueries={() => [
                        { query: GET_USER_RECIPES, variables: { user: author } }
                    ]}
                    update={this.updateCache}
                >
                    {(addRecipe, { data, loading, error }) => {
                        return (
                            <form className={classes.addrecipe_form} onSubmit={event => this.handleSubmit(event, addRecipe)}>
                                <label htmlFor="name">Add Recipe Name</label>
                                <input type="text" name='name' placeholder='Recipe name' value={name} onChange={this.handleChange} />
                                {/* <input type="text" name='imageUrl' placeholder='Recipe Image URL' value={imageUrl} onChange={this.handleChange} /> */}
                                <label htmlFor="image">Upload Recipe Image</label>
                                <div className={classes.dropzone}>
                                    {preview && <img src={preview} alt="preview" />}

                                    <Dropzone
                                        onDrop={this.handleDrop}
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
                                <label htmlFor="category">Add Recipe Category</label>
                                <select name='category' value={category} onChange={this.handleChange}>
                                    <option value="">Select Category</option>
                                    <option value="main">Main Dishes</option>
                                    <option value="side">Side Dishes</option>
                                    <option value="breakfasts">Breakfasts</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="snacks">Snacks</option>
                                </select>
                                <label htmlFor="description">Add Short Description</label>
                                <input type="text" name='description' placeholder='Add description' value={description} onChange={this.handleChange} />
                                <label htmlFor="ingredients">Add Ingredients</label>
                                <CKEditor
                                    name="ingredients"
                                    id="ingredients"
                                    content={ingredients}
                                    // config={{ height: '4em' }}
                                    events={{ change: event => this.handleEditorChange(event, 'ingredients') }}
                                />
                                <label htmlFor="instructions">Add Instructions</label>
                                <CKEditor
                                    name="instructions"
                                    id="instructions"
                                    content={instructions}
                                    events={{ change: event => this.handleEditorChange(event, 'instructions') }}
                                />
                                <div className={classes.buttons}>
                                    <button onClick={this.clearState}>Cancel</button>
                                    <button type='submit' disabled={loading || !formIsValid} className={loading || !formIsValid ? '' : 'button-primary'}>Submit</button>
                                </div>
                                {error && <Error error={error} />}
                            </form>
                        )
                    }}
                </Mutation>
            </div>
        )
    }
}

export default withAuth(session => session && session.getCurrentUser)(AddRecipe)
