const { gql } = require('apollo-server-express')

module.exports = gql`
    
    type Recipe {
        _id: ID
        name: String!
        category: String!
        description: String!
        instructions: String!
        createdAt: String
        likes: Int
        author: User
    }

    type User {
        _id: ID
        username: String!
        password: String! 
        email: String!
        createdAt: String
        favorites: [Recipe]
    }

    type Token {
        token: String!
    }

    input SignupUserInput {
        username: String!
        password: String! 
        email: String!
    }

    input RecipeInput {
        name: String!
        category: String!
        description: String!
        instructions: String! 
    }

    type Query {
        getAllRecipes: [Recipe]
    }

    type Mutation {
        addRecipe(input: RecipeInput!): Recipe
        signupUser(input: SignupUserInput!): Token
    }
`