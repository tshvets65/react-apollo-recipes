import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { SIGNIN_USER } from '../../queries'
import Error from '../Error'

const initialState = {
    username: '',
    password: '',
    formIsValid: false
}

class Signin extends Component {
    state = { ...initialState }

    clearState = () => {
        this.setState({ ...initialState })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value }, () => this.validateForm())
    }

    handleSubmit = (event, signinUser) => {
        event.preventDefault()
        signinUser().then(async ({ data }) => {
            localStorage.setItem('token', data.signinUser.token)
            await this.props.refetch()
            this.clearState()
            this.props.history.push('/')
        })
    }

    validateForm = () => {
        let formIsValid = true
        const { username, password } = this.state
        formIsValid = formIsValid && username.trim() !== ''
        formIsValid = formIsValid && password.trim() !== ''
        this.setState({ formIsValid })
    }

    render() {
        const { username, password, formIsValid } = this.state
        return (
            <div className='App'>
                <h2>Signin</h2>
                <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
                    {(signinUser, { data, loading, error }) => {
                        return (
                            <form className='form' onSubmit={event => this.handleSubmit(event, signinUser)}>
                                <input type="text" name='username' placeholder='Username' value={username} onChange={this.handleChange} />
                                <input type="password" name='password' placeholder='Password' value={password} onChange={this.handleChange} />
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

export default withRouter(Signin)