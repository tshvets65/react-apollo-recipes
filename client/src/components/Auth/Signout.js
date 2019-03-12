import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import classes from './Signout.module.css'

const handleSignOut = (client, history) => {
    localStorage.removeItem('token')
    client.resetStore()
    history.push('/')
}
const Signout = ({ history }) => (
    <ApolloConsumer>
        {client => {
            return (
                <div className={classes.signout} onClick={() => handleSignOut(client, history)}>Log Out</div>
            )
        }}
    </ApolloConsumer>
)

export default withRouter(Signout)