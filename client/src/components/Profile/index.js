import React, { useContext } from 'react'
import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'
import withAuth from '../../hoc/withAuth'
import AuthContext from '../../context/auth-context'

const Profile = () => {
    const { session } = useContext(AuthContext)

    return (
        <div >
            <UserInfo />
            <UserRecipes user={session.getCurrentUser._id} />
        </div>
    )
}

export default withAuth(session => session && session.getCurrentUser)(Profile)