const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
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

app.use(async (req, res, next) => {
    const token = req.headers['authorization']
    if (token && token !== 'null') {
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET)
            req.currentUser = currentUser
            console.log(currentUser)
        } catch (err) {
            console.error(err)
        }
    }
    next()
})

const { ApolloServer } = require('apollo-server-express');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        Recipe,
        User,
        currentUser: req.currentUser
    })
});

server.applyMiddleware({ app })

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})