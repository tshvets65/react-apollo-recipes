import React from 'react'
import UserInfo from './UserInfo'
import withAuth from '../withAuth'

const Profile = ({ session }) => (
    <div >
        <UserInfo session={session} />
    </div>
)

export default withAuth(session => session && session.getCurrentUser)(Profile)