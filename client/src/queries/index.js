import { gql } from 'apollo-boost'

export const GET_ALL_RECIPES = gql`
    query {
        getAllRecipes {
            name
            description
            instructions
            category
            likes
        }
    }
`

export const GET_CURRENT_USER = gql`
    query {
        getCurrentUser {
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