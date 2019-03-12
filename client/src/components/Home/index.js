import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { GET_ALL_RECIPES } from '../../queries'
import RecipeCard from '../Recipe/RecipeCard'
import Spinner from '../Spinner'
import classes from './Home.module.css'

class Home extends Component {

  render() {
    return (
      <div className='centered'>
        <Query query={GET_ALL_RECIPES}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div>Error</div>
            return (
              <section className={classes.cards}>
                {data.getAllRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} {...recipe} />
                ))}
              </section>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Home