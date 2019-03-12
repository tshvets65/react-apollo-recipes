import React from 'react'
import { NavLink } from 'react-router-dom'
import Signout from './Auth/Signout'
import Logo from '../assets/logo.png'

const Navbar = ({ session }) => (
    <nav>

        <NavLink to='/' exact><img src={Logo} /></NavLink>

        <NavLink to='/search' exact>Search</NavLink>

        {session && session.getCurrentUser ? (
            <>

                <NavLink to='/recipe/add' exact>Add Recipe</NavLink>

                <NavLink to='/profile' exact>Profile</NavLink>

                <Signout />

                <h6>Welcome, {session.getCurrentUser.username}!</h6>

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

export default Navbar