import React, { Component } from 'react'
import { Query } from 'react-apollo'
import posed from 'react-pose'
import { GET_ALL_RECIPES } from '../../queries'
import RecipeCard from '../Recipe/RecipeCard'
import Spinner from '../Spinner'
import classes from './Home.module.css'

const RecipeList = posed.section({
  shown: {
    x: '0%',
    staggerChildren: 200
  },
  hidden: {
    x: '-100%'
  }
})

class Home extends Component {
  state = {
    on: false
  }

  componentDidMount() {
    setTimeout(this.slideIn, 200)
  }
  slideIn = () => this.setState({ on: !this.state.on })

  render() {
    return (
      <div className='centered'>
        <Query query={GET_ALL_RECIPES}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />
            if (error) return <div>Error</div>
            return (
              <RecipeList
                className={classes.cards}
                pose={this.state.on ? 'shown' : 'hidden'}
              >
                {data.getAllRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} {...recipe} />
                ))}
              </RecipeList>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Home