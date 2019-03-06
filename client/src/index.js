import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './index.css';
import App from './components/App';
import Signin from './components/Auth/Signin'
import Signup from './components/Auth/Signup'
import withSession from './components/withSession'

const client = new ApolloClient({
    uri: process.env.REACT_APP_APOLLO_URI,
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token')
        operation.setContext({
            headers: {
                authorization: token
            }
        })
    },
    onError: ({ networkError }) => {
        if (networkError) {
            console.error('Network Error', networkError)
            // if(networkError.statusCode === 401) {
            //     localStorage.removeItem('token')
            // }
        }
    }
});

const Root = ({ refetch }) => (
    <BrowserRouter>
        <Switch>
            <Route path='/' exact component={App} />
            <Route path='/signin' render={() => <Signin refetch={refetch} />} />
            <Route path='/signup' render={() => <Signup refetch={refetch} />} />
            <Redirect to='/' />
        </Switch>
    </BrowserRouter>
)

const RootWithSession = withSession(Root)

ReactDOM.render(

    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>

    , document.getElementById('root'));

