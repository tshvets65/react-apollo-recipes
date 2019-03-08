import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries'
import Error from '../Error'
import withAuth from '../withAuth'

const initialState = {
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    instructions: '',
    author: '',
    formIsValid: false
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

    handleSubmit = (event, addRecipe) => {
        event.preventDefault()
        addRecipe().then(({ data }) => {
            this.clearState()
            this.props.history.push('/')
        })
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

    updateCache = (cache, { data: { addRecipe } }) => {
        const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })
        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
                getAllRecipes: [addRecipe, ...getAllRecipes]
            }
        })
    }

    handleEditorChange = event => {
        const newContent = event.editor.getData()
        this.setState({ instructions: newContent })
    }

    render() {
        const { name, imageUrl, category, description, instructions, author, formIsValid } = this.state

        return (
            <div className='App'>
                <h2>Add Recipe</h2>
                <Mutation
                    mutation={ADD_RECIPE}
                    variables={{ name, imageUrl, category, description, instructions, author }}
                    refetchQueries={() => [
                        { query: GET_USER_RECIPES, variables: { user: author } }
                    ]}
                    update={this.updateCache}
                >
                    {(addRecipe, { data, loading, error }) => {
                        return (
                            <form className='form' onSubmit={event => this.handleSubmit(event, addRecipe)}>
                                <input type="text" name='name' placeholder='Recipe name' value={name} onChange={this.handleChange} />
                                <input type="text" name='imageUrl' placeholder='Recipe Image' value={imageUrl} onChange={this.handleChange} />
                                <select name='category' value={category} onChange={this.handleChange}>
                                    <option value="">Select</option>
                                    <option value="main">Main Dishes</option>
                                    <option value="side">Side Dishes</option>
                                    <option value="breakfasts">Breakfasts</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="snacks">Snacks</option>
                                </select>
                                <input type="text" name='description' placeholder='Add description' value={description} onChange={this.handleChange} />
                                <label htmlFor="instructions">Add Instructions</label>
                                <CKEditor name="instructions" content={instructions} events={{ change: this.handleEditorChange }} />
                                {/* <textarea name="instructions" placeholder="Add instructions" value={instructions} onChange={this.handleChange}></textarea> */}
                                <div style={{ marginTop: '20px' }}>
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
