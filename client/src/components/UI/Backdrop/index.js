import React from 'react'
import classes from './Backdrop.module.css'

const Backdrop = ({ show, clicked }) => (
    show ? <div className={classes.backdrop} onClick={clicked}></div> : null
)

export default Backdrop