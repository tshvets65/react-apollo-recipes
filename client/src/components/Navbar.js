import React from 'react'
import { NavLink } from 'react-router-dom'
import Signout from './Auth/Signout'

const Navbar = ({ session }) => (
    <nav>
        {session && session.getCurrentUser ? <NavbarAuth session={session} /> : <NavbarUnAuth />}
    </nav>
)

const NavbarAuth = ({ session }) => (
    <>
        <ul>
            <li>
                <NavLink to='/' exact>Home</NavLink>
            </li>
            <li>
                <NavLink to='/search' exact>Search</NavLink>
            </li>
            <li>
                <NavLink to='/recipe/add' exact>Add Recipe</NavLink>
            </li>
            <li>
                <NavLink to='/profile' exact>Profile</NavLink>
            </li>
            <li>
                <Signout />
            </li>
        </ul>
        <h4>Welcome, {session.getCurrentUser.username}!</h4>
    </>
)

const NavbarUnAuth = () => (
    <ul>
        <li>
            <NavLink to='/' exact>Home</NavLink>
        </li>
        <li>
            <NavLink to='/search' exact>Search</NavLink>
        </li>
        <li>
            <NavLink to='/signin' exact>Signin</NavLink>
        </li>
        <li>
            <NavLink to='/signup' exact>Signup</NavLink>
        </li>
    </ul>

)

export default Navbar