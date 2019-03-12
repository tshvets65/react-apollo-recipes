import React from 'react'
import { Link } from 'react-router-dom'
import classes from './RecipeCard.module.css'

export default ({ _id, name, description, imageUrl }) => (
    <article className={classes.card}>
        <Link to={`/recipe/${_id}`}>
            <figure className={classes.thumbnail}>
                <img src={imageUrl} alt={name} />
            </figure>
            <div className={classes.card_content}>
                <h4>{name}</h4>
                <p>{description}</p>
            </div>
        </Link>
    </article>
)
