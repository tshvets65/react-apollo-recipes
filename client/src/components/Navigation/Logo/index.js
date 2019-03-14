import React from 'react'
import Notepad from '../../../assets/logo.png'
import classes from './Logo.module.css'

const Logo = () => (
    <div className={classes.logo}>
        <div><img src={Notepad} alt='Logo' /> </div><div className={classes.brand}>My Recipe Book</div>
    </div>
)

export default Logo