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
                <li className={classes.navigationitem} onClick={() => handleSignOut(client, history)}>Log Out</li>
            )
        }}
    </ApolloConsumer>
)

export default withRouter(Signout)