import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { SIGNUP_USER } from '../../queries'
import Error from '../Error'
import classes from './Signin.module.css'

const initialState = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    formIsValid: false,
}

class Signup extends Component {
    state = { ...initialState }

    clearState = () => {
        this.setState({ ...initialState })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value }, () => this.validateForm())
    }

    handleSubmit = (event, signupUser) => {
        event.preventDefault()
        signupUser().then(async ({ data }) => {
            localStorage.setItem('token', data.signupUser.token)
            await this.props.refetch()
            this.clearState()
            this.props.history.push('/')
        })
    }

    validateForm = () => {
        let formIsValid = true
        const { username, email, password, passwordConfirmation } = this.state
        formIsValid = formIsValid && username.trim() !== ''
        formIsValid = formIsValid && email.trim() !== ''
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        formIsValid = formIsValid && pattern.test(email)
        formIsValid = formIsValid && password.trim() !== ''
        formIsValid = formIsValid && passwordConfirmation === password
        this.setState({ formIsValid })
    }

    render() {
        const { username, email, password, passwordConfirmation, formIsValid } = this.state
        return (
            <div className={classes.centered}>
                <h2>Create your account</h2>
                <p>Existing user? <Link to='/signin'>Log in</Link></p>
                <Mutation mutation={SIGNUP_USER} variables={{ username, email, password }}>
                    {(signupUser, { data, loading, error }) => {
                        return (
                            <form className={classes.login_form} onSubmit={event => this.handleSubmit(event, signupUser)}>
                                <input type="text" name='username' placeholder='Username' value={username} onChange={this.handleChange} />
                                <input type="email" name='email' placeholder='Email' value={email} onChange={this.handleChange} />
                                <input type="password" name='password' placeholder='Password' value={password} onChange={this.handleChange} />
                                <input type="password" name='passwordConfirmation' placeholder='Confirm password' value={passwordConfirmation} onChange={this.handleChange} />
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

export default Signup