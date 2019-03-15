import React from 'react'
import { Link } from 'react-router-dom'
import classes from './Toolbar.module.css'
import Logo from '../../../assets/logo.png'
import SearchBar from '../../SearchBar'
import NavigationItems from '../NavigationItems'
import DrawerToggle from '../SideDrawer/DrawerToggle'

const Toolbar = ({ drawerToggleClicked }) => (
    <header className={classes.masthead}>
        <DrawerToggle clicked={drawerToggleClicked} />
        <div className={classes.logo}><Link to='/'><img width="80" src={Logo} alt='Logo' /></Link></div>
        <SearchBar />
        <nav className={classes.menu}>
            <NavigationItems />
        </nav>
    </header>
)

export default Toolbar