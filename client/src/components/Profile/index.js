import React from 'react'
import UserInfo from './UserInfo'
import UserRevipes from './UserRecipes'
import withAuth from '../withAuth'

const Profile = ({ session }) => (
    <div >
        <UserInfo session={session} />
        <UserRevipes user={session.getCurrentUser._id} />
    </div>
)

export default withAuth(session => session && session.getCurrentUser)(Profile)