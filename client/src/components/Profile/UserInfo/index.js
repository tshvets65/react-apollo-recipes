import React, { useContext } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import AuthContext from '../../../context/auth-context'
import classes from './UserInfo.module.css'

const UserInfo = () => {
    const { session } = useContext(AuthContext)

    return (
        <div className={classes.userinfo}>
            <h3>User Info</h3>
            <p>Username: {session.getCurrentUser.username}</p>
            <p>Email: {session.getCurrentUser.email}</p>
            <p>Join Date: {moment(new Date(Number(session.getCurrentUser.createdAt))).format('MMMM Do YYYY')}</p>
            <h3>Your Favorites</h3>
            {session.getCurrentUser.favorites.length === 0 && (
                <p>You have no favorites, go add some!</p>
            )}
            <ul>
                {session.getCurrentUser.favorites.map(fav => (
                    <Link key={fav._id} to={`/recipe/${fav._id}`}>
                        <li>{fav.name}</li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default UserInfo