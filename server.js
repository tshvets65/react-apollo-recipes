const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const Recipe = require('./models/Recipe')
const User = require('./models/User')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log(`MongoDB connected to ${process.env.MONGO_URI}`))
    .catch(err => console.error(err))

const app = express()

const { ApolloServer } = require('apollo-server-express');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        Recipe,
        User
    }
});

server.applyMiddleware({ app })

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})