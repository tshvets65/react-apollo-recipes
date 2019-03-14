import React from 'react'
import { Link } from 'react-router-dom'
import classes from './RecipeCard.module.css'

export default ({ _id, name, description, imageUrl }) => (
    <article className={classes.card}>
        <Link to={`/recipe/${_id}`}>
            <div className={classes.cardimage} style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}></div>
            <div className={classes.card_content}>
                <h4>{name}</h4>
                <p>{description}</p>
            </div>
        </Link>
    </article>
)
