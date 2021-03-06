const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const path = require('path')
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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(--__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})