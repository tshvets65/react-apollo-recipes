import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import Home from './components/Home';
import Signin from './components/Auth/Signin'
import Signup from './components/Auth/Signup'
import SearchResults from './components/SearchResults'
import AddRecipe from './components/Recipe/AddRecipe'
import RecipeDetails from './components/Recipe/RecipeDetails'
import Profile from './components/Profile'
import Layout from './hoc/Layout'
import withSession from './hoc/withSession'

import './assets/skeleton.css'

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
            // if(networkError.statusCode === 401) {
            localStorage.removeItem('token')
            // }
        }
    }
});

const Root = ({ refetch, session }) => (
    <BrowserRouter>
        <Layout session={session}>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/search' component={SearchResults} />
                <Route path='/recipe/add' render={props => <AddRecipe {...props} session={session} />} />
                <Route path='/recipe/:id' component={RecipeDetails} />
                <Route path='/profile' render={props => <Profile {...props} session={session} />} />
                <Route path='/signin' render={props => <Signin {...props} refetch={refetch} />} />
                <Route path='/signup' render={props => <Signup {...props} refetch={refetch} />} />
                <Redirect to='/' />
            </Switch>
        </Layout>
    </BrowserRouter>
)

const RootWithSession = withSession(Root)

ReactDOM.render(

    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>

    , document.getElementById('root'));

