import React from 'react'
import { Link } from 'react-router-dom'
import classes from './RecipeCard.module.css'

export default ({ _id, name, description, imageUrl, likes }) => (
    <article className={classes.card}>
        <Link to={`/recipe/${_id}`}>
            <div className={classes.cardimage} style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}></div>
            <div className={classes.card_content}>
                <h4>{name}</h4>
                <p>{description}</p>
                <div className={classes.likes}>{likes} <img className={classes.icon} src='https:icon.now.sh/favorite/20/FF0000' alt='favorite icon' /></div>
            </div>

        </Link>
    </article>
)
