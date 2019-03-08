import React from 'react';
import { Query } from 'react-apollo'
import { GET_ALL_RECIPES } from '../queries'
import RecipeItem from './Recipe/RecipeItem'
import './App.css';

const App = () => (
  <div className='App'>
    <h1 className='main-title'>Find Recipes You Love</h1>
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>Error</div>
        return (
          <ul className='cards'>
            {data.getAllRecipes.map(recipe => (
              <RecipeItem key={recipe._id} {...recipe} />
            ))}
          </ul>
        )
      }}
    </Query>
  </div>
)

export default App
