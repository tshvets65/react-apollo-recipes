import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'

const handleSignOut = (client, history) => {
    localStorage.removeItem('token')
    client.resetStore()
    history.push('/')
}
const Signout = ({ history }) => (
    <ApolloConsumer>
        {client => {
            return (
                <button onClick={() => handleSignOut(client, history)}>Signout</button>
            )
        }}
    </ApolloConsumer>
)

export default withRouter(Signout)