const { gql } = require('apollo-server-express')

module.exports = gql`
    
    type Recipe {
        _id: ID
        name: String!
        imageUrl: String!
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

    input SigninUserInput {
        username: String!
        password: String! 
    }

    input RecipeInput {
        name: String!
        imageUrl: String!
        category: String!
        description: String!
        instructions: String! 
        author: ID!
    }

    input RecipeUpdateInput {
        name: String!
        imageUrl: String!
        category: String!
        description: String!
        instructions: String! 
    }

    type Query {
        getAllRecipes: [Recipe]
        getCurrentUser: User
        getRecipe(_id: ID!): Recipe
        searchRecipes(searchTerm: String): [Recipe]
        getUserRecipes(user: ID!): [Recipe]
    }

    type Mutation {
        addRecipe(input: RecipeInput!): Recipe
        deleteUserRecipe(_id: ID): Recipe
        addRecipeToFavorites(recipeId: ID!, userId: ID!): Recipe
        removeRecipeFromFavorites(recipeId: ID!, userId: ID!): Recipe
        updateUserRecipe(_id: ID, input: RecipeUpdateInput!): Recipe
        signupUser(input: SignupUserInput!): Token
        signinUser(input: SigninUserInput!): Token
    }
`