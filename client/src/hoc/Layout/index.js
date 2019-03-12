import React, { useState } from 'react'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer'
import SearchContext from '../../context/search-context'

const Layout = ({ children, session }) => {

    const [showSideDrawer, setSideDrawer] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const sideDrawerToggleHandler = () => setSideDrawer(!showSideDrawer)

    const sideDrawerClosedHandler = () => setSideDrawer(false)

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            <>
                <Toolbar
                    drawerToggleClicked={sideDrawerToggleHandler}
                    session={session}
                />
                <SideDrawer
                    open={showSideDrawer}
                    closed={sideDrawerClosedHandler}
                    session={session}
                />
                <main className={classes.main_area}>
                    <div className={classes.centered}>
                        {children}
                    </div>
                </main>
            </>
        </SearchContext.Provider>

    )

}

export default Layout