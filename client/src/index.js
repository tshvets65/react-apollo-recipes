import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './index.css';
import App from './components/App';
import Signin from './components/Auth/Signin'
import Signup from './components/Auth/Signup'
import Search from './components/Recipe/Search'
import AddRecipe from './components/Recipe/AddRecipe'
import RecipeDetails from './components/Recipe/RecipeDetails'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
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

const Root = ({ refetch, session }) => (
    <BrowserRouter>
        <>
            <Navbar session={session} />
            <Switch>
                <Route path='/' exact component={App} />
                <Route path='/search' component={Search} />
                <Route path='/recipe/add' render={props => <AddRecipe {...props} session={session} />} />
                <Route path='/recipe/:id' component={RecipeDetails} />
                <Route path='/profile' component={Profile} />
                <Route path='/signin' render={props => <Signin {...props} refetch={refetch} />} />
                <Route path='/signup' render={props => <Signup {...props} refetch={refetch} />} />
                <Redirect to='/' />
            </Switch>
        </>
    </BrowserRouter>
)

const RootWithSession = withSession(Root)

ReactDOM.render(

    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>

    , document.getElementById('root'));

