import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import Signout from './Auth/Signout'
import Logo from '../assets/logo.png'
import AuthContext from '../context/auth-context'

const Navbar = () => {
    const { session } = useContext(AuthContext)

    return (
        <nav>
            <NavLink to='/' exact><img src={Logo} /></NavLink>
            <NavLink to='/search' exact>Search</NavLink>

            {session && session.getCurrentUser ? (
                <>
                    <NavLink to='/recipe/add' exact>Add Recipe</NavLink>
                    <NavLink to='/profile' exact>Profile</NavLink>
                    <Signout />
                </>
            ) : (
                    <>
                        <NavLink to='/signin' exact>Signin</NavLink>
                        <NavLink to='/signup' exact>Signup</NavLink>
                    </>
                )
            }
        </nav>
    )
}

export default Navbar