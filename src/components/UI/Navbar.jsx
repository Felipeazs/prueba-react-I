import React from 'react'

import style from './Navbar.module.css'
import { FaBitcoin } from 'react-icons/fa'

const Navbar = () => {
    return (
        <div className={style.nav}>
            C<FaBitcoin />
            INCAP.IO
        </div>
    )
}

export default Navbar
