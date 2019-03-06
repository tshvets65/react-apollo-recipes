import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { ADD_RECIPE, GET_ALL_RECIPES } from '../../queries'
import Error from '../Error'
import withAuth from '../withAuth'

const initialState = {
    name: '',
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
        addRecipe().then(async ({ data }) => {
            // console.log(data)
            this.clearState()
            this.props.history.push('/')
        })
    }

    validateForm = () => {
        let formIsValid = true
        const { name, category, description, instructions } = this.state
        formIsValid = formIsValid && name.trim() !== ''
        formIsValid = formIsValid && category !== ''
        formIsValid = formIsValid && description.trim() !== ''
        formIsValid = formIsValid && instructions.trim() !== ''
        this.setState({ formIsValid })
    }

    updateCache = (cache, { data: { addRecipe } }) => {
        const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })
        console.log(addRecipe)
        console.log(getAllRecipes)
        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
                getAllRecipes: [addRecipe, ...getAllRecipes]
            }
        })
    }

    render() {
        const { name, category, description, instructions, author, formIsValid } = this.state

        return (
            <div className='App'>
                <h2>Add Recipe</h2>
                <Mutation mutation={ADD_RECIPE}
                    variables={{ name, category, description, instructions, author }}
                    update={this.updateCache}
                >
                    {(addRecipe, { data, loading, error }) => {
                        return (
                            <form className='form' onSubmit={event => this.handleSubmit(event, addRecipe)}>
                                <input type="text" name='name' placeholder='Recipe name' value={name} onChange={this.handleChange} />
                                <select name='category' calue={category} onChange={this.handleChange}>
                                    <option value="">Select</option>
                                    <option value="main">Main Dishes</option>
                                    <option value="side">Side Dishes</option>
                                    <option value="breakfasts">Breakfasts</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="snacks">Snacks</option>
                                </select>
                                <input type="text" name='description' placeholder='Add description' value={description} onChange={this.handleChange} />
                                <textarea name="instructions" placeholder="Add instructions" value={instructions} onChange={this.handleChange}></textarea>
                                <button type='submit' disabled={loading || !formIsValid} className={loading || !formIsValid ? 'button-secondary' : 'button-primary'}>Submit</button>
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
