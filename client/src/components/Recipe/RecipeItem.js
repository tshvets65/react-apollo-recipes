import React from 'react'
import { Link } from 'react-router-dom'
import { categories } from './categories'

const RecipeItem = ({ _id, name, category, likes }) => (
    <li>
        <Link to={`/recipe/${_id}`}>
            <h4>{name}</h4>
        </Link>
        {category && <p><strong>{categories[category]}</strong></p>}
        {likes !== null && <p>{likes} likes</p>}
    </li>

)

export default RecipeItem