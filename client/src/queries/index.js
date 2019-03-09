import { gql } from 'apollo-boost'

export const GET_ALL_RECIPES = gql`
    query {
        getAllRecipes {
          _id  
          name
          imageUrl
          category
        }
    }
`

export const GET_RECIPE = gql`
query($id: ID!) {
  getRecipe(_id: $id) {
    _id
    name
    imageUrl
    category
    description
    ingredients
    instructions
    likes
    createdAt
    author {
      username
    }
  }
}
`

export const GET_USER_RECIPES = gql`
query($user: ID!) {
  getUserRecipes(user: $user) {
    _id
    name
    imageUrl
    category
    description
    ingredients
    instructions
    likes
  }
}
`

export const ADD_RECIPE = gql`
  mutation($name: String!, $imageUrl: String!, $category: String!, $description: String!, $ingredients: String!, $instructions: String!, $author: ID! ) {
    addRecipe(input: {
      name: $name, 
      imageUrl: $imageUrl,
      category: $category,
      description: $description,
      ingredients: $ingredients,
      instructions: $instructions,
      author: $author
    }) {
      _id
      name
      category
    }
  }
`

export const DELETE_USER_RECIPE = gql`
mutation($id: ID!) {
  deleteUserRecipe(_id: $id) {
    _id
  }
}
`

export const UPDATE_USER_RECIPE = gql`
mutation($_id: ID!, $name: String!, $imageUrl: String!, $category: String!, $description: String!, $ingredients: String!, $instructions: String! ) {
  updateUserRecipe(_id: $_id, input: {
    name: $name, 
    imageUrl: $imageUrl,
    category: $category,
    description: $description,
    ingredients: $ingredients,
    instructions: $instructions
  }) {
    _id
    name
    imageUrl
    category
    description
    ingredients
    instructions
    likes
  }
}
`

export const ADD_TO_FAVORITES = gql`
mutation($recipeId: ID!, $userId: ID!) {
  addRecipeToFavorites(recipeId: $recipeId, userId: $userId) {
    _id
    likes
  }
}
`

export const REMOVE_FROM_FAVORITES = gql`
mutation($recipeId: ID!, $userId: ID!) {
  removeRecipeFromFavorites(recipeId: $recipeId, userId: $userId) {
    _id
    likes
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
          favorites {
            _id
            name
          }
        }
    }
`

export const SEARCH_RECIPES = gql`
query($searchTerm: String) {
  searchRecipes(searchTerm: $searchTerm) {
    _id
    name
    likes
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

