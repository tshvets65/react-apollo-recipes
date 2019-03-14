import React, { useContext } from 'react'
import NavigationItem from './NavigationItem'
import Signout from '../../Auth/Signout'
import classes from './NavigationItems.module.css'
import AuthContext from '../../../context/auth-context'

const NavigationItems = () => {
    const { session } = useContext(AuthContext)

    return (
        <ul className={classes.navigationitems}>
            <NavigationItem link='/' exact>Home</NavigationItem>
            {session && session.getCurrentUser && <NavigationItem link='/recipe/add'>Add Recipe</NavigationItem>}
            {session && session.getCurrentUser && <NavigationItem link='/profile'>Profile</NavigationItem>}
            {session && session.getCurrentUser ?
                <Signout />
                :
                <NavigationItem link='/signin'>Log In</NavigationItem>
            }
        </ul>
    )
}

export default NavigationItems