import React from 'react'
import classes from './DrawerToggle.module.css'

const DrawerToggle = ({ clicked }) => (
    <div onClick={clicked} className={classes.drawertoggle}>
        <div></div>
        <div></div>
        <div></div>
    </div>
)

export default DrawerToggle