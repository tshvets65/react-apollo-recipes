import React from 'react'
import { Link } from 'react-router-dom'
import { categories } from './categories'

const RecipeItem = ({ _id, name, category }) => (
    <li>
        <Link to={`/recipe/${_id}`}>
            <h4>{name}</h4>
        </Link>
        <p><strong>{categories[category]}</strong></p>
    </li>

)

export default RecipeItem