import React from 'react'

import style from './Navbar.module.css'

const Navbar = ({ title }) => {
    return <div className={style.nav}>{title}</div>
}

export default Navbar
