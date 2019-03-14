import React, { useContext } from 'react'
import Logo from '../Logo'
import NavigationItems from '../NavigationItems'
import classes from './SideDrawer.module.css'
import Backdrop from '../../UI/Backdrop'
import AuthContext from '../../../context/auth-context'

const SideDrawer = ({ open, closed }) => {
    const { session } = useContext(AuthContext)

    const attachedClasses = open ? `${classes.sidedrawer} ${classes.open}` : `${classes.sidedrawer} ${classes.close}`
    return (
        <>
            <Backdrop show={open} clicked={closed} />
            <div className={attachedClasses} onClick={closed}>
                <div className={classes.logo}><Logo /></div>
                <nav>
                    <NavigationItems session={session} />
                </nav>
            </div>
        </>
    )
}

export default SideDrawer