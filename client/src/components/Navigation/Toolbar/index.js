import React from 'react'
import { Link } from 'react-router-dom'
import classes from './Toolbar.module.css'
import Logo from '../Logo'
import SearchBar from '../../SearchBar'
import NavigationItems from '../NavigationItems'
import DrawerToggle from '../SideDrawer/DrawerToggle'

const Toolbar = ({ drawerToggleClicked, session }) => (
    <header className={classes.masthead}>
        <DrawerToggle clicked={drawerToggleClicked} />
        <div className={classes.logo}><Link to='/'><Logo /></Link></div>
        <SearchBar />
        <nav className={classes.menu}>
            <NavigationItems session={session} />
        </nav>
    </header>
)

export default Toolbar