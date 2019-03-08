import React from 'react'
import UserInfo from './UserInfo'
import UserRecipes from './UserRecipes'
import withAuth from '../withAuth'

const Profile = ({ session }) => (
    <div >
        <UserInfo session={session} />
        <UserRecipes user={session.getCurrentUser._id} />
    </div>
)

export default withAuth(session => session && session.getCurrentUser)(Profile)