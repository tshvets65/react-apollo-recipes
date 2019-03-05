import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import './index.css';
import App from './components/App';

const client = new ApolloClient({
    uri: process.env.REACT_APP_APOLLO_URI
});

ReactDOM.render(

    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>

    , document.getElementById('root'));

