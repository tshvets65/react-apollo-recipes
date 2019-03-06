import { gql } from 'apollo-boost'

export const GET_ALL_RECIPES = gql`
    query {
        getAllRecipes {
          _id  
          name
          category
        }
    }
`

export const GET_RECIPE = gql`
query($id: ID!) {
  getRecipe(_id: $id) {
    _id
    name
    category
    description
    instructions
    likes
    createdAt
    likes
    author {
      username
    }
  }
}
`

export const ADD_RECIPE = gql`
  mutation($name: String!, $category: String!, $description: String!, $instructions: String!, $author: ID! ) {
    addRecipe(input: {
      name: $name, 
      category: $category,
      description: $description,
      instructions: $instructions,
      author: $author
    }) {
      _id
        name
        category
    }
  }
`

export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
          _id  
          username
          createdAt
          email
        }
    }
`

export const SIGNUP_USER = gql`
mutation($username: String!, $email: String!, $password: String!) {
    signupUser(input: {
      username: $username,
      email: $email,
      password: $password
    }) {
      token
    }
}
`

export const SIGNIN_USER = gql`
mutation($username: String!, $password: String!) {
    signinUser(input: {
      username: $username,
      password: $password
    }) {
      token
    }
  }
`