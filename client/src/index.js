import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './index.css';
import App from './components/App';
import Signin from './components/Auth/Signin'
import Signup from './components/Auth/Signup'


const client = new ApolloClient({
    uri: process.env.REACT_APP_APOLLO_URI
});

const Root = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/' exact component={App} />
            <Route path='/signin' component={Signin} />
            <Route path='/signup' component={Signup} />
            <Redirect to='/' />
        </Switch>
    </BrowserRouter>
)

export default Root

ReactDOM.render(

    <ApolloProvider client={client}>
        <Root />
    </ApolloProvider>

    , document.getElementById('root'));

