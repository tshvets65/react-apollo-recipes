import React from 'react'
import classes from './DrawerToggle.module.css'

const DrawerToggle = ({ clicked }) => (
    <div onClick={clicked} className={classes.drawertoggle}>
        <img src='https:icon.now.sh/menu/30/1EAEDB' alt='menu icon' />
    </div>
)

export default DrawerToggle