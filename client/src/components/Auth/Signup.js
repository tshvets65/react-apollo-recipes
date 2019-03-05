import React, { Component } from 'react'

class Signup extends Component {
    state = {}
    render() {
        return (
            <div className='App'>
                <h2>Signup</h2>
                <form className='form'>
                    <input type="text" name='username' placeholder='Username' />
                    <input type="email" name='email' placeholder='Email' />
                    <input type="password" name='password' placeholder='Password' />
                    <input type="password" name='passwordConfirmation' placeholder='Confirm password' />
                    <button type='submit' className='button-primary'>Submit</button>
                </form>
            </div>
        )
    }
}

export default Signup