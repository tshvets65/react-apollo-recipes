import React from 'react'
import Logo from '../Logo'
import NavigationItems from '../NavigationItems'
import classes from './SideDrawer.module.css'
import Backdrop from '../../UI/Backdrop'

const SideDrawer = ({ open, closed }) => {
    const attachedClasses = open ? `${classes.sidedrawer} ${classes.open}` : `${classes.sidedrawer} ${classes.close}`
    return (
        <>
            <Backdrop show={open} clicked={closed} />
            <div className={attachedClasses} onClick={closed}>
                <div className={classes.logo}><Logo /></div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </>
    )
}

export default SideDrawer