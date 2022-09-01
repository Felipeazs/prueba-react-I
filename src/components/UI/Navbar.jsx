import React from 'react'

import style from './Navbar.module.css'
import { FaBitcoin } from 'react-icons/fa'

const Navbar = () => {
    return (
        <div className={style.nav}>
            <div className={style.horizontal}>
                C<FaBitcoin />
                INCAP.IO
            </div>
            <img
                src="foto.jpg"
                alt="perfil"
            />
            <div>
                <span>FELIPE ZAPATA S. </span>
            </div>
        </div>
    )
}

export default Navbar
